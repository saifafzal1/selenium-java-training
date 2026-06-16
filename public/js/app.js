// ── State ──────────────────────────────────────────────────────
let state = {
  progress: { completedLessons: [], lastVisited: null, notes: {} },
  currentLesson: null,
  currentModule: null,
  allLessons: [],   // flat list for prev/next
  chatOpen: true,
  currentLessonContext: '',
  serverMode: false,   // true when Node server is reachable
  smartMode: false,    // Qwen→model chain mode
  projectFolder: '',   // saved code destination
  activeCourse: 'selenium'  // 'selenium' | 'playwright'
};

// ── Active curriculum helpers ───────────────────────────────────
function getActiveCurriculum() {
  return state.activeCourse === 'playwright' ? PLAYWRIGHT_CURRICULUM : CURRICULUM;
}
function getActiveLabs() {
  return state.activeCourse === 'playwright' ? PLAYWRIGHT_LABS : CURRICULUM_LABS;
}
function getProgressKey() {
  return state.activeCourse === 'playwright'
    ? 'playwright-training-progress'
    : 'selenium-training-progress';
}

// ── Course Switcher ─────────────────────────────────────────────
function switchCourse(course) {
  if (state.activeCourse === course) return;

  // Save current progress before switching
  lsSave(state.progress, state.activeCourse === 'playwright'
    ? 'playwright-training-progress' : 'selenium-training-progress');

  state.activeCourse = course;
  localStorage.setItem('activeCourse', course);

  // Update button states
  document.getElementById('btn-selenium').classList.toggle('active', course === 'selenium');
  document.getElementById('btn-playwright').classList.toggle('active', course === 'playwright');

  // Update welcome screen content
  const isPlaywright = course === 'playwright';
  document.getElementById('welcome-icon').textContent = isPlaywright ? '🎭' : '🚀';
  document.getElementById('welcome-title').innerHTML = isPlaywright
    ? 'Playwright —<br><em>From Zero to Expert</em>'
    : 'Selenium with Java —<br><em>From Zero to Expert</em>';
  document.getElementById('welcome-desc').textContent = isPlaywright
    ? 'Modern, fast, and built-in API testing. Learn Playwright from scratch with hands-on exercises, the Request Builder pattern, and CI/CD. The AI assistant is here to help.'
    : 'Hands-on, practical training with real exercises. Pick a lesson from the sidebar to begin. The AI assistant on the right can explain concepts, debug your code, and generate examples.';

  // Update certificate content
  document.getElementById('cert-course-title').innerHTML = isPlaywright
    ? 'Playwright<br><span>Test Automation Training</span>'
    : 'Selenium with Java<br><span>Test Automation Training</span>';
  document.getElementById('cert-lessons').textContent = isPlaywright
    ? '18 Lessons · ~9 Hours'
    : '17 Lessons · ~8 Hours';
  document.getElementById('cert-topics').textContent = isPlaywright
    ? 'JavaScript · Node.js · POM · Fixtures · API Testing · Hybrid Tests · CI/CD · GitHub Actions'
    : 'Java for Testers · WebDriver · Locators · Waits · Page Object Model · TestNG · Frameworks · CI/CD';

  // Update chat placeholder
  const chatInput = document.getElementById('chat-input');
  if (chatInput) chatInput.placeholder = isPlaywright
    ? 'Ask anything about Playwright or JavaScript…'
    : 'Ask anything about Selenium or Java…';

  // Update first chat message
  const firstMsg = document.querySelector('#chat-messages .msg.assistant');
  if (firstMsg) firstMsg.innerHTML = isPlaywright
    ? `👋 Hi! I'm your AI coding assistant for Playwright. I can:<br><br>
      • <strong>Explain</strong> any Playwright/JavaScript concept<br>
      • <strong>Generate</strong> test code and fixtures<br>
      • <strong>Debug</strong> your errors — paste them here<br>
      • <strong>Review</strong> your POM and request builders<br><br>
      Pick a model above and start asking!`
    : `👋 Hi! I'm your AI coding assistant. I can:<br><br>
      • <strong>Explain</strong> any Selenium/Java concept<br>
      • <strong>Generate</strong> test code for your scenarios<br>
      • <strong>Debug</strong> your errors — paste them here<br>
      • <strong>Review</strong> your code and suggest improvements<br><br>
      Pick a model from the dropdown above:<br>
      <strong>☁️ Groq</strong> — free &amp; fast cloud models<br>
      <strong>🤖 Claude</strong> — Anthropic's models (needs API key)<br>
      <strong>🏠 Local</strong> — your Ollama models (needs <code>ollama serve</code>)`;

  // Load progress for the new course
  const key = isPlaywright ? 'playwright-training-progress' : 'selenium-training-progress';
  try { state.progress = JSON.parse(localStorage.getItem(key)) || { completedLessons: [], lastVisited: null, notes: {} }; }
  catch { state.progress = { completedLessons: [], lastVisited: null, notes: {} }; }

  // Rebuild everything
  state.allLessons = getActiveCurriculum().flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));
  state.currentLesson = null;
  state.currentModule = null;

  document.getElementById('welcome-screen').style.display = '';
  document.getElementById('lesson-view').style.display    = 'none';
  document.getElementById('context-pill').textContent     = '📍 No lesson selected';

  buildSidebar();
  updateProgressUI();

  document.getElementById('stat-total').textContent = state.allLessons.length;
  document.getElementById('stat-done').textContent  = state.progress.completedLessons.length;
  const pct = state.allLessons.length
    ? Math.round(state.progress.completedLessons.length / state.allLessons.length * 100) : 0;
  document.getElementById('stat-pct').textContent = pct + '%';
}

// ── Storage helpers (server + localStorage fallback) ──────────
const LS_KEY = 'selenium-training-progress';

function lsLoad(key) {
  const k = key || LS_KEY;
  try { return JSON.parse(localStorage.getItem(k)) || { completedLessons: [], lastVisited: null, notes: {} }; }
  catch { return { completedLessons: [], lastVisited: null, notes: {} }; }
}
function lsSave(p, key) {
  const k = key || LS_KEY;
  try { localStorage.setItem(k, JSON.stringify(p)); } catch {}
}

