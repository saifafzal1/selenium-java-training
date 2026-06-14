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
  projectFolder: ''    // saved code destination
};

// ── Storage helpers (server + localStorage fallback) ──────────
const LS_KEY = 'selenium-training-progress';

function lsLoad() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || { completedLessons: [], lastVisited: null, notes: {} }; }
  catch { return { completedLessons: [], lastVisited: null, notes: {} }; }
}
function lsSave(p) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch {}
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

  // Flatten all lessons
  state.allLessons = CURRICULUM.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));

  // Load progress — try server first, fall back to localStorage
  try {
    const res = await fetch('api/progress', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      state.progress = await res.json();
      state.serverMode = true;
    } else { throw new Error('not ok'); }
  } catch {
    state.progress = lsLoad();
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

  CURRICULUM.forEach(module => {
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
    if (module === CURRICULUM[0]) toggleModule(hdr, list);
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
  meta.innerHTML = `
    <span class="meta-tag">${module.icon} ${module.title}</span>
    <span class="meta-tag ${lesson.type === 'practical' ? 'practical' : 'theory'}">${lesson.type}</span>
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
  lsSave(state.progress);

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
        lsSave(state.progress);
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

async function sendMessage(userText) {
  if (!userText.trim() || isChatting) return;
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
    lsSave(state.progress);
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

  document.getElementById('chat-input').addEventListener('input', e => autoResizeTextarea(e.target));

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
