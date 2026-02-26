# Voorstel: Verrijkt Kanban-endpoint

## Doel
De Kanban-board laadt nu traag omdat de frontend **per item** 2–6 extra API-calls doet om titel en `lifeDomainId` op te halen (sequentieel). Door het bestaande kanban-endpoint te **verrijken** met `title` en `lifeDomainId` (en optioneel `instanceNumber` waar nog niet aanwezig) is **één call** voldoende.

---

## Huidige situatie

### Backend
- **GET** `/api/v2/goals-okr/users/{userId}/kanban-items` → `GetKanbanItemsByUserQueryHandler` → retourneert `List<KanbanItemResult>`.
- **GET** `/api/v2/goals-okr/teams/{teamId}/kanban-items` → `GetTeamKanbanItemsQueryHandler` → idem.
- `KanbanItemResult` bevat: `id`, `userId`, `itemType`, `itemId`, `columnName`, `position`, `notes`, `number`, `createdAt`, `updatedAt`, `readOnly`. Geen `title`, geen `lifeDomainId`.

### Frontend
- `useKanbanItems` / `useTeamKanbanItems` halen de lijst op.
- Een **useEffect** in `KanbanBoard.tsx` (rond regels 473–563) loopt **sequentieel** over alle items en roept per item o.a. aan:
  - **GOAL:** `getUserGoalInstance(itemId)` → `getGoal(goalId)` (in de frontend zijn dit placeholders; Goal-laag is verwijderd).
  - **OBJECTIVE:** `getUserObjectiveInstance(itemId)` → `getObjective(objectiveId)`.
  - **KEY_RESULT:** `getUserKeyResultInstance(itemId)` → `getKeyResult(keyResultId)` → `getObjective(objectiveId)`.
  - **INITIATIVE:** `getUserInitiativeInstance(itemId)` → initiative/keyResult/objective (4–6+ calls).
- Resultaat: met 15 items al snel 30–90+ HTTP-requests → Kanban voelt erg traag.

---

## Gewenste situatie

- De **zelfde** endpoints retourneren dezelfde lijst, maar elk item heeft extra velden:
  - **title** (String): weergavetitel (uit Objective/KeyResult/Initiative, eventueel Goal als die later terugkomt).
  - **lifeDomainId** (Long, optional): voor filteren op wheel/context.
  - **number** bestaat al op `KanbanItemResult`; indien de backend die al goed vult, hoeft daar niets te veranderen.
- De frontend **verwijdert** de useEffect die per item titels/life domains ophaalt en gebruikt alleen nog de verrijkte velden uit de response.

---

## Implementatieplan

### 1. Backend: KanbanItemResult uitbreiden

**Bestand:** `backend/goals-okr-module/.../application/results/KanbanItemResult.java`

- Twee extra velden toevoegen (optioneel, backward compatible):
  - `String title` (nullable)
  - `Long lifeDomainId` (nullable)
- Bestaande `from(KanbanItem item)` / `from(KanbanItem item, boolean readOnly)` behouden; nieuwe factory of builder voor verrijkte items, bijv.:
  - `fromEnriched(KanbanItem item, String title, Long lifeDomainId)` en overload met `readOnly`.
- Of: bestaande `from` aanpassen zodat `title` en `lifeDomainId` null zijn; verrijking gebeurt in de handler door een nieuw result-object te bouwen met dezelfde velden + title + lifeDomainId.

**Aanbevolen:** Result uitbreiden met `title` en `lifeDomainId`; in de handler voor elk item de titel en lifeDomainId bepalen en een result met deze velden teruggeven.

---

### 2. Backend: Verrijklogica in de query-handlers

De resolutielogica die nu in de frontend zit, in de backend implementeren.

**GetKanbanItemsByUserQueryHandler** (en eventueel **GetTeamKanbanItemsQueryHandler**):

- Na `kanbanItemRepository.findByUserId(userId)` (of bij team: items van owner): voor **elk** `KanbanItem`:
  - Op basis van `item.getItemType()` en `item.getItemId()`:
    - **GOAL:** (indien nog ondersteund) UserGoalInstance ophalen → Goal ophalen → title uit goal, lifeDomainId uit goal.
    - **OBJECTIVE:** UserObjectiveInstanceRepository.findById(itemId) → ObjectiveRepository.findById(objectiveId) → title (titleNl/titleEn), lifeDomainId.
    - **KEY_RESULT:** UserKeyResultInstanceRepository.findById(itemId) → KeyResultRepository.findById(krId) → ObjectiveRepository.findById(objectiveId) → title uit keyResult, lifeDomainId uit objective.
    - **INITIATIVE:** UserInitiativeInstanceRepository.findById(itemId) → initiative (user of template) + keyResult + objective → title, lifeDomainId.
  - Nieuw `KanbanItemResult` bouwen met alle bestaande velden + `title` en `lifeDomainId`.
