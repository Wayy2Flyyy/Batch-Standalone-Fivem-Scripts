# Danielilli Scripts

`danielilli-scripts` is a lightweight Python starter for packaging and running standalone scripts in a consistent, deployment-friendly way.

## Current project status

This repository previously had only a minimal README and no source code, tests, dependency manifest, or deployment configuration.

This baseline now includes:

- A Python package layout (`src/`).
- A small CLI entrypoint (`danielilli-scripts`).
- A sample script command (`hello`).
- Unit tests with `pytest`.
- CI workflow for tests.
- Dockerfile for containerized execution.

## Quickstart

### Local setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -e ".[dev]"
```

### Run

```bash
danielilli-scripts hello --name "World"
```

### Test

```bash
pytest
```

## Docker

Build and run:

```bash
docker build -t danielilli-scripts:latest .
docker run --rm danielilli-scripts:latest hello --name "Container"
```

## Next deployment steps

1. Add real script commands under `src/danielilli_scripts/`.
2. Add environment-specific configuration (if needed).
3. Add release automation (for package or container publishing).
