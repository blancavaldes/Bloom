const request = require('supertest');
const bcrypt = require('bcryptjs');

let app;
let dbMock;

beforeAll(async () => {
  dbMock = { query: jest.fn(), __setPool: () => {} };
  await jest.unstable_mockModule('../src/utils/db.js', () => ({ default: dbMock, ...dbMock }));
  const mod = await import('../src/app.js');
  app = mod.createApp({ sessionSecret: 't' });
});

beforeEach(() => jest.clearAllMocks());

test('GET /api/workouts returns rows when authenticated', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 3, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce([{ id: 1, type: 'run' }]);

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'w', password: 'pw' });
  const res = await agent.get('/api/workouts');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('POST /api/workouts inserts and returns id', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 3, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce({ insertId: 12 });

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'w', password: 'pw' });
  const res = await agent.post('/api/workouts').send({ date: '2025-01-01', type: 'yoga' });
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ id: 12 });
});

test('PUT /api/workouts/:id updates and returns success', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 3, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce();

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'w', password: 'pw' });
  const res = await agent.put('/api/workouts/12').send({ date: '2025-01-02', type: 'swim' });
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });
});

test('DELETE /api/workouts/:id deletes and returns success', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 3, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce();

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'w', password: 'pw' });
  const res = await agent.delete('/api/workouts/12');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });
});
