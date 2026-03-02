#!/usr/bin/env bash
# Test rate limiting on login and register (ASVS V2.8).
# Run with backend on http://localhost:8080 (or pass BASE_URL as first argument).
set -e

BASE="${1:-http://localhost:8080}"
API="${BASE}/api/v2/user"

echo "=== Rate limiting test (base: $BASE) ==="

# --- Login: 5 failed attempts from same IP, then 6th must return 429 ---
LOGIN_IP="203.0.113.$((RANDOM % 256))"
echo ""
echo "Login rate limit: sending 5 failed attempts from IP $LOGIN_IP..."
for i in 1 2 3 4 5; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API/login" \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: $LOGIN_IP" \
    -d '{"email":"rate-test@example.com","password":"wrong"}')
  echo "  Attempt $i: HTTP $STATUS (expected 400)"
  if [ "$STATUS" != "400" ]; then
    echo "  Unexpected status; aborting."
    exit 1
  fi
done

echo "  Sending 6th attempt (same IP)..."
RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API/login" \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: $LOGIN_IP" \
  -d '{"email":"rate-test@example.com","password":"wrong"}')
BODY=$(echo "$RESP" | sed '/^HTTP_STATUS:/d')
STATUS=$(echo "$RESP" | grep '^HTTP_STATUS:' | sed 's/HTTP_STATUS://')
echo "  HTTP $STATUS"

if [ "$STATUS" != "429" ]; then
  echo "  FAIL: expected 429 Too Many Requests, got $STATUS"
  echo "  Body: $BODY"
  exit 1
fi
if echo "$BODY" | grep -q "Te veel inlogpogingen"; then
  echo "  OK: 429 with correct message."
else
  echo "  Body: $BODY"
  exit 1
fi

# --- Register: 3 attempts (same IP), 4th must return 429 ---
# Use a unique IP so we don't mix with login state
RAND=$((RANDOM % 256))
echo ""
echo "Register rate limit: sending 3 register attempts from IP 198.51.100.$RAND..."
for i in 1 2 3; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API/register" \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: 198.51.100.$RAND" \
    -d "{\"email\":\"rate-reg-$RAND-$i@example.com\",\"password\":\"Password1!\",\"profileName\":\"Test\"}")
  echo "  Attempt $i: HTTP $STATUS (201 or 400 both count)"
  if [ "$STATUS" != "201" ] && [ "$STATUS" != "400" ]; then
    echo "  Unexpected status $STATUS; continuing..."
  fi
done

echo "  Sending 4th register (same IP)..."
RESP=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API/register" \
  -H "Content-Type: application/json" \
  -H "X-Forwarded-For: 198.51.100.$RAND" \
  -d "{\"email\":\"rate-reg-4@example.com\",\"password\":\"Password1!\",\"profileName\":\"Test\"}")
BODY=$(echo "$RESP" | sed '/^HTTP_STATUS:/d')
STATUS=$(echo "$RESP" | grep '^HTTP_STATUS:' | sed 's/HTTP_STATUS://')
echo "  HTTP $STATUS"

if [ "$STATUS" != "429" ]; then
  echo "  FAIL: expected 429 Too Many Requests, got $STATUS"
  echo "  Body: $BODY"
  exit 1
fi
if echo "$BODY" | grep -q "Te veel registratiepogingen"; then
  echo "  OK: 429 with correct message."
else
  echo "  Body: $BODY"
  exit 1
fi

echo ""
echo "=== All rate limiting checks passed ==="
