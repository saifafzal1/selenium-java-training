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
  webMode: false,      // Groq compound web search mode
  agentMode: false,    // multi-step chain: Refine → Answer → Review
  skillMode: 'explain', // AI persona: explain | debug | generate | quiz
  projectFolder: '',   // saved code destination
  activeCourse: 'selenium'  // 'selenium' | 'playwright' | 'api' | 'e2e' | 'jmeter' | 'security' | 'database'
};

// ── Skill Prompts (AI Persona Modes) ───────────────────────────
const SKILL_PROMPTS = {
  explain: (ctx, course) =>
    `You are a patient, encouraging tutor teaching ${course} to a complete beginner.
Your teaching style:
- Break every concept into simple numbered steps
- Use real-world analogies (e.g. "WebDriver is like a remote control for the browser")
- Always end with a short, runnable code example
- Never assume prior knowledge; explain jargon before using it
- Keep answers concise but complete
${ctx ? `\nYou are currently teaching this lesson:\n${ctx}` : ''}`,

  debug: (ctx, course) =>
    `You are an expert ${course} debugger and problem-solver.
When given an error, stack trace, or broken code:
1. Identify the ROOT CAUSE precisely (be specific)
2. Explain WHY it happened in plain English
3. Show the CORRECTED code with inline comments on each fix
4. Add one "Pro Tip" to prevent this class of error in future
Use code blocks for all code. Be technically precise.
${ctx ? `\nCurrent lesson context:\n${ctx}` : ''}`,

  generate: (ctx, course) =>
    `You are a senior ${course} test automation engineer writing production-ready code.
Every piece of code you produce:
- Follows Page Object Model pattern (separate page classes from tests)
- Uses explicit waits ONLY — never Thread.sleep() or hardcoded delays
- Has meaningful assertions with clear failure messages
- Includes JavaDoc/JSDoc comments on public methods
- Uses TestNG @Test annotations (Java) or describe/it blocks (JS/TS)
- Is COMPLETE and immediately runnable — no placeholder stubs
${ctx ? `\nCurrent lesson context:\n${ctx}` : ''}`,

  quiz: (ctx, course) =>
    `You are an engaging ${course} quiz master testing the student's knowledge.
When asked about a topic, generate EXACTLY 3 questions:
  Q1: A conceptual "why/what" question
  Q2: A "read this code snippet, what happens?" question (include a real snippet)
  Q3: A practical scenario question ("Given X situation, how would you...")
Format each question clearly numbered. After the student answers, give enthusiastic, detailed feedback with the correct answer.
${ctx ? `\nLesson being studied:\n${ctx}` : ''}`
};

const QUICK_PROMPTS_BY_SKILL = {
  explain: [
    { label: 'Explain lesson',    prompt: 'Explain this lesson concept simply, with a real-world analogy' },
    { label: 'Show code',         prompt: 'Show me a simple, runnable code example for this topic' },
    { label: 'Why does it exist?',prompt: 'Why do we need this concept? What problem does it solve?' },
    { label: 'Summarize',         prompt: 'Summarize the key takeaways of this lesson in 5 bullet points' }
  ],
  debug: [
    { label: 'Debug my error',   prompt: 'Here is my error — please diagnose and fix it:\n\n```\n[paste error here]\n```' },
    { label: 'Common mistakes',  prompt: 'What are the most common mistakes beginners make with this topic?' },
    { label: 'Why does it fail?',prompt: 'Walk me through common failure points for this type of code' },
    { label: 'Review my code',   prompt: 'Review this code for bugs and issues:\n\n```java\n[paste code here]\n```' }
  ],
  generate: [
    { label: 'Generate example', prompt: 'Generate a complete, production-ready code example for this topic' },
    { label: 'POM version',      prompt: 'Generate a full Page Object Model implementation for this scenario' },
    { label: 'Add proper waits', prompt: 'Rewrite this to use explicit waits correctly — no Thread.sleep' },
    { label: 'Full test class',  prompt: 'Generate a complete TestNG test class with @BeforeMethod and @AfterMethod' }
  ],
  quiz: [
    { label: 'Quiz me',          prompt: 'Quiz me on this lesson topic with 3 questions' },
    { label: 'Check my answer',  prompt: 'Is my understanding correct? Here is my explanation:' },
    { label: 'Interview Qs',     prompt: 'What interview questions could be asked about this topic? Include model answers' },
    { label: 'Challenge me',     prompt: 'Give me a harder, practical exercise to really test my understanding' }
  ]
};

