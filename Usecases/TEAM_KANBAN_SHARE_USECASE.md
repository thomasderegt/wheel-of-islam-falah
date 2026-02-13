# Use Case: Team Kanban Board Delen

## Overzicht

Deze use case beschrijft hoe een team owner zijn kanban board deelt met team members, zodat team members het board kunnen bekijken in read-only mode.

## Actoren

- **Team Owner**: Gebruiker die het team heeft aangemaakt en eigenaar is
- **Team Member**: Gebruiker die lid is van het team (kan board bekijken)

## Begin State

### Team Owner
- ✅ Heeft een team aangemaakt (via `/api/v2/users/teams`)
- ✅ Heeft een persoonlijk kanban board met items
- ✅ Is ingelogd en geauthenticeerd
- ✅ Kanban board is **NIET** gedeeld (standaard)

### Team Members
- ✅ Zijn lid van het team (via invitation geaccepteerd)
- ✅ Zijn ingelogd en geauthenticeerd
- ❌ Hebben **GEEN** toegang tot team kanban board (nog niet gedeeld)

## End State

### Team Owner
- ✅ Kanban board is **GEDEELD** met het team
- ✅ Kan het board nog steeds bewerken (volledige controle)
- ✅ Kan het board unsharen wanneer gewenst

### Team Members
- ✅ Hebben **READ-ONLY** toegang tot team kanban board
- ✅ Kunnen het board bekijken via `/goals-okr/kanban?mode=team&teamId={teamId}`
- ✅ Kunnen items **NIET** bewerken, verplaatsen of verwijderen
- ✅ Zien read-only indicator en banner

## Use Case Flow

### Stap 1: Team Owner opent Team Settings

**Actie:**
- Team owner navigeert naar team settings/detail pagina
- Bijvoorbeeld: `/teams/{teamId}` of `/teams/{teamId}/settings`

**UI Element:**
```tsx
// Team Settings Component
const { data: team } = useTeam(teamId)
const { data: share } = useTeamKanbanShare(teamId)
const shareKanban = useShareTeamKanban()
const unshareKanban = useUnshareTeamKanban()

{team?.ownerId === userId && (
  <div>
    {share ? (
      <Button onClick={() => unshareKanban.mutate(teamId)}>
        Unshare Kanban Board
      </Button>
    ) : (
      <Button onClick={() => shareKanban.mutate(teamId)}>
        Share Kanban Board
      </Button>
    )}
  </div>
)}
```

### Stap 2: Team Owner klikt "Share Kanban Board"

**Frontend Actie:**
```typescript
// Hook triggert API call
shareKanban.mutate(teamId)
// → POST /api/v2/users/teams/{teamId}/kanban/share
```

**Backend Validatie:**
1. ✅ Check authentication (JWT token)
2. ✅ Check authorization: `userModule.getTeamOwnerId(teamId) === userId`
3. ✅ Check team exists
4. ✅ Check not already shared: `!shareRepository.existsActiveByTeamId(teamId)`

**Backend Actie:**
```java
// Create TeamKanbanShare
TeamKanbanShare share = TeamKanbanShare.create(teamId, userId)
shareRepository.save(share)
// → Database: INSERT INTO users.team_kanban_shares
```

**Response:**
```json
{
  "id": 1,
  "teamId": 123,
  "ownerUserId": 456,
  "sharedAt": "2024-01-01T12:00:00",
  "unsharedAt": null,
  "createdAt": "2024-01-01T12:00:00",
  "updatedAt": "2024-01-01T12:00:00"
}
```

### Stap 3: Team Member bekijkt Team Kanban Board

**Actie:**
- Team member navigeert naar: `/goals-okr/kanban?mode=team&teamId={teamId}`
- Of klikt op link vanuit team page

