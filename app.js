const SESSIONS_KEY = 'ai_sessions';
const ITEMS_KEY    = 'ai_items';

// ── STORAGE ──
function loadSessions() {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || []; } catch { return []; }
}
function loadItems() {
  try { return JSON.parse(localStorage.getItem(ITEMS_KEY)) || []; } catch { return []; }
}
function saveSessions(d) { localStorage.setItem(SESSIONS_KEY, JSON.stringify(d)); }
function saveItems(d)    { localStorage.setItem(ITEMS_KEY, JSON.stringify(d)); }

// ── SESSIONS ──
function addSession() {
  const date  = document.getElementById('s-date').value.trim();
  const hours = document.getElementById('s-hours').value.trim();
  const err   = document.getElementById('s-error');

  if (!date || !hours) { err.classList.remove('hidden'); return; }
  err.classList.add('hidden');

  const sessions = loadSessions();
  sessions.push({ id: Date.now(), date, hours });
  saveSessions(sessions);

  document.getElementById('s-hours').value = '';
  renderSessions();
}

function deleteSession(id) {
  saveSessions(loadSessions().filter(s => s.id !== id));
  renderSessions();
}

function updateHours(id, value) {
  const sessions = loadSessions();
  const s = sessions.find(s => s.id === id);
  if (s) { s.hours = value; saveSessions(sessions); }
  renderStats(sessions);
}

function renderStats(sessions) {
  document.getElementById('s-count').textContent = sessions.length;
  const total = sessions.reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0);
  document.getElementById('s-total').textContent = Number.isInteger(total) ? total : total.toFixed(1);
}

function formatDate(str) {
  if (!str) return '';
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}

function renderSessions() {
  const sessions = loadSessions();
  const tbody    = document.getElementById('s-body');
  const table    = document.getElementById('s-table');
  const empty    = document.getElementById('s-empty');

  tbody.innerHTML = '';

  if (sessions.length === 0) {
    table.style.display = 'none';
    empty.style.display = 'block';
  } else {
    table.style.display = '';
    empty.style.display = 'none';

    sessions.forEach((s, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="num">${i + 1}</td>
        <td>${formatDate(s.date)}</td>
        <td>
          <input class="hours-input" type="text" value="${s.hours}"
            title="Click to edit"
            onchange="updateHours(${s.id}, this.value)" />
        </td>
        <td><button class="del-btn" onclick="deleteSession(${s.id})">✕ DEL</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderStats(sessions);
}

// ── ITEMS ──
function addItem() {
  const text = document.getElementById('i-text').value.trim();
  const err  = document.getElementById('i-error');

  if (!text) { err.classList.remove('hidden'); return; }
  err.classList.add('hidden');

  const items = loadItems();
  items.push({ id: Date.now(), text });
  saveItems(items);

  document.getElementById('i-text').value = '';
  renderItems();
}

function deleteItem(id) {
  saveItems(loadItems().filter(item => item.id !== id));
  renderItems();
}

function renderItems() {
  const items = loadItems();
  const list  = document.getElementById('i-list');
  const empty = document.getElementById('i-empty');

  list.innerHTML = '';

  if (items.length === 0) {
    list.style.display = 'none';
    empty.style.display = 'block';
  } else {
    list.style.display = '';
    empty.style.display = 'none';

    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.text}</span>
        <button class="del-btn" onclick="deleteItem(${item.id})">✕ DEL</button>
      `;
      list.appendChild(li);
    });
  }
}

// ── DARK MODE ──
function toggleTheme() {
  const html  = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const next   = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.getElementById('theme-toggle').textContent = next === 'dark' ? '◑ LIGHT' : '◐ DARK';
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('theme-toggle').textContent = '◑ LIGHT';
  }
})();

// ── INIT ──
document.getElementById('s-date').valueAsDate = new Date();

document.getElementById('s-hours').addEventListener('keydown', e => {
  if (e.key === 'Enter') addSession();
});
document.getElementById('i-text').addEventListener('keydown', e => {
  if (e.key === 'Enter') addItem();
});

renderSessions();
renderItems();
