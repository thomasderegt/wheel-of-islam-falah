#!/usr/bin/env bash
# Test all backend API endpoints (GET only for safety; backend must be running on 8080).
# Usage: ./scripts/test-all-endpoints.sh [baseUrl]
# Default baseUrl: http://localhost:8080

set -e
BASE="${1:-http://localhost:8080}"
PASS=0
FAIL=0

test_url() {
  local method="${1:-GET}"
  local path="$2"
  local url="${BASE}${path}"
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url" 2>/dev/null || echo "000")
  if [[ "$status" =~ ^(200|201|204)$ ]]; then
    echo "  OK   $method $path -> $status"
    ((PASS++)) || true
  else
    echo "  FAIL $method $path -> $status"
    ((FAIL++)) || true
  fi
}

echo "Testing backend at $BASE"
echo "---"

echo "Goals-OKR:"
test_url GET "/api/v2/goals-okr/wheels"
test_url GET "/api/v2/goals-okr/life-domains"
test_url GET "/api/v2/goals-okr/life-domains/1/objectives"
test_url GET "/api/v2/goals-okr/objectives/1"
test_url GET "/api/v2/goals-okr/key-results/1"
test_url GET "/api/v2/goals-okr/objectives/1/key-results"
test_url GET "/api/v2/goals-okr/users/1/user-objective-instances"
test_url GET "/api/v2/goals-okr/users/1/user-key-result-instances"
test_url GET "/api/v2/goals-okr/users/1/kanban-items"
test_url GET "/api/v2/goals-okr/teams/1/kanban-items"
test_url GET "/api/v2/goals-okr/key-result-progress?userKeyResultInstanceId=1"

echo "User:"
test_url GET "/api/v2/user/1"
test_url GET "/api/v2/user/1/preferences"

echo "User teams:"
test_url GET "/api/v2/users/teams/user/1"
test_url GET "/api/v2/users/teams/1"
test_url GET "/api/v2/users/teams/1/members"
test_url GET "/api/v2/users/teams/1/invitations"
test_url GET "/api/v2/users/teams/1/kanban/share"
test_url GET "/api/v2/users/team-invitations"

echo "Content:"
test_url GET "/api/v2/content/wheels"
test_url GET "/api/v2/content/categories"
test_url GET "/api/v2/content/categories/wheel/1"
test_url GET "/api/v2/content/categories/1"
test_url GET "/api/v2/content/books/1"
test_url GET "/api/v2/content/categories/1/books"
test_url GET "/api/v2/content/chapters/1"
test_url GET "/api/v2/content/books/1/chapters"
test_url GET "/api/v2/content/chapters/1/sections"
test_url GET "/api/v2/content/sections/1"
test_url GET "/api/v2/content/sections/1/paragraphs"
test_url GET "/api/v2/content/paragraphs/1"
test_url GET "/api/v2/content/sections/1/versions/current"
test_url GET "/api/v2/content/sections/1/versions/published"

echo "Learning:"
test_url GET "/api/v2/learning/templates"
test_url GET "/api/v2/learning/templates/1"
test_url GET "/api/v2/learning/templates/section/1"
test_url GET "/api/v2/learning/templates/1/steps"
test_url GET "/api/v2/learning/enrollments/user/1"

echo "Content reviews:"
test_url GET "/api/v2/content/reviews/status/PENDING"
test_url GET "/api/v2/content/reviews/1"

echo "---"
echo "Result: $PASS passed, $FAIL failed"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
