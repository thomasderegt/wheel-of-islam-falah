# Use Case: Publieke Content Lezen

## Overzicht

Deze use case beschrijft het lezen van gepubliceerde content (books, chapters, sections, paragraphs) zonder authenticatie. Gebruikt voor lezers die content willen consumeren.

## Actoren

- **Lezer**: Iedereen (anoniem of ingelogd) die content wil lezen

## Flow

### Wheels en categories

```
GET /api/v2/content/wheels
GET /api/v2/content/categories
GET /api/v2/content/categories/wheel/{wheelId}
GET /api/v2/content/wheels/key/{wheelKey}
```

### Public books per category

```
GET /api/v2/content/categories/{categoryId}/books?public=true
// Of: GetPublicBooksByCategory
```

### Public chapters, sections, paragraphs

```
GET /api/v2/content/books/{bookId}/chapters?public=true
GET /api/v2/content/chapters/{chapterId}/sections?public=true
GET /api/v2/content/sections/{sectionId}/paragraphs?public=true
```

### Published version van section

```
GET /api/v2/content/sections/{id}/versions/published
```
*Retourneert de gepubliceerde versie van een section voor lezers*

## API Endpoints (public)

```
GET /api/v2/content/wheels
GET /api/v2/content/wheels/key/{wheelKey}
GET /api/v2/content/categories
GET /api/v2/content/categories/wheel/{wheelId}
GET /api/v2/content/categories/{categoryId}/books (public filter)
GET /api/v2/content/books/{id}
GET /api/v2/content/books/{bookId}/chapters (public)
GET /api/v2/content/chapters/{id}
GET /api/v2/content/chapters/{chapterId}/sections (public)
GET /api/v2/content/sections/{id}
GET /api/v2/content/sections/{id}/versions/published
GET /api/v2/content/sections/{sectionId}/paragraphs (public)
GET /api/v2/content/paragraphs/{id}
```

## Implementatie Status

- ✅ Backend: GetPublicBooksByCategory, GetPublicChaptersByBook, etc.
- ✅ Frontend: usePublicBooksByCategory, usePublicChaptersByBook, SectionViewer, BookSwitcher
