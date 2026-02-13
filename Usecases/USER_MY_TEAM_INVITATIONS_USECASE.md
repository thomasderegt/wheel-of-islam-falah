# Use Case: Mijn Team Uitnodigingen Bekijken

## Overzicht

Deze use case beschrijft het ophalen van alle openstaande team uitnodigingen voor de ingelogde gebruiker. Gebruiker ziet welke teams hem hebben uitgenodigd en kan accepteren of afwijzen (zie TEAM_CREATION_AND_MEMBERS_USECASE).

## Actoren

- **Gebruiker**: Ingelogde gebruiker die uitnodigingen heeft ontvangen

## Begin State

- ✅ Gebruiker is ingelogd
- ✅ Er bestaan mogelijk pending invitations voor dit email adres
- ❌ Lijst nog niet geladen

## End State

- ✅ Lijst van pending team invitations zichtbaar
- ✅ Per invitation: team naam, inviter, role, expiresAt
- ✅ Gebruiker kan accepteren of afwijzen

## Flow

**Stap 1: Gebruiker navigeert naar invitations**
```
/teams/invitations of /user/settings (invitations sectie)
Of: GET my invitations bij laden van teams pagina
```

**Stap 2: Frontend API call**
```typescript
// teamsApi.getMyInvitations() of vergelijkbaar
GET /api/v2/users/team-invitations
// → Authorization: Bearer {token}
// → userId uit JWT (@AuthenticationPrincipal)
```

**Stap 3: Backend Processing**
```java
// GetInvitationsForUserQueryHandler.handle()
1. ✅ Get userId from authenticated context
2. ✅ Find invitations where email = user.email AND accepted_at IS NULL
3. ✅ Join met team en inviter info
4. ✅ Filter expired
```

**Stap 4: Response**
```json
[
  {
    "id": 1,
    "teamId": 123,
    "teamName": "Business Team",
    "role": "MEMBER",
    "invitedById": 456,
    "inviterName": "Piet",
    "token": "abc123...",
    "expiresAt": "2024-01-08T12:00:00",
    "createdAt": "2024-01-01T12:00:00"
  }
]
```

**Stap 5: Gebruiker acties**
```
- Accepteren → POST /api/v2/users/teams/invitations/{token}/accept
- Afwijzen → POST /api/v2/users/teams/invitations/{token}/decline
```

## API Endpoint

```
GET /api/v2/users/team-invitations
Authorization: Bearer {token}
Response: 200 OK, List<MyTeamInvitationResponseDTO>
```

## Relatie met andere use cases

- **Accepteren**: Zie TEAM_CREATION_AND_MEMBERS_USECASE (Use Case 3)
- **Afwijzen**: DeclineTeamInvitationCommandHandler

## Implementatie Status

- ✅ Backend: UserTeamInvitationsController, GetInvitationsForUserQueryHandler
- ⚠️ Frontend: UI voor invitations lijst mogelijk in teams feature