// ── Init ───────────────────────────────────────────────────────
async function init() {
  // Load persisted settings
  state.smartMode    = localStorage.getItem('smartMode') === 'true';
  state.projectFolder = localStorage.getItem('projectFolder') || '';

  // Detect file:// mode and show banner
  if (location.protocol === 'file:') {
    document.getElementById('file-mode-banner').style.display = 'block';
    // Push app content down to account for banner
    document.getElementById('app').style.marginTop = '32px';
  }

  // Restore active course from localStorage
  state.activeCourse = localStorage.getItem('activeCourse') || 'selenium';
  document.getElementById('btn-selenium').classList.toggle('active', state.activeCourse === 'selenium');
  document.getElementById('btn-playwright').classList.toggle('active', state.activeCourse === 'playwright');

  // Flatten all lessons for active course
  state.allLessons = getActiveCurriculum().flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));

  // Load progress — try server first, fall back to localStorage
  const progressKey = state.activeCourse === 'playwright' ? 'playwright-training-progress' : LS_KEY;
  try {
    const res = await fetch('api/progress', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      state.progress = await res.json();
      state.serverMode = true;
    } else { throw new Error('not ok'); }
  } catch {
    state.progress = lsLoad(progressKey);
    state.serverMode = false;
  }

  buildSidebar();
  updateProgressUI();

  // Restore last visited lesson
  if (state.progress.lastVisited) {
    const last = state.allLessons.find(l => l.id === state.progress.lastVisited);
    if (last) {
      const mod = CURRICULUM.find(m => m.lessons.some(l => l.id === last.id));
      showLesson(last, mod);
    }
  }

  // Update stat cards
  document.getElementById('stat-total').textContent = state.allLessons.length;
  document.getElementById('stat-done').textContent  = state.progress.completedLessons.length;
  const pct = Math.round(state.progress.completedLessons.length / state.allLessons.length * 100);
  document.getElementById('stat-pct').textContent   = pct + '%';

  // Check Ollama health
  checkHealth();
  setInterval(checkHealth, 30000);

  // Wire up events
  wireEvents();
}

// ── Sidebar ────────────────────────────────────────────────────
function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = '';

  getActiveCurriculum().forEach(module => {
    const group = document.createElement('div');
    group.className = 'module-group';
    group.dataset.moduleId = module.id;

    const hdr = document.createElement('div');
    hdr.className = 'module-header';
    hdr.innerHTML = `
      <span class="icon">${module.icon}</span>
      <span>${module.title}</span>
      <span class="chevron">›</span>`;
    hdr.addEventListener('click', () => toggleModule(hdr, list));

    const list = document.createElement('div');
    list.className = 'module-lessons';

    module.lessons.forEach(lesson => {
      const item = document.createElement('div');
      item.className = 'lesson-item';
      item.dataset.lessonId = lesson.id;
      const done = state.progress.completedLessons.includes(lesson.id);
      if (done) item.classList.add('completed');
      item.innerHTML = `
        <span class="check">${done ? '✓' : '○'}</span>
        <span style="flex:1">${lesson.title}</span>
        <span class="type-badge">${lesson.type}</span>`;
      item.addEventListener('click', () => showLesson(lesson, module));
      list.appendChild(item);
    });

    group.appendChild(hdr);
    group.appendChild(list);
    sidebar.appendChild(group);

    // Auto-open first module
    if (module === getActiveCurriculum()[0]) toggleModule(hdr, list);
  });
}

function toggleModule(hdr, list) {
  hdr.classList.toggle('open');
  list.classList.toggle('open');
}

// ── Show Lesson ────────────────────────────────────────────────
function showLesson(lesson, module) {
  state.currentLesson = lesson;
  state.currentModule = module;

  // Show lesson view, hide welcome
  document.getElementById('welcome-screen').style.display = 'none';
  document.getElementById('lesson-view').style.display = 'block';

  // Highlight sidebar item
  document.querySelectorAll('.lesson-item').forEach(el => {
    el.classList.toggle('active', el.dataset.lessonId === lesson.id);
  });

  // Open the correct module
  const group = document.querySelector(`[data-module-id="${module.id}"]`);
  if (group) {
    const hdr  = group.querySelector('.module-header');
    const list = group.querySelector('.module-lessons');
    if (!hdr.classList.contains('open')) toggleModule(hdr, list);
  }

  // Populate header
  document.getElementById('lesson-title').textContent = lesson.title;
  const meta = document.getElementById('lesson-meta');
  const diffTag = lesson.difficulty
    ? `<span class="meta-tag diff-${lesson.difficulty}">${lesson.difficulty}</span>` : '';
  const labTag = lesson.type === 'lab'
    ? `<span class="meta-tag lab-badge">🔬 Lab Exercise</span>` : '';
  meta.innerHTML = `
    <span class="meta-tag">${module.icon} ${module.title}</span>
    ${labTag || `<span class="meta-tag ${lesson.type === 'practical' ? 'practical' : 'theory'}">${lesson.type}</span>`}
    ${diffTag}
    <span class="meta-tag">⏱ ${lesson.duration}</span>`;

  // Render "What You'll Learn" section if lesson has it
  renderWhatYoullLearn(lesson);

  // Render lesson content (markdown)
  document.getElementById('lesson-content').innerHTML =
    marked.parse(lesson.content || '_No content yet._');
  requestAnimationFrame(highlightJava);

  // Render exercise
  renderExercise(lesson);

  // Render quiz
  renderQuiz(lesson);

  // Render affiliate resources panel
  renderAffiliatePanel(lesson, module);

  // Show/hide Evaluate tab and render rubric for lab lessons
  const evaluateTab = document.querySelector('.lab-tab[data-tab="evaluate"]');
  if (evaluateTab) {
    const isLab = lesson.type === 'lab';
    evaluateTab.style.display = isLab ? '' : 'none';
    if (isLab) renderLabEvaluation(lesson);
  }

  // Load notes
  const noteArea = document.getElementById('notes-area');
  noteArea.value = state.progress.notes[lesson.id] || '';
  document.getElementById('note-saved-msg').style.display = 'none';

  // Complete button state
  updateCompleteButtons(lesson.id);

  // Switch to lesson tab
  switchTab('lesson');

  // Context for AI
  state.currentLessonContext = `Current lesson: "${lesson.title}" (Module: ${module.title}). Topics covered: ${lesson.content.substring(0, 300)}...`;
  document.getElementById('context-pill').textContent = `📍 ${lesson.title}`;

  // Save last visited
  saveProgress({ lastVisited: lesson.id });
}

