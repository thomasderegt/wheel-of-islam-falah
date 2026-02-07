# Flyway Checksum Mismatch - Uitleg en Oplossingen

## Wat is een Checksum Mismatch?

Een **Flyway checksum mismatch** treedt op wanneer Flyway detecteert dat een migratiebestand is gewijzigd nadat het al is uitgevoerd op de database.

### Hoe werkt het?

1. **Bij eerste uitvoering:** Flyway berekent een checksum (hash) van het migratiebestand en slaat deze op in de `flyway_schema_history` tabel in je database.

2. **Bij volgende opstarten:** Flyway berekent opnieuw de checksum van alle migratiebestanden en vergelijkt deze met de opgeslagen checksums.

3. **Mismatch:** Als de checksum niet overeenkomt, betekent dit dat het bestand is gewijzigd en gooit Flyway een foutmelding.

## Waarom komt dit vaak voor?

In jullie project komt dit waarschijnlijk vaak voor omdat:

### 1. **Migraties worden aangepast na uitvoering**
   - Je past een migratiebestand aan (bijv. `V21__Seed_okr_templates_v2_with_goals.sql`) nadat het al is uitgevoerd
   - Dit kan gebeuren tijdens development wanneer je:
     - Een typo corrigeert
     - SQL syntax verbetert
     - Data aanpast
     - Comments toevoegt/verwijdert

### 2. **Meerdere ontwikkelaars**
   - Verschillende ontwikkelaars werken aan dezelfde migraties
   - Git merges kunnen whitespace of line ending verschillen introduceren
   - Bestanden worden op verschillende systemen (Windows/Mac/Linux) bewerkt

### 3. **Geen strikte workflow**
   - Migraties worden direct aangepast in plaats van nieuwe versies te maken
   - Er is geen review proces voor migraties

## Waarom is dit een probleem?

Flyway voorkomt checksum mismatches omdat:

- **Consistentie:** Migraties moeten **onveranderlijk** zijn zodra ze zijn uitgevoerd
- **Reproduceerbaarheid:** Dezelfde migratie moet altijd hetzelfde resultaat geven
- **Veiligheid:** Voorkomt dat iemand per ongeluk een migratie aanpast die al in productie is

## Oplossingen

### ✅ Oplossing 1: Nieuwe Migratie Maken (AANBEVOLEN)

**Gebruik dit wanneer:** Je een wijziging wilt maken aan een al uitgevoerde migratie.

**Stappen:**
1. Maak een **nieuwe migratie** met een hoger versienummer
2. In de nieuwe migratie voer je de correctie uit

**Voorbeeld:**
```sql
-- V21__Seed_okr_templates_v2_with_goals.sql (al uitgevoerd, niet aanpassen!)
-- Maak in plaats daarvan:

-- V26__Fix_okr_templates_data.sql
UPDATE goals_okr.templates 
SET description = 'Corrected description'
WHERE id = 123;
```

**Voordelen:**
- ✅ Volgt Flyway best practices
- ✅ Geschiedenis blijft intact
- ✅ Werkt in alle omgevingen (dev, staging, production)
- ✅ Teamleden kunnen zien wat er is aangepast

### ✅ Oplossing 2: Checksum Repareren (Alleen Development)

**Gebruik dit alleen wanneer:** Je in een **development omgeving** werkt en de database mag worden gereset.

**Optie A: Checksum handmatig updaten**
```sql
-- Connecteer met je database
-- Update de checksum in flyway_schema_history
UPDATE flyway_schema_history 
SET checksum = (
    SELECT checksum 
    FROM (
        VALUES (FLYWAY_CHECKSUM_FUNCTION('V21__Seed_okr_templates_v2_with_goals.sql'))
    ) AS t(checksum)
)
WHERE version = '21';
```

**Optie B: Database resetten**
```bash
# Drop en recreate de database
dropdb woi_backend_v2
createdb woi_backend_v2

# Migraties opnieuw uitvoeren
mvn flyway:migrate -pl application
```

