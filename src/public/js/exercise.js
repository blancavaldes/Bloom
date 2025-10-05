async function fetchWorkouts() {
  const res = await fetch('/api/workouts');
  return await res.json();
}

function renderItem(w, isEditing = false) {
  const li = document.createElement('li');
  li.className = 'item';
  li.dataset.id = w.id;
  
  if (isEditing) {
    li.className = 'item editing';
    li.innerHTML = `
      <div style="flex: 1;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
          <label>Type<input type="text" name="type" value="${w.type}" required /></label>
          <label>Duration (min)<input type="number" name="duration_minutes" value="${w.duration_minutes}" min="0" /></label>
        </div>
        <label>Notes<textarea name="notes" rows="2">${w.notes || ''}</textarea></label>
      </div>
      <div class="actions">
        <button class="save">Save</button>
        <button class="cancel">Cancel</button>
      </div>`;
    
    li.querySelector('.save').onclick = async () => {
      const typeInput = li.querySelector('input[name="type"]');
      const durationInput = li.querySelector('input[name="duration_minutes"]');
      const notesInput = li.querySelector('textarea[name="notes"]');
      
      const payload = {
        date: w.date,
        type: typeInput.value,
        duration_minutes: Number(durationInput.value) || 0,
        notes: notesInput.value || ''
      };
      
      await fetch(`/api/workouts/${w.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      load();
    };
    
    li.querySelector('.cancel').onclick = () => load();
  } else {
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
      if (confirm('Are you sure you want to delete this workout?')) {
        await fetch(`/api/workouts/${w.id}`, { method: 'DELETE' });
        load();
      }
    };
    
    li.querySelector('.edit').onclick = () => {
      // Replace the current item with an editing version
      const editingLi = renderItem(w, true);
      li.parentNode.replaceChild(editingLi, li);
      // Focus on the first input
      editingLi.querySelector('input').focus();
    };
  }
  
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


