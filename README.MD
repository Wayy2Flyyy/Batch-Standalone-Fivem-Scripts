# Danielilli Scripts

Danielilli Scripts is a starter repository for lightweight standalone Python
scripts that can be packaged, tested, and deployed consistently.

## What is included

- Structured Python package under `src/`
- CLI entrypoint (`danielilli-scripts`)
- Automated tests with `pytest`
- GitHub Actions CI workflow
- Docker image build/run support

## Quickstart

### 1) Create and activate a virtual environment

```bash
python -m venv .venv
source .venv/bin/activate
```

### 2) Install in editable mode with development tools

```bash
python -m pip install --upgrade pip
python -m pip install -e ".[dev]"
```

### 3) Run the CLI

```bash
danielilli-scripts --name "Team"
```

### 4) Run tests

```bash
pytest
```

## Docker

Build image:

```bash
docker build -t danielilli-scripts:latest .
```

Run container:

```bash
docker run --rm danielilli-scripts:latest --name "Team"
```

## Deployment readiness checklist

- [x] Source package and entrypoint
- [x] Dependency manifest (`pyproject.toml`)
- [x] Test suite
- [x] CI automation
- [x] Containerization support
