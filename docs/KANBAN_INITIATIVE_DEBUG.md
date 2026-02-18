# Debug: User-created initiative niet op Kanban

## Stappen om te bepalen waar het misgaat

### 1. Maak een nieuw initiative aan

Open de browserconsole (F12 → Console) en maak een user-created initiative aan.

### 2. Controleer de console-output

**Bij create success:**
```
[useCreateInitiative] Create response: { id, userId, userInitiativeInstanceId, keyResultId, hasInstanceId }
```

| Situatie | Betekenis |
|----------|-----------|
| `userInitiativeInstanceId: undefined` | Backend stuurt het niet mee → herstart backend, controleer of V60+ code actief is |
| `userInitiativeInstanceId: 123` | Backend stuurt het correct |

**Bij kanban add:**
```
[useCreateInitiative] Kanban add succeeded for instance 123
```
of
```
[useCreateInitiative] Kanban add result: { isDuplicate: true, ... }
```
of
```
[useCreateInitiative] Skipped kanban add: missing userInitiativeInstanceId or userId
```

| Situatie | Betekenis |
|----------|-----------|
| "Skipped kanban add" | Response mist userInitiativeInstanceId → backend fix nodig |
| "Kanban add succeeded" | Frontend add werkte → item zou in DB moeten staan |
| "isDuplicate: true" | Backend had al toegevoegd → item zou in DB moeten staan |
| "Failed to add initiative to kanban" | Error bij addKanbanItem → check error message |

### 3. Controleer KanbanBoard-filtering

```
[KanbanBoard] Filter context: { goalsOkrContext, targetWheelId, totalItems, initiativeCount }
[KanbanBoard] Initiatives without lifeDomainId (may be filtered out): [...]
```

| Situatie | Betekenis |
|----------|-----------|
| `goalsOkrContext: 'NONE'` | Board toont niets → zet context op LIFE of ALL |
| `goalsOkrContext: 'LIFE'` + "Initiatives without lifeDomainId" | Items worden uitgefilterd → lifeDomainId fallback moet werken |
| `initiativeCount: 0` | Geen initiative items in kanban-items response → item niet aangemaakt |

### 4. Checklist

- [ ] Backend herstart na code changes (userInitiativeInstanceId in response)
- [ ] Goals-OKR context ≠ NONE (LIFE, BUSINESS of ALL)
- [ ] keyResultId wordt meegegeven (voor lifeDomainId bij filtering)
- [ ] Geen errors in console bij create of addKanbanItem

### 5. Vergelijk met Suggested initiative

Suggested initiative: `POST /user-initiative-instances` → StartUserInitiativeInstanceCommandHandler  
User-created: `POST /initiatives` → CreateInitiativeCommandHandler  

Beide roepen `addKanbanItemHandler.handle(new AddKanbanItemCommand(userId, "INITIATIVE", savedInstance.getId()))` aan.  
Het verschil zit in de bron en het aanmaken van de instance; de kanban-add is hetzelfde.
