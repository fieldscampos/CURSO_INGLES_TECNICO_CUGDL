#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${API_BASE_URL:-http://localhost:8000}"

echo "[1/4] GET /health"
curl -fsS "$API_BASE_URL/health" | cat

echo "\n[2/4] GET /health/deps"
curl -fsS "$API_BASE_URL/health/deps" | cat

echo "\n[3/4] GET /api/courses/overview"
curl -fsS "$API_BASE_URL/api/courses/overview" | cat

echo "\n[4/4] GET /api/questionnaires/questions"
curl -fsS "$API_BASE_URL/api/questionnaires/questions" | cat

echo "\nSmoke test basico completado."

