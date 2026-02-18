# Use Case: Gebruiker Surft door OKR Templates

## Overzicht

Deze use case beschrijft het **read-only** verkennen van de OKR template-structuur. De gebruiker navigeert door wheels, life domains en objectives zonder iets te selecteren of te starten. Geen "Add to Kanban" of "Start" in deze flow.

## Actoren

- **Gebruiker**: Ingelogde of anonieme gebruiker die de OKR-structuur wil verkennen

## Begin State

- ❌ Templates nog niet geladen
- ✅ Wheels, life domains, objectives en key results bestaan in de database

## End State

- ✅ Gebruiker heeft de template-hiërarchie bekeken
- ✅ Geen wijzigingen aan data (geen instances, geen kanban items)

## Data Hiërarchie

```
Wheel (WHEEL_OF_LIFE, WHEEL_OF_WORK, etc.)
  └── Life Domain (Spiritueel, Gezondheid, etc.)
        └── Objective (template)
              └── Key Result (template)
                    └── Initiative (template)
```

## Flow

### Stap 1: Wheels ophalen

```typescript
GET /api/v2/goals-okr/wheels
// useWheels()
```

**Response:** Lijst van wheels met id, wheelKey, nameNl, nameEn.

### Stap 2: Life Domains ophalen

```typescript
GET /api/v2/goals-okr/life-domains
// useLifeDomains()
```

**Response:** Lijst van life domains met id, domainKey, titleNl, titleEn, iconName, displayOrder, wheelId.

### Stap 3: Objectives per Life Domain ophalen

```typescript
GET /api/v2/goals-okr/life-domains/{lifeDomainId}/objectives
// useObjectivesByLifeDomain(lifeDomainId)
```

**Response:** Lijst van objectives (templates) met id, lifeDomainId, titleNl, titleEn, descriptionNl, descriptionEn, orderIndex.

### Stap 4: Objective detail bekijken (optioneel)

```typescript
GET /api/v2/goals-okr/objectives/{objectiveId}
// getObjective(objectiveId)
```

### Stap 5: Key Results van Objective bekijken (optioneel)

```typescript
GET /api/v2/goals-okr/objectives/{objectiveId}/key-results
// getKeyResultsByObjective(objectiveId)
```

## UI Routes

| Route | Component | Beschrijving |
|-------|------------|--------------|
| `/goals-okr` | NavOKRLifeDomainCircle | Wheel + Life Domain circle |
| `/goals-okr/life-domains/{id}` | NavGoalCircle | Grid met objectives |
| `/goals-okr/objectives/{id}` | OKRObjectiveDetailPage | Objective + key results detail |

## API Endpoints (read-only)

```
GET /api/v2/goals-okr/wheels
GET /api/v2/goals-okr/life-domains
GET /api/v2/goals-okr/life-domains/{lifeDomainId}/objectives
GET /api/v2/goals-okr/objectives/{objectiveId}
GET /api/v2/goals-okr/objectives/{objectiveId}/key-results
```

## Gerelateerde Use Cases

- **GOALS_OKR_SELECT_TEMPLATE_USECASE** – Gebruiker selecteert template en start instance (volgende stap na browsen)
- **GOALS_OKR_ADMIN_CREATE_TEMPLATE_USECASE** – Admin creëert de templates die hier worden getoond

## Implementatie Status

- ✅ Backend: GetWheelsQueryHandler, GetLifeDomainsQueryHandler, GetObjectivesByLifeDomainQueryHandler, GetObjectiveQueryHandler, GetKeyResultsByObjectiveQueryHandler
- ✅ Frontend: useWheels, useLifeDomains, useObjectivesByLifeDomain, NavOKRLifeDomainCircle, NavGoalCircle, objectives/[id]/page
