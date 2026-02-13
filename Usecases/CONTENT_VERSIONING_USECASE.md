# Use Case: Content Versies Beheren

## Overzicht

Deze use case beschrijft het versioning systeem voor content. Sections, books en chapters hebben versies. Wijzigingen maken nieuwe versies aan; publiceren zet een versie als "published" voor lezers.

## Actoren

- **Content Editor**: Gebruiker die content bewerkt en versies beheert

## Flow

### Nieuwe versie aanmaken

**Section:**
```
POST /api/v2/content/sections/{sectionId}/versions
Body: { content, ... }
```

**Book:**
```
POST /api/v2/content/books/{bookId}/versions
```

**Chapter:**
```
POST /api/v2/content/chapters/{chapterId}/versions
```

### Huidige/gepubliceerde versie ophalen

```
GET /api/v2/content/sections/{id}/versions/current
GET /api/v2/content/sections/{id}/versions/published
GET /api/v2/content/books/{id}/versions/current
GET /api/v2/content/chapters/{id}/versions/current
```

### Versiegeschiedenis

```
GET /api/v2/content/books/{bookId}/versions
GET /api/v2/content/chapters/{chapterId}/versions
GET /api/v2/content/paragraphs/{id}/versions
GET /api/v2/content/sections/{id}/versions
```

### Section publiceren

```
POST /api/v2/content/sections/{sectionId}/publish
```
*Zet huidige versie als published - lezers zien deze*

## API Endpoints

```
POST /api/v2/content/sections/{sectionId}/versions
POST /api/v2/content/sections/{sectionId}/publish
POST /api/v2/content/books/{bookId}/versions
POST /api/v2/content/chapters/{chapterId}/versions
GET /api/v2/content/sections/{id}/versions/current
GET /api/v2/content/sections/{id}/versions/published
GET /api/v2/content/books/{id}/versions/current
GET /api/v2/content/chapters/{id}/versions/current
GET .../versions (history)
```

## Implementatie Status

- ✅ Backend geïmplementeerd
- ✅ Frontend: useVersionHistory, VersionHistoryPanel, VersionComparisonPanel, CreateVersionDialog