// ── What You'll Learn ─────────────────────────────────────────
function renderWhatYoullLearn(lesson) {
  const existing = document.getElementById('wyll-panel');
  if (existing) existing.remove();
  if (!lesson.whatYoullLearn || !lesson.whatYoullLearn.length) return;

  const panel = document.createElement('div');
  panel.id = 'wyll-panel';
  panel.className = 'wyll-panel';
  panel.innerHTML = `
    <div class="wyll-title">✅ What You'll Learn</div>
    <ul class="wyll-list">
      ${lesson.whatYoullLearn.map(item => `<li>${escHtml(item)}</li>`).join('')}
    </ul>`;

  const lessonContent = document.getElementById('lesson-content');
  lessonContent.parentNode.insertBefore(panel, lessonContent);
}

// ── Quiz ──────────────────────────────────────────────────────
function renderQuiz(lesson) {
  const container = document.getElementById('quiz-content');
  if (!lesson.quiz || !lesson.quiz.length) {
    container.innerHTML = `
      <div class="quiz-empty">
        <div style="font-size:48px;margin-bottom:16px">🧩</div>
        <h3>No quiz for this lesson yet</h3>
        <p>Complete the exercise to practise — or ask the AI to quiz you!</p>
      </div>`;
    return;
  }

  const q = lesson.quiz;
  container.innerHTML = `
    <div class="quiz-panel">
      <div class="quiz-header">
        <span class="quiz-title">🧩 Knowledge Check</span>
        <span class="quiz-count">${q.length} question${q.length !== 1 ? 's' : ''}</span>
      </div>
      <form id="quiz-form">
        ${q.map((item, i) => renderQuizQuestion(item, i)).join('')}
      </form>
      <div class="quiz-actions">
        <button class="btn btn-primary" id="quiz-submit-btn" onclick="submitQuiz(event)">Check Answers →</button>
      </div>
      <div id="quiz-result" style="display:none"></div>
    </div>`;
}

function renderQuizQuestion(item, idx) {
  if (item.type === 'mcq') {
    return `
      <div class="quiz-q" id="qq-${idx}">
        <div class="quiz-q-text"><span class="q-num">Q${idx + 1}</span> ${escHtml(item.q)}</div>
        <div class="quiz-options">
          ${item.options.map((opt, oi) => `
            <label class="quiz-option">
              <input type="radio" name="q${idx}" value="${oi}" />
              <span>${escHtml(opt)}</span>
            </label>`).join('')}
        </div>
      </div>`;
  }
  if (item.type === 'truefalse') {
    return `
      <div class="quiz-q" id="qq-${idx}">
        <div class="quiz-q-text"><span class="q-num">Q${idx + 1}</span> ${escHtml(item.q)}</div>
        <div class="quiz-options">
          <label class="quiz-option"><input type="radio" name="q${idx}" value="true" /><span>True</span></label>
          <label class="quiz-option"><input type="radio" name="q${idx}" value="false" /><span>False</span></label>
        </div>
      </div>`;
  }
  if (item.type === 'fillin') {
    return `
      <div class="quiz-q" id="qq-${idx}">
        <div class="quiz-q-text"><span class="q-num">Q${idx + 1}</span> ${escHtml(item.q)}</div>
        <input class="quiz-fillin" type="text" name="q${idx}" placeholder="Type your answer…" autocomplete="off" />
      </div>`;
  }
  return '';
}

function submitQuiz(e) {
  e.preventDefault();
  const lesson = state.currentLesson;
  if (!lesson || !lesson.quiz) return;

  const quiz = lesson.quiz;
  let correct = 0;
  const form = document.getElementById('quiz-form');

  quiz.forEach((item, i) => {
    const qEl = document.getElementById(`qq-${i}`);
    let userAnswer, isCorrect;

    if (item.type === 'mcq') {
      const sel = form.querySelector(`input[name="q${i}"]:checked`);
      userAnswer = sel ? parseInt(sel.value) : null;
      isCorrect = userAnswer === item.answer;
    } else if (item.type === 'truefalse') {
      const sel = form.querySelector(`input[name="q${i}"]:checked`);
      userAnswer = sel ? (sel.value === 'true') : null;
      isCorrect = userAnswer === item.answer;
    } else if (item.type === 'fillin') {
      const inp = form.querySelector(`input[name="q${i}"]`);
      userAnswer = inp ? inp.value.trim().toLowerCase() : '';
      isCorrect = userAnswer === item.answer.toLowerCase();
    }

    if (isCorrect) {
      correct++;
      qEl.classList.add('q-correct');
    } else {
      qEl.classList.add('q-wrong');
      // Show correct answer
      const ans = document.createElement('div');
      ans.className = 'quiz-correct-ans';
      if (item.type === 'mcq') ans.textContent = `✓ Correct answer: ${item.options[item.answer]}`;
      else if (item.type === 'truefalse') ans.textContent = `✓ Correct answer: ${item.answer ? 'True' : 'False'}`;
      else if (item.type === 'fillin') ans.textContent = `✓ Correct answer: ${item.answer}`;
      qEl.appendChild(ans);
    }

    // Disable inputs after submit
    qEl.querySelectorAll('input').forEach(inp => inp.disabled = true);
  });

  const pct = Math.round(correct / quiz.length * 100);
  const resultEl = document.getElementById('quiz-result');
  const emoji = pct === 100 ? '🎉' : pct >= 60 ? '👍' : '📚';
  const msg   = pct === 100 ? 'Perfect score! You nailed it.' : pct >= 60 ? 'Good work! Review the missed ones.' : 'Keep studying — try the lesson again!';

  resultEl.style.display = 'block';
  resultEl.innerHTML = `
    <div class="quiz-score ${pct === 100 ? 'perfect' : pct >= 60 ? 'good' : 'retry'}">
      ${emoji} ${correct} / ${quiz.length} correct (${pct}%) — ${msg}
    </div>`;

  document.getElementById('quiz-submit-btn').style.display = 'none';
}

