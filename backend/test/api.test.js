// Integration test API memakai MongoDB in-memory. Jalankan: npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = '';

const { connectDB, disconnectDB } = await import('../src/config/db.js');
const { createApp } = await import('../src/app.js');
const { seedDatabase } = await import('../src/seed/seedData.js');

let app;
let token;
const user = { name: 'Mahasiswa Uji', email: 'uji@binus.ac.id', password: 'Rahasia123' };

before(async () => {
  await connectDB('');
  await seedDatabase({ demoUser: false });
  app = createApp();
});

after(async () => {
  await disconnectDB();
});

test('GET /api/health mengembalikan status ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('register menolak password lemah', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'A B', email: 'lemah@binus.ac.id', password: 'abc' });
  assert.equal(res.status, 400);
  assert.match(res.body.message, /Password/);
});

test('register berhasil dan mengembalikan token', async () => {
  const res = await request(app).post('/api/auth/register').send(user);
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.user.email, user.email);
  assert.equal(res.body.user.password, undefined);
});

test('register dengan email yang sama ditolak (409)', async () => {
  const res = await request(app).post('/api/auth/register').send(user);
  assert.equal(res.status, 409);
});

test('login gagal dengan password salah', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: 'SalahSekali1' });
  assert.equal(res.status, 401);
});

test('login menolak NoSQL injection pada field email', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: { $gt: '' }, password: 'apa saja' });
  assert.equal(res.status, 400);
});

test('login berhasil', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: user.email.toUpperCase(), password: user.password });
  assert.equal(res.status, 200);
  token = res.body.token;
  assert.ok(token);
});

test('materi tidak bisa diakses tanpa login', async () => {
  const res = await request(app).get('/api/materials');
  assert.equal(res.status, 401);
});

test('daftar materi, filter kategori, dan pencarian', async () => {
  const auth = { Authorization: `Bearer ${token}` };
  const all = await request(app).get('/api/materials').set(auth);
  assert.equal(all.status, 200);
  assert.equal(all.body.total, 17);

  const desain = await request(app).get('/api/materials?category=desain-grafis').set(auth);
  assert.ok(desain.body.items.every((m) => m.category === 'desain-grafis'));

  const cari = await request(app).get('/api/materials?q=figma').set(auth);
  assert.ok(cari.body.total >= 1);

  const kategori = await request(app).get('/api/materials/categories').set(auth);
  assert.equal(kategori.body.items.length, 4);
});

test('detail kuis tidak membocorkan kunci jawaban, submit kuis menghitung skor', async () => {
  const auth = { Authorization: `Bearer ${token}` };
  const detail = await request(app).get('/api/materials/kuis-dasar-javascript').set(auth);
  assert.equal(detail.status, 200);
  assert.equal(detail.body.material.quiz.length, 5);
  assert.equal(detail.body.material.quiz[0].answerIndex, undefined);

  const submit = await request(app)
    .post('/api/materials/kuis-dasar-javascript/quiz')
    .set(auth)
    .send({ answers: [2, 1, 2, 2, 0] });
  assert.equal(submit.status, 200);
  assert.equal(submit.body.correctCount, 4);
  assert.equal(submit.body.score, 80);
  assert.equal(submit.body.passed, true);
});

test('favorit: tambah, daftar, hapus', async () => {
  const auth = { Authorization: `Bearer ${token}` };
  const list = await request(app).get('/api/materials?type=artikel').set(auth);
  const id = list.body.items[0].id;

  const add = await request(app).post(`/api/favorites/${id}`).set(auth);
  assert.equal(add.status, 201);
  const addAgain = await request(app).post(`/api/favorites/${id}`).set(auth);
  assert.equal(addAgain.status, 201);

  const fav = await request(app).get('/api/favorites').set(auth);
  assert.equal(fav.body.total, 1);
  assert.equal(fav.body.items[0].isFavorite, true);

  await request(app).delete(`/api/favorites/${id}`).set(auth);
  const favAfter = await request(app).get('/api/favorites').set(auth);
  assert.equal(favAfter.body.total, 0);
});

test('riwayat mencatat materi yang dibuka dan progress', async () => {
  const auth = { Authorization: `Bearer ${token}` };
  const detail = await request(app).get('/api/materials/latihan-todo-list-javascript').set(auth);
  const id = detail.body.material.id;

  const patch = await request(app)
    .patch(`/api/history/${id}`)
    .set(auth)
    .send({ progress: 40, checkedSteps: [0, 1] });
  assert.equal(patch.status, 200);
  assert.equal(patch.body.history.progress, 40);

  const history = await request(app).get('/api/history').set(auth);
  assert.equal(history.status, 200);
  assert.equal(history.body.stats.opened, 2);
  assert.equal(history.body.stats.completed, 1);
  assert.equal(history.body.items[0].material.slug, 'latihan-todo-list-javascript');

  const me = await request(app).get('/api/auth/me').set(auth);
  assert.equal(me.body.stats.opened, 2);
});

test('ID tidak valid menghasilkan 400, materi tidak ada menghasilkan 404', async () => {
  const auth = { Authorization: `Bearer ${token}` };
  const bad = await request(app).post('/api/favorites/bukan-id').set(auth);
  assert.equal(bad.status, 400);
  const missing = await request(app).get('/api/materials/tidak-ada').set(auth);
  assert.equal(missing.status, 404);
});
