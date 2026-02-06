# Goal Setting by End User - Change Description

## Overzicht

Implementatie van een aggregate root `UserGoalInstance` en een multi-step dialog flow voor eindgebruikers om goals, objectives en key results te selecteren en toe te voegen aan hun kanban bord.

## Domain Entity Mapping: Huidig → Nieuw

### Template Entities (Blijven Ongewijzigd)

| Entity       | Status   | Velden                                                                                     | Opmerking                  |
| ------------ | -------- | ------------------------------------------------------------------------------------------ | -------------------------- |
| `LifeDomain` | ✅ Blijft | `id`, `domainKey`, `titleNl/En`, `descriptionNl/En`, `iconName`, `displayOrder`            | Template, geen wijzigingen |
| `Goal`       | ✅ Blijft | `id`, `lifeDomainId`, `titleNl/En`, `descriptionNl/En`, `orderIndex`                       | Template, geen wijzigingen |
| `Objective`  | ✅ Blijft | `id`, `goalId`, `titleNl/En`, `descriptionNl/En`, `orderIndex`                             | Template, geen wijzigingen |
| `KeyResult`  | ✅ Blijft | `id`, `objectiveId`, `titleNl/En`, `descriptionNl/En`, `targetValue`, `unit`, `orderIndex` | Template, geen wijzigingen |

### User-Specific Entities (Wijzigingen)

| Entity                      | Huidige Structuur                                                                                          | Nieuwe Structuur                                                                                                        | Wijzigingen                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **`UserGoalInstance`**      | ✅ **BESTAAT AL**                                                                                            | `id`, `userId` ⭐, `goalId`, `startedAt`, `completedAt`                                                                  | ✅ **GEÏMPLEMENTEERD** - Aggregate root                                                                             |
| **`UserObjectiveInstance`** | `id`, `userId` ❌, `objectiveId`, `startedAt`, `completedAt`                                                | `id`, `userGoalInstanceId` ✅, `objectiveId`, `startedAt`, `completedAt`                                                 | **VERWIJDER:** `userId`<br>**TOEVOEGEN:** `userGoalInstanceId`                                                     |
| **`KeyResultProgress`**     | `id`, `userId` ❌, `keyResultId`, `userObjectiveInstanceId`, `currentValue`, `updatedAt`                    | `id`, `keyResultId`, `userObjectiveInstanceId`, `currentValue`, `updatedAt`                                             | **VERWIJDER:** `userId`                                                                                            |
| **`Initiative`**            | `id`, `userId` ❌, `keyResultId`, `userObjectiveInstanceId`, `title`, `description`, `status`, `targetDate` | `id`, `keyResultId`, `userObjectiveInstanceId`, `title`, `description`, `status`, `targetDate`                          | **VERWIJDER:** `userId`                                                                                            |
| **`KanbanItem`**            | `id`, `userId`, `itemType`, `itemId` (template ID), `columnName`, `position`, `notes`                      | `id`, `userId`, `itemType`, `itemId` (instance ID), `userGoalInstanceId` (optioneel), `columnName`, `position`, `notes` | **WIJZIG:** `itemId` verwijst nu naar instance ID<br>**TOEVOEGEN:** `userGoalInstanceId` (optioneel, voor context) |

### Gedetailleerde Mapping

#### 1. UserGoalInstance (✅ GEÏMPLEMENTEERD - Aggregate Root)

```java
// ✅ GEÏMPLEMENTEERD
public class UserGoalInstance {
    private Long id;
    private Long userId; // ⭐ ALLEEN hier in de aggregate!
    private Long goalId; // FK naar Goal (template)
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    
    public static UserGoalInstance start(Long userId, Long goalId) { ... }
    public void complete() { ... }
}
```

**Database:**

* ✅ Tabel bestaat: `goals_okr.user_goal_instances`
* ✅ Constraint: `UNIQUE (user_id, goal_id)` - één subscription per user per goal
* ✅ Migratie: `V23__Add_UserGoalInstance_aggregate.sql`

