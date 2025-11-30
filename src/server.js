import dotenv from 'dotenv';
import { createApp } from './app.js';
import { getPool } from './utils/db.js';

dotenv.config();

const port = process.env.PORT || 3000;

const app = createApp();

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