**Frontend Flow:**
```typescript
// KanbanBoard component detecteert team mode
const teamId = searchParams?.get('teamId')
const isTeamMode = searchParams?.get('mode') === 'team' && teamId !== null

// Gebruikt team kanban hook
const { data: teamKanbanItems } = useTeamKanbanItems(teamId)
```

**Backend Validatie:**
1. ✅ Check authentication (JWT token)
2. ✅ Check authorization: `userModule.isUserTeamMember(userId, teamId)`
3. ✅ Check share exists: `shareRepository.findActiveByTeamId(teamId)`
4. ✅ Get owner's kanban items: `kanbanItemRepository.findByUserId(ownerId)`
5. ✅ Mark as read-only: `KanbanItemResult.from(item, true)`

**Response:**
```json
[
  {
    "id": 1,
    "userId": 456,  // Owner's userId
    "itemType": "GOAL",
    "itemId": 789,
    "columnName": "TODO",
    "position": 0,
    "readOnly": true  // Frontend flag
  }
]
```

### Stap 4: Team Member ziet Read-only Board

**UI State:**
- ✅ Read-only banner: "📖 Team Kanban Board - Read-only mode"
- ✅ Drag & drop disabled (`disabled={isReadOnly}`)
- ✅ Delete buttons hidden (`{!readOnly && <DeleteButton />}`)
- ✅ Drag handle hidden (`{!readOnly && <GripVertical />}`)
- ✅ Read-only indicator op cards: "Read-only"

### Stap 5: Team Owner kan Unshare

**Actie:**
- Team owner klikt "Unshare Kanban Board" in team settings

**Backend Validatie:**
1. ✅ Check authentication
2. ✅ Check authorization: `userModule.getTeamOwnerId(teamId) === userId`
3. ✅ Check share exists and is active
4. ✅ Soft delete: `share.unshare()` → sets `unsharedAt` timestamp

**Resultaat:**
- Team members verliezen onmiddellijk toegang
- GET `/api/v2/goals-okr/teams/{teamId}/kanban-items` → 404 NOT_FOUND

## Security & Privacy

### Backend Validatie (Key!)

**Share Endpoint:**
```java
// Alleen owner kan share
Long ownerId = userModule.getTeamOwnerId(teamId)
if (!ownerId.equals(userId)) {
    return 403 FORBIDDEN
}
```

**Get Team Kanban Items:**
```java
// Alleen team members kunnen bekijken
if (!userModule.isUserTeamMember(userId, teamId)) {
    return 403 FORBIDDEN
}

// Alleen als gedeeld
Optional<TeamKanbanShare> share = shareRepository.findActiveByTeamId(teamId)
if (share.isEmpty()) {
    return 404 NOT_FOUND
}

// Items van OWNER, niet van viewing user!
Long ownerId = share.get().getOwnerUserId()
List<KanbanItem> items = kanbanItemRepository.findByUserId(ownerId)
```

### Privacy First

- ✅ **Standaard NIET gedeeld**: Privacy by default
- ✅ **Expliciet delen vereist**: Owner moet actief share actie uitvoeren
- ✅ **Unshare = onmiddellijk**: Toegang wordt direct verwijderd
- ✅ **Geen automatisch delen**: Alleen expliciete actie

## UI/UX Flow

### Team Owner Journey

1. **Team aanmaken** → `/teams` → "Create Team"
2. **Team beheren** → `/teams/{teamId}` → Team settings
3. **Kanban board delen** → "Share Kanban Board" button
4. **Status zien** → "Kanban Board: Shared" indicator
5. **Unshare** → "Unshare Kanban Board" button (optioneel)

### Team Member Journey

1. **Team joinen** → Accept invitation
2. **Team bekijken** → `/teams/{teamId}` → Team details
3. **Kanban board bekijken** → "View Team Kanban" link
4. **Read-only board** → `/goals-okr/kanban?mode=team&teamId={teamId}`
5. **Items bekijken** → Kan zien maar niet bewerken

## Data Flow Diagram