#### 2. UserObjectiveInstance (WIJZIGING)

**Huidig:**

```java
public class UserObjectiveInstance {
    private Long id;
    private Long userId; // ❌ VERWIJDEREN
    private Long objectiveId; // FK naar Objective (template)
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}
```

**Nieuw:**

```java
public class UserObjectiveInstance {
    private Long id;
    private Long userGoalInstanceId; // ✅ TOEVOEGEN - FK naar UserGoalInstance
    private Long objectiveId; // FK naar Objective (template) - blijft
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    
    // Factory method wijzigen:
    public static UserObjectiveInstance start(Long userGoalInstanceId, Long objectiveId) {
        // userId parameter verwijderen
        // userGoalInstanceId gebruiken
    }
}
```

**Database:**

* Kolom toevoegen: `user_goal_instance_id BIGINT`
* Kolom verwijderen: `user_id`
* Foreign key: `FK user_goal_instance_id → user_goal_instances(id)`

#### 3. KeyResultProgress (WIJZIGING)

**Huidig:**

```java
public class KeyResultProgress {
    private Long id;
    private Long userId; // ❌ VERWIJDEREN
    private Long keyResultId; // FK naar KeyResult (template)
    private Long userObjectiveInstanceId; // FK naar UserObjectiveInstance
    private BigDecimal currentValue;
    private LocalDateTime updatedAt;
    
    public static KeyResultProgress create(Long userId, Long keyResultId, Long userObjectiveInstanceId, BigDecimal currentValue) {
        // userId parameter verwijderen
    }
}
```

**Nieuw:**

```java
public class KeyResultProgress {
    private Long id;
    // userId verwijderd - nu via UserObjectiveInstance → UserGoalInstance
    private Long keyResultId; // FK naar KeyResult (template) - blijft
    private Long userObjectiveInstanceId; // FK naar UserObjectiveInstance - blijft
    private BigDecimal currentValue;
    private LocalDateTime updatedAt;
    
    public static KeyResultProgress create(Long keyResultId, Long userObjectiveInstanceId, BigDecimal currentValue) {
        // userId parameter verwijderen
    }
}
```

**Database:**

* Kolom verwijderen: `user_id`

#### 4. Initiative (WIJZIGING)

**Huidig:**

```java
public class Initiative {
    private Long id;
    private Long userId; // ❌ VERWIJDEREN
    private Long keyResultId; // FK naar KeyResult (template)
    private Long userObjectiveInstanceId; // FK naar UserObjectiveInstance
    private String title;
    private String description;
    private GoalStatus status;
    private LocalDate targetDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static Initiative create(Long userId, Long keyResultId, Long userObjectiveInstanceId, String title) {
        // userId parameter verwijderen
    }
}
```

**Nieuw:**

```java
public class Initiative {
    private Long id;
    // userId verwijderd - nu via UserObjectiveInstance → UserGoalInstance
    private Long keyResultId; // FK naar KeyResult (template) - blijft
    private Long userObjectiveInstanceId; // FK naar UserObjectiveInstance - blijft
    private String title;
    private String description;
    private GoalStatus status;
    private LocalDate targetDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static Initiative create(Long keyResultId, Long userObjectiveInstanceId, String title) {
        // userId parameter verwijderen
    }
}
```

**Database:**

* Kolom verwijderen: `user_id`

#### 5. KanbanItem (WIJZIGING)

**Huidig:**

