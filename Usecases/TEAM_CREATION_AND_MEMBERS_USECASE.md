# Use Case: Team Aanmaken en Leden Toevoegen

## Overzicht

Deze use case beschrijft het volledige proces van team aanmaken, leden uitnodigen, en invitation accepteren.

## Actoren

- **Team Owner**: Gebruiker die een team aanmaakt en beheert
- **Invited User**: Gebruiker die wordt uitgenodigd om lid te worden
- **Team Member**: Gebruiker die lid is van het team

## Use Case 1: Team Aanmaken

### Begin State

**Team Owner (bijv. Piet):**
- ✅ Is ingelogd en geauthenticeerd
- ✅ Heeft nog geen teams (of wil een nieuw team aanmaken)
- ❌ Team bestaat nog niet

### End State

**Team Owner (Piet):**
- ✅ Team is aangemaakt: "Business Team"
- ✅ Piet is automatisch OWNER member van het team
- ✅ Database: 
  - `teams` table: nieuwe team record
  - `team_members` table: Piet als OWNER member

### Flow

**Stap 1: Owner navigeert naar Teams pagina**
```
Piet → /teams → "Create Team" button
```

**Stap 2: Owner vult team formulier in**
```
Form:
- Name: "Business Team"
- Description: "Team voor business doelen" (optioneel)
```

**Stap 3: Frontend API call**
```typescript
createTeam({
  name: "Business Team",
  description: "Team voor business doelen"
})
// → POST /api/v2/users/teams
// → Authorization: Bearer {piet_token}
```

**Stap 4: Backend Validatie**
```java
// TeamController.createTeam()
1. ✅ Check authentication (JWT token)
2. ✅ Validate: userId from token == request.ownerId
3. ✅ Validate: name is not empty
```

**Stap 5: Backend Processing**
```java
// CreateTeamCommandHandler.handle()
1. ✅ Validate owner exists
2. ✅ Create Team entity
3. ✅ Save team to database
4. ✅ Create TeamMember for owner (role: OWNER, status: ACTIVE)
5. ✅ Save owner as team member
```

**Stap 6: Response**
```json
{
  "id": 123,
  "name": "Business Team",
  "description": "Team voor business doelen",
  "ownerId": 456,  // Piet's userId
  "status": "ACTIVE",
  "createdAt": "2024-01-01T12:00:00",
  "updatedAt": "2024-01-01T12:00:00"
}
```

**Stap 7: Database State**
```sql
-- teams table
INSERT INTO users.teams (id, name, description, owner_id, status)
VALUES (123, 'Business Team', 'Team voor business doelen', 456, 'ACTIVE');

-- team_members table (automatisch aangemaakt)
INSERT INTO users.team_members (team_id, user_id, role, status, invited_by_id, joined_at)
VALUES (123, 456, 'OWNER', 'ACTIVE', 456, '2024-01-01T12:00:00');
```

---

## Use Case 2: Team Lid Uitnodigen

### Begin State

**Team Owner (Piet):**
- ✅ Heeft team "Business Team" (id: 123)
- ✅ Is OWNER van het team
- ✅ Wil Klaas toevoegen als member

**Invited User (Klaas):**
- ✅ Heeft account in systeem (of nog niet)
- ❌ Is nog geen lid van het team
- ❌ Heeft nog geen invitation ontvangen

### End State

**Team Owner (Piet):**
- ✅ Invitation is aangemaakt en verstuurd
- ✅ Database: `team_invitations` record met token

**Invited User (Klaas):**
- ✅ Heeft invitation ontvangen (email met token)
- ✅ Invitation is pending (nog niet geaccepteerd)
- ❌ Is nog geen lid (status: INVITED)

### Flow

**Stap 1: Owner opent Team Settings**
```
Piet → /teams/123 → "Invite Member" button
```

**Stap 2: Owner vult invitation formulier in**
```
Form:
- Email: "klaas@example.com"
- Role: "MEMBER" (of ADMIN)
```

**Stap 3: Frontend API call**
```typescript
inviteTeamMember(123, {
  email: "klaas@example.com",
  role: "MEMBER"
})
// → POST /api/v2/users/teams/123/members/invite
// → Authorization: Bearer {piet_token}
```