**Optie C: Flyway repair commando**
```bash
# Flyway probeert checksums te repareren
mvn flyway:repair -pl application
```

**⚠️ Waarschuwing:** Gebruik dit **NOOIT** in productie!

### ✅ Oplossing 3: Checksum Validatie Uitschakelen (NIET AANBEVOLEN)

**Alleen voor development:** Je kunt checksum validatie uitschakelen, maar dit is **gevaarlijk**:

```properties
# application.properties (alleen development!)
spring.flyway.validate-on-migrate=false
```

**⚠️ Waarschuwing:** 
- Dit verbergt alleen het probleem
- Je verliest de bescherming tegen onbedoelde wijzigingen
- Gebruik dit alleen als laatste redmiddel in development

### ✅ Oplossing 4: Betere Workflow (Preventie)

**Best practices om checksum mismatches te voorkomen:**

1. **Review migraties voordat je ze uitvoert**
   - Test migraties eerst op een test database
   - Laat teamleden reviewen voordat je merge

2. **Gebruik versiecontrole correct**
   - Commit migraties voordat je ze uitvoert
   - Push naar remote voordat je `flyway:migrate` draait

3. **Maak nieuwe migraties voor wijzigingen**
   - Pas nooit een uitgevoerde migratie aan
   - Maak altijd een nieuwe migratie voor correcties

4. **Gebruik `.bak` bestanden voor backup**
   - Als je een migratie moet aanpassen, maak eerst een backup
   - Verwijder `.bak` bestanden uit versiecontrole (voeg toe aan `.gitignore`)

5. **Gebruik Flyway clean (alleen development)**
   ```bash
   # Reset alle migraties (verwijdert alle data!)
   mvn flyway:clean -pl application
   mvn flyway:migrate -pl application
   ```

## Jullie Specifieke Situatie

Ik zie dat jullie een `.bak` bestand hebben:
- `V21__Seed_okr_templates_v2_with_goals.sql.bak`

Dit suggereert dat `V21` is aangepast na uitvoering. 

### Aanbevolen Actie:

1. **Verwijder het `.bak` bestand** (of voeg toe aan `.gitignore`)
2. **Als V21 al is uitgevoerd:** Maak een nieuwe migratie (bijv. `V26__Fix_okr_templates_v2_corrections.sql`) voor eventuele correcties
3. **Als V21 nog niet is uitgevoerd:** Herstel het originele bestand en test het eerst

## Snelle Fix voor Development

Als je nu een checksum mismatch hebt en je werkt in development:

```bash
# Optie 1: Repair (probeert checksums te repareren)
mvn flyway:repair -pl application

# Optie 2: Reset database (verwijdert alle data!)
mvn flyway:clean -pl application
mvn flyway:migrate -pl application

# Optie 3: Handmatig checksum updaten in database
psql woi_backend_v2
UPDATE flyway_schema_history SET checksum = NULL WHERE version = '21';
# Herstart applicatie - Flyway zal nieuwe checksum berekenen
```

## Checklist voor Nieuwe Migraties

Voordat je een migratie uitvoert:
- [ ] Migratie is getest op test database
- [ ] Migratie is gecommit naar Git
- [ ] Migratie is gereviewd (indien mogelijk)
- [ ] Migratie bevat geen tijdelijke/test data
- [ ] Migratie is idempotent (kan veilig meerdere keren draaien)

Na uitvoering:
- [ ] Migratie wordt **NOOIT** meer aangepast
- [ ] Voor correcties: maak nieuwe migratie met hoger versienummer

## Conclusie

**Checksum mismatches zijn een beschermingsmechanisme, geen bug!**

Ze voorkomen dat je per ongeluk migraties aanpast die al zijn uitgevoerd. De beste oplossing is om:
1. **Nieuwe migraties te maken** voor wijzigingen
2. **Betere workflows** te gebruiken om dit te voorkomen
3. **Alleen in development** checksums te repareren als het echt nodig is