```java
public class KanbanItem {
    private Long id;
    private Long userId;
    private ItemType itemType; // GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE
    private Long itemId; // ❌ Verwijst naar template ID
    private KanbanColumn columnName;
    private Integer position;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**Nieuw:**

```java
public class KanbanItem {
    private Long id;
    private Long userId; // Blijft (voor queries)
    private ItemType itemType; // GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE
    private Long itemId; // ✅ Verwijst naar instance ID (niet template ID)
    private Long userGoalInstanceId; // ✅ TOEVOEGEN (optioneel, voor context bij KEY_RESULT/INITIATIVE)
    private KanbanColumn columnName;
    private Integer position;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**Mapping van itemId:**

* `GOAL` → `itemId` = `UserGoalInstance.id`
* `OBJECTIVE` → `itemId` = `UserObjectiveInstance.id`
* `KEY_RESULT` → `itemId` = `KeyResult.id` (template) + `userGoalInstanceId` voor context
* `INITIATIVE` → `itemId` = `Initiative.id` + `userGoalInstanceId` voor context

**Database:**

* Kolom toevoegen: `user_goal_instance_id BIGINT` (nullable)
* Foreign key: `FK user_goal_instance_id → user_goal_instances(id)`

## Cross-Module Communicatie

### UserModuleInterface voor User Data

**Patroon:** In een modulaire monolith communiceren modules onderling via module interfaces.

**UserModuleInterface (✅ GEÏMPLEMENTEERD):**
- Locatie: `com.woi.user.api.UserModuleInterface`
- Implementatie: `com.woi.user.infrastructure.api.UserModuleInterfaceImpl`
- Methoden: `getUserById()`, `getUserByEmail()`, `userExists()`, `isUserActive()`

**Gebruik in Goals-OKR Module:**
- Goals-okr module slaat alleen `userId` op als `Long` (soft reference, geen FK)
- Voor user data: injecteer `UserModuleInterface` in handlers
- Query user data via interface, niet direct naar `users` schema
- Dit volgt hetzelfde patroon als:
  - `LearningModuleInterface.isParagraphInUse()` voor content module
  - `ContentModuleInterface.getSectionIdForParagraph()` voor learning module

**Voorbeeld:**
```java
@Component
public class StartUserGoalInstanceCommandHandler {
    private final UserGoalInstanceRepository userGoalInstanceRepository;
    private final GoalRepository goalRepository;
    private final UserModuleInterface userModule; // ← Inject user module interface
    
    @Transactional
    public UserGoalInstanceResult handle(StartUserGoalInstanceCommand command) {
        // Valideer user bestaat via user module interface
        if (!userModule.userExists(command.userId())) {
            throw new IllegalArgumentException("User not found: " + command.userId());
        }
        // ... rest van de logica
    }
}
```

## Domain Model Wijzigingen - Strikte DDD Aanpak

### DDD Principe: userId alleen in Aggregate Root

**Strikte DDD regel:** `userId` komt alleen voor in `UserGoalInstance` (de aggregate root). Alle andere entities binnen de aggregate halen `userId` op via de hiërarchie, niet via een directe `userId` referentie.

### Nieuwe Aggregate Root: UserGoalInstance

`UserGoalInstance` wordt de aggregate root voor user-specific goal instances in de OKR module.

**Structuur:**

```
UserGoalInstance (aggregate root)
  ├── userId: Long ⭐ (ALLEEN hier!)
  ├── goalId: Long (template reference)
  ├── startedAt: LocalDateTime
  ├── completedAt: LocalDateTime
  └── UserObjectiveInstance[] (entities binnen aggregate)
      ├── userGoalInstanceId: Long (FK naar UserGoalInstance)
      ├── objectiveId: Long (template reference)
      ├── startedAt: LocalDateTime
      ├── completedAt: LocalDateTime
      ├── KeyResultProgress[] (entities binnen aggregate)
      │   ├── userObjectiveInstanceId: Long (FK naar UserObjectiveInstance)
      │   ├── keyResultId: Long (template reference)
      │   └── currentValue: BigDecimal
      │   ⚠️ GEEN userId (via UserObjectiveInstance → UserGoalInstance)
      └── Initiative[] (entities binnen aggregate)
          ├── userObjectiveInstanceId: Long (FK naar UserObjectiveInstance)
          ├── keyResultId: Long (template reference)
          └── title: String
          ⚠️ GEEN userId (via UserObjectiveInstance → UserGoalInstance)
```

## Database Migratie

### V23__Add_UserGoalInstance_aggregate.sql

1. **Create `user_goal_instances` table:**

```sql
CREATE TABLE IF NOT EXISTS goals_okr.user_goal_instances (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- ⭐ ALLEEN hier!
    goal_id BIGINT NOT NULL, -- FK to goals_okr.goals (template)
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_user_goal_instance_goal FOREIGN KEY (goal_id)
        REFERENCES goals_okr.goals(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_goal_instance UNIQUE (user_id, goal_id)
);

CREATE INDEX IF NOT EXISTS idx_user_goal_instances_user ON goals_okr.user_goal_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goal_instances_goal ON goals_okr.user_goal_instances(goal_id);
```

2. **Modify `user_objective_instances` table:**

```sql
-- Add user_goal_instance_id column
ALTER TABLE goals_okr.user_objective_instances
    ADD COLUMN IF NOT EXISTS user_goal_instance_id BIGINT;

-- Add foreign key
ALTER TABLE goals_okr.user_objective_instances
    ADD CONSTRAINT fk_user_objective_instance_goal_instance
    FOREIGN KEY (user_goal_instance_id)
    REFERENCES goals_okr.user_goal_instances(id) ON DELETE CASCADE;

-- Migrate existing data (if any)
-- Create temporary UserGoalInstances for existing UserObjectiveInstances
-- Then update user_objective_instances.user_goal_instance_id

-- Remove user_id column (now via UserGoalInstance)
ALTER TABLE goals_okr.user_objective_instances
    DROP COLUMN IF EXISTS user_id;

CREATE INDEX IF NOT EXISTS idx_user_objective_instances_goal_instance 
    ON goals_okr.user_objective_instances(user_goal_instance_id);
```

3. **Modify `key_result_progress` table:**

```sql
-- Remove user_id column (now via UserObjectiveInstance → UserGoalInstance)
ALTER TABLE goals_okr.key_result_progress
    DROP COLUMN IF EXISTS user_id;
```

4. **Modify `initiatives` table:**

```sql
-- Remove user_id column (now via UserObjectiveInstance → UserGoalInstance)
ALTER TABLE goals_okr.initiatives
    DROP COLUMN IF EXISTS user_id;
```

5. **Modify `kanban_items` table:**

```sql
-- Add user_goal_instance_id for context
ALTER TABLE goals_okr.kanban_items
    ADD COLUMN IF NOT EXISTS user_goal_instance_id BIGINT;

-- Add foreign key
ALTER TABLE goals_okr.kanban_items
    ADD CONSTRAINT fk_kanban_item_goal_instance
    FOREIGN KEY (user_goal_instance_id)
    REFERENCES goals_okr.user_goal_instances(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_kanban_items_goal_instance 
    ON goals_okr.kanban_items(user_goal_instance_id);
```

## Backend Implementatie

### 1. Domain Layer

**UserGoalInstance.java (NIEUW):**

```java
public class UserGoalInstance {
    private Long id;
    private Long userId; // ⭐ ALLEEN hier in de aggregate!
    private Long goalId; // Template reference
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    
    public static UserGoalInstance start(Long userId, Long goalId) { ... }
    public void complete() { ... }
    
    // Helper method om userId op te halen (voor queries)
    public Long getUserId() { return userId; }
}
```

**UserObjectiveInstance.java (wijziging):**

```java
// Verwijder userId, voeg toe:
private Long userGoalInstanceId; // FK naar UserGoalInstance

// Factory method wijzigen:
public static UserObjectiveInstance start(Long userGoalInstanceId, Long objectiveId) {
    // userId parameter verwijderen
    // userGoalInstanceId gebruiken
}

// Helper method om userId op te halen via hiërarchie (optioneel, voor queries)
public Long getUserId(UserGoalInstanceRepository repository) {
    return repository.findById(userGoalInstanceId)
        .map(UserGoalInstance::getUserId)
        .orElseThrow(() -> new IllegalStateException("UserGoalInstance not found"));
}
```

**KeyResultProgress.java (wijziging):**

```java
// Verwijder userId
// Factory method wijzigen:
public static KeyResultProgress create(Long keyResultId, Long userObjectiveInstanceId, BigDecimal currentValue) {
    // userId parameter verwijderen
}
```

**Initiative.java (wijziging):**

```java
// Verwijder userId
// Factory method wijzigen:
public static Initiative create(Long keyResultId, Long userObjectiveInstanceId, String title) {
    // userId parameter verwijderen
}
```

### 2. Repository Layer - Query Strategie

**Belangrijk:** Queries moeten via de aggregate root lopen, niet direct via userId.

**Oude aanpak (niet meer):**

```java
// ❌ NIET MEER: Direct query op userId (Spring Data method name)
List<InitiativeJpaEntity> findByUserId(Long userId); // Fails: no userId field in InitiativeJpaEntity
```

**Nieuwe aanpak (strikt DDD met custom queries):**

```java
// ✅ CORRECT: Query via aggregate root met custom @Query
// Op aggregate root (heeft direct userId):
List<UserGoalInstance> findByUserId(Long userId);
List<UserGoalInstance> findByGoalId(Long goalId); // Welke users zijn ingeschreven bij deze Goal?

// Via aggregate root (custom queries met joins):
@Query("SELECT i FROM InitiativeJpaEntity i " +
       "JOIN UserObjectiveInstanceJpaEntity uoi ON i.userObjectiveInstanceId = uoi.id " +
       "JOIN UserGoalInstanceJpaEntity ugi ON uoi.userGoalInstanceId = ugi.id " +
       "WHERE ugi.userId = :userId")
List<InitiativeJpaEntity> findByUserId(@Param("userId") Long userId);

// Direct via FK (geen userId nodig):
List<UserObjectiveInstance> findByUserGoalInstanceId(Long userGoalInstanceId);
List<KeyResultProgress> findByUserObjectiveInstanceId(Long userObjectiveInstanceId);
List<Initiative> findByUserObjectiveInstanceId(Long userObjectiveInstanceId);
```

**✅ Geïmplementeerd:**
- `InitiativeJpaRepository` heeft custom `@Query` queries voor `findByUserId()`, `findByUserIdAndKeyResultId()`, `findByUserIdAndStatus()`
- Queries navigeren via: `Initiative` → `UserObjectiveInstance` → `UserGoalInstance` → `userId`

**Voorbeeld: Alle KeyResultProgress voor een user:**

```java
// Stap 1: Haal alle UserGoalInstances op voor de user
List<UserGoalInstance> goalInstances = userGoalInstanceRepository.findByUserId(userId);

// Stap 2: Haal alle UserObjectiveInstances op voor deze goal instances
List<Long> goalInstanceIds = goalInstances.stream().map(UserGoalInstance::getId).toList();
List<UserObjectiveInstance> objectiveInstances = 
    userObjectiveInstanceRepository.findByUserGoalInstanceIdIn(goalInstanceIds);

// Stap 3: Haal alle KeyResultProgress op voor deze objective instances
List<Long> objectiveInstanceIds = objectiveInstances.stream()
    .map(UserObjectiveInstance::getId).toList();
List<KeyResultProgress> progress = 
    keyResultProgressRepository.findByUserObjectiveInstanceIdIn(objectiveInstanceIds);
```

### 3. Application Layer

**Commands:**

* ✅ `StartUserGoalInstanceCommand` - **GEÏMPLEMENTEERD**
* `CompleteUserGoalInstanceCommand` - **TODO**
* `AddKanbanItemCommand` - **GEÏMPLEMENTEERD** (single item, batch nog TODO)

**Queries:**

* `GetUserGoalInstanceQuery` - **TODO**
* `GetUserGoalInstancesByUserQuery` - **TODO** - In welke Goals is user ingeschreven?
* `GetUserGoalInstancesByGoalQuery` - **TODO** - Welke users zijn ingeschreven bij deze Goal? (subscription query)
* `GetObjectivesByGoalQuery` - **GEÏMPLEMENTEERD** (via `getObjectivesByGoal()` in interface)

**Handlers:**

* ✅ `StartUserGoalInstanceCommandHandler` - **GEÏMPLEMENTEERD**
* `CompleteUserGoalInstanceCommandHandler` - **TODO**
* ✅ `AddKanbanItemCommandHandler` - **GEÏMPLEMENTEERD**

### 4. API Layer

**GoalsOKRModuleInterface:**

```java
// ✅ Subscription/Enrollment - GEÏMPLEMENTEERD
UserGoalInstanceSummary startUserGoalInstance(Long userId, Long goalId); // ✅ User schrijft zich in
Optional<UserGoalInstanceSummary> getUserGoalInstance(Long userGoalInstanceId); // TODO
List<UserGoalInstanceSummary> getUserGoalInstancesForUser(Long userId); // TODO - In welke Goals is user ingeschreven?
List<UserGoalInstanceSummary> getUserGoalInstancesByGoal(Long goalId); // TODO - Welke users zijn ingeschreven bij deze Goal?
UserGoalInstanceSummary completeUserGoalInstance(Long userGoalInstanceId); // TODO
```

**UserModuleInterface (Cross-Module Communicatie):**

```java
// ✅ GEÏMPLEMENTEERD - Voor goals-okr module om user data op te halen
public interface UserModuleInterface {
    Optional<UserSummary> getUserById(Long userId);
    Optional<UserSummary> getUserByEmail(String email);
    boolean userExists(Long userId);
    boolean isUserActive(Long userId);
}
```

**Gebruik in Goals-OKR Module:**
- Goals-okr module slaat alleen `userId` op (soft reference, geen FK)
- Voor user data: injecteer `UserModuleInterface` in handlers
- Query user data via interface, niet direct naar `users` schema
- Dit volgt hetzelfde patroon als `LearningModuleInterface.isParagraphInUse()`

### 5. REST Controller

**Endpoints:**

* ✅ `POST /api/v2/goals-okr/user-goal-instances` - **GEÏMPLEMENTEERD** - Start een nieuwe instance (user schrijft zich in)
* `GET /api/v2/goals-okr/user-goal-instances/{id}` - **TODO** - Get instance
* `GET /api/v2/goals-okr/users/{userId}/user-goal-instances` - **TODO** - Get alle instances voor user (in welke Goals is user ingeschreven?)
* `GET /api/v2/goals-okr/goals/{goalId}/user-goal-instances` - **TODO** - Get alle instances voor goal (welke users zijn ingeschreven bij deze Goal?)
* `POST /api/v2/goals-okr/user-goal-instances/{id}/complete` - **TODO** - Complete instance
* ✅ `POST /api/v2/goals-okr/kanban-items` - **GEÏMPLEMENTEERD** - Voeg één item toe
* `POST /api/v2/goals-okr/kanban-items/batch` - **TODO** - Voeg meerdere items toe in één keer

## Frontend Implementatie

### 1. Multi-Step Dialog Flow

**AddToKanbanDialog Component:**

**Step 1: Goal Selection**

* Gebruiker klikt + op Goal card
* Dialog opent: "Start working on this Goal?"
* Toont goal titel en beschrijving
* "Start Goal" knop → maakt UserGoalInstance aan
* "Cancel" knop

**Step 2: Objectives Selection**

* Dialog toont alle objectives van de geselecteerde goal
* Checkboxes voor elke objective
* "Select All" checkbox
* "Next" knop → maakt UserObjectiveInstances aan voor geselecteerde objectives
* "Back" knop (optioneel)

**Step 3: Key Results Selection**

* Dialog toont key results gegroepeerd per objective
* Checkboxes voor elke key result
* "Select All" per objective groep
* "Add to Kanban" knop → voegt alle items toe aan kanban:

