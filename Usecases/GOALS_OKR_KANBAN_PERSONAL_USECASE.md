# Use Case: Persoonlijk Kanban Board Beheren

## Overzicht

Deze use case beschrijft het beheren van het persoonlijke kanban board - items toevoegen, verplaatsen (drag & drop), notities bijwerken en verwijderen. Kolommen: TODO, IN_PROGRESS, IN_REVIEW, DONE.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die zijn eigen kanban beheert

## Begin State

- ✅ Gebruiker heeft user goal/objective/key result/initiative instances
- ❌ Items nog niet op kanban of willen verplaatsen

## End State

- ✅ Items op kanban in juiste kolom
- ✅ Positie en notities bijgewerkt

## Flow

### Kanban items ophalen

```
GET /api/v2/goals-okr/users/{userId}/kanban-items
```

**Response:** Lijst van KanbanItemResult met itemType (GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE), itemId, columnName, position, notes.

### Item toevoegen

```
POST /api/v2/goals-okr/kanban-items
Body: { "userId": 123, "itemType": "GOAL", "itemId": 1 }
```
*itemId = instance ID (UserGoalInstance.id, etc.)*

### Item verplaatsen (drag & drop)

```
PUT /api/v2/goals-okr/kanban-items/{itemId}/position
Body: { "columnName": "IN_PROGRESS", "position": 0 }
```

### Notities bijwerken

```
PUT /api/v2/goals-okr/kanban-items/{itemId}/notes
Body: { "notes": "Herinnering: ..." }
```

### Item verwijderen

```
DELETE /api/v2/goals-okr/kanban-items/{itemId}
```

## API Endpoints

```
GET /api/v2/goals-okr/users/{userId}/kanban-items
GET /api/v2/goals-okr/kanban-items/{itemId}
POST /api/v2/goals-okr/kanban-items
PUT /api/v2/goals-okr/kanban-items/{itemId}/position
PUT /api/v2/goals-okr/kanban-items/{itemId}/notes
DELETE /api/v2/goals-okr/kanban-items/{itemId}
```

## Team Kanban

Zie TEAM_KANBAN_SHARE_USECASE voor read-only team kanban:
```
GET /api/v2/goals-okr/teams/{teamId}/kanban-items
```
*Returns items met readOnly: true*

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ✅ Frontend: KanbanBoard, useKanbanItems, drag & drop, KanbanFilterPanel
