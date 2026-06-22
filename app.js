const STORAGE_KEY = 'ai_class_entries';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function save(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function addEntry() {
  const date  = document.getElementById('entry-date').value.trim();
  const hours = document.getElementById('entry-hours').value.trim();
  const item  = document.getElementById('entry-item').value.trim();
  const err   = document.getElementById('error-msg');

  if (!date || !hours || !item) {
    err.classList.remove('hidden');
    return;
  }
  err.classList.add('hidden');

  const entries = load();
  entries.push({ id: Date.now(), date, hours, item });
  save(entries);

  document.getElementById('entry-date').value  = '';
  document.getElementById('entry-hours').value = '';
  document.getElementById('entry-item').value  = '';

  render();
}

function deleteEntry(id) {
  const entries = load().filter(e => e.id !== id);
  save(entries);
  render();
}

function updateHours(id, value) {
  const entries = load();
  const entry = entries.find(e => e.id === id);
  if (entry) { entry.hours = value; save(entries); }
  updateStats(entries);
}

function updateStats(entries) {
  document.getElementById('count').textContent = entries.length;
  const total = entries.reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0);
  document.getElementById('total-hours').textContent = total % 1 === 0 ? total : total.toFixed(1);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function render() {
  const entries = load();
  const tbody   = document.getElementById('entry-body');
  const emptyMsg = document.getElementById('empty-msg');
  const table   = document.getElementById('entry-table');

  tbody.innerHTML = '';

  if (entries.length === 0) {
    table.style.display = 'none';
    emptyMsg.style.display = 'block';
  } else {
    table.style.display = '';
    emptyMsg.style.display = 'none';

    entries.forEach((e, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="num">${i + 1}</td>
        <td>${formatDate(e.date)}</td>
        <td class="hours-cell">
          <input
            class="hours-input"
            type="text"
            value="${e.hours}"
            title="Click to edit hours"
            onchange="updateHours(${e.id}, this.value)"
          />
        </td>
        <td>${e.item}</td>
        <td><button class="delete-btn" onclick="deleteEntry(${e.id})">✕ DEL</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  updateStats(entries);
}

// DARK MODE
function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-toggle').textContent = isDark ? '◑ LIGHT' : '◐ DARK';
}

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  document.getElementById('theme-toggle').textContent = '◑ LIGHT';
}

// Set today's date as default
document.getElementById('entry-date').valueAsDate = new Date();

// Enter key submits
document.getElementById('entry-item').addEventListener('keydown', e => {
  if (e.key === 'Enter') addEntry();
});

render();
