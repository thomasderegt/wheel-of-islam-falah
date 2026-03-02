#!/usr/bin/env bash
# Test that security headers are present on API responses (ASVS / P1).
# Run with backend on http://localhost:8080 (or pass BASE_URL as first argument).
set -e

BASE="${1:-http://localhost:8080}"
FAIL=0

check_header() {
  local name="$1"
  local expected="$2"
  local value
  value=$(echo "$HEADERS" | grep -i "^$name:" | sed 's/^[^:]*:[[:space:]]*//' | tr -d '\r')
  if [ -z "$value" ]; then
    echo "  MISSING: $name"
    FAIL=1
  elif [ -n "$expected" ] && [ "$value" != "$expected" ]; then
    echo "  UNEXPECTED $name: got '$value', expected '$expected'"
    FAIL=1
  else
    echo "  OK: $name: $value"
  fi
}

echo "=== Security headers test (base: $BASE) ==="
echo ""
echo "Fetching response headers from $BASE/api/v2/user/login (OPTIONS)..."
HEADERS=$(curl -s -I -X OPTIONS "$BASE/api/v2/user/login" -H "Origin: http://localhost:3000")

echo ""
echo "Required headers:"
check_header "X-Frame-Options" "DENY"
check_header "X-Content-Type-Options" "nosniff"
check_header "Content-Security-Policy" ""
# X-XSS-Protection: 0 is optional (we set it to disable legacy filter)
check_header "X-XSS-Protection" ""

echo ""
if [ $FAIL -eq 0 ]; then
  echo "=== All required security headers present ==="
  exit 0
else
  echo "=== Some headers missing or wrong ==="
  exit 1
fi
