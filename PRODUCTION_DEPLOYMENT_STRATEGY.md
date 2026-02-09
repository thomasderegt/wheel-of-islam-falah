# Production Deployment Strategy

## Generiek Plan voor Grote Refactoringen in Productie

Dit document beschrijft een veilige strategie voor het implementeren van grote structuurwijzigingen in een productie-omgeving met actieve gebruikers en bestaande data.

**Doel:** Zero-downtime deployments waar mogelijk, planned downtime waar nodig, met focus op backwards compatibility en veilige rollback.

---

## Uitgangspunten

- ✅ **Zero downtime** waar mogelijk (voor grote userbase)
- ✅ **Backwards compatible** - oude code blijft werken
- ✅ **Rollback mogelijk** - altijd terug kunnen zonder dataverlies
- ✅ **Geleidelijke rollout** - stap voor stap, niet alles tegelijk
- ✅ **Monitoring** - continu tijdens rollout
- ✅ **Feature flags** - aan/uit zonder deploy

---

## Fase 1: Voorbereiding (1-2 weken)

### 1.1 Database Backup

```bash
# Backup maken VOOR je begint
pg_dump -h localhost -U user -d database > backup_before_refactoring_$(date +%Y%m%d).sql

# Test restore op staging
pg_restore -d staging_db backup_before_refactoring_*.sql
```

**Checklist:**
- [ ] Backup gemaakt
- [ ] Backup getest (restore op staging)
- [ ] Backup locatie gedocumenteerd
- [ ] Restore procedure gedocumenteerd

### 1.2 Feature Flag Systeem

```java
// FeatureFlags.java
@Component
public class FeatureFlags {
    @Value("${features.goal-version-system:false}")
    private boolean goalVersionSystemEnabled;
    
    @Value("${features.goal-version-system-percentage:0}")
    private int percentage;
    
    public boolean shouldUseVersionSystem(Long userId) {
        if (!goalVersionSystemEnabled) {
            return false;
        }
        
        // Percentage-based rollout
        if (percentage > 0) {
            return (userId % 100) < percentage;
        }
        
        return true;
    }
}
```

```properties
# application.properties
features.goal-version-system=false
features.goal-version-system-percentage=0
```

### 1.3 Monitoring Setup

**Metrics om te tracken:**
- Error rates (oude vs nieuwe code)
- Response times
- Database query performance
- Feature flag usage percentage
- Migration progress
- Rollback events

---

## Fase 2: Database Migratie (Zero-Downtime)

### 2.1 Stap 1: Nieuwe Tabellen Toevoegen (Backwards Compatible)

**Regel:** ALTIJD backwards compatible migrations!

```sql
-- VXX__Add_version_tables.sql
-- Deze migratie breekt NIETS

-- Nieuwe tabellen (leeg)
CREATE TABLE IF NOT EXISTS goals_okr.goal_versions (
    id BIGSERIAL PRIMARY KEY,
    goal_id BIGINT NOT NULL,
    version_number INTEGER NOT NULL,
    title_nl VARCHAR(255),
    title_en VARCHAR(255),
    description_nl TEXT,
    description_en TEXT,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_versions_goal FOREIGN KEY (goal_id) 
        REFERENCES goals_okr.goals(id) ON DELETE CASCADE,
    CONSTRAINT uk_goal_version UNIQUE (goal_id, version_number)
);

CREATE TABLE IF NOT EXISTS goals_okr.reviewable_items (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    reference_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_reviewable_item UNIQUE (type, reference_id)
);

CREATE TABLE IF NOT EXISTS goals_okr.reviews (
    id BIGSERIAL PRIMARY KEY,
    reviewable_item_id BIGINT NOT NULL,
    reviewed_version_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    comment TEXT,
    submitted_by BIGINT NOT NULL,
    reviewed_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_reviewable_item FOREIGN KEY (reviewable_item_id) 
        REFERENCES goals_okr.reviewable_items(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS goals_okr.template_status (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_template_status_entity UNIQUE (entity_type, entity_id)
);

-- Nieuwe kolommen (nullable = backwards compatible)
ALTER TABLE goals_okr.goals 
    ADD COLUMN IF NOT EXISTS working_status_goalversion_id BIGINT NULL;

-- Indexes voor performance
CREATE INDEX IF NOT EXISTS idx_goals_version 
    ON goals_okr.goals(working_status_goalversion_id);
CREATE INDEX IF NOT EXISTS idx_goal_versions_goal_id 
    ON goals_okr.goal_versions(goal_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status 
    ON goals_okr.reviews(status);
```

