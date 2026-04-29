'use strict';

const path = require('path');
const request = require('supertest');
const { app, server } = require('../src/server');

// Point SCRIPTS_DIR at the real scripts folder for integration tests
process.env.SCRIPTS_DIR = path.join(__dirname, '..', 'scripts');

afterAll(() => server.close());

describe('GET /api/scripts', () => {
  it('returns an array', async () => {
    const res = await request(app).get('/api/scripts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('each script has required fields', async () => {
    const res = await request(app).get('/api/scripts');
    for (const s of res.body) {
      expect(s).toHaveProperty('name');
      expect(s).toHaveProperty('extension');
      expect(s).toHaveProperty('language');
      expect(s).toHaveProperty('description');
      expect(s).toHaveProperty('size');
      expect(s).toHaveProperty('modified');
    }
  });
});

describe('GET /api/scripts/:name', () => {
  it('returns 404 for unknown script', async () => {
    const res = await request(app).get('/api/scripts/does-not-exist.sh');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 for disallowed extension', async () => {
    const res = await request(app).get('/api/scripts/evil.exe');
    expect(res.status).toBe(400);
  });

  it('returns detail for hello.sh', async () => {
    const res = await request(app).get('/api/scripts/hello.sh');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('content');
    expect(res.body.name).toBe('hello.sh');
  });
});

describe('POST /api/scripts/:name/run', () => {
  it('returns 404 for unknown script', async () => {
    const res = await request(app).post('/api/scripts/ghost.sh/run');
    expect(res.status).toBe(404);
  });

  it('executes hello.sh and returns output', async () => {
    const res = await request(app).post('/api/scripts/hello.sh/run');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('exitCode');
    expect(res.body).toHaveProperty('stdout');
    expect(res.body).toHaveProperty('duration');
    expect(res.body.exitCode).toBe(0);
    expect(res.body.stdout).toMatch(/Danielilli/);
  }, 15000);

  it('executes cleanup.py and returns output', async () => {
    const res = await request(app).post('/api/scripts/cleanup.py/run');
    expect(res.status).toBe(200);
    expect(res.body.exitCode).toBe(0);
    expect(res.body.stdout).toMatch(/Cleanup/i);
  }, 15000);
});
