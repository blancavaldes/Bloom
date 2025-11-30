const request = require('supertest');

let app;
let dbMock;

beforeAll(async () => {
  dbMock = { query: jest.fn() };
  await jest.unstable_mockModule('../src/utils/db.js', () => dbMock);
  const mod = await import('../src/app.js');
  app = mod.createApp({ sessionSecret: 't' });
});

test('GET /api/journal without session returns 401', async () => {
  const res = await request(app).get('/api/journal');
  expect(res.status).toBe(401);
});

test('GET /api/meals without session returns 401', async () => {
  const res = await request(app).get('/api/meals');
  expect(res.status).toBe(401);
});

test('GET /api/workouts without session returns 401', async () => {
  const res = await request(app).get('/api/workouts');
  expect(res.status).toBe(401);
});

test('GET /health responds ok', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ status: 'ok' });
});