**Waarom veilig:**
- ✅ Oude code negeert nieuwe tabellen/kolommen
- ✅ Geen NOT NULL constraints op nieuwe kolommen
- ✅ Geen data wijzigingen
- ✅ Rollback mogelijk: DROP TABLE/COLUMN (als nodig)

**Checklist:**
- [ ] Migraties backwards compatible
- [ ] Geen NOT NULL op nieuwe kolommen
- [ ] Foreign keys correct
- [ ] Indexes toegevoegd
- [ ] Getest op staging

### 2.2 Stap 2: Deploy Nieuwe Code (Feature Flag OFF)

```bash
# CI/CD Pipeline
1. Run database migrations (stap 2.1)
2. Deploy nieuwe code
3. Feature flag = false (default)
4. Oude code blijft actief
5. Nieuwe code is beschikbaar maar niet gebruikt
```

**Code die beide ondersteunt:**
```java
// GetGoalQueryHandler.java
public GoalResult handle(GetGoalQuery query) {
    if (featureFlags.isGoalVersionSystemEnabled()) {
        // NIEUWE code (nog niet actief)
        return getGoalWithVersion(query.goalId());
    } else {
        // OUDE code (nog actief)
        return getGoalOld(query.goalId());
    }
}

private GoalResult getGoalOld(Long goalId) {
    Goal goal = goalRepository.findById(goalId)
        .orElseThrow(() -> new IllegalArgumentException("Goal not found"));
    return GoalResult.from(goal);
}

private GoalResult getGoalWithVersion(Long goalId) {
    Goal goal = goalRepository.findById(goalId)
        .orElseThrow(() -> new IllegalArgumentException("Goal not found"));
    
    if (goal.getWorkingStatusGoalVersionId() != null) {
        GoalVersion version = goalVersionRepository.findById(
            goal.getWorkingStatusGoalVersionId()
        ).orElseThrow(() -> new IllegalStateException("Version not found"));
        return GoalResult.from(goal, version);
    } else {
        // Lazy migration
        migrationService.migrateGoal(goalId);
        return getGoalWithVersion(goalId);
    }
}
```

### 2.3 Stap 3: Smoke Tests

```bash
# Na deploy:
- Check health endpoint
- Test enkele endpoints
- Check database connectie
- Verify feature flag = false
- Check logs voor errors
```

---

## Fase 3: Dual-Write Periode (1-2 weken)

### 3.1 Code die Beide Schrijft

```java
// CreateGoalCommandHandler.java
@Transactional
public GoalResult handle(CreateGoalCommand cmd) {
    // Schrijf naar OUDE structuur (backwards compatible)
    Goal goal = Goal.create(
        cmd.lifeDomainId(),
        cmd.titleNl(),
        cmd.titleEn(),
        cmd.orderIndex()
    );
    
    if (cmd.descriptionNl() != null) {
        goal.setDescriptionNl(cmd.descriptionNl());
    }
    if (cmd.descriptionEn() != null) {
        goal.setDescriptionEn(cmd.descriptionEn());
    }
    
    Goal savedGoal = goalRepository.save(goal);
    
    // Schrijf ook naar NIEUWE structuur (als feature flag ON)
    if (featureFlags.isGoalVersionSystemEnabled()) {
        Integer versionNumber = versionNumberGenerator
            .generateNextGoalVersionNumber(savedGoal.getId());
        
        GoalVersion version = GoalVersion.create(
            savedGoal.getId(),
            versionNumber,
            savedGoal.getTitleNl(),
            savedGoal.getTitleEn(),
            savedGoal.getDescriptionNl(),
            savedGoal.getDescriptionEn(),
            cmd.userId()
        );
        
        GoalVersion savedVersion = goalVersionRepository.save(version);
        savedGoal.setWorkingStatusGoalVersionId(savedVersion.getId());
        goalRepository.save(savedGoal);
        
        // Zet status op DRAFT
        TemplateStatus status = TemplateStatus.create(
            "goal",
            savedGoal.getId(),
            TemplateStatusType.DRAFT,
            cmd.userId()
        );
        templateStatusRepository.save(status);
    }
    
    return GoalResult.from(savedGoal);
}
```

**Waarom:**
- ✅ Oude code blijft werken
- ✅ Nieuwe data wordt al voorbereid
- ✅ Geen dataverlies
- ✅ Testen mogelijk zonder risico

