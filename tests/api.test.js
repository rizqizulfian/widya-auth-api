// Integration test: membutuhkan PostgreSQL (DATABASE_URL) yang sudah termigrasi.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const app = require('../src/app');
const pool = require('../src/db/pool');

let server, base;
const email = `test-${Date.now()}@example.com`;
const body = { name: 'Budi', email, gender: 'male', password: 'rahasia123' };
const call = (path, opts = {}) =>
  fetch(base + path, { ...opts, headers: { 'Content-Type': 'application/json', ...opts.headers }, body: opts.body && JSON.stringify(opts.body) });

before(async () => {
  server = app.listen(0);
  base = `http://localhost:${server.address().port}/api`;
});
after(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', [email]);
  await pool.end();
  server.close();
});

test('register -> login -> profile', async () => {
  let res = await call('/auth/register', { method: 'POST', body });
  assert.strictEqual(res.status, 201);
  const created = (await res.json()).data;
  assert.strictEqual(created.password_hash, undefined);

  res = await call('/auth/login', { method: 'POST', body: { email, password: body.password } });
  assert.strictEqual(res.status, 200);
  const { token } = (await res.json()).data;

  res = await call('/profile', { headers: { Authorization: `Bearer ${token}` } });
  assert.strictEqual(res.status, 200);
  assert.strictEqual((await res.json()).data.email, email);
});

test('email duplikat -> 409', async () => {
  const res = await call('/auth/register', { method: 'POST', body });
  assert.strictEqual(res.status, 409);
});

test('validasi register -> 400', async () => {
  const res = await call('/auth/register', { method: 'POST', body: { name: '', email: 'x', gender: 'z', password: '1' } });
  assert.strictEqual(res.status, 400);
  assert.deepStrictEqual(Object.keys((await res.json()).errors).sort(), ['email', 'gender', 'name', 'password']);
});

test('login password salah -> 401', async () => {
  const res = await call('/auth/login', { method: 'POST', body: { email, password: 'salah-salah' } });
  assert.strictEqual(res.status, 401);
});

test('profile tanpa/dengan token palsu -> 401', async () => {
  assert.strictEqual((await call('/profile')).status, 401);
  assert.strictEqual((await call('/profile', { headers: { Authorization: 'Bearer abc' } })).status, 401);
});
