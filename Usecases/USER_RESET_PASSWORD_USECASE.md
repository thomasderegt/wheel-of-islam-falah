# Use Case: Wachtwoord Resetten (Met Token)

## Overzicht

Deze use case beschrijft het daadwerkelijk resetten van het wachtwoord met de token uit de "wachtwoord vergeten" email. Volgt op USER_FORGOT_PASSWORD_USECASE.

## Actoren

- **Gebruiker**: Persoon die op reset link in email heeft geklikt

## Begin State

- ✅ Gebruiker heeft reset email ontvangen (zie USER_FORGOT_PASSWORD_USECASE)
- ✅ Gebruiker heeft geldige reset token (in URL)
- ❌ Nieuw wachtwoord nog niet gezet

## End State

- ✅ Wachtwoord is gewijzigd
- ✅ Reset token is ongeldig gemaakt (one-time use)
- ✅ Gebruiker kan inloggen met nieuw wachtwoord

## Flow

**Stap 1: Gebruiker klikt link in email**
```
/reset-password?token=abc123...
```

**Stap 2: Gebruiker voert nieuw wachtwoord in**
```
Form:
- New Password: "********"
- Confirm Password: "********"
```

**Stap 3: Frontend API call**
```typescript
// authApi.resetPassword({ token, newPassword })
POST /api/v2/user/reset-password
Body: {
  "token": "abc123...",
  "newPassword": "********"
}
```

**Stap 4: Backend Validatie**
```java
// ResetPasswordCommandHandler.handle()
1. ✅ Find reset token
2. ✅ Validate token niet expired
3. ✅ Validate token niet al gebruikt
4. ✅ Validate new password (strength)
```

**Stap 5: Backend Processing**
```java
1. ✅ Hash nieuw wachtwoord
2. ✅ Update user password
3. ✅ Invalidate/delete reset token
```

**Stap 6: Response**
```json
{
  "message": "Wachtwoord is succesvol gewijzigd."
}
```

**Stap 7: Frontend**
```
Redirect naar /login
Gebruiker kan nu inloggen met nieuw wachtwoord
```

## API Endpoint

```
POST /api/v2/user/reset-password
Body: {
  "token": "string",
  "newPassword": "string"
}
Response: 200 OK
```

## Edge Cases

- **Token verlopen**: Error "Reset link is verlopen"
- **Token al gebruikt**: Error "Reset link is al gebruikt"
- **Ongeldige token**: Error "Ongeldige reset link"

## Implementatie Status

- ✅ Backend geïmplementeerd
- ⚠️ Frontend reset-password pagina mogelijk nog te implementeren
