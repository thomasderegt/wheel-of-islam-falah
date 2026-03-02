# OWASP ASVS Level 1 – Analyse

**Project:** Wheel of Islam Falah  
**Datum:** februari 2026  
**Scope:** Backend (Java/Spring), referentie naar frontend waar relevant  

Level 1 (Opportunistic/Basic) dekt de eerste verdedigingslaag tegen veelvoorkomende kwetsbaarheden. Deze analyse toetst de huidige stand tegen ASVS Level 1-vereisten.

---

## Executive summary

| Categorie              | Status      | Opmerking |
|------------------------|------------|------------|
| **V1 Architectuur**    | ✅ Voldoende | Modulair, auth endpoints expliciet |
| **V2 Authenticatie**   | ✅ Voldoende | BCrypt, lockout, rate limit, generieke fout |
| **V3 Session**         | ✅ Voldoende | Stateless JWT, expiry, refresh, revocation |
| **V4 Access control**  | ✅ Voldoende | Deny by default, userId vs JWT gecontroleerd |
| **V5 Validatie**       | ✅ Voldoende | @Valid, @Size, @Email; JPA parameterized |
| **V6 Cryptografie**    | ✅ Voldoende | BCrypt, JWT secret uit config |
| **V7 Error / logging**  | ✅ Voldoende | Geen stack traces; geen e.getMessage() in API (allowlist auth, rest generiek) |
| **V8 Data protection**  | ✅ Basis     | Wachtwoorden gehashed, tokens gehashed |
| **V9 Communicatie**    | ✅ Voldoende | HTTPS in productie; CORS beperkt |
| **V10 API / config**    | ✅ Voldoende | Security headers; JWT secret via config |

**Conclusie:** Level 1 is in grote lijnen gehaald. Aanbevolen verbetering: geen `e.getMessage()` in API-responses (alleen generieke of veilige boodschappen).

---

## V1 – Architectuur

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| Beveiligingsvereisten / scheiding van verantwoordelijkheden | ✅ | Use cases / docs; modules user, content, learning, goals-okr |
| Alleen benodigde endpoints publiek | ✅ | `SecurityConfig`: alleen login, register, refresh, forgot/reset-password, team invitations + OPTIONS zijn `permitAll()`; rest `authenticated()` |
| Defense in depth | ✅ | Security headers filter, JWT filter, CORS, rate limiting op auth |

---

## V2 – Authenticatie

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| Wachtwoorden niet in plaintext opgeslagen | ✅ | `BcryptPasswordHasher`, `Credential` met `password_hash` |
| Sterke hashing (bcrypt/argon2) | ✅ | BCrypt strength 10 (`BcryptPasswordHasher`) |
| Beperking credential stuffing | ✅ | Generieke fout "Ongeldige email of wachtwoord" |
| Account lockout na mislukte pogingen | ✅ | `AccountLockoutService` |
| Rate limiting op auth endpoints | ✅ | `RateLimitingService` op login (5/15 min) en register (3/uur), 429 + Retry-After |
| Wachtwoordbeleid (lengte) | ✅ | `@Size(min=8, max=128)` op register/change/reset password |
| Geen wachtwoord in logs | ✅ | Geen logging van wachtwoordvelden |

---

## V3 – Session management

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| Stateless of veilige server-side sessies | ✅ | Stateless JWT |
| Token/session expiry | ✅ | JWT expiration (config); refresh token 7 dagen |
| Logout / invalidation | ✅ | Refresh token revocation bij logout |
| Geen sessie-fixation | ✅ | Nieuwe token bij login |

---

## V4 – Access control

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| Deny by default | ✅ | `anyRequest().authenticated()` |
| Autorisation checks op resources | ✅ | `userId` uit path/body gecontroleerd tegen `@AuthenticationPrincipal` (o.a. UserController, TeamController, CustomObjectivesController, GoalsOKRController) |
| Kanban/objectives ownership | ✅ | Handlers/controllers checken `createdByUserId` / team membership waar nodig |

---

## V5 – Validatie en sanitization

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| Inputvalidatie op alle relevante input | ✅ | `@Valid`, `@NotNull`, `@NotBlank`, `@Email`, `@Size` op DTOs |
| Geen SQL injection | ✅ | JPA/Hibernate met named parameters in `@Query`; geen string-concatenatie in queries |
| Whitelist waar van toepassing | ✅ | Enums / beperkte waarden (bijv. team roles) |

---

## V6 – Cryptografie

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| Sterke algoritmes voor wachtwoordhashing | ✅ | BCrypt |
| Geheimen niet in code | ✅ | JWT secret via `@Value("${jwt.secret:...}")` (default alleen voor dev) |
| Tokens (refresh/reset) niet plaintext opgeslagen | ✅ | Hash opgeslagen (`RefreshToken`, `PasswordResetToken`) |

---

## V7 – Error handling en logging

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| Geen stack traces naar client | ✅ | Geen `printStackTrace`; generieke 500-meldingen |
| Geen gevoelige info in foutresponses | ✅ | UserController: allowlist van veilige auth-berichten + generiek fallback; overige controllers: vaste generieke melding "De actie kon niet worden uitgevoerd. Controleer de invoer." |
| Access denied afgehandeld | ✅ | `AccessDeniedHandler` retourneert vaste JSON "Access denied" |

---

## V8 – Data protection

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| Gevoelige data (wachtwoorden, tokens) niet in logs | ✅ | Geen logging van passwords; tokens gehashed opgeslagen |
| Persoonlijke data alleen voor geautoriseerde gebruikers | ✅ | Controle op userId / ownership in controllers en handlers |

---

## V9 – Communicatie

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| HTTPS in productie | ✅ | Aanname deployment (bijv. Vercel/Railway); HSTS header bij HTTPS (`SecurityHeadersFilter`) |
| CORS beperkt | ✅ | `SecurityConfig`: vaste allowed origins (localhost + productie-frontend) |

---

## V10 – API en configuratie

| Vereiste (L1) | Status | Bewijs |
|---------------|--------|--------|
| Security headers | ✅ | `SecurityHeadersFilter`: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Content-Security-Policy, HSTS (bij HTTPS) |
| Geen default credentials in productie | ✅ | JWT secret uit config/env; default alleen in code voor dev |
| Foutafhandeling API | ✅ | Consistente JSON-error bodies; 401/403/429 waar van toepassing |

---

## Aanbevelingen voor Level 1

1. ~~**e.getMessage() in API-responses (V7)**~~ **Uitgevoerd.**  
   UserController gebruikt `safeErrorMessage(e)`: allowlist van veilige auth-berichten (o.a. "Ongeldige email of wachtwoord", "Account is niet actief") + berichten die beginnen met "Account is geblokkeerd."; overige → generieke melding. Alle andere controllers retourneren alleen de vaste tekst "De actie kon niet worden uitgevoerd. Controleer de invoer." bij 400.

2. **JWT default secret**  
   Zorgen dat in productie geen default fallback wordt gebruikt (`jwt.secret` verplicht via env/config).

3. **Documentatie**  
   Korte security-overzichtsdocument (bijv. in `docs/`) bijwerken met: welke endpoints publiek zijn, rate limits, en dat HTTPS en security headers worden afgedwongen.

---

## Referenties

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [ASVS Level 1 (readthedocs)](https://owasp-aasvs.readthedocs.io/en/latest/level1.html)
- Project: `backend/application/src/main/java/com/woi/config/SecurityConfig.java`, `SecurityHeadersFilter.java`, `JwtAuthenticationFilter.java`; user-module auth en rate limiting.