- Benodigde injecties in de handler: naast `KanbanItemRepository` o.a. `UserObjectiveInstanceRepository`, `UserKeyResultInstanceRepository`, `UserInitiativeInstanceRepository`, `ObjectiveRepository`, `KeyResultRepository`, en evt. `InitiativeRepository` of bestaande query-handlers voor initiative-resolutie.

**N+1 beperken:** Waar mogelijk batch-loaden (bijv. alle itemIds van type OBJECTIVE in één keer ophalen) of caching overweegbaar; minimaal is per item de benodigde chain (instance → entity → objective) aanroepen. Eventueel later optimaliseren met één JPQL-query of dedicated “enriched kanban”-query.

**Team-kanban:** Dezelfde verrijking toepassen in `GetTeamKanbanItemsQueryHandler` op de lijst items van de owner (readOnly blijft true).

---

### 3. Backend: Controller

- Geen wijziging nodig: de controller retourneert al `List<KanbanItemResult>`. Zodra `KanbanItemResult` de velden `title` en `lifeDomainId` heeft, worden die automatisch meegestuurd in de JSON.

---

### 4. Frontend: Type en gebruik

**KanbanItemDTO** (`frontend/.../api/goalsOkrApi.ts`):

- Uitbreiden met:
  - `title?: string | null`
  - `lifeDomainId?: number | null`

**KanbanBoard.tsx:**

- De **useEffect** die `loadTitlesAndLifeDomains` aanroept (regels ~473–563) **verwijderen**.
- State die alleen voor die verrijking werd gebruikt, verwijderen of hergebruiken:
  - `itemTitles` → niet meer nodig; gebruik `item.title` uit de API.
  - `itemLifeDomainIds` → niet meer nodig; gebruik `item.lifeDomainId` uit de API.
  - `itemNumbers` → indien de backend `number` al per item teruggeeft, gebruik `item.number`; anders tijdelijk behouden tot backend number consistent vult.
  - `isLoadingTitles` → kan weg (of afleiden uit `isLoading` van de kanban-query).
- **filteredItems** en **itemsByColumn**: filtering op life domain en weergave van titel aanpassen zodat ze rechtstreeks `item.lifeDomainId` en `item.title` gebruiken (eventueel fallback `item.itemType + ' ' + item.itemId` als title ontbreekt).
- **KanbanCard** e.d.: titel tonen via `item.title` (en evt. `item.number`) uit het doorgegeven `KanbanItemDTO`.

---

### 5. Volgorde van uitvoering

1. **Backend:** `KanbanItemResult` uitbreiden met `title` en `lifeDomainId` (nullable).
2. **Backend:** `GetKanbanItemsByUserQueryHandler` uitbreiden met verrijklogica (repositories/handlers injecteren, per item type title + lifeDomainId vullen).
3. **Backend:** Zelfde verrijking in `GetTeamKanbanItemsQueryHandler`.
4. **Frontend:** `KanbanItemDTO` uitbreiden; in `KanbanBoard` de useEffect en bijbehorende state verwijderen en overal `item.title` / `item.lifeDomainId` (en `item.number`) gebruiken.
5. **Testen:** Kanban-pagina laden en controleren dat alle items in één call komen, met titel en filtering op life domain correct.

---

### 6. Optioneel: GOAL-itemtype

In de frontend zijn `getGoal` en `getUserGoalInstance` placeholders (Goal-laag verwijderd). Als GOAL in de kanban nog voorkomt:

- Backend: voor GOAL in de verrijking ofwel een vaste placeholder (bijv. title `"Goal"`, lifeDomainId null) of geen verrijking; of later echte Goal/UserGoalInstance-resolutie toevoegen.
- Frontend: als de backend voor GOAL geen title/lifeDomainId stuurt, fallback blijven tonen (bijv. "GOAL {itemId}").

---

## Samenvatting

| Onderdeel | Actie |
|-----------|--------|
| **KanbanItemResult** | Velden `title` (String, nullable) en `lifeDomainId` (Long, nullable) toevoegen. |
| **GetKanbanItemsByUserQueryHandler** | Na ophalen items, per item title + lifeDomainId bepalen (OBJECTIVE, KEY_RESULT, INITIATIVE; GOAL optioneel) en verrijkt result teruggeven. |
| **GetTeamKanbanItemsQueryHandler** | Zelfde verrijking op de lijst van de owner. |
| **Controller** | Geen wijziging (zelfde endpoint, uitgebreide result). |
| **Frontend KanbanItemDTO** | `title` en `lifeDomainId` toevoegen. |
| **Frontend KanbanBoard** | useEffect en state voor titels/life domains verwijderen; overal `item.title` en `item.lifeDomainId` gebruiken. |

Hierdoor is **één verrijkte kanban-endpoint** voldoende en wordt de Kanban aanzienlijk sneller.
