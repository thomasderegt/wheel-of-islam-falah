# Use Case: Access Token Vernieuwen

## Overzicht

Deze use case beschrijft het vernieuwen van een verlopen access token met behulp van een refresh token. Gebruikt wanneer de JWT access token is verlopen maar de sessie nog actief moet blijven.

## Actoren

- **Ingelogde Gebruiker**: Gebruiker met geldige refresh token wiens access token verlopen is

## Begin State

- ✅ Gebruiker was ingelogd
- ❌ Access token is verlopen (401 Unauthorized)
- ✅ Refresh token is nog geldig

## End State

- ✅ Nieuwe access token en refresh token
- ✅ Gebruiker kan doorgaan zonder opnieuw in te loggen

## Flow

**Stap 1: Frontend detecteert 401**
```
API call faalt met 401 → auth interceptor triggert refresh
```

**Stap 2: Frontend API call**
```typescript
authApi.refreshToken({ refreshToken })
// → POST /api/v2/user/refresh
// → Body: { "refreshToken": "abc123..." }
```

**Stap 3: Backend Validatie**
```java
// RefreshTokenCommandHandler.handle()
1. ✅ Validate refresh token format
2. ✅ Find stored refresh token
3. ✅ Check niet expired
4. ✅ Check user nog actief
```

**Stap 4: Backend Processing**
```java
1. ✅ Invalidate oude refresh token
2. ✅ Generate nieuwe JWT access token
3. ✅ Generate nieuwe refresh token
4. ✅ Store nieuwe refresh token
```

**Stap 5: Response**
```json
{
  "userId": 123,
  "email": "jan@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "xyz789...",
  "expiresAt": "2024-01-01T14:00:00"
}
```

## API Endpoint

```
POST /api/v2/user/refresh
Body: { "refreshToken": "string" }
Response: 200 OK
```

## Edge Cases

- **Refresh token verlopen**: 401 → redirect naar login
- **Refresh token ingetrokken**: 401 → redirect naar login
- **Geen refresh token**: Redirect naar login

## Implementatie Status

- ✅ Backend geïmplementeerd
- ⚠️ Frontend: authApi.refreshToken aanwezig, interceptors mogelijk nog te configureren
