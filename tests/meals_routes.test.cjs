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

test('GET /api/meals returns rows when authenticated', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 2, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce([{ id: 1, name: 'salad' }]);

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'm', password: 'pw' });
  const res = await agent.get('/api/meals');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test('POST /api/meals inserts and returns id', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 2, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce({ insertId: 7 });

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'm', password: 'pw' });
  const res = await agent.post('/api/meals').send({ date: '2025-01-01', name: 'toast' });
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ id: 7 });
});

test('PUT /api/meals/:id updates and returns success', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 2, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce();

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'm', password: 'pw' });
  const res = await agent.put('/api/meals/7').send({ date: '2025-01-02', name: 'eggs' });
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });
});

test('DELETE /api/meals/:id deletes and returns success', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 2, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce();

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'm', password: 'pw' });
  const res = await agent.delete('/api/meals/7');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });
});