function renderExercise(lesson) {
  const container = document.getElementById('exercise-content');
  if (!lesson.exercise) {
    container.innerHTML = '<p style="color:var(--text2)">This lesson has no dedicated exercise. Practice the code examples in the Lesson tab.</p>';
    return;
  }
  const ex = lesson.exercise;
  let hintsHtml = '';
  if (ex.hints) {
    hintsHtml = `<ul class="hints-list">${ex.hints.map(h => `<li>${h}</li>`).join('')}</ul>`;
  }
  let solutionHtml = '';
  if (ex.solution) {
    solutionHtml = `
      <button class="solution-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.textContent=this.nextElementSibling.classList.contains('open')?'🙈 Hide Solution':'👀 Show Solution'">👀 Show Solution</button>
      <pre class="solution-box">${escHtml(ex.solution)}</pre>`;
  }
  container.innerHTML = `
    <div class="exercise-panel">
      <h3>🏋️ ${ex.title}</h3>
      <p class="task-text">${ex.task}</p>
      ${hintsHtml}
      ${solutionHtml}
    </div>
    <p style="font-size:13px;color:var(--text3);margin-top:12px">
      💡 Paste your code or errors into the AI chat for help →
    </p>`;
}

// ── Lab Evaluation / Rubric ───────────────────────────────────
function renderLabEvaluation(lesson) {
  const container = document.getElementById('evaluate-content');
  if (!lesson.rubric) { container.innerHTML = ''; return; }

  const rubric = lesson.rubric;
  const savedKey = 'rubric_' + lesson.id;
  const saved = JSON.parse(localStorage.getItem(savedKey) || '{}');

  // Compute score from saved checks
  function computeScore(checks) {
    return rubric.criteria.reduce((sum, c) => sum + (checks[c.id] ? c.points : 0), 0);
  }

  function levelBadge(pct) {
    if (pct >= 90) return { label: '🏆 Expert',        cls: 'level-expert' };
    if (pct >= 80) return { label: '🥇 Advanced',      cls: 'level-advanced' };
    if (pct >= 60) return { label: '⚡ Intermediate',  cls: 'level-intermediate' };
    if (pct >= 40) return { label: '📈 Developing',    cls: 'level-developing' };
    return             { label: '🌱 Beginner',         cls: 'level-beginner' };
  }

  function renderPanel(checks) {
    const score = computeScore(checks);
    const pct   = Math.round(score / rubric.totalPoints * 100);
    const { label, cls } = levelBadge(pct);

    // Capstone totals across all labs
    const labIds = ['lab1','lab2','lab3','lab4','lab5'];
    const labTotals = { lab1:20, lab2:20, lab3:25, lab4:20, lab5:30 };
    let totalEarned = 0, totalPossible = 0;
    labIds.forEach(id => {
      const k = JSON.parse(localStorage.getItem('rubric_' + id) || '{}');
      const lab = CURRICULUM.find(m => m.id === 'module-7')
                            ?.lessons.find(l => l.id === id);
      if (!lab || !lab.rubric) return;
      totalPossible += lab.rubric.totalPoints;
      totalEarned   += lab.rubric.criteria.reduce((s, c) => s + (k[c.id] ? c.points : 0), 0);
    });
    const overallPct = totalPossible > 0 ? Math.round(totalEarned / totalPossible * 100) : 0;
    const overall    = levelBadge(overallPct);

    container.innerHTML = `
      <div class="eval-wrap">

        <div class="eval-header">
          <div>
            <div class="eval-title">🏆 Self-Assessment Rubric</div>
            <div class="eval-sub">${lesson.title}</div>
          </div>
          <div class="eval-score-badge ${cls}">${label}</div>
        </div>

        <div class="eval-score-bar-wrap">
          <div class="eval-score-bar-track">
            <div class="eval-score-bar-fill" style="width:${pct}%"></div>
          </div>
          <div class="eval-score-text">${score} / ${rubric.totalPoints} pts &nbsp;(${pct}%)</div>
        </div>

        <p class="eval-instruction">Check each criterion you have <strong>fully met</strong> in your implementation. Be honest — this is for your own learning.</p>

        <div class="eval-criteria">
          ${rubric.criteria.map(c => `
            <label class="eval-criterion ${checks[c.id] ? 'checked' : ''}" data-id="${c.id}">
              <input type="checkbox" class="eval-cb" data-id="${c.id}" data-pts="${c.points}" ${checks[c.id] ? 'checked' : ''}/>
              <div class="eval-criterion-body">
                <span class="eval-criterion-label">${escHtml(c.label)}</span>
                <span class="eval-pts-badge">+${c.points} pts</span>
              </div>
            </label>`).join('')}
        </div>

        <div class="eval-divider"></div>

        <div class="eval-overall">
          <div class="eval-overall-title">📊 Capstone Overall Progress</div>
          <div class="eval-overall-bar-wrap">
            <div class="eval-overall-bar-track">
              <div class="eval-overall-bar-fill" style="width:${overallPct}%"></div>
            </div>
            <div class="eval-score-text">${totalEarned} / ${totalPossible} pts across all labs &nbsp;(${overallPct}%)</div>
          </div>
          <div class="eval-overall-badge ${overall.cls}">${overall.label}</div>
          <div class="eval-level-legend">
            <span class="lvl level-beginner">🌱 Beginner &lt;40%</span>
            <span class="lvl level-developing">📈 Developing 40–59%</span>
            <span class="lvl level-intermediate">⚡ Intermediate 60–79%</span>
            <span class="lvl level-advanced">🥇 Advanced 80–89%</span>
            <span class="lvl level-expert">🏆 Expert 90–100%</span>
          </div>
        </div>

        <div class="eval-footer">
          <button class="btn btn-ghost eval-reset-btn" onclick="resetLabRubric('${lesson.id}')">↺ Reset Checklist</button>
          <span style="color:var(--text3);font-size:12px">Scores saved in your browser · Ask the AI to review your code for deeper feedback</span>
        </div>
      </div>`;

    // Attach checkbox listeners after render
    container.querySelectorAll('.eval-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const id  = cb.dataset.id;
        checks[id] = cb.checked;
        localStorage.setItem(savedKey, JSON.stringify(checks));
        renderPanel(checks);          // re-render with updated scores
      });
    });
  }

  renderPanel({ ...saved });
}

