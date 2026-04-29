const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");

const { createServer } = require("../server");

async function startTestServer() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();

  return {
    server,
    baseUrl: `http://127.0.0.1:${port}`,
  };
}

test("GET /healthz returns ready status", async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/healthz`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: "ok" });
  } finally {
    server.close();
    await once(server, "close");
  }
});

test("GET / serves the landing page", async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const response = await fetch(baseUrl);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Deployment-ready UI starter/);
  } finally {
    server.close();
    await once(server, "close");
  }
});

test("GET missing asset returns 404", async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/missing-file.txt`);
    const body = await response.text();

    assert.equal(response.status, 404);
    assert.match(body, /Not found/);
  } finally {
    server.close();
    await once(server, "close");
  }
});

test("GET path traversal attempt is rejected with 404", async () => {
  const { server, baseUrl } = await startTestServer();

  try {
    const response = await fetch(`${baseUrl}/../package.json`);
    const body = await response.text();

    assert.equal(response.status, 404);
    assert.match(body, /Not found/);
  } finally {
    server.close();
    await once(server, "close");
  }
});