**Stap 4: Backend Validatie**
```java
// TeamController.inviteMember()
1. ✅ Check authentication
2. ✅ Check authorization: user is OWNER or ADMIN
   - userModule.getUserTeamRole(userId, teamId)
   - Must be "OWNER" or "ADMIN"
3. ✅ Validate team exists
4. ✅ Validate email format
5. ✅ Check: user not already member
6. ✅ Check: no pending invitation exists
```

**Stap 5: Backend Processing**
```java
// InviteTeamMemberCommandHandler.handle()
1. ✅ Validate team exists
2. ✅ Check existing invitation (by email + team)
3. ✅ Generate unique token (UUID)
4. ✅ Create TeamInvitation
   - teamId: 123
   - email: "klaas@example.com"
   - role: MEMBER
   - token: "abc123..."
   - expiresAt: now + 7 days
5. ✅ Save invitation to database
```

**Stap 6: Response**
```json
{
  "id": 1,
  "teamId": 123,
  "email": "klaas@example.com",
  "role": "MEMBER",
  "invitedById": 456,  // Piet's userId
  "token": "abc123def456...",
  "expiresAt": "2024-01-08T12:00:00",
  "acceptedAt": null,
  "createdAt": "2024-01-01T12:00:00"
}
```

**Stap 7: Email Verzenden (TODO)**
```
TODO: Send invitation email to klaas@example.com
Email bevat:
- Team name: "Business Team"
- Inviter: Piet
- Link: /teams/invitations/accept?token=abc123...
- Expires: 7 days
```

**Stap 8: Database State**
```sql
-- team_invitations table
INSERT INTO users.team_invitations (
  team_id, email, role, invited_by_id, token, expires_at
)
VALUES (
  123, 
  'klaas@example.com', 
  'MEMBER', 
  456,  -- Piet's userId
  'abc123def456...',
  '2024-01-08T12:00:00'
);
```

---

## Use Case 3: Invitation Accepteren

### Begin State

**Invited User (Klaas):**
- ✅ Heeft invitation ontvangen (email met token)
- ✅ Is ingelogd met eigen account
- ✅ Token is nog geldig (niet expired)
- ❌ Is nog geen lid van het team

**Team Owner (Piet):**
- ✅ Team bestaat nog steeds
- ✅ Invitation is nog pending

### End State

**Invited User (Klaas):**
- ✅ Is lid geworden van het team
- ✅ Status: ACTIVE member
- ✅ Role: MEMBER (zoals in invitation)
- ✅ Database: `team_members` record
- ✅ Invitation is verwijderd (of marked as accepted)

**Team Owner (Piet):**
- ✅ Klaas verschijnt in team members lijst
- ✅ Klaas kan nu team kanban board bekijken (als gedeeld)

### Flow

**Stap 1: User klikt op invitation link**
```
Klaas → Email link → /teams/invitations/accept?token=abc123...
```

**Stap 2: Frontend detecteert token**
```typescript
// Frontend: Extract token from URL
const token = searchParams.get('token')
// → POST /api/v2/users/teams/invitations/{token}/accept
// → Authorization: Bearer {klaas_token}
```

**Stap 3: Frontend API call**
```typescript
acceptTeamInvitation(token)
// → POST /api/v2/users/teams/invitations/abc123.../accept
// → Authorization: Bearer {klaas_token}
```

**Stap 4: Backend Validatie**
```java
// TeamController.acceptInvitation()
1. ✅ Check authentication (Klaas is ingelogd)
2. ✅ Find invitation by token
3. ✅ Validate: invitation not expired
4. ✅ Validate: invitation not already accepted
5. ✅ Validate: user exists (Klaas)
6. ✅ Validate: user email matches invitation email
7. ✅ Check: user not already member
```

**Stap 5: Backend Processing**
```java
// AcceptTeamInvitationCommandHandler.handle()
1. ✅ Find invitation by token
2. ✅ Validate invitation (not expired, not accepted)
3. ✅ Mark invitation as accepted
4. ✅ Create TeamMember
   - teamId: 123
   - userId: 789  // Klaas's userId
   - role: MEMBER
   - status: ACTIVE
   - invitedById: 456  // Piet's userId
   - joinedAt: now
5. ✅ Save team member
6. ✅ Delete invitation (or mark as accepted)
```

