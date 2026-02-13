# Use Case: Gebruikersprofiel Bekijken

## Overzicht

Deze use case beschrijft het ophalen van gebruikersgegevens (profiel) voor weergave. Gebruikt voor profielpagina, header met gebruikersnaam, etc.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die eigen profiel bekijkt
- **Andere gebruiker**: (indien profielen publiek/shareable zijn)

## Begin State

- ✅ Gebruiker is ingelogd (voor eigen profiel)
- ❌ Profielgegevens nog niet geladen

## End State

- ✅ Profielgegevens beschikbaar voor weergave
- ✅ Email, profileName, status, createdAt zichtbaar

## Flow

**Stap 1: Frontend heeft userId nodig**
```
Uit authStore na login, of uit route /user/{id}
```

**Stap 2: Frontend API call**
```typescript
authApi.getCurrentUser(userId)
// → GET /api/v2/user/{id}
// → Authorization: Bearer {token}
```

**Stap 3: Backend Processing**
```java
// GetUserQueryHandler.handle()
1. ✅ Find user by id
2. ✅ Return Optional<UserResult>
```

**Stap 4: Response**
```json
{
  "id": 123,
  "email": "jan@example.com",
  "profileName": "Jan",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T12:00:00",
  "updatedAt": "2024-01-01T12:00:00"
}
```

## API Endpoint

```
GET /api/v2/user/{id}
Authorization: Bearer {token}
Response: 200 OK of 404 Not Found
```

## Security

- **Authorization**: Controleer of gebruiker eigen profiel bekijkt of rechten heeft
- **Geen gevoelige data**: Wachtwoord/hash nooit in response

## Implementatie Status

- ✅ Backend geïmplementeerd
- ✅ Frontend: authApi.getCurrentUser