// ── Active curriculum helpers ───────────────────────────────────
function getActiveCurriculum() {
  if (state.activeCourse === 'playwright') return PLAYWRIGHT_CURRICULUM;
  if (state.activeCourse === 'api') return API_CURRICULUM;
  if (state.activeCourse === 'e2e') return E2E_CURRICULUM;
  if (state.activeCourse === 'jmeter') return JMETER_CURRICULUM;
  if (state.activeCourse === 'security') return SECURITY_CURRICULUM;
  if (state.activeCourse === 'database') return DATABASE_CURRICULUM;
  return CURRICULUM;
}
function getActiveLabs() {
  if (state.activeCourse === 'playwright') return PLAYWRIGHT_LABS;
  if (state.activeCourse === 'api') return API_CURRICULUM_LABS;
  if (state.activeCourse === 'e2e') return E2E_CURRICULUM_LABS;
  if (state.activeCourse === 'jmeter') return JMETER_CURRICULUM_LABS;
  if (state.activeCourse === 'security') return SECURITY_CURRICULUM_LABS;
  if (state.activeCourse === 'database') return DATABASE_CURRICULUM_LABS;
  return CURRICULUM_LABS;
}
function getProgressKey() {
  if (state.activeCourse === 'playwright') return 'playwright-training-progress';
  if (state.activeCourse === 'api') return 'api-training-progress';
  if (state.activeCourse === 'e2e') return 'e2e-training-progress';
  if (state.activeCourse === 'jmeter') return 'jmeter-training-progress';
  if (state.activeCourse === 'security') return 'security-training-progress';
  if (state.activeCourse === 'database') return 'database-training-progress';
  return 'selenium-training-progress';
}