window.resetLabRubric = function(lessonId) {
  localStorage.removeItem('rubric_' + lessonId);
  const lesson = state.currentLesson;
  if (lesson && lesson.id === lessonId) renderLabEvaluation(lesson);
};

// ── Affiliate Resources Panel ──────────────────────────────────
function renderAffiliatePanel(lesson, module) {
  // Remove existing panel if any
  const existing = document.getElementById('affiliate-panel');
  if (existing) existing.remove();

  const panel = document.createElement('div');
  panel.id = 'affiliate-panel';
  panel.innerHTML = `
    <div class="affiliate-header">
      <span class="affiliate-title">📚 Recommended Resources</span>
      <span class="affiliate-sub">Curated tools &amp; courses to accelerate your learning</span>
    </div>
    <div class="affiliate-grid">
      <a class="affiliate-card" href="https://www.udemy.com/course/selenium-webdriver-with-java-testng-and-log4j/?couponCode=LEARNNOWPLANS" target="_blank" rel="noopener">
        <div class="aff-icon">🎓</div>
        <div class="aff-body">
          <div class="aff-name">Selenium WebDriver + Java</div>
          <div class="aff-desc">Most popular Selenium course on Udemy — 50,000+ students</div>
          <div class="aff-cta">View on Udemy →</div>
        </div>
      </a>
      <a class="affiliate-card" href="https://www.lambdatest.com/?utm_source=selenium-training&utm_medium=affiliate" target="_blank" rel="noopener">
        <div class="aff-icon">☁️</div>
        <div class="aff-body">
          <div class="aff-name">LambdaTest — Cloud Testing</div>
          <div class="aff-desc">Run Selenium tests on 3000+ browsers &amp; OS combinations</div>
          <div class="aff-cta">Try Free →</div>
        </div>
      </a>
      <a class="affiliate-card" href="https://www.browserstack.com/automate?utm_source=selenium-training&utm_medium=affiliate" target="_blank" rel="noopener">
        <div class="aff-icon">🌐</div>
        <div class="aff-body">
          <div class="aff-name">BrowserStack Automate</div>
          <div class="aff-desc">Real devices, instant access — industry standard for QA</div>
          <div class="aff-cta">Start Free Trial →</div>
        </div>
      </a>
      <a class="affiliate-card" href="https://www.jetbrains.com/idea/?fromMenu" target="_blank" rel="noopener">
        <div class="aff-icon">💡</div>
        <div class="aff-body">
          <div class="aff-name">IntelliJ IDEA</div>
          <div class="aff-desc">Best IDE for Java &amp; Selenium — Community edition is free</div>
          <div class="aff-cta">Download Free →</div>
        </div>
      </a>
    </div>`;

  // Append after the lesson tab content
  document.getElementById('tab-lesson').appendChild(panel);
}

// ── Tabs ───────────────────────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  document.querySelectorAll('.tab-content').forEach(c => {
    const id = c.id.replace('tab-', '');
    c.classList.toggle('active', id === tabId);
  });
}

// ── Progress ───────────────────────────────────────────────────
function updateCompleteButtons(lessonId) {
  const done = state.progress.completedLessons.includes(lessonId);
  ['complete-btn', 'complete-btn-ex'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.textContent = done ? '✓ Completed' : '✓ Mark Complete';
    btn.className = 'complete-btn ' + (done ? 'done' : 'not-done');
  });
}

function toggleComplete(lessonId) {
  const done = state.progress.completedLessons.includes(lessonId);
  if (done) {
    saveProgress({ removeLesson: lessonId });
    state.progress.completedLessons = state.progress.completedLessons.filter(l => l !== lessonId);
  } else {
    saveProgress({ completedLesson: lessonId });
    state.progress.completedLessons.push(lessonId);
  }
  updateCompleteButtons(lessonId);
  updateProgressUI();
  rebuildSidebarItems();
}

function rebuildSidebarItems() {
  document.querySelectorAll('.lesson-item').forEach(item => {
    const id = item.dataset.lessonId;
    const done = state.progress.completedLessons.includes(id);
    item.classList.toggle('completed', done);
    const check = item.querySelector('.check');
    if (check) check.textContent = done ? '✓' : '○';
  });
}

function updateProgressUI() {
  const total = state.allLessons.length;
  const done  = state.progress.completedLessons.length;
  const pct   = total ? Math.round(done / total * 100) : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = `${done} / ${total} lessons`;
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-pct').textContent  = pct + '%';

  // Show certificate button when course complete
  const certBtn = document.getElementById('cert-btn');
  if (certBtn) certBtn.style.display = pct === 100 ? 'inline-flex' : 'none';
}

function showCertificate() {
  const modal = document.getElementById('cert-modal');
  const dateEl = document.getElementById('cert-date');
  dateEl.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  modal.style.display = 'flex';
}

async function saveProgress(payload) {
  // Always apply changes to in-memory state immediately
  if (payload.completedLesson !== undefined && !state.progress.completedLessons.includes(payload.completedLesson)) {
    state.progress.completedLessons.push(payload.completedLesson);
  }
  if (payload.removeLesson !== undefined) {
    state.progress.completedLessons = state.progress.completedLessons.filter(l => l !== payload.removeLesson);
  }
  if (payload.lastVisited !== undefined) state.progress.lastVisited = payload.lastVisited;
  if (payload.note) state.progress.notes[payload.note.lessonId] = payload.note.text;

  // Always persist to localStorage as backup
  lsSave(state.progress, getProgressKey());

  // Also try server if available
  if (state.serverMode) {
    try {
      const res = await fetch('api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        state.progress = data.progress;
        lsSave(state.progress, getProgressKey());
      }
    } catch { state.serverMode = false; }
  }
}

// ── Navigation ─────────────────────────────────────────────────
function navigateRelative(delta) {
  if (!state.currentLesson) return;
  const idx = state.allLessons.findIndex(l => l.id === state.currentLesson.id);
  const next = state.allLessons[idx + delta];
  if (!next) return;
  const mod = CURRICULUM.find(m => m.lessons.some(l => l.id === next.id));
  showLesson(next, mod);
}

