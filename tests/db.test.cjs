const mysqlMock = { createPool: jest.fn() };

beforeEach(() => jest.clearAllMocks());

test('getPool creates a pool', async () => {
  await jest.unstable_mockModule('mysql2/promise', () => ({ default: mysqlMock }));
  const db = await import('../src/utils/db.js');
  const fakePool = { execute: jest.fn() };
  mysqlMock.createPool.mockReturnValueOnce(fakePool);
  const p = db.getPool();
  expect(p).toBe(fakePool);
  expect(mysqlMock.createPool).toHaveBeenCalled();
});

test('query uses pool.execute and returns rows', async () => {
  await jest.unstable_mockModule('mysql2/promise', () => ({ default: mysqlMock }));
  const db = await import('../src/utils/db.js');
  const fakePool = { execute: jest.fn().mockResolvedValue([[{ id: 1, a: 'b' }], []]) };
  mysqlMock.createPool.mockReturnValueOnce(fakePool);
  // ensure query uses our fakePool even if module cached a previous pool
  db.__setPool(fakePool);
  const rows = await db.query('SELECT 1');
  expect(rows).toEqual([{ id: 1, a: 'b' }]);
});