// ── Course Switcher ─────────────────────────────────────────────
function switchCourse(course) {
  if (state.activeCourse === course) return;

  // Save current progress before switching
  lsSave(state.progress, getProgressKey());

  state.activeCourse = course;
  localStorage.setItem('activeCourse', course);

  // Update button states
  document.getElementById('btn-selenium').classList.toggle('active', course === 'selenium');
  document.getElementById('btn-playwright').classList.toggle('active', course === 'playwright');
  document.getElementById('btn-api').classList.toggle('active', course === 'api');
  document.getElementById('btn-e2e').classList.toggle('active', course === 'e2e');
  document.getElementById('btn-jmeter').classList.toggle('active', course === 'jmeter');
  document.getElementById('btn-security').classList.toggle('active', course === 'security');
  document.getElementById('btn-database').classList.toggle('active', course === 'database');

  // Update welcome screen content
  const isPlaywright = course === 'playwright';
  const isApi = course === 'api';
  const isE2E = course === 'e2e';
  const isJMeter = course === 'jmeter';
  const isSecurity = course === 'security';
  const isDatabase = course === 'database';
  document.getElementById('welcome-icon').textContent = isPlaywright ? '🎭' : isApi ? '🔌' : isE2E ? '🔗' : isJMeter ? '⚡' : isSecurity ? '🔒' : isDatabase ? '🗄️' : '🚀';
  document.getElementById('welcome-title').innerHTML = isPlaywright
    ? 'Playwright —<br><em>From Zero to Expert</em>'
    : isApi
    ? 'API Test Execution —<br><em>From Zero to Expert</em>'
    : isE2E
    ? 'E2E Integration —<br><em>The Full Test Pyramid</em>'
    : isJMeter
    ? 'JMeter Performance Testing —<br><em>From Zero to Expert</em>'
    : isSecurity
    ? 'Security Vulnerability Testing —<br><em>From Zero to Expert</em>'
    : isDatabase
    ? 'Database Testing with JDBC —<br><em>From Zero to Expert</em>'
    : 'Selenium with Java —<br><em>From Zero to Expert</em>';
  document.getElementById('welcome-desc').textContent = isPlaywright
    ? 'Modern, fast, and built-in API testing. Learn Playwright from scratch with hands-on exercises, the Request Builder pattern, and CI/CD. The AI assistant is here to help.'
    : isApi
    ? 'Master API testing from scratch — Postman, REST Assured, Newman, and GitHub Actions CI/CD. Build a full Java automation suite against a real REST API. The AI assistant is here at every step.'
    : isE2E
    ? 'Combine Selenium + REST Assured into a unified test pyramid. Learn ThreadLocal WebDriver, hybrid API/UI patterns, Selenium Grid with Docker, and a full GitHub Actions CI pipeline.'
    : isJMeter
    ? 'Learn performance testing from scratch — Thread Groups, HTTP Samplers, Assertions, CSV Data Sets, Correlation, HTML Reports, and a full GitHub Actions CI pipeline. Catch regressions before production.'
    : isSecurity
    ? 'Learn security testing hands-on — OWASP Top 10, SQL Injection, XSS, Broken Access Control, JWT attacks, API security, and automated ZAP scanning in CI/CD. Use ZAP and Burp Suite like a professional pentester.'
    : isDatabase
    ? 'Master database testing with JDBC — CRUD assertions, transaction management, DBUnit fixtures, Flyway migrations, Selenium+JDBC hybrid tests, and performance regression suites. Test every layer of your application.'
    : 'Hands-on, practical training with real exercises. Pick a lesson from the sidebar to begin. The AI assistant on the right can explain concepts, debug your code, and generate examples.';

  // Update certificate content
  document.getElementById('cert-course-title').innerHTML = isPlaywright
    ? 'Playwright<br><span>Test Automation Training</span>'
    : isApi
    ? 'API Test Execution<br><span>Test Automation Training</span>'
    : isE2E
    ? 'E2E Integration<br><span>Full Test Pyramid Training</span>'
    : isJMeter
    ? 'JMeter Performance Testing<br><span>Performance Engineering Training</span>'
    : isSecurity
    ? 'Security Vulnerability Testing<br><span>Application Security Training</span>'
    : isDatabase
    ? 'Database Testing with JDBC<br><span>Data Layer Testing Training</span>'
    : 'Selenium with Java<br><span>Test Automation Training</span>';
  document.getElementById('cert-lessons').textContent = isPlaywright
    ? '18 Lessons · ~9 Hours'
    : isApi
    ? '13 Lessons · ~7 Hours'
    : isE2E
    ? '11 Lessons · ~6 Hours'
    : isJMeter
    ? '11 Lessons · ~5 Hours'
    : isSecurity
    ? '11 Lessons · ~6 Hours'
    : isDatabase
    ? '12 Lessons · ~6 Hours'
    : '17 Lessons · ~8 Hours';
  document.getElementById('cert-topics').textContent = isPlaywright
    ? 'JavaScript · Node.js · POM · Fixtures · API Testing · Hybrid Tests · CI/CD · GitHub Actions'
    : isApi
    ? 'REST & HTTP · Postman · Newman · REST Assured · Java · TestNG · Authentication · Allure · CI/CD'
    : isE2E
    ? 'Test Pyramid · Multi-Module Maven · ThreadLocal WebDriver · Hybrid Patterns · Docker · Selenium Grid · Allure · GitHub Actions'
    : isJMeter
    ? 'Thread Groups · HTTP Samplers · Assertions · CSV Data Sets · Correlation · HTML Reports · CLI Mode · GitHub Actions'
    : isSecurity
    ? 'OWASP Top 10 · ZAP · Burp Suite · SQL Injection · XSS · IDOR · JWT · API Security · GitHub Actions CI/CD'
    : isDatabase
    ? 'JDBC · H2 · MySQL · CRUD Tests · Transactions · DBUnit · Flyway Migrations · Selenium+JDBC Hybrid · Performance'
    : 'Java for Testers · WebDriver · Locators · Waits · Page Object Model · TestNG · Frameworks · CI/CD';

  // Update chat placeholder
  const chatInput = document.getElementById('chat-input');
  if (chatInput) chatInput.placeholder = isPlaywright
    ? 'Ask anything about Playwright or JavaScript…'
    : isApi
    ? 'Ask anything about API testing, REST Assured or Postman…'
    : isE2E
    ? 'Ask anything about E2E integration, Docker, or the test pyramid…'
    : isJMeter
    ? 'Ask anything about JMeter, performance testing, or load analysis…'
    : isSecurity
    ? 'Ask anything about security testing, ZAP, Burp Suite, or OWASP…'
    : isDatabase
    ? 'Ask anything about JDBC, SQL, DBUnit, Flyway, or database testing…'
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
    : isApi
    ? `👋 Hi! I'm your AI assistant for API Testing. I can:<br><br>
      • <strong>Explain</strong> REST concepts, HTTP methods and JSON<br>
      • <strong>Generate</strong> REST Assured test code and Postman collections<br>
      • <strong>Debug</strong> your API test failures — paste errors here<br>
      • <strong>Review</strong> your test structure and assertions<br><br>
      Pick a model above and start asking!`
    : isE2E
    ? `👋 Hi! I'm your AI assistant for E2E Integration. I can:<br><br>
      • <strong>Explain</strong> test pyramid concepts and hybrid patterns<br>
      • <strong>Generate</strong> ThreadLocal WebDriver and APIClient code<br>
      • <strong>Debug</strong> race conditions, Grid issues, and Docker problems<br>
      • <strong>Review</strong> your multi-module Maven project structure<br><br>
      Pick a model above and start asking!`
    : isJMeter
    ? `👋 Hi! I'm your AI assistant for JMeter Performance Testing. I can:<br><br>
      • <strong>Explain</strong> Thread Groups, Samplers, and Listeners<br>
      • <strong>Generate</strong> JMeter test plans and GitHub Actions workflows<br>
      • <strong>Debug</strong> failed assertions, extractor issues, and correlation problems<br>
      • <strong>Analyse</strong> HTML reports — p95, APDEX, throughput, error rates<br><br>
      Pick a model above and start asking!`
    : isSecurity
    ? `👋 Hi! I'm your AI assistant for Security Vulnerability Testing. I can:<br><br>
      • <strong>Explain</strong> OWASP Top 10, attack techniques, and defensive patterns<br>
      • <strong>Generate</strong> ZAP scan configs, GitHub Actions security pipelines, and Java fixes<br>
      • <strong>Debug</strong> injection payloads, Burp Suite configs, and false positives<br>
      • <strong>Review</strong> your pentest findings and help write security reports<br><br>
      Pick a model above and start asking!`
    : isDatabase
    ? `👋 Hi! I'm your AI assistant for Database Testing with JDBC. I can:<br><br>
      • <strong>Explain</strong> JDBC concepts, SQL queries, and transaction management<br>
      • <strong>Generate</strong> JDBC test code, DBUnit fixtures, and Flyway migration scripts<br>
      • <strong>Debug</strong> SQLExceptions, constraint violations, and connection leaks<br>
      • <strong>Review</strong> your test data builders, DAOs, and hybrid Selenium+JDBC patterns<br><br>
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
  const key = isPlaywright ? 'playwright-training-progress' : isApi ? 'api-training-progress' : isE2E ? 'e2e-training-progress' : isJMeter ? 'jmeter-training-progress' : isSecurity ? 'security-training-progress' : isDatabase ? 'database-training-progress' : 'selenium-training-progress';
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
  state.webMode      = localStorage.getItem('webMode') === 'true';
  state.agentMode    = localStorage.getItem('agentMode') === 'true';
  state.skillMode    = localStorage.getItem('skillMode') || 'explain';
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
  document.getElementById('btn-api').classList.toggle('active', state.activeCourse === 'api');
  document.getElementById('btn-e2e').classList.toggle('active', state.activeCourse === 'e2e');
  document.getElementById('btn-jmeter').classList.toggle('active', state.activeCourse === 'jmeter');
  document.getElementById('btn-security').classList.toggle('active', state.activeCourse === 'security');
  document.getElementById('btn-database').classList.toggle('active', state.activeCourse === 'database');

  // Flatten all lessons for active course
  state.allLessons = getActiveCurriculum().flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));

  // Load progress — try server first, fall back to localStorage
  const progressKey = state.activeCourse === 'playwright' ? 'playwright-training-progress' : state.activeCourse === 'api' ? 'api-training-progress' : state.activeCourse === 'e2e' ? 'e2e-training-progress' : state.activeCourse === 'jmeter' ? 'jmeter-training-progress' : state.activeCourse === 'security' ? 'security-training-progress' : state.activeCourse === 'database' ? 'database-training-progress' : LS_KEY;
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
  state.currentLessonContext = `Current lesson: "${lesson.title}" (Module: ${module.title}). Topics covered: ${(lesson.content || lesson.objective || lesson.title).substring(0, 300)}...`;
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
  // Handle string exercises (markdown format used by some lab courses)
  if (typeof lesson.exercise === 'string') {
    container.innerHTML = `
      <div class="exercise-panel">
        <h3>🏋️ Exercise</h3>
        <div class="lesson-content">${marked.parse(lesson.exercise)}</div>
      </div>
      <p style="font-size:13px;color:var(--text3);margin-top:12px">
        💡 Paste your code or errors into the AI chat for help →
      </p>`;
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
  // Handle string evaluate fields (markdown format used by some lab courses)
  if (!lesson.rubric && lesson.evaluate) {
    container.innerHTML = `
      <div class="eval-wrap">
        <div class="eval-header">
          <div class="eval-title">✅ Lab Evaluation</div>
          <div class="eval-sub">${lesson.title}</div>
        </div>
        <div class="lesson-content" style="padding:16px 0">${marked.parse(lesson.evaluate)}</div>
        <p style="font-size:13px;color:var(--text3);margin-top:12px">
          💡 Share your results in the AI chat for feedback →
        </p>
      </div>`;
    return;
  }
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

// ── Client-side guards ────────────────────────────────────────
const CHAT_MAX_CHARS    = 3000;
const CHAT_SESSION_WARN = 20;
const CHAT_SESSION_KEY  = 'chat_session_' + new Date().toDateString();

function getChatCount()  { return parseInt(localStorage.getItem(CHAT_SESSION_KEY) || '0', 10); }
function incChatCount()  { localStorage.setItem(CHAT_SESSION_KEY, getChatCount() + 1); }

async function sendMessage(userText) {
  if (!userText.trim() || isChatting) return;

  if (userText.length > CHAT_MAX_CHARS) {
    appendMessage('assistant',
      `⚠️ Your message is **${userText.length} characters** — the limit is ${CHAT_MAX_CHARS}.\n\nPlease shorten your message. For large code pastes, paste only the relevant section and describe the rest.`
    );
    return;
  }

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

  // Build system prompt using active skill persona
  const course = state.activeCourse === 'playwright'
    ? 'Playwright (TypeScript/JavaScript)'
    : state.activeCourse === 'api'
    ? 'API Test Execution (REST Assured / Postman / Java)'
    : state.activeCourse === 'jmeter'
    ? 'JMeter Performance Testing'
    : state.activeCourse === 'security'
    ? 'Security Vulnerability Testing (OWASP, ZAP, Burp Suite)'
    : state.activeCourse === 'database'
    ? 'Database Testing with JDBC (H2, MySQL, DBUnit, Flyway)'
    : 'Selenium with Java';
  const skillFn = SKILL_PROMPTS[state.skillMode] || SKILL_PROMPTS.explain;
  const systemPrompt = skillFn(state.currentLessonContext, course);

  chatHistory.push({ role: 'user', content: userText });

  const model = document.getElementById('model-select').value;

  // ── Agent Mode ──────────────────────────────────────────────
  if (state.agentMode) {
    const course = state.activeCourse === 'playwright'
      ? 'Playwright (TypeScript/JavaScript)'
      : state.activeCourse === 'api'
      ? 'API Test Execution (REST Assured / Postman / Java)'
      : state.activeCourse === 'jmeter'
      ? 'JMeter Performance Testing'
      : 'Selenium with Java';
    try {
      await runAgentChain(userText, state.currentLessonContext, course);
    } finally {
      isChatting = false;
      sendBtn.disabled = false;
    }
    return;
  }

  // Status message (Smart Mode or Web Mode)
  let chainStatusEl = null;
  if (state.webMode) {
    chainStatusEl = document.createElement('div');
    chainStatusEl.className = 'msg assistant chain-status';
    chainStatusEl.innerHTML = '🌐 <em>Searching the web for current information…</em>';
    document.getElementById('chat-messages').appendChild(chainStatusEl);
    scrollChat();
  } else if (state.smartMode) {
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
        webMode: state.webMode,
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

    // Update status message
    if (chainStatusEl) {
      if (data.webSearchUsed) {
        chainStatusEl.innerHTML = `🌐 <strong>Web searched</strong> — answer includes real-time data`;
      } else if (data.refinedQuestion) {
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
      incChatCount();
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

    const ollamaGroup = document.getElementById('ollama-optgroup');
    if (ollamaGroup && data.ollama === 'ok' && data.ollamaModels?.length > 0) {
      ollamaGroup.innerHTML = data.ollamaModels.map(m =>
        `<option value="${m}">🟢 ${m}</option>`
      ).join('');
    }

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
  setTimeout(() => { toast.classList.add('toast-fade'); setTimeout(() => toast.remove(), 400); }, 5000);
}

// ── Save to Project (VS Code) ──────────────────────────────────
async function saveToProject(code) {
  const folder = state.projectFolder;

  const match = code.match(/public\s+class\s+(\w+)/);
  const filename = match ? `${match[1]}.java` : `SeleniumCode_${Date.now()}.java`;

  if (state.serverMode && folder) {
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
    showToast('⚠️ Set your Project Folder in Settings first (⚙️)', 'warning', {
      label: 'Open Settings',
      fn: openSettings
    });
  } else {
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
  const btn = document.getElementById('smart-mode-btn');
  if (btn) btn.classList.toggle('active', on);
}

// ── Skill Mode ─────────────────────────────────────────────────
const SKILL_DESCRIPTIONS = {
  explain:  '🎓 Patient tutor — explains with analogies & simple code',
  debug:    '🐛 Expert debugger — root cause analysis + corrected code',
  generate: '⚙️ Senior engineer — production-ready POM code',
  quiz:     '🧩 Quiz master — tests your knowledge with 3 questions'
};

const SKILL_HELP_ANCHORS = {
  explain:  '#skill-explain',
  debug:    '#skill-debug',
  generate: '#skill-generate',
  quiz:     '#skill-quiz'
};

const SKILL_INTRO_MESSAGES = {
  explain: `🎓 **Explain Mode** activated!

I'll act as your patient tutor — breaking concepts into simple steps, using real-world analogies, and always ending with a working code example.

**Try asking:**
- *"Explain WebDriver waits with a real example"*
- *"What is Page Object Model and why use it?"*
- *"Walk me through how locators work in Selenium"*

📖 [See full examples & tips in the Help Guide →](/help.html#skill-explain)`,

  debug: `🐛 **Debug Mode** activated!

I'll act as your expert debugger — finding the root cause of errors, explaining *why* they happen, and giving you corrected code with inline comments.

**Try asking:**
- *"Fix this error: NoSuchElementException on findElement"*
- *"My test passes locally but fails in CI — why?"*
- Paste any stack trace or broken code and I'll diagnose it

📖 [See full examples & tips in the Help Guide →](/help.html#skill-debug)`,

  generate: `⚙️ **Generate Mode** activated!

I'll act as a senior engineer — writing production-ready, POM-structured Selenium code you can drop straight into your framework.

**Try asking:**
- *"Generate a LoginPage class using Page Object Model"*
- *"Write a DriverFactory with ChromeOptions for headless mode"*
- *"Create a TestNG data provider test for a login form"*

📖 [See full examples & tips in the Help Guide →](/help.html#skill-generate)`,

  quiz: `🧩 **Quiz Mode** activated!

I'll test your knowledge with 3 targeted questions on the current lesson — multiple choice or short answer. Answer them and I'll give you feedback and explanations.

**Try asking:**
- *"Quiz me on WebDriver locators"*
- *"Test my understanding of explicit vs implicit waits"*
- *"Give me 3 questions on Page Object Model"*

📖 [See full examples & tips in the Help Guide →](/help.html#skill-quiz)`
};

// ── Agent Mode ────────────────────────────────────────────────
function setAgentMode(on) {
  state.agentMode = on;
  localStorage.setItem('agentMode', on);
  const btn = document.getElementById('agent-toggle-btn');
  if (btn) btn.setAttribute('aria-pressed', String(on));
  const status = document.getElementById('agent-status');
  if (status) status.textContent = on
    ? 'On — 🔍 Qwen refines → 💬 Llama answers → ✅ Scout reviews'
    : 'Off — using selected model directly';
  showToast(on ? '🤖 Agent Mode ON' : '🤖 Agent Mode OFF', on ? 'success' : 'info');

  if (on) {
    appendMessage('assistant',
      `🤖 **Agent Mode is ON** — your questions now run through a 3-step AI chain:\n\n` +
      `**🔍 Refine** (Qwen 3 32B) → **💬 Answer** (Llama 3.3 70B) → **✅ Review** (Llama 4 Scout)\n\n` +
      `Each step streams into chat with a colour-coded border. Responses take a bit longer but are higher quality.\n\n` +
      `📖 [Learn more about Agent Mode →](/help.html#agent-mode)`
    );
  }
}

async function agentStep(model, systemPrompt, userMessage) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  }
      ],
      stream: false
    })
  });
  if (!res.ok) throw new Error(`Step failed: HTTP ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || data.content || '';
}

async function runAgentChain(userText, lessonCtx, course) {
  const skillFn = SKILL_PROMPTS[state.skillMode] || SKILL_PROMPTS.explain;
  const skillPrompt = skillFn(lessonCtx, course);

  // ── Step 1: Refine ──────────────────────────────────────────
  const refineEl = appendMessage('assistant', '');
  refineEl.classList.add('agent-refine');
  refineEl.innerHTML = '<span class="agent-step-label">🔍 REFINING</span><br><em>Sharpening your question…</em>';

  let refinedQ;
  try {
    refinedQ = await agentStep(
      'qwen/qwen3-32b',
      `You are a question refiner for a ${course} automation training platform.
Rewrite the user's question to be precise, specific, and richly contextual for a Selenium/Java learner.
Return ONLY the refined question — no preamble, no explanation.`,
      userText
    );
    refineEl.innerHTML = `<span class="agent-step-label">🔍 REFINED QUESTION</span>\n\n${marked.parse(refinedQ)}`;
  } catch (err) {
    refineEl.innerHTML = `<span class="agent-step-label">🔍 REFINE</span> ⚠️ ${err.message} — using original question`;
    refinedQ = userText;
  }

  // ── Step 2: Answer ─────────────────────────────────────────
  const answerEl = appendMessage('assistant', '');
  answerEl.classList.add('agent-answer');
  answerEl.innerHTML = '<span class="agent-step-label">💬 ANSWERING</span><br><em>Generating detailed answer…</em>';

  let answer;
  try {
    answer = await agentStep(
      'llama-3.3-70b-versatile',
      skillPrompt,
      refinedQ
    );
    answerEl.innerHTML = `<span class="agent-step-label">💬 ANSWER</span>\n\n${marked.parse(answer)}`;
  } catch (err) {
    answerEl.innerHTML = `<span class="agent-step-label">💬 ANSWER</span> ⚠️ ${err.message}`;
    answer = '';
  }

  // ── Step 3: Review ─────────────────────────────────────────
  const reviewEl = appendMessage('assistant', '');
  reviewEl.classList.add('agent-review');
  reviewEl.innerHTML = '<span class="agent-step-label">✅ REVIEWING</span><br><em>Checking quality…</em>';

  try {
    const review = await agentStep(
      'meta-llama/llama-4-scout-17b-16e-instruct',
      `You are a senior ${course} automation engineer reviewing an AI-generated answer for a learner.
Check the answer below for: accuracy, completeness, and best practices.
Then provide:
1. ✅ What's good
2. 🔧 Any corrections or missing info
3. 💡 One bonus tip
4. ⭐ Quality score (1-5)
Be concise — learner-friendly tone.`,
      `Original question: ${userText}\n\nAnswer to review:\n${answer}`
    );
    reviewEl.innerHTML = `<span class="agent-step-label">✅ REVIEW</span>\n\n${marked.parse(review)}`;
  } catch (err) {
    reviewEl.innerHTML = `<span class="agent-step-label">✅ REVIEW</span> ⚠️ ${err.message}`;
  }
}

function setSkillMode(skill) {
  state.skillMode = skill;
  localStorage.setItem('skillMode', skill);
  document.querySelectorAll('.skill-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.skill === skill)
  );
  const desc = document.getElementById('skill-desc');
  if (desc) desc.textContent = SKILL_DESCRIPTIONS[skill] || '';
  updateQuickPrompts(skill);
  const labels = {
    explain:  '🎓 Explain Mode',
    debug:    '🐛 Debug Mode',
    generate: '⚙️ Generate Mode',
    quiz:     '🧩 Quiz Mode'
  };
  showToast(labels[skill] || 'Skill mode changed', 'success');

  const intro = SKILL_INTRO_MESSAGES[skill];
  if (intro) appendMessage('assistant', intro);
}

function updateQuickPrompts(skill) {
  const container = document.getElementById('quick-prompts');
  if (!container) return;
  const prompts = QUICK_PROMPTS_BY_SKILL[skill] || QUICK_PROMPTS_BY_SKILL.explain;
  container.innerHTML = prompts.map(p =>
    `<div class="quick-prompt" data-prompt="${escHtml(p.prompt)}">${escHtml(p.label)}</div>`
  ).join('');
  container.querySelectorAll('.quick-prompt').forEach(qp => {
    qp.addEventListener('click', () => {
      const lessonSuffix = state.currentLessonContext ? ` (Lesson: ${state.currentLesson?.title})` : '';
      sendMessage(qp.dataset.prompt + lessonSuffix);
    });
  });
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
    const len     = e.target.value.length;
    const counter = document.getElementById('chat-char-counter');
    if (counter) {
      counter.textContent = `${len} / ${CHAT_MAX_CHARS}`;
      counter.style.color = len > CHAT_MAX_CHARS * 0.9 ? '#e74c3c' : '#9BA8BB';
    }
  });

  // Feature tray tab switching
  document.querySelectorAll('.tray-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tray = tab.dataset.tray;
      document.querySelectorAll('.tray-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tray-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById('tray-' + tray)?.classList.add('active');
    });
  });

  // Skill mode buttons
  document.querySelectorAll('.skill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.skill === state.skillMode);
    btn.addEventListener('click', () => setSkillMode(btn.dataset.skill));
  });
  const descEl = document.getElementById('skill-desc');
  if (descEl) descEl.textContent = SKILL_DESCRIPTIONS[state.skillMode] || '';
  updateQuickPrompts(state.skillMode);

  // Feedback button
  const feedbackBtn = document.getElementById('feedback-btn');
  if (feedbackBtn) feedbackBtn.addEventListener('click', openFeedback);
  wireFeedbackStars();

  // Settings gear button
  document.getElementById('settings-btn').addEventListener('click', openSettings);

  // Smart Mode header button
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

  // Agent Mode toggle
  const agentToggleBtn = document.getElementById('agent-toggle-btn');
  if (agentToggleBtn) {
    agentToggleBtn.setAttribute('aria-pressed', String(state.agentMode));
    const agentStatus = document.getElementById('agent-status');
    if (agentStatus) agentStatus.textContent = state.agentMode
      ? 'On — 🔍 Qwen refines → 💬 Llama answers → ✅ Scout reviews'
      : 'Off — using selected model directly';
    agentToggleBtn.addEventListener('click', () => setAgentMode(!state.agentMode));
  }

  // Web Mode header button
  const webBtn = document.getElementById('web-mode-btn');
  if (webBtn) {
    webBtn.classList.toggle('active', state.webMode);
    webBtn.addEventListener('click', () => {
      state.webMode = !state.webMode;
      localStorage.setItem('webMode', state.webMode);
      webBtn.classList.toggle('active', state.webMode);
      showToast(state.webMode ? '🌐 Web Mode ON — answers will use real-time search' : '🌐 Web Mode OFF', state.webMode ? 'success' : 'info');
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
function highlightJava() {
  document.querySelectorAll(
    '.lesson-body pre code, .solution-box, .msg.assistant pre code, .msg.assistant pre'
  ).forEach(block => {
    if (block.dataset.highlighted) return;
    block.dataset.highlighted = '1';

    const raw = block.tagName === 'PRE'
      ? block.textContent
      : block.textContent;

    function esc(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    const lines = raw.split('\n');
    const highlighted = lines.map(line => {
      const lineCommentMatch = line.match(/^(\s*)(\/\/.*|#.*)$/);
      if (lineCommentMatch) {
        return esc(lineCommentMatch[1]) + `<span class="cmt">${esc(lineCommentMatch[2])}</span>`;
      }

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

        const inlineCmt = s.indexOf('//');
        let cmt = '';
        if (inlineCmt !== -1) { cmt = s.slice(inlineCmt); s = s.slice(0, inlineCmt); }

        s = s.replace(/(@\w+)/g, '<span class="ann">$1</span>');
        const kws = ['public','private','protected','static','final','abstract','class',
          'interface','extends','implements','new','return','void','this','super',
          'null','true','false','if','else','for','while','do','switch','case',
          'break','continue','default','try','catch','finally','throw','throws',
          'import','package','var','instanceof','synchronized','volatile',
          'transient','native','enum','record','sealed','permits'];
        s = s.replace(new RegExp(`\\b(${kws.join('|')})\\b`, 'g'), '<span class="kw">$1</span>');
        s = s.replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="cls">$1</span>');
        s = s.replace(/\b([a-z]\w*)(\s*\()/g, '<span class="met">$1</span>$2');
        s = s.replace(/\b(\d+\.?\d*[LlFfDd]?)\b/g, '<span class="num">$1</span>');

        if (cmt) s += `<span class="cmt">${cmt}</span>`;
        return s;
      }).join('');
    }).join('\n');

    block.innerHTML = highlighted;

    const pre = block.closest('.lesson-body pre, .solution-box, .msg.assistant pre');
    if (pre && !pre.querySelector('.copy-code-btn')) {
      const codeText = () => block.textContent || pre.textContent;

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

      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-code-btn';
      saveBtn.textContent = '💾 Save';
      saveBtn.setAttribute('aria-label', 'Save code to project folder');
      saveBtn.addEventListener('click', () => saveToProject(codeText()));
      pre.appendChild(saveBtn);
    }
  });
}

// ── Feedback Modal ─────────────────────────────────────────────
let feedbackRating = 0;

const RATING_LABELS = ['', 'Poor 😕', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent! 🤩'];

function openFeedback() {
  feedbackRating = 0;
  document.getElementById('feedback-comment').value = '';
  document.getElementById('feedback-char-count').textContent = '0 / 500';
  document.getElementById('feedback-rating-label').textContent = 'Tap a star to rate';
  document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('selected', 'hovered'));
  document.getElementById('feedback-submit-btn').disabled = true;
  document.getElementById('feedback-overlay').style.display = 'block';
  document.getElementById('feedback-modal').style.display = 'block';
}

function closeFeedback() {
  document.getElementById('feedback-overlay').style.display = 'none';
  document.getElementById('feedback-modal').style.display  = 'none';
}

function wireFeedbackStars() {
  const stars = document.querySelectorAll('.star-btn');
  stars.forEach(btn => {
    const val = Number(btn.dataset.value);

    btn.addEventListener('mouseover', () => {
      stars.forEach(b => b.classList.toggle('hovered', Number(b.dataset.value) <= val));
    });
    btn.addEventListener('mouseout', () => {
      stars.forEach(b => b.classList.remove('hovered'));
    });
    btn.addEventListener('click', () => {
      feedbackRating = val;
      stars.forEach(b => b.classList.toggle('selected', Number(b.dataset.value) <= val));
      document.getElementById('feedback-rating-label').textContent = RATING_LABELS[val] || '';
      document.getElementById('feedback-submit-btn').disabled = false;
    });
  });

  document.getElementById('feedback-comment').addEventListener('input', e => {
    const len = e.target.value.length;
    document.getElementById('feedback-char-count').textContent = `${len} / 500`;
  });
}

async function submitFeedback() {
  if (!feedbackRating) return;
  const btn = document.getElementById('feedback-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  const payload = {
    rating:      feedbackRating,
    comment:     document.getElementById('feedback-comment').value.trim(),
    lessonTitle: state.currentLesson?.title || null,
    lessonId:    state.currentLesson?.id    || null,
    skillMode:   state.skillMode,
    model:       document.getElementById('model-select')?.value || 'unknown'
  };

  try {
    const res = await fetch('/api/feedback', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    closeFeedback();
    showToast('⭐ Thanks for your feedback!', 'success');
  } catch (err) {
    showToast(`❌ Feedback failed: ${err.message}`, 'error');
    btn.disabled = false;
    btn.textContent = 'Send Feedback';
  }
}

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