// ── AI Chat ────────────────────────────────────────────────────
let chatHistory = [];
let isChatting  = false;

// ── Client-side guards (fixes #4 + #5) ───────────────────────
const CHAT_MAX_CHARS    = 3000;   // max chars per message
const CHAT_SESSION_WARN = 20;     // warn after this many messages
const CHAT_SESSION_KEY  = 'chat_session_' + new Date().toDateString(); // resets daily

function getChatCount()  { return parseInt(localStorage.getItem(CHAT_SESSION_KEY) || '0', 10); }
function incChatCount()  { localStorage.setItem(CHAT_SESSION_KEY, getChatCount() + 1); }

async function sendMessage(userText) {
  if (!userText.trim() || isChatting) return;

  // Fix #4 — hard cap on message length
  if (userText.length > CHAT_MAX_CHARS) {
    appendMessage('assistant',
      `⚠️ Your message is **${userText.length} characters** — the limit is ${CHAT_MAX_CHARS}.\n\nPlease shorten your message. For large code pastes, paste only the relevant section and describe the rest.`
    );
    return;
  }

  // Fix #5 — per-session counter with warning
  const count = getChatCount();
  if (count >= CHAT_SESSION_WARN && count % 10 === 0) {
    appendMessage('assistant',
      `💡 **Heads-up:** You've sent **${count} messages** today. The server allows up to 30 per hour per user.\n\nFor unlimited usage, switch to a **local Ollama model** in the ⚙️ settings.`
    );
  }

  isChatting = true;

  const sendBtn = document.getElementById('chat-send');
  sendBtn.disabled = true;

  appendMessage('user', userText);
  document.getElementById('chat-input').value = '';
  autoResizeTextarea(document.getElementById('chat-input'));

  // Build system prompt with lesson context
  const systemPrompt = `You are an expert Selenium with Java tutor. You help beginners learn test automation step by step.
Be concise, practical, and always include runnable Java code examples when relevant.
Use code blocks with java syntax highlighting.
${state.currentLessonContext ? '\n' + state.currentLessonContext : ''}`;

  chatHistory.push({ role: 'user', content: userText });

  const model = document.getElementById('model-select').value;

  // Smart Mode status message (shown before answer)
  let chainStatusEl = null;
  if (state.smartMode) {
    chainStatusEl = document.createElement('div');
    chainStatusEl.className = 'msg assistant chain-status';
    chainStatusEl.innerHTML = '🔄 <em>Refining your question with Qwen…</em>';
    document.getElementById('chat-messages').appendChild(chainStatusEl);
    scrollChat();
  }

  // Typing indicator
  const typing = document.createElement('div');
  typing.className = 'msg assistant typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  document.getElementById('chat-messages').appendChild(typing);
  scrollChat();

  try {
    const res = await fetch('api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        chainMode: state.smartMode,
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory.slice(-10)
        ]
      })
    });

    typing.remove();

    if (!res.ok) {
      appendMessage('assistant', `⚠️ Server error ${res.status}. Check your Vercel deployment.`);
      isChatting = false;
      sendBtn.disabled = false;
      return;
    }

    const data = await res.json();

    // Update chain status with refined question (or remove it)
    if (chainStatusEl) {
      if (data.refinedQuestion) {
        chainStatusEl.innerHTML = `🔍 <strong>Refined:</strong> <em>${escHtml(data.refinedQuestion)}</em>`;
      } else {
        chainStatusEl.remove();
        chainStatusEl = null;
      }
    }

    if (data.error) {
      const msgEl = appendMessage('assistant', '');
      msgEl.className = 'msg error';
      msgEl.innerHTML = '⚠️ ' + escHtml(data.error);
    } else {
      incChatCount(); // fix #5 — only count successful responses
      const assistantText = data.content || '';
      chatHistory.push({ role: 'assistant', content: assistantText });
      const msgEl = appendMessage('assistant', '');
      msgEl.innerHTML = renderMarkdown(assistantText);
      requestAnimationFrame(highlightJava);
      scrollChat();
    }

  } catch (err) {
    typing.remove();
    if (chainStatusEl) chainStatusEl.remove();
    appendMessage('assistant',
      `⚠️ Could not reach the API.\n\nIf running locally: make sure \`npm start\` is running.\nIf on Vercel: check /api/debug for diagnosis.\n\nError: ${err.message}`
    );
  }

  isChatting = false;
  sendBtn.disabled = false;
}

function appendMessage(role, text) {
  const msgs = document.getElementById('chat-messages');
  const el = document.createElement('div');
  el.className = 'msg ' + role;
  el.innerHTML = role === 'user' ? escHtml(text) : renderMarkdown(text);
  msgs.appendChild(el);
  scrollChat();
  return el;
}

