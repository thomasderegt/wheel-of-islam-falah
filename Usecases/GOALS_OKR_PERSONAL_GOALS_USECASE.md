# Use Case: Personal Goals en Objectives Aanmaken

## Overzicht

Deze use case beschrijft het aanmaken van volledig persoonlijke goals en objectives - niet gebaseerd op templates. Creëert Goal/Objective template + UserGoalInstance/UserObjectiveInstance + Kanban item in één actie.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die eigen doelen wil definiëren

## Flow

### Personal Goal aanmaken

**Stap 1: Gebruiker vult formulier in**
```
Form: lifeDomainId, title, description
```

**Stap 2: Frontend API call**
```typescript
POST /api/v2/goals-okr/users/{userId}/personal-goals
Body: {
  "lifeDomainId": 1,
  "title": "Mijn persoonlijk doel",
  "description": "..."
}
```

**Stap 3: Backend (CreatePersonalGoalCommandHandler)**
```
1. Create Goal template
2. Start UserGoalInstance
3. Add Kanban item (TODO kolom)
4. Return UserGoalInstanceResult
```

### Personal Objective aanmaken

**Stap 1: Onder bestaande UserGoalInstance**
```typescript
POST /api/v2/goals-okr/users/{userId}/personal-objectives
Body: {
  "userGoalInstanceId": 1,
  "title": "Mijn persoonlijke objective",
  "description": "..."
}
```

**Stap 2: Backend**
```
1. Create Objective template (onder goal van userGoalInstance)
2. Start UserObjectiveInstance
3. Add Kanban item
4. Return UserObjectiveInstanceResult
```

## API Endpoints

```
POST /api/v2/goals-okr/users/{userId}/personal-goals
POST /api/v2/goals-okr/users/{userId}/personal-objectives
```

## Verschil met template-based flow

| Template-based | Personal |
|----------------|----------|
| Kiest bestaande Goal uit wheel | Maakt nieuw Goal template |
| StartUserGoalInstance | CreatePersonalGoal = Goal + Instance + Kanban |
| Voor gestandaardiseerde doelen | Voor vrije invulling |

## Implementatie Status

- ✅ Backend geïmplementeerd
- ⚠️ Frontend: CreatePersonalObjectiveDialog aanwezig, personal goals UI mogelijk beperkt
