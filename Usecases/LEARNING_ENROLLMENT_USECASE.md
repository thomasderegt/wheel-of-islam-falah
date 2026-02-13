# Use Case: Learning Flow Enrollment Starten

## Overzicht

Deze use case beschrijft het starten van een learning flow enrollment - een gebruiker begint een leerflow gebaseerd op een template. De enrollment koppelt user + template + section.

## Actoren

- **Gebruiker**: Ingelogde gebruiker die een leerflow wil volgen

## Flow

### Enrollment starten

**Stap 1: Gebruiker kiest template**
```
/learning of vanuit initiative (learningFlowTemplateId)
```

**Stap 2: Frontend API call**
```typescript
POST /api/v2/learning/enrollments
Body: {
  "userId": 123,
  "templateId": 1,
  "sectionId": 456
}
```

**Stap 3: Response**
```json
{
  "id": 1,
  "userId": 123,
  "templateId": 1,
  "sectionId": 456,
  "startedAt": "2024-01-01T12:00:00",
  "completedAt": null
}
```

### Enrollment voltooien

```
POST /api/v2/learning/enrollments/{id}/complete
```

### Enrollments ophalen

```
GET /api/v2/learning/enrollments/{id}
GET /api/v2/learning/enrollments/user/{userId}
```

## API Endpoints

```
POST /api/v2/learning/enrollments
GET /api/v2/learning/enrollments/{id}
GET /api/v2/learning/enrollments/user/{userId}
POST /api/v2/learning/enrollments/{id}/complete
```

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ✅ Frontend: useStartEnrollment, learningApi
