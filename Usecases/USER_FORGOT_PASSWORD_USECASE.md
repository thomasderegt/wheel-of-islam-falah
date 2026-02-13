# Use Case: Wachtwoord Vergeten (Aanvragen Reset)

## Overzicht

Deze use case beschrijft het aanvragen van een wachtwoord reset. Gebruiker voert email in, systeem stuurt (indien email bestaat) een reset link. Security: altijd dezelfde response om email enumeration te voorkomen.

## Actoren

- **Gebruiker**: Persoon die wachtwoord is vergeten

## Begin State

- ❌ Gebruiker kan niet inloggen (wachtwoord vergeten)
- ❌ Geen reset token

## End State

- ✅ Als email bestaat: reset email verstuurd met token
- ✅ Als email niet bestaat:zelfde success response (security)
- ✅ Gebruiker ziet bevestiging

## Flow

**Stap 1: Gebruiker klikt "Wachtwoord vergeten"**
```
/login → link "Wachtwoord vergeten?"
```

**Stap 2: Gebruiker voert email in**
```
Form: Email: "jan@example.com"
```

**Stap 3: Frontend API call**
```typescript
// authApi.forgotPassword({ email })
POST /api/v2/user/forgot-password
Body: { "email": "jan@example.com" }
```

**Stap 4: Backend Processing**
```java
// ForgotPasswordCommandHandler.handle()
1. ✅ Find user by email (als bestaat)
2. ✅ Generate reset token (UUID, tijdelijk geldig)
3. ✅ Store token met expiry (bijv. 1 uur)
4. ✅ Als user bestaat: stuur email met reset link
5. ✅ Return altijd success (geen info of email bestaat)
```

**Stap 5: Response**
```json
{
  "message": "Als dit email adres bestaat, is er een reset link verzonden."
}
```

## API Endpoint

```
POST /api/v2/user/forgot-password
Body: { "email": "string" }
Response: 200 OK (altijd)
```

## Security

- **Email enumeration prevention**: Altijd dezelfde response, nooit onthullen of email bestaat
- **Token expiry**: Reset token verloopt (bijv. 1 uur)
- **Rate limiting**: Aanbevolen om brute force te voorkomen

## Implementatie Status

- ✅ Backend geïmplementeerd
- ⚠️ Email verzending: TODO (handler maakt token, email service mogelijk nog te koppelen)
