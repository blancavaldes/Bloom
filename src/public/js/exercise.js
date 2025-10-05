async function fetchWorkouts() {
  const res = await fetch('/api/workouts');
  return await res.json();
}

function renderItem(w) {
  const li = document.createElement('li');
  li.className = 'item';
  li.innerHTML = `
    <div>
      <strong>${w.date}</strong> — ${w.type} • ${w.duration_minutes} min<br/>
      <span class="muted">${w.notes || ''}</span>
    </div>
    <div class="actions">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>`;
  li.querySelector('.delete').onclick = async () => {
    await fetch(`/api/workouts/${w.id}`, { method: 'DELETE' });
    load();
  };
  li.querySelector('.edit').onclick = async () => {
    const type = prompt('Type', w.type);
    if (type === null) return;
    const duration_minutes = Number(prompt('Duration (min)', w.duration_minutes)) || 0;
    const notes = prompt('Notes', w.notes || '') || '';
    await fetch(`/api/workouts/${w.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: w.date, type, duration_minutes, notes }) });
    load();
  };
  return li;
}

async function load() {
  const list = document.getElementById('workoutList');
  list.innerHTML = '';
  const data = await fetchWorkouts();
  data.forEach(w => list.appendChild(renderItem(w)));
}

document.getElementById('workoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const payload = Object.fromEntries(new FormData(form));
  await fetch('/api/workouts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  form.reset();
  load();
});

load();


