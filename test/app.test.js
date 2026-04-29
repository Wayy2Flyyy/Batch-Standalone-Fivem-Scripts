import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import { createApp } from "../src/app.js";

test("GET /health returns application status", async () => {
  const app = createApp();
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
  assert.match(response.body.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test("GET / returns the landing page", async () => {
  const app = createApp();
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.match(response.text, /Danielilli Scripts/i);
});
