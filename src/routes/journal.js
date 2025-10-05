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
    'SELECT id, date, title, content FROM journal_entries WHERE user_id = ? ORDER BY date DESC, id DESC',
    [req.session.userId]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { date, title, content } = req.body;
  // Convert ISO date to YYYY-MM-DD format
  const dateOnly = new Date(date).toISOString().split('T')[0];
  const result = await query(
    'INSERT INTO journal_entries (user_id, date, title, content) VALUES (?, ?, ?, ?)',
    [req.session.userId, dateOnly, title, content]
  );
  res.json({ id: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { date, title, content } = req.body;
  // Convert ISO date to YYYY-MM-DD format
  const dateOnly = new Date(date).toISOString().split('T')[0];
  await query(
    'UPDATE journal_entries SET date = ?, title = ?, content = ? WHERE id = ? AND user_id = ? LIMIT 1',
    [dateOnly, title, content, id, req.session.userId]
  );
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM journal_entries WHERE id = ? AND user_id = ? LIMIT 1', [id, req.session.userId]);
  res.json({ success: true });
});

export default router;


