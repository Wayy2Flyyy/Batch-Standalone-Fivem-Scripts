import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "..", "public");

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json());
  app.use(express.static(publicDir));

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "danielilli-scripts",
      appName: process.env.APP_NAME || "Danielilli Scripts",
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/api/config", (_req, res) => {
    res.json({
      appName: process.env.APP_NAME || "Danielilli Scripts",
      environment: process.env.NODE_ENV || "development",
      port: Number(process.env.PORT || 3000),
    });
  });

  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });

  return app;
}