```
┌─────────────┐
│ Team Owner  │
│  (User 456) │
└──────┬──────┘
       │
       │ 1. POST /api/v2/users/teams/{teamId}/kanban/share
       │    Authorization: Bearer {token}
       │    Body: {}
       │
       ▼
┌─────────────────────────────────┐
│ Backend: TeamController          │
│ - Check: isOwner?                │
│ - Create: TeamKanbanShare        │
│ - Save: team_kanban_shares table │
└──────┬──────────────────────────┘
       │
       │ 2. Response: TeamKanbanShareDTO
       │
       ▼
┌─────────────────────────────────┐
│ Database: team_kanban_shares    │
│ team_id: 123                    │
│ owner_user_id: 456              │
│ shared_at: 2024-01-01T12:00:00 │
│ unshared_at: NULL               │
└─────────────────────────────────┘

┌──────────────┐
│ Team Member  │
│  (User 789)  │
└──────┬───────┘
       │
       │ 3. GET /api/v2/goals-okr/teams/{teamId}/kanban-items
       │    Authorization: Bearer {token}
       │
       ▼
┌─────────────────────────────────┐
│ Backend: GoalsOKRController    │
│ - Check: isTeamMember?          │
│ - Check: share exists?           │
│ - Get: owner's kanban items      │
│ - Mark: readOnly = true          │
└──────┬──────────────────────────┘
       │
       │ 4. Response: KanbanItemDTO[] (readOnly: true)
       │
       ▼
┌─────────────────────────────────┐
│ Frontend: KanbanBoard           │
│ - Detect: isTeamMode            │
│ - Show: read-only banner         │
│ - Disable: drag & drop           │
│ - Hide: delete buttons           │
└─────────────────────────────────┘
```

## Edge Cases

### 1. Owner deelt board, maar heeft geen items
- **Resultaat**: Team members zien leeg board
- **UI**: "No items in team kanban board"

### 2. Owner unshares board terwijl member kijkt
- **Resultaat**: Member verliest toegang bij volgende refresh
- **Backend**: Returns 404 NOT_FOUND
- **Frontend**: Toont error of redirect naar personal board

### 3. Member probeert direct API aan te roepen
- **Resultaat**: Backend validatie blokkeert (403 FORBIDDEN)
- **Security**: Frontend kan niet om validatie heen

### 4. Owner verwijdert team
- **Resultaat**: Cascade delete → `team_kanban_shares` wordt verwijderd
- **Database**: `ON DELETE CASCADE` constraint

## Test Scenarios

### Scenario 1: Happy Path
1. ✅ Owner deelt board
2. ✅ Member bekijkt board (read-only)
3. ✅ Owner kan nog steeds bewerken
4. ✅ Owner unshares board
5. ✅ Member verliest toegang

### Scenario 2: Authorization
1. ✅ Non-owner kan niet share
2. ✅ Non-member kan niet bekijken
3. ✅ Owner kan unshare

### Scenario 3: Privacy
1. ✅ Standaard niet gedeeld
2. ✅ Expliciet delen vereist
3. ✅ Unshare verwijdert toegang direct

## Implementatie Status

### ✅ Geïmplementeerd
- Backend endpoints (share/unshare/get)
- Backend validatie en authorization
- Frontend API client en hooks
- KanbanBoard component met team mode
- Read-only UI (disable drag, hide buttons)

### ⚠️ Nog te implementeren
- Team settings UI (share/unshare buttons)
- Team kanban navigatie link
- Error handling voor unshared boards
- Loading states voor share/unshare actions

## Conclusie

**Begin State:** Team owner heeft team en persoonlijk kanban board (niet gedeeld)

**End State:** Team kanban board is gedeeld, members kunnen read-only bekijken

**Key Points:**
- Privacy first: expliciet delen vereist
- Backend validatie is key voor security
- Read-only mode voorkomt concurrency issues
- Unshare verwijdert toegang onmiddellijk
