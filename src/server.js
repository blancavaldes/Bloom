import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import workoutsRouter from './routes/workouts.js';
import mealsRouter from './routes/meals.js';
import journalRouter from './routes/journal.js';
import { getPool } from './utils/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
}));

app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  next();
});

app.use('/', authRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/journal', journalRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/exercise', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercise.html'));
});

app.get('/food', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'food.html'));
});

app.get('/mindfulness', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mindfulness.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

const port = process.env.PORT || 3000;

getPool() // trigger pool init and verify connectivity on boot
  .getConnection()
  .then((conn) => {
    conn.release();
    app.listen(port, () => console.log(`Bloom server running on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MySQL. Check your .env settings.', err);
    process.exit(1);
  });