**Stap 6: Response**
```json
{
  "id": 2,
  "teamId": 123,
  "userId": 789,  // Klaas's userId
  "role": "MEMBER",
  "status": "ACTIVE",
  "invitedById": 456,  // Piet's userId
  "joinedAt": "2024-01-01T13:00:00",
  "createdAt": "2024-01-01T13:00:00"
}
```

**Stap 7: Database State**
```sql
-- team_members table (nieuwe member)
INSERT INTO users.team_members (
  team_id, user_id, role, status, invited_by_id, joined_at
)
VALUES (
  123,      -- Business Team
  789,      -- Klaas's userId
  'MEMBER',
  'ACTIVE',
  456,      -- Piet's userId (inviter)
  '2024-01-01T13:00:00'
);

-- team_invitations table (verwijderd of marked as accepted)
DELETE FROM users.team_invitations WHERE token = 'abc123...';
-- OF
UPDATE users.team_invitations 
SET accepted_at = '2024-01-01T13:00:00' 
WHERE token = 'abc123...';
```

**Stap 8: Frontend Redirect**
```
Klaas → Redirect naar /teams/123
      → Ziet nu team details
      → Ziet zichzelf in members lijst
```

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ BEGIN: No Team                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Piet (Owner)                                              │
│  ┌─────────────────┐                                       │
│  │ No Teams        │                                       │
│  └─────────────────┘                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1. Create Team
                            │ POST /api/v2/users/teams
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Team Created                                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Piet (Owner)                                              │
│  ┌─────────────────┐                                       │
│  │ Business Team   │                                       │
│  │ Members: Piet   │                                       │
│  └─────────────────┘                                       │
│                                                             │
│  Database:                                                  │
│  - teams: {id: 123, owner_id: 456}                         │
│  - team_members: {team_id: 123, user_id: 456, role: OWNER}│
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 2. Invite Member
                            │ POST /api/v2/users/teams/123/members/invite
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ Invitation Sent                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Piet (Owner)              Klaas (Invited)                  │
│  ┌─────────────────┐       ┌─────────────────┐           │
│  │ Business Team   │       │ Email Received  │           │
│  │ Members: Piet   │       │ - Invitation    │           │
│  │ Invitations: 1   │       │ - Token: abc123 │           │
│  └─────────────────┘       └─────────────────┘           │
│                                                             │
│  Database:                                                  │
│  - team_invitations: {email: klaas@..., token: abc123}    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 3. Accept Invitation
                            │ POST /api/v2/users/teams/invitations/abc123/accept
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ END: Team with Members                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Piet (Owner)              Klaas (Member)                   │
│  ┌─────────────────┐       ┌─────────────────┐           │
│  │ Business Team   │       │ Business Team    │           │
│  │ Members:        │       │ - Member        │           │
│  │ - Piet (OWNER)  │       │ - Can view team  │           │
│  │ - Klaas (MEMBER)│       │ - Can view kanban│           │
│  └─────────────────┘       │   (if shared)  │           │
│                             └─────────────────┘           │
│                                                             │
│  Database:                                                  │
│  - team_members:                                            │
│    {team_id: 123, user_id: 456, role: OWNER}              │
│    {team_id: 123, user_id: 789, role: MEMBER}              │
│  - team_invitations: DELETED                               │
└─────────────────────────────────────────────────────────────┘
```

## Security & Validatie

### Team Aanmaken
- ✅ Alleen ingelogde gebruikers kunnen teams aanmaken
- ✅ Owner wordt automatisch OWNER member
- ✅ Team name is required
- ✅ Backend valideert dat ownerId overeenkomt met authenticated user

### Lid Uitnodigen
- ✅ Alleen OWNER of ADMIN kan uitnodigen
- ✅ Email validatie (format check)
- ✅ Geen duplicate invitations (check op pending invitations)
- ✅ Geen duplicate members (check op existing members)
- ✅ Token wordt gegenereerd (UUID, uniek)
- ✅ Expiration: 7 dagen

### Invitation Accepteren
- ✅ Token moet geldig zijn (niet expired)
- ✅ Token moet uniek zijn
- ✅ User moet ingelogd zijn
- ✅ User email moet matchen met invitation email (security)
- ✅ Invitation kan maar 1x geaccepteerd worden
- ✅ User kan niet al member zijn

## Edge Cases

### 1. User bestaat nog niet
- **Scenario**: Piet nodigt email uit die nog niet geregistreerd is
- **Resultaat**: Invitation wordt aangemaakt, user kan later account maken en accepteren
- **Database**: `team_invitations` record met email (geen userId nodig)
- **Note**: Bij acceptance moet email wel matchen

### 2. Duplicate Invitation
- **Scenario**: Piet nodigt Klaas 2x uit
- **Resultaat**: Error "User already invited to this team"
- **Backend**: Check `findByTeamIdAndEmail` voor pending invitations
- **Preventie**: Backend validatie voorkomt duplicate

### 3. Expired Invitation
- **Scenario**: Klaas accepteert invitation na 7 dagen
- **Resultaat**: Error "Invitation has expired"
- **Backend**: Check `expiresAt < now()`
- **Domain Logic**: `TeamInvitation.isExpired()`

### 4. Owner probeert zichzelf uit te nodigen
- **Scenario**: Piet nodigt zijn eigen email uit
- **Resultaat**: Technisch mogelijk, maar niet logisch
- **Aanbeveling**: Frontend check toevoegen (optioneel)
- **Backend**: Geen restrictie (maar niet nodig)

### 5. User accepteert invitation voor ander team
- **Scenario**: Klaas heeft 2 invitations, accepteert verkeerde
- **Resultaat**: Alleen de juiste invitation wordt geaccepteerd (token-based)
- **Security**: Token is uniek per invitation
- **Note**: User kan alleen de invitation accepteren waarvan hij de token heeft

### 6. User accepteert invitation met verkeerd email
- **Scenario**: Klaas is ingelogd met email "klaas@example.com", maar invitation is voor "klaas2@example.com"
- **Resultaat**: Error "User email does not match invitation email"
- **Security**: Backend check voorkomt dat verkeerde user invitation accepteert

### 7. Team wordt verwijderd tijdens pending invitation
- **Scenario**: Piet verwijderd team terwijl Klaas nog invitation heeft
- **Resultaat**: Invitation wordt ongeldig (CASCADE delete)
- **Database**: `ON DELETE CASCADE` op `team_invitations.team_id`

## Test Scenarios

### Scenario 1: Happy Path
1. ✅ Piet maakt team aan
2. ✅ Piet nodigt Klaas uit
3. ✅ Klaas accepteert invitation
4. ✅ Klaas is nu team member
5. ✅ Klaas kan team details bekijken

### Scenario 2: Authorization
1. ✅ Non-owner kan niet uitnodigen
2. ✅ Non-member kan niet uitnodigen
3. ✅ Alleen OWNER/ADMIN kan uitnodigen
4. ✅ Alleen OWNER kan team settings wijzigen

### Scenario 3: Duplicate Prevention
1. ✅ Kan niet 2x dezelfde user uitnodigen (pending invitation)
2. ✅ Kan niet user uitnodigen die al member is
3. ✅ Kan niet duplicate invitation maken
4. ✅ Kan niet invitation accepteren als al member

### Scenario 4: Expiration
1. ✅ Invitation verloopt na 7 dagen
2. ✅ Expired invitation kan niet geaccepteerd worden
3. ✅ Error message is duidelijk

### Scenario 5: Email Matching
1. ✅ User moet ingelogd zijn met email die matcht invitation
2. ✅ Verkeerde email geeft error
3. ✅ Security: voorkomt dat verkeerde user invitation accepteert

## API Endpoints

### Create Team
```
POST /api/v2/users/teams
Authorization: Bearer {token}
Body: {
  "name": "Business Team",
  "description": "Team voor business doelen",
  "ownerId": 456
}
Response: 201 Created
{
  "id": 123,
  "name": "Business Team",
  "description": "Team voor business doelen",
  "ownerId": 456,
  "status": "ACTIVE",
  "createdAt": "2024-01-01T12:00:00",
  "updatedAt": "2024-01-01T12:00:00"
}
```

### Invite Team Member
```
POST /api/v2/users/teams/{teamId}/members/invite
Authorization: Bearer {token}
Body: {
  "email": "klaas@example.com",
  "role": "MEMBER"
}
Response: 201 Created
{
  "id": 1,
  "teamId": 123,
  "email": "klaas@example.com",
  "role": "MEMBER",
  "invitedById": 456,
  "token": "abc123def456...",
  "expiresAt": "2024-01-08T12:00:00",
  "acceptedAt": null,
  "createdAt": "2024-01-01T12:00:00"
}
```

### Accept Team Invitation
```
POST /api/v2/users/teams/invitations/{token}/accept
Authorization: Bearer {token}
Response: 200 OK
{
  "id": 2,
  "teamId": 123,
  "userId": 789,
  "role": "MEMBER",
  "status": "ACTIVE",
  "invitedById": 456,
  "joinedAt": "2024-01-01T13:00:00",
  "createdAt": "2024-01-01T13:00:00"
}
```

### Get Teams by User
```
GET /api/v2/users/teams/user/{userId}
Authorization: Bearer {token}
Response: 200 OK
[
  {
    "id": 123,
    "name": "Business Team",
    "description": "Team voor business doelen",
    "ownerId": 456,
    "status": "ACTIVE",
    "createdAt": "2024-01-01T12:00:00",
    "updatedAt": "2024-01-01T12:00:00"
  }
]
```

### Get Team Members
```
GET /api/v2/users/teams/{teamId}/members
Authorization: Bearer {token}
Response: 200 OK
[
  {
    "id": 1,
    "teamId": 123,
    "userId": 456,
    "role": "OWNER",
    "status": "ACTIVE",
    "invitedById": 456,
    "joinedAt": "2024-01-01T12:00:00",
    "createdAt": "2024-01-01T12:00:00"
  },
  {
    "id": 2,
    "teamId": 123,
    "userId": 789,
    "role": "MEMBER",
    "status": "ACTIVE",
    "invitedById": 456,
    "joinedAt": "2024-01-01T13:00:00",
    "createdAt": "2024-01-01T13:00:00"
  }
]
```

## Implementatie Status

### ✅ Geïmplementeerd (Backend)
- ✅ Database schema: `teams`, `team_members`, `team_invitations`
- ✅ Domain entities: `Team`, `TeamMember`, `TeamInvitation`
- ✅ Repositories: `TeamRepository`, `TeamMemberRepository`, `TeamInvitationRepository`
- ✅ Command handlers: `CreateTeamCommandHandler`, `InviteTeamMemberCommandHandler`, `AcceptTeamInvitationCommandHandler`
- ✅ Query handlers: `GetTeamQueryHandler`, `GetTeamsByUserQueryHandler`, `GetTeamMembersQueryHandler`
- ✅ REST API: `TeamController` met alle endpoints
- ✅ Validatie en authorization checks
- ✅ Email matching bij acceptance (security)

### ⚠️ Nog te implementeren (Frontend)
- ⚠️ Team creation UI (`/teams/create`)
- ⚠️ Team list page (`/teams`)
- ⚠️ Team detail page (`/teams/{teamId}`)
- ⚠️ Invite member form (in team detail)
- ⚠️ Invitation acceptance page (`/teams/invitations/accept?token=...`)
- ⚠️ Team members list (in team detail)
- ⚠️ API client hooks (`useCreateTeam`, `useInviteMember`, `useAcceptInvitation`)

### ⚠️ Nog te implementeren (Backend)
- ⚠️ Email service: Invitation emails versturen
- ⚠️ Email templates voor invitations
- ⚠️ Invitation link generation (frontend URL)

## Conclusie

**Begin State:** Geen team, geen members

**End State:** Team met owner en members, klaar voor kanban sharing

**Key Points:**
- ✅ Owner wordt automatisch OWNER member bij team creation
- ✅ Invitations zijn token-based (veilig, uniek)
- ✅ Backend validatie voorkomt duplicates en security issues
- ✅ Email matching bij acceptance (security)
- ✅ Expiration: invitations verlopen na 7 dagen
- ✅ Clean architecture: domain logic in entities, validatie in handlers

**Volgende Stap:** 
Na team creation en member management, kan de team owner zijn kanban board delen met het team (zie `TEAM_KANBAN_SHARE_USECASE.md`).
