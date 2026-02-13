# Use Case: Learning Flow Templates Beheren

## Overzicht

Deze use case beschrijft het aanmaken en beheren van learning flow templates. Een template koppelt een section aan stappen (steps) met vragen. Gebruikt door content editors om leerflows te configureren.

## Actoren

- **Content Editor**: Maakt learning templates aan voor sections

## Flow

### Template aanmaken

```
POST /api/v2/learning/templates
Body: {
  "name": "Reflectie op gebed",
  "description": "...",
  "sectionId": 123,
  "createdBy": 456
}
```

### Template steps toevoegen

```
POST /api/v2/learning/templates/{templateId}/steps
Body: {
  "paragraphId": 789,
  "orderIndex": 0,
  "questionText": "Wat heb je geleerd?"
}
```

### Templates ophalen

```
GET /api/v2/learning/templates
GET /api/v2/learning/templates/{id}
GET /api/v2/learning/templates/section/{sectionId}
```

### Steps ophalen

```
GET /api/v2/learning/templates/{templateId}/steps
```

### Verwijderen

```
DELETE /api/v2/learning/templates/{id}
DELETE /api/v2/learning/templates/{templateId}/steps/{stepId}
```

## API Endpoints

```
POST /api/v2/learning/templates
GET /api/v2/learning/templates
GET /api/v2/learning/templates/{id}
GET /api/v2/learning/templates/section/{sectionId}
DELETE /api/v2/learning/templates/{id}
POST /api/v2/learning/templates/{templateId}/steps
GET /api/v2/learning/templates/{templateId}/steps
DELETE /api/v2/learning/templates/{templateId}/steps/{stepId}
```

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ✅ Frontend: useTemplates, useTemplatesForSection, TemplatesTable, TemplateFilterPanel
