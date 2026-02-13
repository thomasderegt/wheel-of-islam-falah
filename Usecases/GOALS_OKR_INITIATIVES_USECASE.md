# Use Case: Initiatives Beheren

## Overzicht

Deze use case beschrijft het beheren van initiatives - concrete acties onder een Key Result. Er zijn initiative templates (suggesties) en user-created initiatives.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die initiatives toevoegt of voltooit

## Flow

### Initiative template starten (UserInitiativeInstance)

**Stap 1: Gebruiker kiest initiative template**
```
POST /api/v2/goals-okr/user-initiative-instances
Body: { "userId": 123, "userKeyResultInstanceId": 3, "initiativeId": 7 }
```

### Eigen initiative aanmaken

**Stap 1: Frontend API call**
```typescript
POST /api/v2/goals-okr/initiatives
Body: {
  "keyResultId": 10,
  "userKeyResultInstanceId": 3,
  "title": "Dagelijks 5 minuten reflectie",
  "description": "..."
}
```

### Initiative bijwerken / voltooien

```
PUT /api/v2/goals-okr/initiatives/{id}
POST /api/v2/goals-okr/initiatives/{id}/complete
```

### Key Result progress bijwerken

```
GET /api/v2/goals-okr/key-result-progress?userId=123&keyResultId=10&userKeyResultInstanceId=3
PUT /api/v2/goals-okr/key-result-progress
Body: { "userId", "keyResultId", "userKeyResultInstanceId", "currentValue" }
```

## API Endpoints

```
POST /api/v2/goals-okr/user-initiative-instances
POST /api/v2/goals-okr/initiatives
PUT /api/v2/goals-okr/initiatives/{id}
POST /api/v2/goals-okr/initiatives/{id}/complete
GET /api/v2/goals-okr/key-results/{keyResultId}/initiatives
GET /api/v2/goals-okr/user-key-result-instances/{id}/initiatives
PUT /api/v2/goals-okr/key-result-progress
```

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ✅ Frontend: useCreateInitiative, InitiativeList, InitiativeSuggestions, CreateInitiativeDialog
