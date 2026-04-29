'use strict';

/* ============================================================
   State
   ============================================================ */
const state = {
  scripts: [],
  runLogs: JSON.parse(localStorage.getItem('danielilli_logs') || '[]'),
  currentScript: null,
  activeView: 'dashboard',
  activeFilter: 'all',
  searchQuery: '',
};

/* ============================================================
   Utilities
   ============================================================ */
function saveLogs() {
  // Keep max 100 entries
  if (state.runLogs.length > 100) state.runLogs = state.runLogs.slice(-100);
  localStorage.setItem('danielilli_logs', JSON.stringify(state.runLogs));
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function badgeClass(lang) {
  const map = { sh: 'badge--sh', bash: 'badge--sh', py: 'badge--py', python: 'badge--py', python3: 'badge--py', js: 'badge--js', javascript: 'badge--js', node: 'badge--js' };
  return map[lang] || 'badge--default';
}

/* ============================================================
   Toast
   ============================================================ */
function toast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

/* ============================================================
   Health check
   ============================================================ */
async function checkHealth() {
  const indicator = document.getElementById('health-indicator');
  const label = indicator.querySelector('.health__label');
  try {
    const res = await fetch('/healthz');
    if (res.ok) {
      indicator.className = 'health health--ok';
      label.textContent = 'Server online';
    } else {
      throw new Error('Non-OK');
    }
  } catch {
    indicator.className = 'health health--error';
    label.textContent = 'Server offline';
  }
}

/* ============================================================
   Fetch scripts
   ============================================================ */
async function fetchScripts() {
  try {
    const res = await fetch('/api/scripts');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.scripts = await res.json();
    return state.scripts;
  } catch (err) {
    toast(`Failed to load scripts: ${err.message}`, 'error');
    return [];
  }
}

async function fetchScriptDetail(name) {
  const res = await fetch(`/api/scripts/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function runScript(name) {
  const res = await fetch(`/api/scripts/${encodeURIComponent(name)}/run`, { method: 'POST' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ============================================================
   View routing
   ============================================================ */
function switchView(viewId) {
  document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
  document.getElementById(`view-${viewId}`).classList.remove('hidden');

  document.querySelectorAll('.sidebar__link').forEach((l) => {
    l.classList.toggle('sidebar__link--active', l.dataset.view === viewId);
  });

  const titles = { dashboard: 'Dashboard', scripts: 'Scripts', logs: 'Run Logs' };
  document.getElementById('view-title').textContent = titles[viewId] || viewId;
  state.activeView = viewId;

  // Close sidebar on mobile after navigation
  document.querySelector('.sidebar').classList.remove('open');

  if (viewId === 'scripts') renderScripts();
  if (viewId === 'logs') renderAllLogs();
  if (viewId === 'dashboard') renderDashboard();
}

/* ============================================================
   Dashboard
   ============================================================ */
function renderDashboard() {
  document.getElementById('stat-total').textContent = state.scripts.length || '—';

  const success = state.runLogs.filter((l) => l.exitCode === 0).length;
  const failed = state.runLogs.filter((l) => l.exitCode !== 0).length;
  document.getElementById('stat-success').textContent = success;
  document.getElementById('stat-failed').textContent = failed;

  const durations = state.runLogs.map((l) => l.duration).filter(Boolean);
  const avg = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;
  document.getElementById('stat-avg-duration').textContent = avg ? formatDuration(avg) : '—';

  const container = document.getElementById('recent-logs');
  const recent = [...state.runLogs].reverse().slice(0, 5);
  if (!recent.length) {
    container.innerHTML = '<p class="empty-state">No runs yet. Go to <strong>Scripts</strong> to execute one.</p>';
    return;
  }
  container.innerHTML = recent.map(logEntryHTML).join('');
}

/* ============================================================
   Scripts view
   ============================================================ */
function renderScripts() {
  const grid = document.getElementById('scripts-grid');
  let filtered = state.scripts;

  if (state.activeFilter !== 'all') {
    filtered = filtered.filter((s) => s.language === state.activeFilter || s.extension === `.${state.activeFilter}`);
  }
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }

  if (!filtered.length) {
    grid.innerHTML = '<p class="empty-state" style="grid-column:1/-1;text-align:center;padding:40px 0;color:var(--color-text-muted)">No scripts found.</p>';
    return;
  }

  grid.innerHTML = filtered.map((s) => `
    <div class="script-card" data-name="${escapeHtml(s.name)}">
      <div class="script-card__header">
        <span class="script-card__badge ${badgeClass(s.language)}">${escapeHtml(s.language)}</span>
        <span class="script-card__name">${escapeHtml(s.name)}</span>
      </div>
      <p class="script-card__desc">${escapeHtml(s.description)}</p>
      <div class="script-card__footer">
        <span class="script-card__meta">${escapeHtml(formatDate(s.modified))}</span>
        <button class="run-inline-btn" data-name="${escapeHtml(s.name)}">▶ Run</button>
      </div>
    </div>
  `).join('');

  // Card click → open detail modal
  grid.querySelectorAll('.script-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.run-inline-btn')) return;
      openModal(card.dataset.name);
    });
  });

  // Inline run button
  grid.querySelectorAll('.run-inline-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      executeScript(btn.dataset.name, btn);
    });
  });
}

/* ============================================================
   Log list helpers
   ============================================================ */
function logEntryHTML(entry) {
  const isOk = entry.exitCode === 0;
  const preview = (entry.stdout || entry.stderr || '').split('\n')[0] || '';
  return `
    <div class="log-entry ${isOk ? 'log-entry--success' : 'log-entry--error'}">
      <div class="log-entry__info">
        <div class="log-entry__name">${escapeHtml(entry.name)}</div>
        ${preview ? `<div class="log-entry__preview">${escapeHtml(preview)}</div>` : ''}
      </div>
      <div class="log-entry__meta">
        <div class="log-entry__status ${isOk ? 'status--ok' : 'status--err'}">${isOk ? '✓ OK' : `✗ exit ${entry.exitCode}`}</div>
        <div>${escapeHtml(formatDuration(entry.duration))}</div>
        <div>${escapeHtml(formatDate(entry.timestamp))}</div>
      </div>
    </div>
  `;
}

function renderAllLogs() {
  const container = document.getElementById('all-logs');
  const logs = [...state.runLogs].reverse();
  if (!logs.length) {
    container.innerHTML = '<p class="empty-state">No run history yet.</p>';
    return;
  }
  container.innerHTML = logs.map(logEntryHTML).join('');
}

/* ============================================================
   Execute script
   ============================================================ */
async function executeScript(name, triggerEl) {
  if (triggerEl) { triggerEl.disabled = true; triggerEl.textContent = '…'; }
  toast(`Running ${name}…`, 'info', 2000);

  let result = null;
  try {
    result = await runScript(name);
  } catch (err) {
    toast(`Execution failed: ${err.message}`, 'error');
    if (triggerEl) { triggerEl.disabled = false; triggerEl.textContent = '▶ Run'; }
    return null;
  }

  // Save log
  state.runLogs.push({ ...result, timestamp: new Date().toISOString() });
  saveLogs();

  const isOk = result.exitCode === 0;
  toast(`${name} finished — exit ${result.exitCode} (${formatDuration(result.duration)})`, isOk ? 'success' : 'error');

  if (triggerEl) { triggerEl.disabled = false; triggerEl.textContent = '▶ Run'; }
  if (state.activeView === 'dashboard') renderDashboard();
  if (state.activeView === 'logs') renderAllLogs();

  return result;
}

/* ============================================================
   Modal
   ============================================================ */
async function openModal(name) {
  state.currentScript = name;
  const overlay = document.getElementById('modal-overlay');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalCode = document.getElementById('modal-code');
  const modalLang = document.getElementById('modal-lang-label');
  const runBtn = document.getElementById('run-btn');

  modalTitle.textContent = name;
  modalMeta.textContent = 'Loading…';
  modalCode.textContent = '';
  overlay.classList.remove('hidden');

  // Remove previous output
  const oldOutput = document.getElementById('run-output');
  if (oldOutput) oldOutput.remove();

  try {
    const detail = await fetchScriptDetail(name);
    modalMeta.textContent = detail.description;
    modalCode.textContent = detail.content;
    modalLang.textContent = detail.language.toUpperCase();
  } catch (err) {
    modalMeta.textContent = 'Failed to load script details.';
    toast(`Error: ${err.message}`, 'error');
  }

  runBtn.onclick = async () => {
    runBtn.disabled = true;
    runBtn.innerHTML = '<div class="spinner" style="width:14px;height:14px;border-width:2px"></div> Running…';

    const result = await executeScript(name, null);
    runBtn.disabled = false;
    runBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Run Script';

    if (!result) return;

    const existing = document.getElementById('run-output');
    if (existing) existing.remove();

    const outputEl = document.createElement('div');
    outputEl.id = 'run-output';
    outputEl.className = 'run-output';
    const isOk = result.exitCode === 0;
    outputEl.innerHTML = `
      <div class="run-output__header">
        <span class="${isOk ? 'ok' : 'err'}">${isOk ? '✓ Exit 0' : `✗ Exit ${result.exitCode}`}</span>
        <span>${formatDuration(result.duration)}</span>
      </div>
      <pre class="run-output__pre">${escapeHtml(result.stdout || result.stderr || '(no output)')}</pre>
    `;
    document.querySelector('.modal__body').appendChild(outputEl);
  };
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  state.currentScript = null;
}

/* ============================================================
   Event listeners
   ============================================================ */
function setupListeners() {
  // Sidebar navigation
  document.querySelectorAll('.sidebar__link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(link.dataset.view);
    });
  });

  // Mobile menu toggle
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
  });

  // Refresh
  document.getElementById('refresh-btn').addEventListener('click', async () => {
    await fetchScripts();
    if (state.activeView === 'dashboard') renderDashboard();
    if (state.activeView === 'scripts') renderScripts();
    toast('Refreshed', 'success', 1500);
  });

  // Modal close
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Copy code
  document.getElementById('copy-btn').addEventListener('click', () => {
    const code = document.getElementById('modal-code').textContent;
    navigator.clipboard.writeText(code).then(() => toast('Copied to clipboard', 'success', 1500));
  });

  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    renderScripts();
  });

  // Filters
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      state.activeFilter = btn.dataset.lang;
      renderScripts();
    });
  });

  // Clear logs
  document.getElementById('clear-logs-btn').addEventListener('click', () => {
    state.runLogs = [];
    saveLogs();
    renderAllLogs();
    renderDashboard();
    toast('Logs cleared', 'info', 1500);
  });
}

/* ============================================================
   Init
   ============================================================ */
async function init() {
  setupListeners();
  checkHealth();
  setInterval(checkHealth, 30000);

  await fetchScripts();
  renderDashboard();
}

document.addEventListener('DOMContentLoaded', init);
