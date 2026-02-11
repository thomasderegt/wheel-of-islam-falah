#!/bin/bash

# Test script for Teams API endpoints
# Usage: ./test_teams_api.sh <JWT_TOKEN>
# Example: ./test_teams_api.sh "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

BASE_URL="http://localhost:8080/api/v2/users/teams"
TOKEN="${1:-}"

if [ -z "$TOKEN" ]; then
    echo "Usage: $0 <JWT_TOKEN>"
    echo "Get token by logging in: POST /api/v2/user/login"
    exit 1
fi

echo "=== Testing Teams API ==="
echo "Base URL: $BASE_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test 1: Create a team
echo -e "${YELLOW}Test 1: Create Team${NC}"
echo "POST $BASE_URL"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Team",
    "description": "Test team description"
  }')
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')
if [ "$HTTP_CODE" -eq 201 ]; then
    echo -e "${GREEN}✓ Success (201)${NC}"
    TEAM_ID=$(echo "$BODY" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo "Team ID: $TEAM_ID"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ Failed ($HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""

# Test 2: Get teams by user (requires userId from token or response)
echo -e "${YELLOW}Test 2: Get Teams by User${NC}"
echo "GET $BASE_URL/user/{userId}"
echo "Note: Replace {userId} with actual user ID"
echo ""

# Test 3: Get team by ID
if [ -n "$TEAM_ID" ]; then
    echo -e "${YELLOW}Test 3: Get Team by ID${NC}"
    echo "GET $BASE_URL/$TEAM_ID"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/$TEAM_ID" \
      -H "Authorization: Bearer $TOKEN")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "${GREEN}✓ Success (200)${NC}"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    else
        echo -e "${RED}✗ Failed ($HTTP_CODE)${NC}"
        echo "$BODY"
    fi
    echo ""
fi

# Test 4: Get team members
if [ -n "$TEAM_ID" ]; then
    echo -e "${YELLOW}Test 4: Get Team Members${NC}"
    echo "GET $BASE_URL/$TEAM_ID/members"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/$TEAM_ID/members" \
      -H "Authorization: Bearer $TOKEN")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "${GREEN}✓ Success (200)${NC}"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    else
        echo -e "${RED}✗ Failed ($HTTP_CODE)${NC}"
        echo "$BODY"
    fi
    echo ""
fi

# Test 5: Invite team member
if [ -n "$TEAM_ID" ]; then
    echo -e "${YELLOW}Test 5: Invite Team Member${NC}"
    echo "POST $BASE_URL/$TEAM_ID/members/invite"
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/$TEAM_ID/members/invite" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "role": "MEMBER"
      }')
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    if [ "$HTTP_CODE" -eq 201 ]; then
        echo -e "${GREEN}✓ Success (201)${NC}"
        INVITATION_TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        echo "Invitation Token: $INVITATION_TOKEN"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    else
        echo -e "${RED}✗ Failed ($HTTP_CODE)${NC}"
        echo "$BODY"
    fi
    echo ""
fi

echo "=== Test Summary ==="
echo "All tests completed. Check results above."
echo ""
echo "Next steps:"
echo "1. Test accept invitation with token"
echo "2. Test authorization (try accessing other user's teams)"
echo "3. Test error cases (invalid team ID, expired token, etc.)"
