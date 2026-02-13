# Use Case: Falah Dashboard

## Overzicht

Deze use case beschrijft het Falah dashboard - een overzichtspagina die data uit meerdere modules combineert: user goals, kanban status, teams, learning progress, etc. Geeft de gebruiker een holistisch beeld van zijn voortgang.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die zijn overzicht wil zien

## Flow

**Stap 1: Gebruiker navigeert naar dashboard**
```
/ of /dashboard of /falah
```

**Stap 2: Frontend laadt geaggregeerde data**
```typescript
// useFalahDashboardData - combineert:
// - User goal instances
// - Kanban items (samenvatting)
// - Teams
// - Learning enrollments
// - etc.
```

**Stap 3: Dashboard toont**
- Wheel/life domain overzicht
- Actieve goals en voortgang
- Kanban samenvatting (TODO vs DONE)
- Team memberships
- Learning progress
- Quick actions

## API

Geen dedicated dashboard endpoint - frontend combineert bestaande APIs:
- GET /api/v2/goals-okr/users/{userId}/user-goal-instances
- GET /api/v2/goals-okr/users/{userId}/kanban-items
- GET /api/v2/users/teams/user/{userId}
- GET /api/v2/learning/enrollments/user/{userId}
- etc.

## Implementatie Status

- ✅ Frontend: FalahDashboard, useFalahDashboardData
- ✅ Backend: Data via bestaande endpoints
