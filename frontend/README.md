# Frontend V2

Nieuwe frontend applicatie met feature-based architecture, gebouwd met React + Vite + TypeScript.

## Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **State Management:** Zustand (FASE 2)
- **Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **TypeScript:** Strict mode

## Project Setup

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/                # App setup & globale configuratie
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
│
├── features/           # Domein / modules
│   ├── auth/          # (FASE 2)
│   ├── user/          # (Later)
│   ├── content/       # (FASE 3)
│   ├── learning/      # (Later)
│   └── assessment/    # (Later)
│
├── shared/             # Herbruikbare code
│   ├── api/           # API client, types, errors
│   ├── components/    # UI components
│   ├── constants/     # Routes, config
│   └── utils/         # Utilities
│
└── styles/            # Global styles
```

## Development Status

### ✅ FASE 0: Alignment met Backend
- [x] API Contract gedocumenteerd
- [x] TypeScript types voor API responses
- [x] Endpoint mapping

### ✅ FASE 1: Skeleton + Infrastructuur
- [x] Project setup (Vite + React + TypeScript)
- [x] Tailwind CSS configuratie
- [x] React Query setup
- [x] Axios client met interceptors (basis)
- [x] Router setup (basis routes)
- [x] Basis UI components (Loading, Error)

### 🔄 FASE 2: Auth (Next)
- [ ] Login formulier
- [ ] Register formulier
- [ ] Sessiestatus
- [ ] Protected routes
- [ ] Refresh tokens

### 📋 FASE 3: Content READ-only (Later)
- [ ] Category list
- [ ] Category details
- [ ] Section viewer

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8081
```

## API Documentation

See `apps/_documents/Frontend_V2/API Contract - Backend V2.md` for complete API documentation.

## Architecture Principles

1. **Feature Isolation:** Features importeren alleen uit `shared/`, niet uit andere features
2. **Shared Code:** `shared/` bevat alleen domein-onafhankelijke code
3. **State Management:** Zustand voor client state, React Query voor server state
4. **Type Safety:** TypeScript strict mode voor alle API calls

