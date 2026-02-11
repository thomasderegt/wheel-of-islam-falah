#!/bin/bash
# Test script voor backend content wheels endpoints

echo "🔍 Testing Backend Content Wheels Endpoints"
echo "=========================================="
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  if curl -s -f http://localhost:8080/api/v2/content/categories > /dev/null 2>&1; then
    echo "✅ Backend is ready!"
    break
  fi
  ATTEMPT=$((ATTEMPT + 1))
  echo "   Attempt $ATTEMPT/$MAX_ATTEMPTS..."
  sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
  echo "❌ Backend is not responding after $MAX_ATTEMPTS attempts"
  echo "   Make sure the backend is running: cd backend/application && mvn spring-boot:run"
  exit 1
fi

echo ""
echo "=========================================="
echo ""

# Test 1: Get all wheels
echo "📋 Test 1: GET /api/v2/content/wheels"
echo "-----------------------------------"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8080/api/v2/content/wheels)
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Status: $HTTP_STATUS"
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
  echo "❌ Status: $HTTP_STATUS"
  echo "$BODY"
fi

echo ""
echo "=========================================="
echo ""

# Test 2: Get wheel by key
echo "📋 Test 2: GET /api/v2/content/wheels/key/WHEEL_OF_ISLAM"
echo "-----------------------------------"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8080/api/v2/content/wheels/key/WHEEL_OF_ISLAM)
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

if [ "$HTTP_STATUS" = "200" ]; then
  echo "✅ Status: $HTTP_STATUS"
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
  
  # Extract wheel ID for next test
  WHEEL_ID=$(echo "$BODY" | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])" 2>/dev/null)
  if [ -n "$WHEEL_ID" ]; then
    echo ""
    echo "📋 Test 3: GET /api/v2/content/categories/wheel/$WHEEL_ID"
    echo "-----------------------------------"
    RESPONSE2=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "http://localhost:8080/api/v2/content/categories/wheel/$WHEEL_ID")
    HTTP_STATUS2=$(echo "$RESPONSE2" | grep "HTTP_STATUS" | cut -d: -f2)
    BODY2=$(echo "$RESPONSE2" | sed '/HTTP_STATUS/d')
    
    if [ "$HTTP_STATUS2" = "200" ]; then
      echo "✅ Status: $HTTP_STATUS2"
      echo "$BODY2" | python3 -m json.tool 2>/dev/null || echo "$BODY2"
    else
      echo "❌ Status: $HTTP_STATUS2"
      echo "$BODY2"
    fi
  fi
else
  echo "❌ Status: $HTTP_STATUS"
  echo "$BODY"
fi

echo ""
echo "=========================================="
echo "✅ Testing complete!"
