#!/bin/bash
# Script om alle goals en OKRs uit de database te halen, gegroepeerd per life domain
# Gebruik: ./scripts/get_goals_and_okrs.sh

DB_NAME="woi_backend_v2"
DB_USER="${USER:-postgres}"
DB_HOST="localhost"
DB_PORT="5432"

SQL_FILE="backend/application/src/main/resources/db/scripts/get_all_goals_and_okrs_by_life_domain.sql"

echo "Ophalen van goals en OKRs uit de database..."
echo "Database: $DB_NAME"
echo "Gebruiker: $DB_USER"
echo ""

# Voer de eerste query uit (gedetailleerd overzicht)
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "Query succesvol uitgevoerd!"
else
    echo ""
    echo "Fout bij uitvoeren van query. Controleer of:"
    echo "  - PostgreSQL draait"
    echo "  - Database $DB_NAME bestaat"
    echo "  - Gebruiker $DB_USER heeft toegang"
    exit 1
fi