  * UserGoalInstance
  * UserObjectiveInstances
  * Key Results (met context van UserGoalInstance)
* "Back" knop

### 2. API Calls

**goalsOkrApi.ts:**

```typescript
// UserGoalInstance
export async function startUserGoalInstance(userId: number, goalId: number): Promise<UserGoalInstanceDTO>
export async function getUserGoalInstances(userId: number): Promise<UserGoalInstanceDTO[]>
export async function getUserGoalInstancesByGoal(goalId: number): Promise<UserGoalInstanceDTO[]>
export async function completeUserGoalInstance(instanceId: number): Promise<UserGoalInstanceDTO>

// Batch kanban items
export async function addKanbanItemsBatch(request: {
  userId: number
  userGoalInstanceId: number
  objectiveInstanceIds: number[]
  keyResultIds: number[]
}): Promise<KanbanItemDTO[]>
```

### 3. Hooks

**useUserGoalInstances.ts:**

```typescript
export function useUserGoalInstances(userId: number | null)
export function useUserGoalInstancesByGoal(goalId: number | null)
export function useStartUserGoalInstance()
export function useCompleteUserGoalInstance()
export function useAddKanbanItemsBatch()
```

### 4. Component Updates

**NavGoalCircle.tsx:**

* * knop opent Step 1 van dialog
* Na bevestiging → navigeer naar Step 2

**AddToKanbanDialog.tsx:**

* Multi-step wizard component
* State management voor geselecteerde items
* API calls voor het aanmaken van instances
* Progress indicator (Step 1/3, 2/3, 3/3)

## User Experience Flow

1. **Gebruiker ziet Goal card** → Klikt + knop
2. **Dialog Step 1:** "Start working on [Goal Title]?"