function scrollChat() {
  const msgs = document.getElementById('chat-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

function renderMarkdown(text) {
  // Use marked if available
  try { return marked.parse(text); } catch { return escHtml(text); }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Health & Provider Status ──────────────────────────────────
async function checkHealth() {
  const dot = document.getElementById('ollama-status');
  try {
    const res  = await fetch('api/health', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();

    // Update Ollama optgroup with discovered local models
    const ollamaGroup = document.getElementById('ollama-optgroup');
    if (ollamaGroup && data.ollama === 'ok' && data.ollamaModels?.length > 0) {
      ollamaGroup.innerHTML = data.ollamaModels.map(m =>
        `<option value="${m}">🟢 ${m}</option>`
      ).join('');
    }

    // Status dot: green = at least one provider ready
    const groqOk  = data.groq  === 'key_set';
    const claudeOk = data.claude === 'key_set';
    const ollamaOk = data.ollama === 'ok';
    const anyOk = groqOk || claudeOk || ollamaOk;

    dot.className = anyOk ? 'online' : 'offline';

    const parts = [];
    if (groqOk)   parts.push('Groq ✅');
    else          parts.push('Groq ❌ (set GROQ_API_KEY)');
    if (claudeOk) parts.push('Claude ✅');
    else          parts.push('Claude ⚠️ (optional — set ANTHROPIC_API_KEY)');
    if (ollamaOk) parts.push(`Ollama ✅ (${data.ollamaModels?.length || 0} models)`);
    else          parts.push('Ollama offline (run: ollama serve)');
    dot.title = parts.join(' · ');

  } catch {
    dot.className = 'offline';
    dot.title = 'Could not reach server';
  }
}

// ── Auto-resize textarea ───────────────────────────────────────
function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ── Toast Notifications ────────────────────────────────────────
function showToast(message, type = 'success', action = null) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  if (action) {
    const btn = document.createElement('button');
    btn.className = 'toast-action-btn';
    btn.textContent = action.label;
    btn.addEventListener('click', () => { action.fn(); toast.remove(); });
    toast.appendChild(btn);
  }
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => toast.remove());
  toast.appendChild(closeBtn);
  container.appendChild(toast);
  // Auto-remove after 5s
  setTimeout(() => { toast.classList.add('toast-fade'); setTimeout(() => toast.remove(), 400); }, 5000);
}

// ── Save to Project (VS Code) ──────────────────────────────────
async function saveToProject(code) {
  const folder = state.projectFolder;

  // Auto-detect filename from public class name
  const match = code.match(/public\s+class\s+(\w+)/);
  const filename = match ? `${match[1]}.java` : `SeleniumCode_${Date.now()}.java`;

  if (state.serverMode && folder) {
    // Write directly to disk via local server
    try {
      const res = await fetch('api/save-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, filename, folder })
      });
      const data = await res.json();
      if (data.ok) {
        showToast(`✅ Saved: ${data.filename}`, 'success', {
          label: 'Open in VS Code',
          fn: () => { window.open(`vscode://file/${encodeURI(data.path)}`, '_blank'); }
        });
      } else {
        showToast(`❌ ${data.error}`, 'error');
      }
    } catch (e) {
      showToast(`❌ Save failed: ${e.message}`, 'error');
    }
  } else if (state.serverMode && !folder) {
    // Server running but no folder set — prompt to set it
    showToast('⚠️ Set your Project Folder in Settings first (⚙️)', 'warning', {
      label: 'Open Settings',
      fn: openSettings
    });
  } else {
    // Vercel / no server — trigger browser download
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    showToast(`📥 Downloaded: ${filename}`, 'success');
  }
}

// ── Settings Panel ─────────────────────────────────────────────
function openSettings() {
  const panel   = document.getElementById('settings-panel');
  const overlay = document.getElementById('settings-overlay');
  const input   = document.getElementById('project-folder-input');
  const checkbox = document.getElementById('smart-mode-checkbox');
  const statusText = document.getElementById('smart-mode-status-text');

  input.value = state.projectFolder;
  checkbox.checked = state.smartMode;
  statusText.textContent = state.smartMode ? 'On' : 'Off';
  document.getElementById('folder-status').textContent = '';

  panel.style.display   = 'flex';
  overlay.style.display = 'block';
}

function closeSettings() {
  document.getElementById('settings-panel').style.display  = 'none';
  document.getElementById('settings-overlay').style.display = 'none';
}

function saveProjectFolder() {
  const val = document.getElementById('project-folder-input').value.trim();
  state.projectFolder = val;
  localStorage.setItem('projectFolder', val);
  document.getElementById('folder-status').textContent = val ? '✅ Path saved!' : '⚠️ Path cleared.';
  document.getElementById('folder-status').className = 'settings-status ' + (val ? 'ok' : 'warn');
}

async function testProjectFolder() {
  const folder = document.getElementById('project-folder-input').value.trim();
  const statusEl = document.getElementById('folder-status');
  if (!folder) { statusEl.textContent = '⚠️ Enter a path first'; statusEl.className = 'settings-status warn'; return; }
  if (!state.serverMode) { statusEl.textContent = '❌ Server not running locally (npm start required)'; statusEl.className = 'settings-status error'; return; }

  statusEl.textContent = 'Testing…';
  try {
    const code = `// Test file — safe to delete\npublic class SeleniumTestConnection { }`;
    const res  = await fetch('api/save-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, filename: 'SeleniumTestConnection.java', folder })
    });
    const data = await res.json();
    if (data.ok) {
      statusEl.textContent = `✅ Connected! Wrote to: ${data.path}`;
      statusEl.className = 'settings-status ok';
    } else {
      statusEl.textContent = `❌ ${data.error}`;
      statusEl.className = 'settings-status error';
    }
  } catch (e) {
    statusEl.textContent = `❌ ${e.message}`;
    statusEl.className = 'settings-status error';
  }
}

function toggleSmartMode(on) {
  state.smartMode = on;
  localStorage.setItem('smartMode', on);
  document.getElementById('smart-mode-status-text').textContent = on ? 'On' : 'Off';
  // Sync the header button
  const btn = document.getElementById('smart-mode-btn');
  if (btn) btn.classList.toggle('active', on);
}

