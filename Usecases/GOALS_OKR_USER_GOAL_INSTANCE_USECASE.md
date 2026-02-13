# Use Case: User Goal Instance Starten en Voltooien

## Overzicht

Deze use case beschrijft het starten van een goal "subscription" (UserGoalInstance) - de gebruiker kiest een goal template en start deze voor zichzelf. Dit is de aggregate root van de Goals/OKR hiërarchie.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die een goal wil oppakken

## Begin State

- ✅ Gebruiker heeft wheel/life domain/goals bekeken (zie GOALS_OKR_WHEEL_LIFEDOMAINS_USECASE)
- ❌ Gebruiker heeft nog geen UserGoalInstance voor dit goal

## End State

- ✅ UserGoalInstance aangemaakt (startedAt gezet)
- ✅ Gebruiker kan objectives selecteren onder dit goal
- ✅ Optioneel: item op kanban board

## Flow

### User Goal Instance starten

**Stap 1: Gebruiker selecteert goal**
```
/goals-okr → Life Domain → Goal → "Start deze goal"
```

**Stap 2: Frontend API call**
```typescript
POST /api/v2/goals-okr/user-goal-instances
Body: { "userId": 123, "goalId": 1 }
```

**Stap 3: Backend**
```java
// StartUserGoalInstanceCommandHandler
// - UNIQUE constraint: één instance per user per goal
// - UserGoalInstance.start(userId, goalId)
```

**Stap 4: Response**
```json
{
  "id": 1,
  "userId": 123,
  "goalId": 1,
  "startedAt": "2024-01-01T12:00:00",
  "completedAt": null
}
```

### User Goal Instance voltooien

**Stap 1: Gebruiker markeert goal als afgerond**
```
POST /api/v2/goals-okr/user-goal-instances/{id}/complete
```

**Stap 2: Backend**
```java
// CompleteUserGoalInstanceCommandHandler
// - Sets completedAt = now
```

## API Endpoints

```
POST /api/v2/goals-okr/user-goal-instances
GET /api/v2/goals-okr/users/{userId}/user-goal-instances
GET /api/v2/goals-okr/user-goal-instances/{id}
POST /api/v2/goals-okr/user-goal-instances/{id}/complete
```

## Hiërarchie

```
UserGoalInstance (aggregate root)
  └── UserObjectiveInstance
        └── UserKeyResultInstance
              └── UserInitiativeInstance
```

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ✅ Frontend: useUserGoals, CreateUserGoalDialog, OKRCart