   * Bevestigen → UserGoalInstance wordt aangemaakt
   * Dialog gaat naar Step 2
3. **Dialog Step 2:** "Select Objectives"

   * Toont alle objectives van de goal
   * Gebruiker selecteert (alle of selectie)
   * "Next" → UserObjectiveInstances worden aangemaakt
   * Dialog gaat naar Step 3
4. **Dialog Step 3:** "Select Key Results"

   * Toont key results gegroepeerd per objective
   * Gebruiker selecteert key results
   * "Add to Kanban" → Alle items worden toegevoegd aan kanban
   * Dialog sluit

## Voordelen

1. **Strikte DDD:** Duidelijke aggregate boundaries, userId alleen in root
2. **Aggregate Root Pattern:** Duidelijke hiërarchie en consistency boundaries
3. **Betere UX:** Gebruiker kan in één flow meerdere items selecteren
4. **Data Integriteit:** Alle entities zijn altijd gekoppeld via de hiërarchie
5. **Flexibiliteit:** Gebruiker kiest zelf welke objectives en key results relevant zijn
6. **Batch Operations:** Efficiënter dan individuele API calls

## Subscription/Enrollment Concept

**UserGoalInstance = Subscription/Enrollment**

Wanneer een gebruiker een Goal selecteert, objectives en key results kiest en bevestigt, wordt hij/zij "ingeschreven" (subscribed) in dat Goal. Dit wordt vastgelegd als een `UserGoalInstance`.

**Functionaliteit:**

* Gebruiker kan zien: "In welke Goals ben ik ingeschreven?"
* Admin/System kan zien: "Welke users zijn ingeschreven bij deze Goal?"
* Dit maakt het mogelijk om:

