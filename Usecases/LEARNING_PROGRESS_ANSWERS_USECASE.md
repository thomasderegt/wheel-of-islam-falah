# Use Case: Learning Progress en Antwoorden

## Overzicht

Deze use case beschrijft het bijhouden van voortgang en antwoorden tijdens een learning flow enrollment. Gebruiker beantwoordt vragen per step en update progress status (NOT_STARTED, IN_PROGRESS, COMPLETED).

## Actoren

- **Gebruiker**: Ingelogde gebruiker die een leerflow doorloopt

## Flow

### Antwoord toevoegen

```
POST /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/answers
Body: {
  "type": "TEXT",
  "answerText": "Mijn reflectie..."
}
```
*AnswerType: TEXT, MULTIPLE_CHOICE, etc.*

### Antwoorden ophalen

```
GET /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/answers?type=TEXT
```

### Progress bijwerken

```
POST /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/progress
Body: { "status": "COMPLETED" }
```
*ProgressStatus: NOT_STARTED, IN_PROGRESS, COMPLETED*

### Progress ophalen

```
GET /api/v2/learning/enrollments/{enrollmentId}/progress
GET /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/progress
```

## API Endpoints

```
POST /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/answers
GET /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/answers
POST /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/progress
GET /api/v2/learning/enrollments/{enrollmentId}/progress
GET /api/v2/learning/enrollments/{enrollmentId}/steps/{stepId}/progress
```

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ⚠️ Frontend: learning flow UI mogelijk in ontwikkeling
