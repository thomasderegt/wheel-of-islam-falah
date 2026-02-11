# Fase 2: Team Kanban Sharing

## Overzicht

Team Kanban Sharing maakt het mogelijk voor team owners om hun Kanban board te delen met team members. Team members kunnen het board alleen bekijken (read-only), terwijl de owner volledige controle heeft.

## Requirements

1. **Explicit Sharing**: Team owner moet actief zijn Kanban board delen met het team
2. **Read-only voor Members**: Team members kunnen alleen bekijken, niet bewerken
3. **Backend Validatie**: Alle access control gebeurt op de backend (security/privacy)
4. **Privacy First**: Standaard is niets gedeeld, alleen expliciet gedeelde boards zijn zichtbaar

## Database Schema

### Tabel: `team_kanban_shares`

```sql
CREATE TABLE users.team_kanban_shares (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL,
    owner_user_id BIGINT NOT NULL, -- User die het board deelt (moet team owner zijn)
    shared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unshared_at TIMESTAMP, -- NULL = actief gedeeld
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_team_kanban_share_team FOREIGN KEY (team_id) 
        REFERENCES users.teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_kanban_share_owner FOREIGN KEY (owner_user_id) 
        REFERENCES users.users(id) ON DELETE CASCADE,
    CONSTRAINT uk_team_kanban_share UNIQUE (team_id, owner_user_id) -- Eén share per team per owner
);
```

**Business Rules:**
- Eén team kan één Kanban board hebben (van de owner)
- Owner kan delen/unsharen
- Members kunnen alleen lezen (read-only)
- Unshare = soft delete (unshared_at wordt gezet)

## Backend Endpoints

### 1. Share Kanban Board
```
POST /api/v2/users/teams/{teamId}/kanban/share
Authorization: Bearer {token}
Body: {} (geen body nodig, owner wordt uit token gehaald)
```

**Validatie:**
- User moet team owner zijn
- Team moet bestaan
- Kanban board moet bestaan (owner moet items hebben)

**Response:**
```json
{
  "id": 1,
  "teamId": 1,
  "ownerUserId": 123,
  "sharedAt": "2024-01-01T12:00:00",
  "unsharedAt": null
}
```

### 2. Unshare Kanban Board
```
POST /api/v2/users/teams/{teamId}/kanban/unshare
Authorization: Bearer {token}
```

**Validatie:**
- User moet team owner zijn
- Share moet bestaan en actief zijn

### 3. Get Team Kanban Items (Read-only)
```
GET /api/v2/goals-okr/teams/{teamId}/kanban-items
Authorization: Bearer {token}
```

**Validatie:**
- User moet team member zijn
- Kanban board moet gedeeld zijn (active share)
- Returns items van owner (read-only)

**Response:**
```json
[
  {
    "id": 1,
    "userId": 123, // Owner's userId
    "itemType": "GOAL",
    "itemId": 1,
    "columnName": "TODO",
    "position": 0,
    "notes": "...",
    "readOnly": true // Frontend flag
  }
]
```

## Backend Validatie Flow

### Get Team Kanban Items

1. **Authorization Check:**
   ```java
   // User moet team member zijn
   if (!userModule.isUserTeamMember(userId, teamId)) {
       return 403 FORBIDDEN;
   }
   ```

2. **Share Check:**
   ```java
   // Check of board gedeeld is
   Optional<TeamKanbanShare> share = shareRepository.findActiveByTeamId(teamId);
   if (share.isEmpty()) {
       return 404 NOT_FOUND; // Board niet gedeeld
   }
   ```

3. **Get Owner's Items:**
   ```java
   // Haal items op van owner (niet van viewing user!)
   Long ownerId = share.get().getOwnerUserId();
   List<KanbanItem> items = kanbanItemRepository.findByUserId(ownerId);
   ```

4. **Mark as Read-only:**
   ```java
   // Markeer alle items als read-only voor frontend
   return items.stream()
       .map(item -> KanbanItemResult.from(item).withReadOnly(true))
       .collect(toList());
   ```

### Share Kanban Board

1. **Authorization:**
   ```java
   // User moet team owner zijn
   Long ownerId = userModule.getTeamOwnerId(teamId);
   if (!ownerId.equals(userId)) {
       return 403 FORBIDDEN;
   }
   ```

2. **Check Existing Share:**
   ```java
   // Check of al gedeeld is
   if (shareRepository.existsActiveByTeamId(teamId)) {
       return 400 BAD_REQUEST; // Al gedeeld
   }
   ```

3. **Create Share:**
   ```java
   TeamKanbanShare share = TeamKanbanShare.create(teamId, userId);
   shareRepository.save(share);
   ```

## Frontend Changes

### 1. Team Kanban Mode

**New Route:**
```
/goals-okr/kanban?mode=team&teamId={teamId}
```

**KanbanBoard Component:**
```typescript
const { mode, teamId } = useSearchParams();
const isTeamMode = mode === 'team' && teamId;

// Use different hook based on mode
const { data: items, isLoading } = isTeamMode
  ? useTeamKanbanItems(teamId!)
  : useKanbanItems(userId);
```

### 2. Read-only UI

**Disable drag & drop:**
```typescript
const isReadOnly = items?.[0]?.readOnly ?? false;

<DndContext
  disabled={isReadOnly}
  onDragEnd={isReadOnly ? undefined : handleDragEnd}
>
```

**Hide edit buttons:**
```typescript
{!isReadOnly && (
  <Button onClick={handleEdit}>Edit</Button>
)}
```

**Show read-only indicator:**
```typescript
{isReadOnly && (
  <Badge variant="secondary">Read-only - Team Board</Badge>
)}
```

### 3. Share/Unshare UI

**Team Settings Page:**
```typescript
const { data: team } = useTeam(teamId);
const { data: share } = useTeamKanbanShare(teamId);
const shareKanban = useShareTeamKanban();
const unshareKanban = useUnshareTeamKanban();

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

## Security Considerations

1. **Backend Validatie is Key:**
   - Alle checks gebeuren op de backend
   - Frontend kan niet om validatie heen
   - Read-only flag is alleen voor UI, niet voor security

2. **Privacy:**
   - Standaard is niets gedeeld
   - Owner moet expliciet delen
   - Unshare verwijdert toegang onmiddellijk

3. **Authorization:**
   - Team members kunnen alleen lezen
   - Alleen owner kan delen/unsharen
   - Backend checkt altijd team membership

## Implementation Order

1. ✅ Database migration
2. ✅ Domain layer (TeamKanbanShare entity)
3. ✅ Application layer (Commands, Queries, Handlers)
4. ✅ Infrastructure layer (JPA, Repository)
5. ✅ REST Controller endpoints
6. ✅ Frontend API client
7. ✅ Frontend UI components
