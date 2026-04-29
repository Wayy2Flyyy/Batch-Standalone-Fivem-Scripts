const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const host = process.env.HOST || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const publicDir = path.resolve(__dirname, "public");

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".ico", "image/x-icon"],
]);

function getAssetPath(requestPath) {
  const decodedPath = decodeURIComponent(requestPath);
  const normalizedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const trimmedPath = normalizedPath.replace(/^\/+/, "");
  const resolvedPath = path.resolve(publicDir, trimmedPath);
  const publicPrefix = `${publicDir}${path.sep}`;

  if (resolvedPath !== publicDir && !resolvedPath.startsWith(publicPrefix)) {
    return null;
  }

  return resolvedPath;
}

async function serveFile(filePath, response) {
  if (!filePath) {
    response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes.get(extension) || "application/octet-stream";

  try {
    const file = await fs.readFile(filePath);
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "Internal server error" }));
  }
}

function createServer() {
  return http.createServer(async (request, response) => {
    let requestUrl;

    try {
      requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    } catch {
      response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ error: "Bad request" }));
      return;
    }

    if (request.method !== "GET") {
      response.writeHead(405, {
        "Content-Type": "application/json; charset=utf-8",
        Allow: "GET",
      });
      response.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    if (requestUrl.pathname === "/healthz") {
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }

    await serveFile(getAssetPath(requestUrl.pathname), response);
  });
}

function startServer() {
  const server = createServer();
  server.listen(port, host, () => {
    // Keep startup logs simple for local use and container logs.
    console.log(`Danielilli Scripts listening on http://${host}:${port}`);
  });

  const shutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close((error) => {
      if (error) {
        console.error("Error while closing the server", error);
        process.exitCode = 1;
      }
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createServer,
  startServer,
};
