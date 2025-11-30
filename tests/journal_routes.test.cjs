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

test('GET /api/journal returns user rows when authenticated', async () => {
  // login: return user with password hash
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 5, password_hash: hash }]);
  // journal GET returns two rows
  dbMock.query.mockResolvedValueOnce([
    { id: 1, date: '2025-01-01', title: 'A', content: '...' },
    { id: 2, date: '2025-01-02', title: 'B', content: '...' },
  ]);

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'x', password: 'pw' });
  const res = await agent.get('/api/journal');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(2);
});

test('POST /api/journal inserts and returns id', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 5, password_hash: hash }]);
  // insert returns insertId
  dbMock.query.mockResolvedValueOnce({ insertId: 99 });

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'x', password: 'pw' });
  const res = await agent.post('/api/journal').send({ date: '2025-01-01', title: 't', content: 'c' });
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ id: 99 });
});

test('PUT /api/journal/:id updates and returns success', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 5, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce();

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'x', password: 'pw' });
  const res = await agent.put('/api/journal/99').send({ date: '2025-01-02', title: 'u', content: 'v' });
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });
});

test('DELETE /api/journal/:id deletes and returns success', async () => {
  const hash = await bcrypt.hash('pw', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 5, password_hash: hash }]);
  dbMock.query.mockResolvedValueOnce();

  const agent = request.agent(app);
  await agent.post('/api/login').send({ email: 'x', password: 'pw' });
  const res = await agent.delete('/api/journal/99');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });
});
