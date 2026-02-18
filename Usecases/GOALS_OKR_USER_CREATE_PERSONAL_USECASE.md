# Use Case: Gebruiker Creëert Personal Objective

## Overzicht

Deze use case beschrijft het aanmaken van **volledig persoonlijke** objectives door de gebruiker – niet gebaseerd op templates. De gebruiker definieert een eigen doel binnen een life domain. Creëert Objective template + UserObjectiveInstance + KanbanItem in één actie. Dit is een **aparte flow** van het selecteren van bestaande templates.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die eigen doelen wil definiëren

## Precondities

- Gebruiker is ingelogd (userId beschikbaar)
- Life domain bestaat (gebruiker kiest uit bestaande domains)

## Begin State

- ✅ Life domain geselecteerd
- ❌ Geen Objective template voor dit specifieke doel

## End State

- ✅ Nieuw Objective template aangemaakt (onder life domain)
- ✅ UserObjectiveInstance gestart
- ✅ KanbanItem toegevoegd (TODO kolom)
- ✅ Gebruiker ziet het item op het kanban board

## Flow

### Stap 1: Gebruiker opent Create Personal Objective dialog

**Locatie:** NavGoalCircle – "Create Personal Objective" card of knop, binnen een life domain context.

### Stap 2: Gebruiker vult formulier in

```
- lifeDomainId: number (uit context)
- title: string (verplicht)
- description?: string (optioneel)
```

### Stap 3: Frontend API call

```typescript
POST /api/v2/goals-okr/users/{userId}/personal-objectives
Body: {
  lifeDomainId: number,
  title: string,
  description?: string
}
// createPersonalObjective(userId, { lifeDomainId, title, description })
```

### Stap 4: Backend (CreatePersonalObjectiveCommandHandler)

1. Valideer user bestaat
2. Create Objective template (CreateObjectiveCommand) onder life domain
3. Start UserObjectiveInstance (StartUserObjectiveInstanceCommand)
4. Add KanbanItem (OBJECTIVE, UserObjectiveInstance.id)
5. Return UserObjectiveInstanceResult

### Stap 5: Frontend

- Invalidate queries (objectives, user-objective-instances)
- Optioneel: navigeer naar kanban board

## API Endpoints

```
POST /api/v2/goals-okr/users/{userId}/personal-objectives
```

## Verschil met Template Selecteren

| Personal Objective | Template Selecteren |
|-------------------|---------------------|
| Maakt nieuw Objective (geen template) | Kiest bestaande Objective template |
| CreatePersonalObjective (alles in één) | StartUserObjectiveInstance + AddKanbanItem |
| Voor vrije invulling | Voor gestandaardiseerde doelen |
| Eigen titel en beschrijving | Vaste template content |

## Frontend Componenten

| Component | Rol |
|-----------|-----|
| CreatePersonalObjectiveDialog | Formulier voor title, description |
| NavGoalCircle | "Create Personal Objective" card, opent dialog |
| createPersonalObjective | API call |

## Gerelateerde Use Cases

- **GOALS_OKR_SELECT_TEMPLATE_USECASE** – Alternatief: bestaande template kiezen
- **GOALS_OKR_KANBAN_PERSONAL_USECASE** – Vervolg: kanban board beheren
- **GOALS_OKR_BROWSE_TEMPLATES_USECASE** – Context: life domain kiezen (zelfde navigatie)

## Implementatie Status

- ✅ Backend: CreatePersonalObjectiveCommandHandler (Objective + Instance + Kanban in één)
- ✅ Frontend: CreatePersonalObjectiveDialog, NavGoalCircle
