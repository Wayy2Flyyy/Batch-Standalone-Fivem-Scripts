FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml README.MD ./
COPY src ./src

RUN python -m pip install --upgrade pip && \
    pip install .

ENTRYPOINT ["danielilli-scripts"]
