#!/bin/bash

# Test script for Teams API endpoints
# Assumes backend is running on http://localhost:8080

BASE_URL="http://localhost:8080/api/v2/users/teams"

echo "=== Testing Teams API ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test 1: Create a team (requires authentication)
echo "Test 1: Create Team"
echo "POST $BASE_URL"
echo "Note: This requires authentication token"
echo ""

# Test 2: Get teams by user
echo "Test 2: Get Teams by User"
echo "GET $BASE_URL/user/{userId}"
echo "Note: This requires authentication token"
echo ""

# Test 3: Get team by ID
echo "Test 3: Get Team by ID"
echo "GET $BASE_URL/{teamId}"
echo ""

# Test 4: Get team members
echo "Test 4: Get Team Members"
echo "GET $BASE_URL/{teamId}/members"
echo ""

# Test 5: Invite team member
echo "Test 5: Invite Team Member"
echo "POST $BASE_URL/{teamId}/members/invite"
echo ""

# Test 6: Accept invitation
echo "Test 6: Accept Team Invitation"
echo "POST $BASE_URL/invitations/{token}/accept"
echo ""

echo "=== Manual Testing Steps ==="
echo "1. Start backend: cd backend/application && mvn spring-boot:run"
echo "2. Login to get JWT token"
echo "3. Use token to test endpoints with curl or Postman"
echo ""
echo "Example curl command (with token):"
echo "curl -X POST $BASE_URL \\"
echo "  -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"name\": \"Test Team\", \"description\": \"Test description\"}'"
