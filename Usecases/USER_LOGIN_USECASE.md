# Use Case: Gebruiker Inloggen

## Overzicht

Deze use case beschrijft het inloggen van een bestaande gebruiker en het verkrijgen van JWT tokens.

## Actoren

- **Gebruiker**: Persoon met bestaand account die wil inloggen

## Begin State

- ✅ Gebruiker heeft account
- ❌ Gebruiker is niet ingelogd (geen geldige token)

## End State

- ✅ Gebruiker heeft access token en refresh token
- ✅ Frontend slaat tokens op (localStorage/authStore)
- ✅ Gebruiker kan geauthenticeerde requests doen

## Flow

**Stap 1: Gebruiker navigeert naar login pagina**
```
/login
```

**Stap 2: Gebruiker vult credentials in**
```
Form:
- Email: "jan@example.com"
- Password: "********"
```

**Stap 3: Frontend API call**
```typescript
authApi.login({ email, password })
// → POST /api/v2/user/login
// → Body: { "email": "jan@example.com", "password": "********" }
```

**Stap 4: Backend Validatie**
```java
// LoginCommandHandler.handle()
1. ✅ Find user by email
2. ✅ Verify password (BCrypt.matches)
3. ✅ Check user is ACTIVE
```

**Stap 5: Backend Processing**
```java
// LoginCommandHandler
1. ✅ Generate JWT access token
2. ✅ Generate refresh token
3. ✅ Store refresh token (voor validatie)
4. ✅ Audit logging
```

**Stap 6: Response**
```json
{
  "userId": 123,
  "email": "jan@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "abc123...",
  "expiresAt": "2024-01-01T13:00:00"
}
```

**Stap 7: Frontend**
```
- Sla token en refreshToken op in authStore
- Redirect naar dashboard of vorige pagina
- Voeg Authorization header toe aan volgende requests
```

## API Endpoint

```
POST /api/v2/user/login
Body: {
  "email": "string",
  "password": "string"
}
Response: 200 OK
```

## Edge Cases

- **Verkeerde credentials**: Error "Ongeldige email of wachtwoord"
- **Inactieve gebruiker**: Error (account gedeactiveerd)
- **Rate limiting**: (indien geïmplementeerd)

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ✅ Frontend: LoginForm, authApi.login, authStore
