# Use Case: User Objective en Key Result Instances

## Overzicht

Deze use case beschrijft het starten en voltooien van UserObjectiveInstance en UserKeyResultInstance. Deze zitten onder een UserGoalInstance in de hiërarchie.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die objectives/key results oppakt

## Flow

### User Objective Instance

**Starten:**
```
POST /api/v2/goals-okr/user-objective-instances
Body: { "userId": 123, "userGoalInstanceId": 1, "objectiveId": 5 }
```

**Voltooien:**
```
POST /api/v2/goals-okr/user-objective-instances/{id}/complete
```

### User Key Result Instance

**Starten:**
```
POST /api/v2/goals-okr/user-key-result-instances
Body: { "userId": 123, "userObjectiveInstanceId": 2, "keyResultId": 10 }
```

**Voltooien:**
```
POST /api/v2/goals-okr/user-key-result-instances/{id}/complete
```

## API Endpoints

```
POST /api/v2/goals-okr/user-objective-instances
GET /api/v2/goals-okr/user-goal-instances/{id}/user-objective-instances
POST /api/v2/goals-okr/user-objective-instances/{id}/complete

POST /api/v2/goals-okr/user-key-result-instances
GET /api/v2/goals-okr/user-objective-instances/{id}/user-key-result-instances
POST /api/v2/goals-okr/user-key-result-instances/{id}/complete
```

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ✅ Frontend: useUserObjectiveInstances, useUserKeyResults, NavObjective, NavKeyResult