// ── Wire Events ────────────────────────────────────────────────
function wireEvents() {
  // Tab clicks
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Complete buttons
  ['complete-btn', 'complete-btn-ex'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => {
      if (state.currentLesson) toggleComplete(state.currentLesson.id);
    });
  });

  // Nav buttons
  document.getElementById('prev-btn').addEventListener('click', () => navigateRelative(-1));
  document.getElementById('next-btn').addEventListener('click', () => navigateRelative(1));
  document.getElementById('prev-btn-ex').addEventListener('click', () => navigateRelative(-1));
  document.getElementById('next-btn-ex').addEventListener('click', () => navigateRelative(1));

  // Start button
  document.getElementById('start-btn').addEventListener('click', () => {
    const first = state.allLessons[0];
    if (first) showLesson(first, CURRICULUM[0]);
  });

  // Certificate button
  const certBtn = document.getElementById('cert-btn');
  if (certBtn) certBtn.addEventListener('click', showCertificate);

  // Reset
  document.getElementById('reset-btn').addEventListener('click', async () => {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    state.progress = { completedLessons: [], lastVisited: null, notes: {} };
    lsSave(state.progress, getProgressKey());
    if (state.serverMode) {
      await fetch('api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true })
      }).catch(() => {});
    }
    location.reload();
  });

  // Toggle chat
  document.getElementById('toggle-chat-btn').addEventListener('click', () => {
    const panel = document.getElementById('chat-panel');
    panel.classList.toggle('collapsed');
    state.chatOpen = !panel.classList.contains('collapsed');
    document.getElementById('toggle-chat-btn').textContent =
      state.chatOpen ? '💬 AI Chat' : '💬 Show Chat';
  });

  // Chat send
  document.getElementById('chat-send').addEventListener('click', () => {
    sendMessage(document.getElementById('chat-input').value);
  });

  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e.target.value);
    }
  });

  document.getElementById('chat-input').addEventListener('input', e => {
    autoResizeTextarea(e.target);
    // Fix #4 — live character counter
    const len     = e.target.value.length;
    const counter = document.getElementById('chat-char-counter');
    if (counter) {
      counter.textContent = `${len} / ${CHAT_MAX_CHARS}`;
      counter.style.color = len > CHAT_MAX_CHARS * 0.9 ? '#e74c3c' : '#9BA8BB';
    }
  });

  // Quick prompts
  document.querySelectorAll('.quick-prompt').forEach(qp => {
    qp.addEventListener('click', () => {
      const prompt = qp.dataset.prompt + (state.currentLessonContext ? ` (Lesson: ${state.currentLesson?.title})` : '');
      sendMessage(prompt);
    });
  });

  // Settings gear button
  document.getElementById('settings-btn').addEventListener('click', openSettings);

  // Smart Mode header button (syncs with settings checkbox)
  const smartBtn = document.getElementById('smart-mode-btn');
  if (smartBtn) {
    smartBtn.classList.toggle('active', state.smartMode);
    smartBtn.addEventListener('click', () => {
      state.smartMode = !state.smartMode;
      localStorage.setItem('smartMode', state.smartMode);
      smartBtn.classList.toggle('active', state.smartMode);
      const cb = document.getElementById('smart-mode-checkbox');
      if (cb) { cb.checked = state.smartMode; document.getElementById('smart-mode-status-text').textContent = state.smartMode ? 'On' : 'Off'; }
      showToast(state.smartMode ? '⚡ Smart Mode ON — Qwen will refine your questions' : '⚡ Smart Mode OFF', state.smartMode ? 'success' : 'info');
    });
  }

  // Notes save
  document.getElementById('save-note-btn').addEventListener('click', async () => {
    if (!state.currentLesson) return;
    const text = document.getElementById('notes-area').value;
    state.progress.notes[state.currentLesson.id] = text;
    await saveProgress({ note: { lessonId: state.currentLesson.id, text } });
    const msg = document.getElementById('note-saved-msg');
    msg.style.display = 'inline';
    setTimeout(() => msg.style.display = 'none', 2000);
  });
}

// ── Java Syntax Highlighter ────────────────────────────────────
// Works on raw text → HTML-escape → apply spans → set innerHTML
// This avoids the bug of regexes matching inside existing HTML attributes.
function highlightJava() {
  document.querySelectorAll(
    '.lesson-body pre code, .solution-box, .msg.assistant pre code, .msg.assistant pre'
  ).forEach(block => {
    if (block.dataset.highlighted) return;
    block.dataset.highlighted = '1';

    // 1. Get raw text (no HTML)
    const raw = block.tagName === 'PRE'
      ? block.textContent
      : block.textContent;

    // 2. HTML-escape the raw text first
    function esc(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    // 3. Tokenise line by line to keep comments safe
    const lines = raw.split('\n');
    const highlighted = lines.map(line => {
      // Whole-line comment (// or #)
      const lineCommentMatch = line.match(/^(\s*)(\/\/.*|#.*)$/);
      if (lineCommentMatch) {
        return esc(lineCommentMatch[1]) + `<span class="cmt">${esc(lineCommentMatch[2])}</span>`;
      }

      // Split by string literals first to protect them
      const parts = [];
      let remaining = line;
      const strRe = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
      let lastIdx = 0, m;
      while ((m = strRe.exec(line)) !== null) {
        parts.push({ type: 'code', val: line.slice(lastIdx, m.index) });
        parts.push({ type: 'str',  val: m[1] });
        lastIdx = m.index + m[1].length;
      }
      parts.push({ type: 'code', val: line.slice(lastIdx) });

      return parts.map(p => {
        if (p.type === 'str') return `<span class="str">${esc(p.val)}</span>`;

        let s = esc(p.val);

        // Inline comment after code
        const inlineCmt = s.indexOf('//');
        let cmt = '';
        if (inlineCmt !== -1) { cmt = s.slice(inlineCmt); s = s.slice(0, inlineCmt); }

        // Annotations
        s = s.replace(/(@\w+)/g, '<span class="ann">$1</span>');
        // Keywords
        const kws = ['public','private','protected','static','final','abstract','class',
          'interface','extends','implements','new','return','void','this','super',
          'null','true','false','if','else','for','while','do','switch','case',
          'break','continue','default','try','catch','finally','throw','throws',
          'import','package','var','instanceof','synchronized','volatile',
          'transient','native','enum','record','sealed','permits'];
        s = s.replace(new RegExp(`\\b(${kws.join('|')})\\b`, 'g'), '<span class="kw">$1</span>');
        // Class names (PascalCase)
        s = s.replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="cls">$1</span>');
        // Method calls
        s = s.replace(/\b([a-z]\w*)(\s*\()/g, '<span class="met">$1</span>$2');
        // Numbers
        s = s.replace(/\b(\d+\.?\d*[LlFfDd]?)\b/g, '<span class="num">$1</span>');

        if (cmt) s += `<span class="cmt">${cmt}</span>`;
        return s;
      }).join('');
    }).join('\n');

    block.innerHTML = highlighted;

    // Add Copy + Save buttons to code blocks (lesson body, chat, solution boxes)
    const pre = block.closest('.lesson-body pre, .solution-box, .msg.assistant pre');
    if (pre && !pre.querySelector('.copy-code-btn')) {
      const codeText = () => block.textContent || pre.textContent;

      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeText()).then(() => {
          copyBtn.textContent = '✓ Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
        }).catch(() => {
          copyBtn.textContent = 'Error';
          setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        });
      });
      pre.appendChild(copyBtn);

      // Save to Project button
      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-code-btn';
      saveBtn.textContent = '💾 Save';
      saveBtn.setAttribute('aria-label', 'Save code to project folder');
      saveBtn.addEventListener('click', () => saveToProject(codeText()));
      pre.appendChild(saveBtn);
    }
  });
}

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
