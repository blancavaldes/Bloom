const request = require('supertest');
const bcrypt = require('bcryptjs');

let app;
let dbMock;

beforeAll(async () => {
  // mock the ESM module before importing app
  dbMock = { query: jest.fn() };
  await jest.unstable_mockModule('../src/utils/db.js', () => dbMock);
  const mod = await import('../src/app.js');
  app = mod.createApp({ sessionSecret: 'test-secret' });
});

beforeEach(() => jest.clearAllMocks());

test('GET /api/auth/status returns loggedIn false without session', async () => {
  const res = await request(app).get('/api/auth/status');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ loggedIn: false });
});

test('POST /api/register returns 409 if email exists', async () => {
  dbMock.query.mockResolvedValueOnce([{ id: 1 }]);
  const res = await request(app).post('/api/register').send({ email: 'a@b.com', password: 'pwd' });
  expect(res.status).toBe(409);
  expect(res.body).toHaveProperty('error');
});

test('POST /api/register creates a user and returns success JSON', async () => {
  dbMock.query
    .mockResolvedValueOnce([]) // check existing
    .mockResolvedValueOnce({ insertId: 42 }); // insert

  const res = await request(app)
    .post('/api/register')
    .send({ email: 'new@user.com', password: 'secret' })
    .set('Content-Type', 'application/json');

  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });
});

test('POST /api/login rejects invalid credentials', async () => {
  dbMock.query.mockResolvedValueOnce([]); // no user
  const res = await request(app).post('/api/login').send({ email: 'x', password: 'y' });
  expect(res.status).toBe(401);
});

test('POST /api/login accepts valid credentials', async () => {
  const hash = await bcrypt.hash('pw123', 10);
  dbMock.query.mockResolvedValueOnce([{ id: 7, password_hash: hash }]);

  const agent = request.agent(app);
  const res = await agent.post('/api/login').send({ email: 'u', password: 'pw123' });
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ success: true });

  const s = await agent.get('/api/auth/status');
  expect(s.body).toEqual({ loggedIn: true });
});