### 3.2 Data Migratie (Achtergrond Job)

```java
// GoalVersionMigrationService.java
@Service
public class GoalVersionMigrationService {
    
    private final GoalRepository goalRepository;
    private final GoalVersionRepository goalVersionRepository;
    private final TemplateStatusRepository templateStatusRepository;
    private final GoalVersionNumberGenerator versionNumberGenerator;
    
    @Transactional
    public MigrationResult migrateGoal(Long goalId) {
        try {
            Goal goal = goalRepository.findById(goalId)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found"));
            
            // Check: heeft goal al een versie?
            if (goal.getWorkingStatusGoalVersionId() != null) {
                return new MigrationResult(true, "Already migrated");
            }
            
            // Maak versie 1 van bestaande goal data
            Integer versionNumber = versionNumberGenerator
                .generateNextGoalVersionNumber(goalId);
            
            GoalVersion version1 = GoalVersion.create(
                goal.getId(),
                versionNumber,
                goal.getTitleNl(),
                goal.getTitleEn(),
                goal.getDescriptionNl(),
                goal.getDescriptionEn(),
                null  // created_by onbekend voor oude data
            );
            
            GoalVersion savedVersion = goalVersionRepository.save(version1);
            
            // Zet pointer in goal
            goal.setWorkingStatusGoalVersionId(savedVersion.getId());
            goalRepository.save(goal);
            
            // Zet status op PUBLISHED (oude goals waren al "live")
            TemplateStatus status = templateStatusRepository
                .findByEntityTypeAndEntityId("goal", goal.getId())
                .orElseGet(() -> TemplateStatus.create(
                    "goal",
                    goal.getId(),
                    TemplateStatusType.PUBLISHED,
                    null
                ));
            
            if (status.getStatus() != TemplateStatusType.PUBLISHED) {
                status.updateStatus(TemplateStatusType.PUBLISHED, null);
            }
            templateStatusRepository.save(status);
            
            return new MigrationResult(true, "Success");
            
        } catch (Exception e) {
            log.error("Failed to migrate goal {}", goalId, e);
            return new MigrationResult(false, "Error: " + e.getMessage());
        }
    }
    
    @Transactional
    public BatchMigrationResult migrateAllGoals() {
        List<Goal> allGoals = goalRepository.findAll();
        
        int total = allGoals.size();
        int success = 0;
        int failed = 0;
        int skipped = 0;
        List<String> errors = new ArrayList<>();
        
        for (Goal goal : allGoals) {
            try {
                if (goal.getWorkingStatusGoalVersionId() != null) {
                    skipped++;
                    continue;
                }
                
                MigrationResult result = migrateGoal(goal.getId());
                if (result.isSuccess()) {
                    success++;
                    if (success % 10 == 0) {
                        log.info("Migration progress: {}/{}", success, total);
                    }
                } else {
                    failed++;
                    errors.add("Goal " + goal.getId() + ": " + result.getMessage());
                }
            } catch (Exception e) {
                failed++;
                errors.add("Goal " + goal.getId() + ": " + e.getMessage());
            }
        }
        
        return new BatchMigrationResult(total, success, failed, skipped, errors);
    }
}
```

**Migratie Endpoints:**
```java
// MigrationController.java
@RestController
@RequestMapping("/api/v2/goals-okr/admin/migration")
public class MigrationController {
    
    @PostMapping("/goals/{goalId}")
    public ResponseEntity<?> migrateGoal(@PathVariable Long goalId) {
        MigrationResult result = migrationService.migrateGoal(goalId);
        return ResponseEntity.ok(Map.of(
            "success", result.isSuccess(),
            "message", result.getMessage()
        ));
    }
    
    @PostMapping("/goals")
    public ResponseEntity<?> migrateAllGoals() {
        BatchMigrationResult result = migrationService.migrateAllGoals();
        return ResponseEntity.ok(Map.of(
            "total", result.getTotal(),
            "success", result.getSuccess(),
            "failed", result.getFailed(),
            "skipped", result.getSkipped(),
            "successRate", result.getSuccessRate() + "%",
            "errors", result.getErrors()
        ));
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> getMigrationStatus() {
        long total = goalRepository.count();
        long migrated = goalRepository.countByWorkingStatusGoalVersionIdIsNotNull();
        return ResponseEntity.ok(Map.of(
            "totalGoals", total,
            "migratedGoals", migrated,
            "unmigratedGoals", total - migrated,
            "migrationProgress", total > 0 ? 
                (migrated * 100.0 / total) + "%" : "0%"
        ));
    }
}
```

