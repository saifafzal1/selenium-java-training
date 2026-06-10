// ── State ──────────────────────────────────────────────────────
let state = {
  progress: { completedLessons: [], lastVisited: null, notes: {} },
  currentLesson: null,
  currentModule: null,
  allLessons: [],   // flat list for prev/next
  chatOpen: true,
  currentLessonContext: '',
  serverMode: false   // true when Node server is reachable
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

  // Render lesson content (markdown)
  document.getElementById('lesson-content').innerHTML =
    marked.parse(lesson.content || '_No content yet._');
  requestAnimationFrame(highlightJava);

  // Render exercise
  renderExercise(lesson);

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

  // Typing indicator
  const typing = document.createElement('div');
  typing.className = 'msg assistant typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  document.getElementById('chat-messages').appendChild(typing);
  scrollChat();

  const model = document.getElementById('model-select').value;

  try {
    const res = await fetch('api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
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

// ── Ollama Health & Model Auto-Detect ─────────────────────────
async function checkHealth() {
  const dot    = document.getElementById('ollama-status');
  const select = document.getElementById('model-select');
  try {
    const res  = await fetch('api/health', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();

    if (data.ollama === 'ok') {
      dot.className = 'online';
      const models = data.models || [];
      dot.title = 'Ollama online — ' + (models.join(', ') || 'no models pulled');

      // Populate dropdown with ONLY installed models
      if (models.length > 0) {
        const currentVal = select.value;
        select.innerHTML = models.map(m =>
          `<option value="${m}">${m}</option>`
        ).join('');
        // Keep previous selection if still available, else pick first
        if (models.includes(currentVal)) {
          select.value = currentVal;
        }
      } else {
        select.innerHTML = `<option value="llama-3.3-70b-versatile">Llama 3.3 70B ✨</option>`;
      }
    } else {
      dot.className = 'offline';
      dot.title = 'Groq API offline — check GROQ_API_KEY in Vercel env vars';
    }
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
    '.lesson-body pre code, .solution-box, .msg.assistant pre code'
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
  });
}

// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
