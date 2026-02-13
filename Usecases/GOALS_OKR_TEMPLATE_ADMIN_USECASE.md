# Use Case: Goals/OKR Templates Beheren (Admin)

## Overzicht

Deze use case beschrijft het aanmaken en bewerken van goal/objective/key result templates door admins. Dit is de "content" kant van Goals/OKR - de gestandaardiseerde doelen die gebruikers kunnen kiezen.

## Actoren

- **Admin/Content Editor**: Beheert de goal-structuur van wheels

## Flow

### Goals

```
POST /api/v2/goals-okr/goals
Body: {
  "lifeDomainId": 1,
  "titleNl": "Dagelijkse gebeden",
  "titleEn": "Daily prayers",
  "descriptionNl": "...",
  "orderIndex": 0,
  "quarter": 1,
  "year": 2025
}

GET /api/v2/goals-okr/goals/{goalId}
PUT /api/v2/goals-okr/goals/{goalId}
GET /api/v2/goals-okr/life-domains/{lifeDomainId}/goals
```

### Objectives

```
POST /api/v2/goals-okr/objectives
Body: { "goalId", "titleNl", "titleEn", ... }
GET /api/v2/goals-okr/objectives/{id}
GET /api/v2/goals-okr/goals/{goalId}/objectives
```

### Key Results

```
POST /api/v2/goals-okr/key-results
Body: { "objectiveId", "titleNl", "targetValue", "unit", ... }
GET /api/v2/goals-okr/key-results/{id}
GET /api/v2/goals-okr/objectives/{objectiveId}/key-results
```

### Initiatives (templates/suggesties)

```
POST /api/v2/goals-okr/initiatives (template)
GET /api/v2/goals-okr/initiatives/{id}
PUT /api/v2/goals-okr/initiatives/{id}
GET /api/v2/goals-okr/key-results/{keyResultId}/initiatives
```

## API Endpoints

```
POST/GET/PUT /api/v2/goals-okr/goals
POST/GET /api/v2/goals-okr/objectives
POST/GET /api/v2/goals-okr/key-results
POST/GET/PUT /api/v2/goals-okr/initiatives
```

## Implementatie Status

- ✅ Backend geïmplementeerd (CreateGoal, CreateObjective, CreateKeyResult)
- ⚠️ Frontend: Admin UI voor template beheer mogelijk beperkt