---

## Fase 4: Geleidelijke Rollout

### 4.1 Stap 1: Feature Flag ON voor 1% (Test)

```properties
# Via config server of database
features.goal-version-system=true
features.goal-version-system-percentage=1  # 1% van requests
```

```java
// Code die percentage-based rollout ondersteunt
if (featureFlags.isGoalVersionSystemEnabled()) {
    // Random: X% krijgt nieuwe code
    Long userId = getCurrentUserId(); // Of request ID
    if (featureFlags.shouldUseVersionSystem(userId)) {
        return getGoalWithVersion(id);
    }
}
return getGoalOld(id);
```

**Monitor:**
- Error rates
- Response times
- User complaints
- Database performance

### 4.2 Stap 2: Opschalen (5% → 25% → 50% → 100%)

```
Dag 1: 1%   → Monitor 24 uur
Dag 2: 5%   → Monitor 24 uur
Dag 3: 25%  → Monitor 24 uur
Dag 4: 50%  → Monitor 24 uur
Dag 5: 100% → Monitor 48 uur
```

**Bij problemen:**
```properties
# Direct terug naar 0%
features.goal-version-system-percentage=0
# Geen deploy nodig!
```

### 4.3 Stap 3: Read van Nieuwe Structuur

```java
@GetMapping("/goals/{id}")
public GoalResult getGoal(Long id) {
    if (featureFlags.isGoalVersionSystemEnabled()) {
        Goal goal = goalRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Goal not found"));
        
        if (goal.getWorkingStatusGoalVersionId() != null) {
            // Heeft versie → gebruik nieuwe structuur
            GoalVersion version = goalVersionRepository.findById(
                goal.getWorkingStatusGoalVersionId()
            ).orElseThrow(() -> new IllegalStateException("Version not found"));
            return GoalResult.from(goal, version);
        } else {
            // Nog niet gemigreerd → lazy migration
            migrationService.migrateGoal(id);
            return getGoal(id); // Retry
        }
    } else {
        // OUDE code (fallback)
        return getGoalOld(id);
    }
}
```

---

## Fase 5: Cleanup (Weken Later)

### 5.1 Oude Code Verwijderen (Pas na Weken)

```
Week 1-4: Nieuwe code actief, oude code blijft
Week 5:   Oude code uitcommenten
Week 6:   Testen
Week 7:   Oude code verwijderen
```

### 5.2 Database Cleanup (Optioneel)

```sql
-- Pas als je zeker weet dat niets oude structuur gebruikt
-- ALTIJD eerst backup maken!

-- Verwijder oude kolommen (als niet meer nodig)
-- ALTER TABLE goals DROP COLUMN old_field;
```

---

## CI/CD Integratie

### Pipeline Structuur

```yaml
# .github/workflows/deploy.yml

stages:
  - test
  - migrate-database
  - deploy
  - smoke-test
  - rollback (if needed)

test:
  - Run unit tests
  - Run integration tests
  - Check backwards compatibility

migrate-database:
  - Run Flyway migrations (backwards compatible only!)
  - Verify migrations succeeded
  - Check database health

deploy:
  - Deploy to staging first
  - Run smoke tests
  - Deploy to production
  - Feature flag = false (default)

smoke-test:
  - Health check
  - Critical endpoints test
  - Database connectivity
  - Feature flag verification

rollback:
  - If smoke tests fail → automatic rollback
  - Or: Set feature flag to false
```

### Database Migratie Regels

**ALTIJD backwards compatible:**
```sql
-- ✅ GOED:
ALTER TABLE goals ADD COLUMN new_field VARCHAR(255) NULL;
CREATE TABLE new_table (...);

-- ❌ SLECHT:
ALTER TABLE goals DROP COLUMN title;
ALTER TABLE goals ALTER COLUMN title SET NOT NULL;
```

---

## Monitoring en Alerting

### Metrics

```java
// Track alles:
- Feature flag usage percentage
- Error rates (oude vs nieuwe code)
- Response times
- Database query performance
- Migration progress
- Rollback events
```

### Alerting

```yaml
alerts:
  - error_rate > 1% → Alert team
  - response_time > 2s → Alert team
  - migration_failures > 5 → Alert team
  - database_errors → Alert team
```

---

## Rollback Plan

### Niveau 1: Feature Flag OFF (Snelst)

