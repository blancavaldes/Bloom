async function fetchMeals() {
  const res = await fetch('/api/meals');
  return await res.json();
}

function renderItem(m) {
  const li = document.createElement('li');
  li.className = 'item';
  li.innerHTML = `
    <div>
      <strong>${m.date}</strong> — ${m.name} • ${m.calories} kcal<br/>
      <span class="muted">P ${m.protein_g} • C ${m.carbs_g} • F ${m.fat_g}</span><br/>
      <span class="muted">${m.notes || ''}</span>
    </div>
    <div class="actions">
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    </div>`;
  li.querySelector('.delete').onclick = async () => {
    await fetch(`/api/meals/${m.id}`, { method: 'DELETE' });
    load();
  };
  li.querySelector('.edit').onclick = async () => {
    const name = prompt('Name', m.name);
    if (name === null) return;
    const calories = Number(prompt('Calories', m.calories)) || 0;
    const protein_g = Number(prompt('Protein (g)', m.protein_g)) || 0;
    const carbs_g = Number(prompt('Carbs (g)', m.carbs_g)) || 0;
    const fat_g = Number(prompt('Fat (g)', m.fat_g)) || 0;
    const notes = prompt('Notes', m.notes || '') || '';
    await fetch(`/api/meals/${m.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: m.date, name, calories, protein_g, carbs_g, fat_g, notes }) });
    load();
  };
  return li;
}

async function load() {
  const list = document.getElementById('mealList');
  list.innerHTML = '';
  const data = await fetchMeals();
  data.forEach(m => list.appendChild(renderItem(m)));
}

document.getElementById('mealForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const payload = Object.fromEntries(new FormData(form));
  await fetch('/api/meals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  form.reset();
  load();
});

load();


