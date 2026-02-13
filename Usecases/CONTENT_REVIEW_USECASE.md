# Use Case: Content Review Workflow

## Overzicht

Deze use case beschrijft het review proces voor content: indienen voor review, goedkeuren of afwijzen, en commentaar toevoegen. Reviewable types: SECTION, BOOK, CHAPTER, etc.

## Actoren

- **Auteur**: Dient content in voor review
- **Reviewer**: Keurt goed of wijst af, met commentaar

## Flow

### Indienen voor review

```
POST /api/v2/content/reviews/submit
Body: {
  "type": "SECTION",
  "referenceId": 123,
  "versionId": 456,
  "submittedBy": 789
}
```

### Goedkeuren

```
POST /api/v2/content/reviews/{id}/approve
Body: { "approvedBy": 789 }
```

### Afwijzen

```
POST /api/v2/content/reviews/{id}/reject
Body: { "rejectedBy": 789, "reason": "..." }
```

### Review commentaar

```
POST /api/v2/content/reviews/{id}/comments
GET /api/v2/content/reviews/{id}/comments
PUT /api/v2/content/reviews/{id}/comments/{commentId}
DELETE /api/v2/content/reviews/{id}/comments/{commentId}
```

### Reviews opvragen

```
GET /api/v2/content/reviews/{id}
GET /api/v2/content/reviews?status=PENDING
GET /api/v2/content/reviews?reviewableType=SECTION&referenceId=123
```

## Review statussen

- PENDING
- APPROVED
- REJECTED

## API Endpoints

```
POST /api/v2/content/reviews/submit
POST /api/v2/content/reviews/{id}/approve
POST /api/v2/content/reviews/{id}/reject
GET /api/v2/content/reviews/{id}
GET /api/v2/content/reviews (by status, by reviewable)
POST/GET/PUT/DELETE .../reviews/{id}/comments
```

## Implementatie Status

- ✅ Backend: ReviewController, SubmitForReview, Approve, Reject, Comments
- ✅ Frontend: useReviews, ReviewsTable, FieldCommentModal, useReviewComments
