// ── API HELPERS ──
async function api(path, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(path, opts)
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`)
  return res.json()
}

// ── SESSIONS ──
async function addSession() {
  const date  = document.getElementById('s-date').value.trim()
  const hours = document.getElementById('s-hours').value.trim()
  const err   = document.getElementById('s-error')

  if (!date || !hours) { err.classList.remove('hidden'); return }
  err.classList.add('hidden')

  setLoading('s-table', true)
  await api('/api/sessions', 'POST', { date, hours })
  document.getElementById('s-hours').value = ''
  await renderSessions()
}

async function deleteSession(id) {
  setLoading('s-table', true)
  await api(`/api/sessions?id=${id}`, 'DELETE')
  await renderSessions()
}

async function updateHours(id, value) {
  await api(`/api/sessions?id=${id}`, 'PATCH', { hours: value })
  const sessions = await api('/api/sessions')
  renderStats(sessions)
}

function renderStats(sessions) {
  document.getElementById('s-count').textContent = sessions.length
  const total = sessions.reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0)
  document.getElementById('s-total').textContent = Number.isInteger(total) ? total : total.toFixed(1)
}

function formatDate(str) {
  if (!str) return ''
  const [y, m, d] = str.split('-')
  return `${d}/${m}/${y}`
}

async function renderSessions() {
  const sessions = await api('/api/sessions')
  const tbody = document.getElementById('s-body')
  const table = document.getElementById('s-table')
  const empty = document.getElementById('s-empty')

  tbody.innerHTML = ''
  setLoading('s-table', false)

  if (sessions.length === 0) {
    table.style.display = 'none'
    empty.style.display = 'block'
  } else {
    table.style.display = ''
    empty.style.display = 'none'
    sessions.forEach((s, i) => {
      const tr = document.createElement('tr')
      tr.innerHTML = `
        <td class="num">${i + 1}</td>
        <td>${formatDate(s.date)}</td>
        <td>
          <input class="hours-input" type="text" value="${s.hours}"
            title="Click to edit"
            onchange="updateHours(${s.id}, this.value)" />
        </td>
        <td><button class="del-btn" onclick="deleteSession(${s.id})">✕ DEL</button></td>
      `
      tbody.appendChild(tr)
    })
  }

  renderStats(sessions)
}

// ── ITEMS ──
async function addItem() {
  const text = document.getElementById('i-text').value.trim()
  const err  = document.getElementById('i-error')

  if (!text) { err.classList.remove('hidden'); return }
  err.classList.add('hidden')

  setLoading('i-list', true)
  await api('/api/items', 'POST', { text })
  document.getElementById('i-text').value = ''
  await renderItems()
}

async function deleteItem(id) {
  setLoading('i-list', true)
  await api(`/api/items?id=${id}`, 'DELETE')
  await renderItems()
}

async function renderItems() {
  const items = await api('/api/items')
  const list  = document.getElementById('i-list')
  const empty = document.getElementById('i-empty')

  list.innerHTML = ''
  setLoading('i-list', false)

  if (items.length === 0) {
    list.style.display = 'none'
    empty.style.display = 'block'
  } else {
    list.style.display = ''
    empty.style.display = 'none'
    items.forEach(item => {
      const li = document.createElement('li')
      li.innerHTML = `
        <span>${item.text}</span>
        <button class="del-btn" onclick="deleteItem(${item.id})">✕ DEL</button>
      `
      list.appendChild(li)
    })
  }
}

// ── LOADING STATE ──
function setLoading(elId, on) {
  const el = document.getElementById(elId)
  if (!el) return
  el.style.opacity = on ? '0.4' : '1'
  el.style.pointerEvents = on ? 'none' : ''
}

// ── DARK MODE ──
function toggleTheme() {
  const html   = document.documentElement
  const isDark = html.getAttribute('data-theme') === 'dark'
  const next   = isDark ? 'light' : 'dark'
  html.setAttribute('data-theme', next)
  localStorage.setItem('theme', next)
  document.getElementById('theme-toggle').textContent = next === 'dark' ? '◑ LIGHT' : '◐ DARK'
}

;(function initTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.getElementById('theme-toggle').textContent = '◑ LIGHT'
  }
})()

// ── INIT ──
document.getElementById('s-date').valueAsDate = new Date()

document.getElementById('s-hours').addEventListener('keydown', e => {
  if (e.key === 'Enter') addSession()
})
document.getElementById('i-text').addEventListener('keydown', e => {
  if (e.key === 'Enter') addItem()
})

renderSessions()
renderItems()
