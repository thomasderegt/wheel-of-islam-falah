#!/bin/bash
# Rebuild alle modules en installeer in Maven repository
# Gebruik: ./rebuild.sh

set -e  # Stop bij fouten

echo "🔨 Rebuilding alle backend modules..."
echo ""

# Ga naar backend directory (script moet vanuit backend/ of root uitgevoerd worden)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Clean en install alle modules
echo "📦 Running: mvn clean install -DskipTests"
mvn clean install -DskipTests

echo ""
echo "✅ Alle modules geïnstalleerd in Maven repository"
echo ""
echo "📍 JAR locaties:"
echo "   - goals-okr-module: ~/.m2/repository/com/woi/goals-okr-module/2.0.0/goals-okr-module-2.0.0.jar"
echo "   - user-module: ~/.m2/repository/com/woi/user-module/2.0.0/user-module-2.0.0.jar"
echo "   - content-module: ~/.m2/repository/com/woi/content-module/2.0.0/content-module-2.0.0.jar"
echo "   - learning-module: ~/.m2/repository/com/woi/learning-module/2.0.0/learning-module-2.0.0.jar"
echo "   - assessment-module: ~/.m2/repository/com/woi/assessment-module/2.0.0/assessment-module-2.0.0.jar"
echo ""
echo "💡 Tip: Herstart de backend na wijzigingen:"
echo "   cd application && mvn spring-boot:run"
