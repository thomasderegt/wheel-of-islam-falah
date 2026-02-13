# Use Case: Wheels en Life Domains Bekijken

## Overzicht

Deze use case beschrijft het ophalen van de beschikbare Wheels (bijv. "Success", "Falah") en Life Domains. Dit is de foundation voor goal selection - gebruikers kiezen eerst een wheel, dan een life domain, dan goals/objectives/key results.

## Actoren

- **Gebruiker**: Ingelogde of anonieme gebruiker die de goal-structuur wil verkennen

## Begin State

- ❌ Wheels/life domains nog niet geladen
- ✅ Content (wheels, life domains) bestaat in database als templates

## End State

- ✅ Lijst van wheels beschikbaar
- ✅ Per wheel: life domains met goals
- ✅ Frontend kan navigatie (circle UI) tonen

## Flow

### Wheels ophalen

**Stap 1: Frontend API call**
```typescript
// goalsOkrApi.getWheels() of useWheels()
GET /api/v2/goals-okr/wheels
// → Optioneel: Authorization (sommige content publiek)
```

**Stap 2: Response**
```json
[
  {
    "id": 1,
    "key": "SUCCESS",
    "titleNl": "Wheel of Success",
    "titleEn": "Wheel of Success"
  }
]
```

### Life Domains ophalen

**Stap 1: Frontend API call**
```typescript
GET /api/v2/goals-okr/life-domains
```

**Stap 2: Response**
```json
[
  {
    "id": 1,
    "domainKey": "SPIRITUAL",
    "titleNl": "Spiritueel",
    "titleEn": "Spiritual",
    "iconName": "heart",
    "displayOrder": 0
  }
]
```

### Goals per Life Domain

**Stap 1: Frontend API call**
```typescript
GET /api/v2/goals-okr/life-domains/{lifeDomainId}/goals
```

**Stap 2: Response**
```json
[
  {
    "id": 1,
    "lifeDomainId": 1,
    "titleNl": "Dagelijkse gebeden",
    "titleEn": "Daily prayers"
  }
]
```

## API Endpoints

```
GET /api/v2/goals-okr/wheels
GET /api/v2/goals-okr/life-domains
GET /api/v2/goals-okr/life-domains/{lifeDomainId}/goals
```

## Data hiërarchie

```
Wheel (SUCCESS, FALAH, etc.)
  └── Life Domain (Spiritueel, Fysiek, etc.)
        └── Goal (template)
              └── Objective (template)
                    └── Key Result (template)
```

## Implementatie Status

- ✅ Backend: GoalsOKRController, GetWheelsQueryHandler, GetLifeDomainsQueryHandler
- ✅ Frontend: useWheels, useLifeDomains, useGoalsByLifeDomain, NavOKRLifeDomainCircle