```properties
# Via config server (geen deploy!)
features.goal-version-system=false
```

**Tijd:** < 1 minuut

### Niveau 2: Code Rollback

```bash
# CI/CD rollback
git revert <commit>
# Deploy vorige versie
```

**Tijd:** 5-10 minuten

### Niveau 3: Database Rollback (Laatste Redmiddel)

```sql
-- Alleen als echt nodig
-- ALTIJD backup eerst!
ALTER TABLE goals DROP COLUMN working_status_goalversion_id;
DROP TABLE goal_versions;
```

**Tijd:** 15-30 minuten (met backup restore)

---

## Checklist voor Productie

### Voor Deploy

- [ ] Database backup gemaakt
- [ ] Migraties backwards compatible
- [ ] Feature flag systeem werkt
- [ ] Monitoring in plaats
- [ ] Rollback plan getest
- [ ] Staging getest
- [ ] Team geïnformeerd

### Tijdens Deploy

- [ ] Migraties draaien
- [ ] Code deployen
- [ ] Feature flag = false
- [ ] Smoke tests slagen
- [ ] Monitoring actief

### Na Deploy

- [ ] Monitor 24 uur
- [ ] Geleidelijk opschalen
- [ ] Data migratie draaien
- [ ] Verifiëren dat alles werkt

---

## Planned Downtime vs Zero-Downtime

### Wanneer Planned Downtime?

**Voor jouw situatie (nu):**
- ✅ Relatief kleine gebruikersgroep
- ✅ Geen 24/7 kritieke service
- ✅ Je kunt gebruikers informeren
- ✅ Veel eenvoudiger te implementeren
- ✅ Minder risico op fouten

**Hoe:**
```
1. Kies rustig moment (bijv. zondag 02:00 NL tijd)
2. Informeer gebruikers (email/notificatie)
3. Maintenance mode aan
4. Database migraties
5. Code deploy
6. Test
7. Online
```

### Wanneer Zero-Downtime?

**Later (bij groei):**
- 10.000+ actieve gebruikers
- Gebruikers in meerdere tijdzones
- Downtime wordt problematisch

**Dan:**
- Feature flags gebruiken
- Dual-write implementeren
- Geleidelijke rollout

---

## Strategie: Nu Eenvoudig, Later Schaalbaar

### Nu (Ontwikkeling/Launch)

**Voor grote refactoringen:**
- Planned downtime
- Feature flags voor kleine updates
- Backwards compatible bouwen
- Monitoring opzetten

### Later (Groei - 10.000+ gebruikers)

**Zero-downtime deployments:**
- Feature flags activeren
- Geleidelijke rollout
- Percentage-based feature flags

### Nog Later (Schaal - 100.000+ gebruikers)

**Microservices overwegen:**
- Split alleen wat nodig is
- Start met één service
- Monitor performance
- Split verder als nodig

---

## Best Practices

### 1. Database: Altijd Backwards Compatible

```sql
-- ✅ ALTIJD zo:
ALTER TABLE goals ADD COLUMN new_field VARCHAR(255) NULL;

-- ❌ NOOIT zo:
ALTER TABLE goals DROP COLUMN old_field;
ALTER TABLE goals ALTER COLUMN field SET NOT NULL;
```

### 2. Code: Feature Flag Ready

```java
// Bouw NU al met feature flags
// Dan kun je later zero-downtime doen
if (featureFlags.isEnabled()) {
    // Nieuwe code
} else {
    // Oude code
}
```

### 3. Architectuur: Modular

```
Modular Monolith
  └── Duidelijke module boundaries
  └── Kan later splitsen naar microservices
  └── Maar nu eenvoudiger
```

### 4. Monitoring: Vanaf Begin

```java
// Track alles:
- Error rates
- Response times
- Database performance
- Feature flag usage
- User metrics
```

---

## Conclusie

**Hybride Aanpak:**
- **Nu:** Planned downtime voor grote changes, feature flags voor kleine
- **Later:** Zero-downtime deployments, geleidelijke rollout
- **Nog Later:** Microservices overwegen, alleen splitsen wat nodig is

**Belangrijk:**
- Bouw NU al backwards compatible
- Gebruik feature flags vanaf begin
- Modular architectuur
- Monitoring vanaf dag 1

Dit plan zorgt voor:
- ✅ Zero downtime waar mogelijk
- ✅ Geen dataverlies
- ✅ Geleidelijke overgang
- ✅ Veilige rollback
- ✅ Schaalbaar naar toekomst