  * Progress tracking per user per goal
  * Community features (welke users werken aan hetzelfde goal)
  * Analytics (populaire goals, etc.)

**Query voorbeeld:**

```java
// Welke users zijn ingeschreven bij Goal X?
List<UserGoalInstance> enrollments = userGoalInstanceRepository.findByGoalId(goalId);
List<Long> userIds = enrollments.stream()
    .map(UserGoalInstance::getUserId)
    .collect(Collectors.toList());
```

## Development Changes

**Opmerking:** Dit zijn development/refactoring changes, geen breaking changes, omdat er nog geen productie data of actieve gebruikers zijn.

**Wijzigingen in Domain Entities:**

* `UserObjectiveInstance` verliest `userId` (nu via `UserGoalInstance`)
* `KeyResultProgress` verliest `userId` (nu via hiërarchie)
* `Initiative` verliest `userId` (nu via hiërarchie)
* Factory methods worden aangepast (parameters wijzigen)
* Repository methods worden aangepast (`findByUserId` verwijderen, nieuwe methods toevoegen)

**Database Schema Wijzigingen:**

* Nieuwe tabel: `user_goal_instances`
* Kolommen verwijderen: `user_id` uit `user_objective_instances`, `key_result_progress`, `initiatives`
* Kolommen toevoegen: `user_goal_instance_id` in `user_objective_instances` en `kanban_items`
* Foreign keys toevoegen voor nieuwe relaties

**Code Wijzigingen:**

* ✅ Alle queries moeten via de aggregate root lopen (strikte DDD) - **GEÏMPLEMENTEERD**
  * `InitiativeJpaRepository` gebruikt custom `@Query` queries met joins
  * Queries navigeren: `Initiative` → `UserObjectiveInstance` → `UserGoalInstance` → `userId`
* ✅ UserModuleInterface toegevoegd voor cross-module communicatie - **GEÏMPLEMENTEERD**
* Test data moet mogelijk aangepast worden (indien aanwezig)
* Kanban items die naar templates verwijzen moeten worden gemigreerd naar instance IDs (indien aanwezig)

## Query Performance Overwegingen

**Mogelijk performance impact:**

* Queries moeten nu via joins lopen: `UserGoalInstance` → `UserObjectiveInstance` → `KeyResultProgress/Initiative`
* **Oplossing:** Database indexes toevoegen op foreign keys
* **Alternative:** Eventueel database views voor read-optimized queries (maar behoud DDD structuur)

## Implementatie Status

### ✅ Geïmplementeerd:

1. **Backend:**
   * ✅ Domain entities: `UserGoalInstance` (aggregate root), `UserObjectiveInstance` (zonder userId)
   * ✅ Database migratie: `V23__Add_UserGoalInstance_aggregate.sql`
   * ✅ Repository layer: Custom `@Query` queries voor `InitiativeJpaRepository.findByUserId()` methoden
   * ✅ Application layer: `StartUserGoalInstanceCommandHandler`, `AddKanbanItemCommandHandler`
   * ✅ API layer: `GoalsOKRModuleInterface.startUserGoalInstance()`, `UserModuleInterface` (cross-module)
   * ✅ REST controller: `POST /api/v2/goals-okr/user-goal-instances`, `POST /api/v2/goals-okr/kanban-items`

### 🔄 TODO:

1. **Backend:**
   * Domain entities: `KeyResultProgress` en `Initiative` moeten nog `userId` verwijderen (als dat nog niet gebeurd is)
   * Application layer: `CompleteUserGoalInstanceCommandHandler`, batch kanban items
   * API layer: `getUserGoalInstancesForUser()`, `getUserGoalInstancesByGoal()`, `completeUserGoalInstance()`
   * REST controller: GET endpoints voor user goal instances, complete endpoint

2. **Frontend:**

   * API calls en DTOs
   * Hooks
   * Multi-step dialog component
   * Integratie in NavGoalCircle

3. **Testing:**

   * Unit tests voor domain logic
   * Integration tests voor API endpoints
   * E2E tests voor user flow
   * Performance tests voor query strategie
