// rag-app.js — RAG knowledge base UI + Submit Project feature
// Loaded after app.js. Adds functions called by index.html onclick handlers.
// Patches updateProgressUI to show Submit panel when all lessons complete.

// ── Patch updateProgressUI to also show Submit panel ────────────────
// Works because app.js defines updateProgressUI as a global function declaration;
// reassigning window.updateProgressUI redirects all subsequent calls through the
// patched version (global function lookups go via the window object).
(function patchProgressUI() {
  const _orig = window.updateProgressUI;
  if (!_orig) return; // safety: app.js not yet loaded
  window.updateProgressUI = function () {
    _orig();
    // Show submit panel once course is 100% complete
    const total = window.state?.allLessons?.length || 0;
    const done  = window.state?.progress?.completedLessons?.length || 0;
    if (total > 0 && done >= total) {
      const panel = document.getElementById('submit-project-panel');
      if (panel) panel.style.display = 'block';
    }
  };
})();

// ── RAG Status ───────────────────────────────────────────────────

async function checkRagStatus() {
  if (!window.state?.serverMode) return;
  try {
    const res = await fetch('api/rag/status', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return;
    const data = await res.json();
    _updateRagBadge(data);
    // Show/hide the RAG pill in chat header
    const indicator = document.getElementById('rag-indicator');
    if (indicator) indicator.style.display = data.synced ? 'block' : 'none';
  } catch { /* silent — RAG not available or server offline */ }
}

function _updateRagBadge(data) {
  const badge = document.getElementById('rag-badge');
  const count = document.getElementById('rag-chunk-count');
  if (!badge) return;
  if (data.synced) {
    badge.textContent = '✅ Synced';
    badge.className   = 'rag-badge rag-ok';
    if (count) count.textContent = `${data.count} chunks · ${data.sources?.length || 0} sources`;
  } else {
    badge.textContent = '⏳ Not synced';
    badge.className   = 'rag-badge rag-warn';
    if (count) count.textContent = '';
  }
}

// ── Sync Docs ─────────────────────────────────────────────────────
// Called from index.html: onclick="syncDocs()"

async function syncDocs() {
  if (!window.state?.serverMode) {
    window.showToast?.('❌ Server not running — start with: npm start', 'error');
    return;
  }

  const progressWrap  = document.getElementById('rag-progress-wrap');
  const progressFill  = document.getElementById('rag-progress-fill');
  const progressLabel = document.getElementById('rag-progress-label');
  const msgEl         = document.getElementById('rag-msg');
  const badge         = document.getElementById('rag-badge');
  const indicator     = document.getElementById('rag-indicator');

  // Show progress UI
  if (progressWrap)  progressWrap.style.display  = 'block';
  if (progressFill)  progressFill.style.width     = '5%';
  if (progressLabel) progressLabel.textContent    = 'Starting sync…';
  if (badge)  { badge.textContent = '🔄 Syncing…'; badge.className = 'rag-badge rag-syncing'; }
  if (msgEl)  msgEl.textContent = '';

  try {
    const evtSource = new EventSource('api/rag/ingest');
    let total = 0, current = 0;

    evtSource.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === 'start') {
        total = data.total || 7;
        if (progressLabel) progressLabel.textContent = `Fetching ${total} documentation sources…`;
        if (progressFill)  progressFill.style.width  = '8%';
      }

      if (data.type === 'progress') {
        current++;
        const baseProgress = 8 + (current / Math.max(total * 2, 1)) * 80;

        if (data.stage === 'fetch') {
          const srcName = data.url?.split('/').filter(Boolean).slice(-2).join('/') || '…';
          if (progressLabel) progressLabel.textContent = `📥 Fetching: ${srcName}`;
          if (progressFill)  progressFill.style.width  = `${Math.min(baseProgress, 88)}%`;
        }
        if (data.stage === 'embed') {
          const chunkPct   = data.totalChunks ? (data.embedded / data.totalChunks) : 0;
          const totalPct   = Math.min(baseProgress + chunkPct * 8, 94);
          if (progressFill)  progressFill.style.width  = `${totalPct}%`;
          if (progressLabel) progressLabel.textContent =
            `🧠 Embedding ${data.embedded || '?'}/${data.totalChunks || '?'} chunks…`;
        }
        if (data.stage === 'error') {
          if (progressLabel)
            progressLabel.textContent = `⚠️ Skipped (${(data.error || '').substring(0, 50)})`;
        }
      }

      if (data.type === 'done') {
        evtSource.close();
        const added = data.totalAdded || 0;
        if (progressFill)  progressFill.style.width  = '100%';
        if (progressLabel) progressLabel.textContent = `✅ Done! ${added} chunks stored locally`;
        _updateRagBadge(data.status || { synced: true, count: added, sources: [] });
        if (indicator) indicator.style.display = 'block';
        const failed = data.results?.filter(r => !r.ok).length || 0;
        if (msgEl) {
          msgEl.textContent = failed > 0
            ? `⚠️ ${failed} source(s) skipped (network). ${added} chunks saved — partial sync OK.`
            : `✅ All 7 sources synced! ${added} new chunks ready for local AI.`;
          msgEl.className = 'settings-status ' + (failed > 0 ? 'warn' : 'ok');
        }
        window.showToast?.('📚 Docs synced! Local Ollama models now use Selenium documentation context', 'success');
        setTimeout(() => { if (progressWrap) progressWrap.style.display = 'none'; }, 5000);
      }

      if (data.type === 'error') {
        evtSource.close();
        if (progressFill)  progressFill.style.width  = '0%';
        if (progressLabel) progressLabel.textContent = `❌ ${data.error}`;
        if (badge)  { badge.textContent = '❌ Error'; badge.className = 'rag-badge rag-warn'; }
        if (msgEl)  { msgEl.textContent = `❌ ${data.error}`; msgEl.className = 'settings-status error'; }
        window.showToast?.(`❌ Sync error: ${(data.error || '').substring(0, 70)}`, 'error');
      }
    };

    evtSource.onerror = () => {
      evtSource.close();
      if (progressLabel) progressLabel.textContent = '❌ Connection dropped — is npm start running?';
      window.showToast?.('❌ Sync connection dropped — check npm start in terminal', 'error');
    };

  } catch (err) {
    window.showToast?.(`❌ Sync failed: ${err.message}`, 'error');
  }
}

