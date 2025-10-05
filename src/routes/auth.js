import { Router } from 'express';
import bcrypt from 'bcrypt';
import { query } from '../utils/db.js';

const router = Router();

router.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length) return res.status(409).json({ error: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const result = await query('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hash]);
  req.session.userId = result.insertId;
  const isFormPost = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded');
  if (isFormPost) return res.redirect('/');
  res.json({ success: true });
});

router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const users = await query('SELECT id, password_hash FROM users WHERE email = ?', [email]);
  if (!users.length) return res.status(401).json({ error: 'Invalid credentials' });
  const user = users[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.userId = user.id;
  const isFormPost = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded');
  if (isFormPost) return res.redirect('/');
  res.json({ success: true });
});

router.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

router.get('/api/auth/status', (req, res) => {
  res.json({ loggedIn: !!req.session.userId });
});

export default router;


