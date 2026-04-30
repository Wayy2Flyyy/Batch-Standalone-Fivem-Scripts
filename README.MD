# Danielilli Scripts

Danielilli Scripts is now a lightweight, deployment-ready starter for a modern
visual UI backed by a small Node.js server.

## What is included

- Responsive landing page in `public/`
- Node HTTP server with static asset delivery
- `/healthz` endpoint for health checks and container platforms
- Docker support for straightforward container deployment
- CI workflow that runs the smoke tests on every push and pull request
- No external runtime dependencies

## Project structure

```text
.
├── .github/workflows/ci.yml
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── test/server.test.js
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── package-lock.json
├── package.json
├── README.MD
└── server.js
```

## Local development

### Requirements

- Node.js 22 or newer

### Start in watch mode

```bash
npm run dev
```

### Start normally

```bash
npm start
```

The app listens on `PORT`, which defaults to `3000`.

## Tests

Run the smoke tests with:

```bash
npm test
```

## Docker

Build the image:

```bash
docker build -t danielilli-scripts .
```

Run the container:

```bash
docker run --rm -p 3000:3000 danielilli-scripts
```

## Deployment notes

- Set `PORT` through your platform if it is assigned dynamically.
- Use `/healthz` for uptime and readiness probes.
- Static assets are served directly by the Node process, which keeps the
  deployment footprint small.