// ── Clear Docs ─────────────────────────────────────────────────────
// Called from index.html: onclick="clearDocs()"

async function clearDocs() {
  if (!confirm('Clear all locally stored documentation? You can re-sync at any time when online.')) return;
  try {
    const res = await fetch('api/rag/clear', { method: 'POST' });
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    _updateRagBadge({ synced: false });
    const indicator = document.getElementById('rag-indicator');
    if (indicator) indicator.style.display = 'none';
    const msgEl = document.getElementById('rag-msg');
    if (msgEl) { msgEl.textContent = '🗑️ Cleared.'; msgEl.className = 'settings-status'; }
    const wrap = document.getElementById('rag-progress-wrap');
    if (wrap) wrap.style.display = 'none';
    window.showToast?.('🗑️ Local docs cleared. Click Sync Docs to rebuild anytime.', 'info');
  } catch (err) {
    window.showToast?.(`❌ Clear failed: ${err.message}`, 'error');
  }
}

// ── Submit Project for Review ──────────────────────────────────────

function showSubmitPanel() {
  const panel = document.getElementById('submit-project-panel');
  if (panel) panel.style.display = 'block';
}

async function submitProject() {
  const urlInput = document.getElementById('github-repo-url');
  const statusEl = document.getElementById('submit-status');
  const reviewEl = document.getElementById('review-output');

  const repoUrl = urlInput?.value.trim();
  if (!repoUrl) {
    if (statusEl) { statusEl.textContent = '⚠️ Please enter your GitHub repo URL'; statusEl.style.color = 'var(--orange)'; }
    return;
  }

  if (!repoUrl.includes('github.com')) {
    if (statusEl) { statusEl.textContent = '❌ Must be a GitHub URL: https://github.com/username/repo'; statusEl.style.color = 'var(--red)'; }
    return;
  }

  if (!window.state?.serverMode) {
    if (statusEl) { statusEl.textContent = '❌ Server must be running locally (npm start)'; statusEl.style.color = 'var(--red)'; }
    return;
  }

  if (statusEl) { statusEl.textContent = '🔍 Fetching your code from GitHub…'; statusEl.style.color = 'var(--text2)'; }
  if (reviewEl) reviewEl.style.display = 'none';

  try {
    const model = document.getElementById('model-select')?.value || 'llama-3.3-70b-versatile';
    const res   = await fetch('api/submit-review', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ repoUrl, model }),
      signal:  AbortSignal.timeout(120000)   // code review can take time
    });

    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const data = await res.json();

    if (!data.ok || data.error) {
      if (statusEl) { statusEl.textContent = `❌ ${data.error}`; statusEl.style.color = 'var(--red)'; }
      return;
    }

    const files = data.filesReviewed || [];
    if (statusEl) {
      statusEl.textContent = `✅ Reviewed ${files.length} Java file(s) from ${data.repo}`;
      statusEl.style.color = 'var(--lime)';
    }

    if (reviewEl && data.review) {
      reviewEl.style.display = 'block';
      reviewEl.innerHTML     = window.renderMarkdown?.(data.review) || data.review;
      requestAnimationFrame(() => window.highlightJava?.());
    }

    window.showToast?.('✅ Code review complete! Scroll down to see your feedback.', 'success');

  } catch (err) {
    if (statusEl) { statusEl.textContent = `❌ ${err.message}`; statusEl.style.color = 'var(--red)'; }
  }
}

// ── Boot ────────────────────────────────────────────────────────
// Run after app.js init() has finished its async work (~1.2s on local server).

document.addEventListener('DOMContentLoaded', () => {
  // Patch must run AFTER app.js has set window.updateProgressUI
  // The IIFE at top already did this; calling it again is safe.
  setTimeout(async () => {
    // 1. Check RAG sync status and update badge
    await checkRagStatus();

    // 2. Show submit panel if all lessons are already complete (resume session)
    const total = window.state?.allLessons?.length || 0;
    const done  = window.state?.progress?.completedLessons?.length || 0;
    if (total > 0 && done >= total) showSubmitPanel();
  }, 1200);   // wait for init() async tasks to finish
});
