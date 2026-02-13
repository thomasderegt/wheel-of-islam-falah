# Use Case: Wachtwoord Wijzigen (Ingelogd)

## Overzicht

Deze use case beschrijft het wijzigen van het wachtwoord door een ingelogde gebruiker. Vereist het huidige wachtwoord voor bevestiging.

## Actoren

- **Ingelogde Gebruiker**: Gebruiker die zijn wachtwoord wil wijzigen vanuit account settings

## Begin State

- ✅ Gebruiker is ingelogd
- ✅ Gebruiker kent huidige wachtwoord

## End State

- ✅ Wachtwoord is gewijzigd
- ✅ Gebruiker moet met nieuw wachtwoord inloggen (bij volgende sessie)

## Flow

**Stap 1: Gebruiker navigeert naar instellingen**
```
/user/settings of /settings
```

**Stap 2: Gebruiker vult wachtwoord formulier in**
```
Form:
- Huidige wachtwoord: "********"
- Nieuw wachtwoord: "********"
- Bevestig nieuw wachtwoord: "********"
```

**Stap 3: Frontend API call**
```typescript
// authApi.changePassword({ oldPassword, newPassword })
POST /api/v2/user/change-password
Authorization: Bearer {token}
X-User-Id: {userId}  // Of uit JWT
Body: {
  "oldPassword": "********",
  "newPassword": "********"
}
```

**Stap 4: Backend Validatie**
```java
// ChangePasswordCommandHandler.handle()
1. ✅ Check user geauthenticeerd (userId)
2. ✅ Verify old password correct (BCrypt.matches)
3. ✅ Validate new password (strength, niet gelijk aan old)
```

**Stap 5: Backend Processing**
```java
1. ✅ Hash nieuw wachtwoord
2. ✅ Update user in database
```

**Stap 6: Response**
```json
{
  "message": "Wachtwoord is succesvol gewijzigd."
}
```

## API Endpoint

```
POST /api/v2/user/change-password
Authorization: Bearer {token}
Body: {
  "oldPassword": "string",
  "newPassword": "string"
}
Response: 200 OK
```

## Edge Cases

- **Verkeerd huidige wachtwoord**: Error "Huidige wachtwoord is onjuist"
- **Nieuw = oud**: Error "Nieuw wachtwoord moet anders zijn"
- **Niet ingelogd**: 401 Unauthorized

## Implementatie Status

- ✅ Backend geïmplementeerd
- ⚠️ Frontend: change password UI in settings mogelijk nog te implementeren
