# OWASP ASVS Level 2 – Gap Analyse

**Project:** Wheel of Islam Falah  
**Datum:** 20 februari 2025  
**Scope:** Backend (Java/Spring), Frontend (Next.js/React)

ASVS Level 2 (Standard) is bedoeld voor applicaties met gevoelige data. Deze analyse vergelijkt de huidige implementatie met de OWASP ASVS 5.0 vereisten.

---

## Executive Summary

| Categorie | Status | Score | Prioriteit |
|-----------|--------|-------|------------|
| **1. Architectuur** | Gedeeltelijk | 60% | Hoog |
| **2. Authenticatie** | Redelijk | 75% | Medium |
| **3. Session Management** | Redelijk | 70% | Medium |
| **4. Access Control** | **Kritiek** | 40% | **Kritiek** |
| **5. Validatie & Sanitization** | Redelijk | 65% | Medium |
| **6. Cryptografie** | Redelijk | 70% | Medium |
| **7. Error Handling & Logging** | **Gap** | 45% | **Kritiek** |
| **8. Data Protection** | Gedeeltelijk | 55% | Hoog |
| **9. Communicatie** | Gedeeltelijk | 60% | Hoog |
| **10. API Security** | **Gap** | 50% | **Kritiek** |

---

## 1. Architectuur (V1)

### ✅ Aanwezig
- **V1.1** – Security requirements zijn gedocumenteerd (via use cases)
- **V1.2** – Applicatie is opgesplitst in modules (user, content, learning, goals-okr)
- **V1.4** – Sensitive data in transit (HTTPS via deployment)

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V1.3 | Alle componenten zijn up-to-date | Geen dependency scanning | Voeg OWASP Dependency-Check of Snyk toe in CI |
| V1.5 | Security principles (minimal privilege, defense in depth) | Beperkte defense in depth | Implementeer API gateway, rate limiting op alle endpoints |


---

## 2. Authenticatie (V2)

### ✅ Aanwezig
- **V2.1** – Credential stuffing bescherming: generieke foutmelding ("Ongeldige email of wachtwoord")
- **V2.2** – Account lockout na mislukte pogingen (`AccountLockoutService`)
- **V2.3** – Password policy: min 8, max 128 tekens (`PasswordValidator`, `RegisterRequestDTO`)
- **V2.4** – Password hashing met BCrypt (`PasswordHasher`)
- **V2.5** – Geen password in logs
- **V2.7** – Password reset flow met token

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V2.6 | Password complexity | Alleen lengte, geen complexiteit (letters, cijfers, symbolen) | Voeg `@Pattern` toe voor complexiteit (bijv. min 1 hoofdletter, 1 cijfer) |
| V2.8 | Rate limiting op auth endpoints | `RateLimitingService` bestaat maar wordt **niet gebruikt** in UserController | Injecteer en gebruik `RateLimitingService` in login/register endpoints |
| V2.9 | Secure password reset | Reset token expiry moet verifieerbaar zijn | Controleer reset token expiry in `ResetPasswordCommandHandler` |
| V2.10 | MFA (Multi-Factor Authentication) | Niet geïmplementeerd | Voor Level 2: optioneel; voor hogere compliance: overwegen |


---

## 3. Session Management (V3)

### ✅ Aanwezig
- **V3.1** – Stateless JWT, geen server-side sessies
- **V3.2** – JWT met expiration (15 min default, 24h in application.properties)
- **V3.3** – Refresh token met expiration (7 dagen)
- **V3.4** – Refresh token revocation bij logout

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V3.5 | Token storage | Tokens in **localStorage** | XSS-risico: overweeg httpOnly cookies voor tokens |
| V3.6 | Token binding | Geen binding aan IP/User-Agent | Overweeg token binding voor extra beveiliging |
| V3.7 | Token rotation | Refresh token wordt niet geroteerd | Implementeer refresh token rotation (nieuwe token bij refresh) |


---

## 4. Access Control (V4) – **KRITIEK**

### ✅ Aanwezig
- **V4.1** – Deny by default: JWT filter vereist token voor auth
- **V4.2** – Enkele endpoints: `GetTeamKanbanItemsHandler` checkt team membership
- **V4.2** – Enkele endpoints: `GetObjective`/`DeleteObjective` checken `createdByUserId` vs `userId`

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V4.1 | **Deny by default** | **`anyRequest().permitAll()`** – alle endpoints zijn publiek! | **Kritiek:** Wijzig naar `.authenticated()` voor alle endpoints behalve public |
| V4.2 | **Authorization** | User ID uit request body wordt niet gevalideerd tegen JWT | **Kritiek:** `UpdateKeyResultProgressRequest.userId`, `AddKanbanItemRequest.userId` – aanvaller kan willekeurige userId sturen |
| V4.2 | **Authorization** | `GET /users/{userId}/kanban-items` – geen check of userId = authenticated user | **Kritiek:** Idor (Insecure Direct Object Reference) |
| V4.2 | **Authorization** | `GET /kanban-items/{itemId}` – geen ownership check | **Kritiek:** Kanban items van andere user kunnen worden opgehaald |
| V4.4 | Admin functies | Geen admin/role-based access control | Implementeer rol-gebaseerde toegang voor admin endpoints |
| V4.5 | Content ownership | Content-module: `submittedBy` in request body – niet gevalideerd tegen JWT | Valideer alle user IDs tegen JWT principal |


---

## 5. Validatie & Sanitization (V5)

