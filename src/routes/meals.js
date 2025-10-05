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
    'SELECT id, date, name, calories, protein_g, carbs_g, fat_g, notes FROM meals WHERE user_id = ? ORDER BY date DESC, id DESC',
    [req.session.userId]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { date, name, calories, protein_g, carbs_g, fat_g, notes } = req.body;
  const result = await query(
    'INSERT INTO meals (user_id, date, name, calories, protein_g, carbs_g, fat_g, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      req.session.userId,
      date,
      name,
      calories || 0,
      protein_g || 0,
      carbs_g || 0,
      fat_g || 0,
      notes || null,
    ]
  );
  res.json({ id: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { date, name, calories, protein_g, carbs_g, fat_g, notes } = req.body;
  await query(
    'UPDATE meals SET date = ?, name = ?, calories = ?, protein_g = ?, carbs_g = ?, fat_g = ?, notes = ? WHERE id = ? AND user_id = ? LIMIT 1',
    [date, name, calories || 0, protein_g || 0, carbs_g || 0, fat_g || 0, notes || null, id, req.session.userId]
  );
  res.json({ success: true });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM meals WHERE id = ? AND user_id = ? LIMIT 1', [id, req.session.userId]);
  res.json({ success: true });
});

export default router;


