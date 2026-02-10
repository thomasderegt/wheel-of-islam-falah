# Frontend State Management - Risks & TODO

## Overzicht

Dit document beschrijft de risico's en verbeterpunten voor de frontend state management implementatie.

**Huidige Status:** 6.5/10 → 8/10 (na fixes)

**Context:** Eerste implementatie door solution architect zonder programmeer achtergrond, gebouwd met AI. Applicatie draait op acceptatie omgeving, nog niet naar productie.

---

## ✅ Opgeloste Issues

### 1. TypeScript Interface Compleet
- **Status:** ✅ OPGELOST
- **Details:** `setTokens` staat nu in de `AuthStore` interface (regel 14 in `authStore.ts`)
- **Impact:** Type safety is nu compleet

---

## ⚠️ Openstaande Issues (TODO)

### 1. Dubbele localStorage Management
- **Prioriteit:** Medium
- **Locatie:** `frontend/src/features/auth/store/authStore.ts`
- **Probleem:** 
  - Zustand `persist` middleware slaat al op in localStorage
  - Handmatige `localStorage.setItem()` calls in actions (regels 32-34, 44-45, 49-50)
  - Risico op sync problemen tussen Zustand state en localStorage
- **Impact:** 
  - Onnodige complexiteit
  - Mogelijke inconsistenties
  - Dubbele opslag
- **Oplossing:**
  - Verwijder alle handmatige `localStorage.setItem()` calls uit actions
  - Laat Zustand `persist` middleware alles afhandelen
  - Gebruik alleen `set()` voor state updates

### 2. Unify Token Management (API Client via Store)
- **Prioriteit:** Medium
- **Locatie:** `frontend/src/shared/api/client.ts`
- **Probleem:**
  - API client gebruikt direct `localStorage.getItem()` en `localStorage.setItem()`
  - Store wordt wel gebruikt (regel 131-138), maar niet consistent
  - Geen single source of truth voor tokens
- **Impact:**
  - Moeilijker te debuggen
  - Risico op desync tussen store en API client
  - Onderhoudsproblemen
- **Oplossing:**
  - API client moet tokens ophalen via `useAuthStore.getState().tokens`
  - API client moet tokens updaten via `useAuthStore.getState().setTokens()`
  - Verwijder directe localStorage calls uit API client

### 3. Consistent Gebruik van Config Keys
- **Prioriteit:** Medium
- **Locatie:** 
  - `frontend/src/shared/api/client.ts` (regels 27, 118, 127-128, 148-150)
  - `frontend/src/shared/constants/config.ts`
- **Probleem:**
  - Store gebruikt: `config.auth.tokenKey`, `config.auth.refreshTokenKey`, `config.auth.userKey`
  - API client gebruikt: hardcoded `'auth_token'`, `'refresh_token'`, `'user'`
  - Als config keys veranderen, breekt API client
- **Impact:**
  - Inconsistentie
  - Onderhoudsproblemen
  - Risico op bugs bij config wijzigingen
- **Oplossing:**
  - Vervang alle hardcoded strings in API client met `config.auth.*` keys
  - Regel 27: `localStorage.getItem(config.auth.tokenKey)`
  - Regel 118: `localStorage.getItem(config.auth.refreshTokenKey)`
  - Regel 127-128: `localStorage.setItem(config.auth.tokenKey, ...)`
  - Regel 148-150: `localStorage.removeItem(config.auth.*)`

---

## 🔮 Toekomstige Verbeteringen (Post-Productie)

### 4. Environment-Specifieke localStorage Keys
- **Prioriteit:** Low (voor productie)
- **Probleem:**
  - Zelfde localStorage keys voor alle omgevingen
  - Risico: tokens van productie kunnen op acceptatie gebruikt worden (en vice versa)
- **Impact:** 
  - Security risico
  - Verwarring bij gebruikers die tussen omgevingen wisselen
- **Oplossing:**
  ```typescript
  // In config.ts
  const env = process.env.NEXT_PUBLIC_ENV || 'development'
  export const config = {
    auth: {
      tokenKey: `auth_token_${env}`,
      refreshTokenKey: `refresh_token_${env}`,
      userKey: `user_${env}`,
    },
  }
  ```
  - Zustand persist: `name: 'auth-storage-${env}'`

### 5. Environment-Specifieke React Query Config
- **Prioriteit:** Low (voor productie)
- **Probleem:**
  - `staleTime: 5 minuten` is hetzelfde voor alle omgevingen
  - Op acceptatie wil je mogelijk kortere staleTime voor snellere updates tijdens testen
- **Oplossing:**
  ```typescript
  const staleTime = process.env.NEXT_PUBLIC_ENV === 'acceptance' 
    ? 1 * 60 * 1000  // 1 minuut voor acceptatie
    : 5 * 60 * 1000  // 5 minuten voor productie
  ```

---

## 📊 Huidige Architectuur

### State Management Stack
- ✅ **Zustand** - Global client state (auth)
- ✅ **TanStack Query** - Server state (data fetching)
- ✅ **React Context** - Feature-specific state (OKR Cart, Theme)
- ✅ **Local State (useState)** - Component-level UI state

### Best Practices
- ✅ Goede scheiding van verantwoordelijkheden
- ✅ TypeScript type safety
- ✅ Custom hooks voor abstractions
- ✅ Moderne tooling

---

## 🎯 Actieplan

### Fase 1: Kritieke Fixes (Voor Acceptatie)
1. [ ] Fix dubbele localStorage management (Issue #1)
2. [ ] Unify token management (Issue #2)
3. [ ] Consistent config keys (Issue #3)

### Fase 2: Productie Voorbereiding
4. [ ] Environment-specifieke localStorage keys
5. [ ] Environment-specifieke React Query config

---

## 📝 Notities

- **Deployment Status:** Frontend is deployment-ready voor Vercel
- **State Management:** Werkt functioneel, geen breaking bugs
- **Acceptatie Omgeving:** Draait zonder problemen
- **Productie:** Issues #1-3 zijn niet kritiek, maar wel aan te raden om op te lossen voor betere maintainability

---

**Laatste Update:** {{ current_date }}
**Status:** In ontwikkeling - Acceptatie omgeving