### ✅ Aanwezig
- **V5.1** – Input validation via `@Valid`, `@NotNull`, `@NotBlank`, `@Email`, `@Size`, `@Min`, `@Pattern`
- **V5.2** – Whitelist voor enum/role (`@Pattern(regexp = "OWNER|ADMIN|MEMBER")`)
- **V5.4** – SQL injection: JPA met parameterized queries

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V5.1 | **Max length** | Veel DTOs missen `@Size(max=...)` op string velden | Voeg `@Size(max=...)` toe op alle string inputs (title, description, etc.) |
| V5.5 | Output encoding | Geen expliciete output encoding voor XSS | Next.js escaped standaard; controleer user-generated content |
| V5.6 | Mass assignment | Geen expliciete whitelist van request velden | Overweeg `@JsonView` of restrictieve DTOs |


---

## 6. Cryptografie (V6)

### ✅ Aanwezig
- **V6.1** – BCrypt voor password hashing
- **V6.2** – JWT met HMAC-SHA256
- **V6.3** – JWT secret configuratie (min 32 chars)

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V6.1 | **Default secret** | `application.properties`: default secret in codebase | **Kritiek:** Gebruik altijd env var `jwt.secret` in productie; fail als niet gezet |
| V6.6 | Refresh token hashing | SHA-256 voor token lookup (geen salt) | Acceptabel voor lookup; overweeg HMAC voor extra beveiliging |


---

## 7. Error Handling & Logging (V7) – **KRITIEK**

### ✅ Aanwezig
- **V7.1** – Audit logging voor login/register (`AuditLogService`)
- **V7.2** – Geen credentials in logs

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V7.4 | **Geen stack traces** | **`e.printStackTrace()`** in meerdere controllers | **Kritiek:** Verwijder stack traces; log alleen naar server-side logger |
| V7.4 | **Geen stack traces** | **`e.getMessage()`** in error response (`GoalsOKRController` regel 965) | **Kritiek:** Lekt interne stack trace naar client |
| V7.3 | Logging | Geen gestructureerde security logging | Log alle auth failures, access denied, rate limit events |
| V7.5 | Error handling | Inconsistente error responses | Centraliseer via `@ControllerAdvice` + generieke error DTO |


---

## 8. Data Protection (V8)

### ✅ Aanwezig
- **V8.1** – Geen PII in logs

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V8.2 | Sensitive data in transit | HTTPS niet afgedwongen in code | Zorg dat reverse proxy/load balancer HTTPS afdwingt |
| V8.3 | Sensitive data at rest | Geen encryptie van DB velden | Overweeg encryptie voor zeer gevoelige velden (bijv. email) |


---

## 9. Communicatie (V9)

### ✅ Aanwezig
- **V9.1** – CORS geconfigureerd met whitelist

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V9.2 | **Security headers** | Geen X-Frame-Options, Content-Security-Policy, X-XSS-Protection | Voeg headers toe via Spring Security of filter |
| V9.3 | **Content-Type** | Geen expliciete Content-Type validatie op API | Valideer `Content-Type: application/json` voor POST/PUT |
| V9.4 | **TLS** | Geen HSTS header | Voeg `Strict-Transport-Security` toe |


---

## 10. API & Web Services (V14)

### ✅ Aanwezig
- **V14.1** – JSON API
- **V14.2** – Input validation op DTOs

### ❌ Gaps
| ID | Vereiste | Gap | Aanbeveling |
|----|----------|-----|-------------|
| V14.5 | **Request size limits** | Geen limiet op request body size | Configureer `spring.servlet.multipart.max-file-size` en `max-request-size` |
| V14.5 | **Rate limiting** | Alleen login/register (niet geïmplementeerd); geen API rate limiting | Implementeer rate limiting op alle endpoints |
| V14.5 | **CSRF** | CSRF uitgeschakeld | Voor API-only met JWT: acceptabel; documenteer bewust |
| V14.5 | **Schema validation** | Geen JSON schema validatie | Overweeg OpenAPI schema validation |


---

## Prioriteiten Actieplan

### P0 – Kritiek (binnen 2 weken)
1. **Access Control:** `anyRequest().authenticated()` – vereis authenticatie op alle endpoints
2. **Access Control:** Valideer userId in request body tegen JWT principal (alle endpoints)
3. **Access Control:** IDOR fixes: `GET /users/{userId}/kanban-items`, `GET /kanban-items/{itemId}`
4. **Error Handling:** Verwijder alle `e.printStackTrace()` en `e.getMessage()` in error responses
5. **Cryptografie:** JWT secret via environment variable; fail startup als niet gezet in productie

### P1 – Hoog (binnen 1 maand)
6. **Rate limiting:** Integreer `RateLimitingService` in login/register
7. **Security headers:** X-Frame-Options, CSP, X-XSS-Protection, HSTS
8. **Global rate limiting:** Bucket4j of Spring Cloud Gateway voor API
9. **Request size limits:** Configureer max request size

### P2 – Medium (binnen 2 maanden)
10. **Password complexity:** Voeg regex validatie toe (min 1 hoofdletter, 1 cijfer)
11. **Token storage:** Evalueer httpOnly cookies vs localStorage
12. **Refresh token rotation:** Nieuwe refresh token bij refresh
13. **Input validation:** `@Size(max=...)` op alle string velden
14. **Centralized error handling:** `@ControllerAdvice` + generieke error DTO

### P3 – Laag
15. Dependency scanning (OWASP Dependency-Check)
16. MFA (indien compliance vereist)
17. JSON schema validation

---

## Referenties

- [OWASP ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP ASVS GitHub](https://github.com/OWASP/ASVS)
