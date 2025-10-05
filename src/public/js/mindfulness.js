async function fetchEntries() {
  const res = await fetch('/api/journal');
  return await res.json();
}

function renderItem(j) {
  const li = document.createElement('li');
  li.className = 'item';
  li.innerHTML = `
    <div>
      <strong>${j.date}</strong> — ${j.title}<br/>
      <span class="muted">${j.content || ''}</span>
    </div>
    <div class="actions">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>`;
  li.querySelector('.delete').onclick = async () => {
    await fetch(`/api/journal/${j.id}`, { method: 'DELETE' });
    load();
  };
  li.querySelector('.edit').onclick = async () => {
    const title = prompt('Title', j.title);
    if (title === null) return;
    const content = prompt('Content', j.content || '') || '';
    await fetch(`/api/journal/${j.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: j.date, title, content }) });
    load();
  };
  return li;
}

async function load() {
  const list = document.getElementById('journalList');
  list.innerHTML = '';
  const data = await fetchEntries();
  data.forEach(j => list.appendChild(renderItem(j)));
}

document.getElementById('journalForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const payload = Object.fromEntries(new FormData(form));
  await fetch('/api/journal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  form.reset();
  load();
});

load();


