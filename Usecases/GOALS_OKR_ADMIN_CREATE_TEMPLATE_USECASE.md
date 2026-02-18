# Use Case: Admin Creëert OKR Template

## Overzicht

Deze use case beschrijft het aanmaken en bewerken van OKR templates door admins. Dit is de "content" kant van Goals/OKR – de gestandaardiseerde objectives, key results en initiatives die gebruikers kunnen kiezen en oppakken.

## Actoren

- **Admin / Content Editor**: Beheert de OKR-structuur van wheels

## Data Hiërarchie

```
Wheel
  └── Life Domain
        └── Objective (template)
              └── Key Result (template)
                    └── Initiative (template)
```

## Flow

### Objectives aanmaken

**Stap 1: Frontend API call**
```typescript
POST /api/v2/goals-okr/objectives
Body: {
  lifeDomainId: number,
  titleNl: string,
  titleEn: string,
  descriptionNl?: string,
  descriptionEn?: string,
  orderIndex: number
}
```

**Backend:** CreateObjectiveCommandHandler
- Maakt Objective template aan onder life domain

**Stap 2: Objective verwijderen**
```typescript
DELETE /api/v2/goals-okr/objectives/{objectiveId}
```
- Cascade delete: UserObjectiveInstances, KanbanItems, KeyResults, etc.

### Key Results aanmaken

**Stap 1: Frontend API call**
```typescript
POST /api/v2/goals-okr/key-results
Body: {
  objectiveId: number,
  titleNl: string,
  titleEn: string,
  descriptionNl?: string,
  descriptionEn?: string,
  targetValue: number,
  unit: string,
  orderIndex: number
}
```

**Backend:** CreateKeyResultCommandHandler

**Stap 2: Key Result verwijderen**
```typescript
DELETE /api/v2/goals-okr/key-results/{keyResultId}
```

### Initiatives (templates) aanmaken

```typescript
POST /api/v2/goals-okr/initiatives
Body: {
  keyResultId: number,
  titleNl: string,
  titleEn: string,
  descriptionNl?: string,
  descriptionEn?: string,
  displayOrder: number,
  learningFlowTemplateId?: number
}

PUT /api/v2/goals-okr/initiatives/{initiativeId}
DELETE /api/v2/goals-okr/initiatives/{initiativeId}
```

## API Endpoints

```
POST   /api/v2/goals-okr/objectives
GET    /api/v2/goals-okr/objectives/{id}
DELETE /api/v2/goals-okr/objectives/{objectiveId}

POST   /api/v2/goals-okr/key-results
GET    /api/v2/goals-okr/key-results/{id}
DELETE /api/v2/goals-okr/key-results/{keyResultId}
GET    /api/v2/goals-okr/objectives/{objectiveId}/key-results

POST   /api/v2/goals-okr/initiatives
GET    /api/v2/goals-okr/initiatives/{id}
PUT    /api/v2/goals-okr/initiatives/{id}
DELETE /api/v2/goals-okr/initiatives/{initiativeId}
GET    /api/v2/goals-okr/key-results/{keyResultId}/initiatives
```

## Opmerkingen

- **Wheels en Life Domains** worden typisch via database migrations of aparte admin flows beheerd, niet via deze use case.
- **Delete constraints:** Objective kan niet worden verwijderd als er UserObjectiveInstances zijn, tenzij cascade delete (zie DeleteObjectiveCommandHandler – cascade is geïmplementeerd).

## Gerelateerde Use Cases

- **GOALS_OKR_BROWSE_TEMPLATES_USECASE** – Gebruikers bekijken de templates die hier worden aangemaakt
- **GOALS_OKR_SELECT_TEMPLATE_USECASE** – Gebruikers selecteren templates om te starten

## Implementatie Status

- ✅ Backend: CreateObjectiveCommandHandler, CreateKeyResultCommandHandler, CreateInitiativeCommandHandler, DeleteObjectiveCommandHandler, DeleteKeyResultCommandHandler
- ⚠️ Frontend: CreateKeyResultDialog op objectives/[id] pagina; admin UI voor objectives/initiatives mogelijk beperkt
