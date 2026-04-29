# Danielilli Scripts

Modern visual UI — unique, easy-to-install standalone scripts!

---

## Overview

Danielilli Scripts is a self-contained web application that provides a beautiful dashboard to browse, run, and manage standalone utility scripts (Bash and Python). It ships as a single Docker container and is ready for deployment on any server or cloud platform.

---

## Tech Stack

| Layer       | Technology                     |
|-------------|-------------------------------|
| Backend     | Node.js 20 + Express 4        |
| Frontend    | Vanilla HTML / CSS / JS       |
| Scripts     | Bash + Python 3               |
| Container   | Docker + Docker Compose       |
| CI/CD       | GitHub Actions                |
| Tests       | Jest                          |

---

## Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org/) and npm
- [Docker](https://www.docker.com/) (optional, for containerised deployment)

### Development

```bash
# Install dependencies
npm install

# Copy env template
cp .env.example .env

# Start dev server (auto-reload)
npm run dev

# Run tests
npm test

# Lint
npm run lint
```

The server starts at **http://localhost:3000**.

### Docker (Production)

```bash
# Build & start
docker compose up --build -d

# Tail logs
docker compose logs -f

# Stop
docker compose down
```

---

## Project Structure

```
.
├── src/
│   ├── server.js          # Express entry point
│   ├── routes/
│   │   ├── scripts.js     # Script list & execution API
│   │   └── health.js      # /healthz endpoint
│   └── middleware/
│       └── errorHandler.js
├── public/
│   ├── index.html         # Dashboard UI
│   ├── style.css
│   └── app.js
├── scripts/
│   ├── hello.sh           # Example Bash script
│   ├── sysinfo.sh         # System information
│   └── cleanup.py         # Example Python script
├── tests/
│   ├── health.test.js
│   └── scripts.test.js
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable        | Default     | Description                        |
|-----------------|-------------|------------------------------------|
| `PORT`          | `3000`      | HTTP port the server listens on    |
| `NODE_ENV`      | `development` | `development` or `production`    |
| `SCRIPTS_DIR`   | `./scripts` | Path to the scripts directory      |
| `MAX_EXEC_TIME` | `30`        | Max script execution time (seconds)|

---

## API

| Method | Path                  | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/healthz`            | Health check             |
| GET    | `/api/scripts`        | List all scripts         |
| GET    | `/api/scripts/:name`  | Get script metadata      |
| POST   | `/api/scripts/:name/run` | Execute a script      |

---

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m "feat: add my feature"`)
4. Push and open a PR

---

## License

MIT
