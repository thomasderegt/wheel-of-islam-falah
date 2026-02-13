# Use Case: Gebruiker Registreren

## Overzicht

Deze use case beschrijft het registreren van een nieuwe gebruiker in het systeem.

## Actoren

- **Nieuwe Gebruiker**: Persoon die een account wil aanmaken

## Begin State

- ❌ Gebruiker heeft nog geen account
- ❌ Gebruiker is niet ingelogd

## End State

- ✅ Gebruiker heeft account met email en wachtwoord
- ✅ Gebruiker kan inloggen (zie USER_LOGIN_USECASE.md)
- ✅ Database: `users` table met nieuw record

## Flow

**Stap 1: Gebruiker navigeert naar registratie pagina**
```
/register of /user/settings (als onderdeel van onboarding)
```

**Stap 2: Gebruiker vult formulier in**
```
Form:
- Email: "jan@example.com"
- Password: "********"
- (eventueel: profileName)
```

**Stap 3: Frontend API call**
```typescript
authApi.register({ email, password })
// → POST /api/v2/user/register
// → Body: { "email": "jan@example.com", "password": "********" }
```

**Stap 4: Backend Validatie**
```java
// UserController.register()
1. ✅ @Valid: email format, not blank
2. ✅ @Valid: password (min length, etc.)
3. ✅ RegisterUserCommandHandler: check email niet al in gebruik
```

**Stap 5: Backend Processing**
```java
// RegisterUserCommandHandler.handle()
1. ✅ Validate email niet al geregistreerd
2. ✅ Hash password (BCrypt)
3. ✅ Create User entity
4. ✅ Save to database
5. ✅ Audit logging (clientIp, userAgent)
```

**Stap 6: Response**
```json
{
  "id": 123,
  "email": "jan@example.com",
  "profileName": "Jan",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T12:00:00"
}
```
*Note: Geen token in response - gebruiker moet apart inloggen*

## API Endpoint

```
POST /api/v2/user/register
Body: {
  "email": "string",
  "password": "string"
}
Response: 201 Created
```

## Edge Cases

- **Email al in gebruik**: Error "Email is al geregistreerd"
- **Ongeldig email format**: 400 Bad Request
- **Zwak wachtwoord**: 400 Bad Request (validatie rules)

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ✅ Frontend: RegisterForm, authApi.register
