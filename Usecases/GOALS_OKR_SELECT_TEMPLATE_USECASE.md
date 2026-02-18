# Use Case: Gebruiker Selecteert OKR Template

## Overzicht

Deze use case beschrijft het **selecteren** van een bestaand OKR template (Objective) door de gebruiker. De gebruiker kiest een template en start hiermee een UserObjectiveInstance, die direct op het kanban board wordt geplaatst. Dit is de overgang van template naar persoonlijke uitvoering.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die een template wil oppakken

## Precondities

- Gebruiker heeft templates bekeken (GOALS_OKR_BROWSE_TEMPLATES_USECASE)
- Gebruiker is ingelogd (userId beschikbaar)
- Objective template bestaat

## Begin State

- ✅ Objective template bestaat
- ❌ Gebruiker heeft nog geen UserObjectiveInstance voor dit objective

## End State

- ✅ UserObjectiveInstance aangemaakt
- ✅ KanbanItem (OBJECTIVE) toegevoegd aan kanban board (TODO kolom)
- ✅ Gebruiker wordt doorgestuurd naar kanban board

## Flow

### Stap 1: Gebruiker klikt "Add to Kanban" op een objective

**Locatie:** NavGoalCircle (grid) of objectives/[id] detailpagina.

### Stap 2: Start UserObjectiveInstance

```typescript
POST /api/v2/goals-okr/user-objective-instances
Body: { userId: number, objectiveId: number }
// startUserObjectiveInstance(userId, objectiveId)
```

**Backend:** StartUserObjectiveInstanceCommandHandler
- Maakt UserObjectiveInstance aan
- Retourneert UserObjectiveInstanceResult met instance id

### Stap 3: Voeg KanbanItem toe

```typescript
POST /api/v2/goals-okr/kanban-items
Body: {
  userId: number,
  itemType: "OBJECTIVE",
  itemId: number  // UserObjectiveInstance.id
}
// addKanbanItem({ userId, itemType: 'OBJECTIVE', itemId: instance.id })
```

**Backend:** AddKanbanItemCommandHandler
- Maakt KanbanItem aan in TODO kolom

### Stap 4: Navigeer naar Kanban

Gebruiker wordt doorgestuurd naar `/goals-okr/kanban` om het nieuwe item te zien.

## API Endpoints

```
POST /api/v2/goals-okr/user-objective-instances
POST /api/v2/goals-okr/kanban-items
```

## Frontend Componenten

| Component | Rol |
|-----------|-----|
| NavGoalCircle | "Add to Kanban" knop op objective card |
| CreatePersonalObjectiveDialog | Niet van toepassing (dat is personal flow) |
| useAddKanbanItem | Mutation voor kanban item toevoegen |
| startUserObjectiveInstance | API call voor instance |

## Verschil met Personal Objectives

| Template selecteren | Personal objective |
|--------------------|-------------------|
| Kiest bestaande Objective template | Maakt nieuw Objective (geen template) |
| StartUserObjectiveInstance + AddKanbanItem | CreatePersonalObjective (alles in één) |
| Voor gestandaardiseerde doelen | Voor vrije invulling |

## Gerelateerde Use Cases

- **GOALS_OKR_BROWSE_TEMPLATES_USECASE** – Voorafgaand: templates bekijken
- **GOALS_OKR_KANBAN_PERSONAL_USECASE** – Vervolg: kanban board beheren
- **GOALS_OKR_USER_CREATE_PERSONAL_USECASE** – Alternatief: eigen objective maken (geen template)

## Implementatie Status

- ✅ Backend: StartUserObjectiveInstanceCommandHandler, AddKanbanItemCommandHandler
- ✅ Frontend: NavGoalCircle handleConfirmAddToKanban, useAddKanbanItem, startUserObjectiveInstance
