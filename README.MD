# Danielilli Scripts

Minimal deployment-ready starter for a standalone scripts landing page and API.

## What is included

- Express server with configurable `PORT`
- Static landing page served from `public/`
- Health endpoint at `/health`
- Docker support
- GitHub Actions CI for install and test
- Example environment configuration

## Requirements

- Node.js 22+
- npm 10+

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production run

```bash
npm install
npm start
```

## Environment variables

Copy `.env.example` and adapt as needed.

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port used by the server |
| `APP_NAME` | `Danielilli Scripts` | Name shown in the health response and UI |

## Endpoints

- `GET /` - static landing page
- `GET /health` - JSON readiness endpoint

Example response:

```json
{
  "status": "ok",
  "service": "danielilli-scripts",
  "timestamp": "2026-04-29T09:12:00.000Z"
}
```

## Docker

```bash
docker build -t danielilli-scripts .
docker run -p 3000:3000 --env-file .env.example danielilli-scripts
```

## Testing

```bash
npm test
```

## Deployment readiness status

The original repository only contained a placeholder README. This starter now provides:

- a dependency manifest and lockfile
- a runnable service
- a smoke test
- CI configuration
- a container image definition

This is a solid baseline for deployment, but real product-specific script features still need to be implemented on top of it.
