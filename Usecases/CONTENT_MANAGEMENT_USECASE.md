# Use Case: Content Beheren (CRUD)

## Overzicht

Deze use case beschrijft het beheren van content door editors/admins: categories, books, chapters, sections, paragraphs aanmaken, wijzigen en verwijderen.

## Actoren

- **Content Editor/Admin**: Gebruiker met rechten om content te beheren

## Flow

### Categories

```
POST /api/v2/content/categories
PUT /api/v2/content/categories/{id}
DELETE /api/v2/content/categories/{id}
GET /api/v2/content/categories
GET /api/v2/content/categories/{id}
```

### Books

```
POST /api/v2/content/books
PUT /api/v2/content/books/{id}
DELETE /api/v2/content/books/{id}
GET /api/v2/content/books/{id}
GET /api/v2/content/categories/{categoryId}/books
```

### Chapters

```
POST /api/v2/content/chapters
PUT /api/v2/content/chapters/{id}
DELETE /api/v2/content/chapters/{id}
GET /api/v2/content/chapters/{id}
GET /api/v2/content/books/{bookId}/chapters
```

### Sections

```
POST /api/v2/content/sections
PUT /api/v2/content/sections/{id}
DELETE /api/v2/content/sections/{id}
GET /api/v2/content/sections/{id}
GET /api/v2/content/chapters/{chapterId}/sections
```

### Paragraphs

```
POST /api/v2/content/paragraphs
PUT /api/v2/content/paragraphs/{id}
DELETE /api/v2/content/paragraphs/{id}
GET /api/v2/content/paragraphs/{id}
GET /api/v2/content/sections/{sectionId}/paragraphs
```

## Hiërarchie

```
Wheel → Category → Book → Chapter → Section → Paragraph
```

## Implementatie Status

- ✅ Backend volledig geïmplementeerd
- ✅ Frontend: content hooks, ContentItemsTable, CreateContentDialog, SectionsList
