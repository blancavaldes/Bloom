import { Router } from 'express';
import { query } from '../utils/db.js';

const router = Router();

function ensureAuth(req, _res, next) {
  if (!req.session.userId) return next({ status: 401, message: 'Unauthorized' });
  next();
}

router.use(ensureAuth);

router.get('/', async (req, res) => {
  const rows = await query(
    'SELECT id, date, type, duration_minutes, notes FROM workouts WHERE user_id = ? ORDER BY date DESC, id DESC',
    [req.session.userId]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { date, type, duration_minutes, notes } = req.body;
  // Convert ISO date to YYYY-MM-DD format
  const dateOnly = new Date(date).toISOString().split('T')[0];
  const result = await query(
    'INSERT INTO workouts (user_id, date, type, duration_minutes, notes) VALUES (?, ?, ?, ?, ?)',
    [req.session.userId, dateOnly, type, duration_minutes || 0, notes || null]
  );
  res.json({ id: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { date, type, duration_minutes, notes } = req.body;
  // Convert ISO date to YYYY-MM-DD format
  const dateOnly = new Date(date).toISOString().split('T')[0];
  await query(
    'UPDATE workouts SET date = ?, type = ?, duration_minutes = ?, notes = ? WHERE id = ? AND user_id = ? LIMIT 1',
    [dateOnly, type, duration_minutes || 0, notes || null, id, req.session.userId]
  );
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM workouts WHERE id = ? AND user_id = ? LIMIT 1', [id, req.session.userId]);
  res.json({ success: true });
});

export default router;


