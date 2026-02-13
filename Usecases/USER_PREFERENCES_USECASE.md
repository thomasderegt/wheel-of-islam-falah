# Use Case: Gebruikersvoorkeuren Beheren

## Overzicht

Deze use case beschrijft het ophalen en bijwerken van gebruikersvoorkeuren. Voorkeuren bepalen o.a. default context voor Goals/OKR (SUCCESS wheel), content weergave, etc.

## Actoren

- **Ingelogde Gebruiker**: Gebruiker die zijn voorkeuren wil aanpassen

## Begin State

- ✅ Gebruiker is ingelogd
- ❌ Voorkeuren nog niet geladen of willen wijzigen

## End State

- ✅ Voorkeuren opgehaald of bijgewerkt
- ✅ Default context (bijv. defaultGoalsOkrContext) is ingesteld

## Flow

### Ophalen voorkeuren

**Stap 1: Frontend API call**
```typescript
authApi.getUserPreferences(userId)
// → GET /api/v2/user/{id}/preferences
// → Authorization: Bearer {token}
```

**Stap 2: Backend**
```java
// GetUserPreferencesQueryHandler
// Creëert default preferences als ze niet bestaan
```

**Stap 3: Response**
```json
{
  "id": 1,
  "userId": 123,
  "defaultContext": "SUCCESS",
  "defaultGoalsOkrContext": "NONE",
  "createdAt": "2024-01-01T12:00:00",
  "updatedAt": "2024-01-01T12:00:00"
}
```

### Bijwerken voorkeuren

**Stap 1: Gebruiker wijzigt instellingen**
```
/user/settings → Voorkeuren sectie
```

**Stap 2: Frontend API call**
```typescript
authApi.updateUserPreferences(userId, { defaultGoalsOkrContext: "PERSONAL" })
// → PUT /api/v2/user/{id}/preferences
// → Body: { "defaultGoalsOkrContext": "PERSONAL" }
```

**Stap 3: Backend**
```java
// UpdateUserPreferencesCommandHandler
// Context is altijd SUCCESS (Content Context)
// defaultGoalsOkrContext: NONE, PERSONAL, TEAM, etc.
```

## API Endpoints

```
GET /api/v2/user/{id}/preferences
PUT /api/v2/user/{id}/preferences
Body: { "defaultGoalsOkrContext": "string" }
```

## Implementatie Status

- ✅ Backend geïmplementeerd
- ✅ Frontend: useUserPreferences hook, settings page
