# Toevoegen van Attribuut aan Database tabel - Wijzigingen Overzicht

Dit document beschrijft alle wijzigingen die nodig waren om het `subtitle` attribuut toe te voegen aan de Category entity, en waarom elke wijziging nodig was.

## Architectuur Overzicht

De applicatie gebruikt **Clean Architecture** met de volgende lagen:
1. **Database** - PostgreSQL tabellen
2. **Infrastructure Layer** - JPA entities (database mapping)
3. **Domain Layer** - Domain entities (pure POJOs, business logic)
4. **Application Layer** - Result DTOs en handlers
5. **API Layer** - Web DTOs en controllers
6. **Frontend** - TypeScript types

Elke laag moet worden aangepast om een nieuw attribuut door de hele stack te laten stromen.

---

## 1. Database Migratie

**Bestand:** `backend/application/src/main/resources/db/migration/V12__Add_subtitle_fields_to_categories.sql`

**Waarom:** De database schema moet eerst worden uitgebreid voordat de applicatie de nieuwe velden kan gebruiken.

**Wat er aangepast werd:**
```sql
-- Add subtitle_nl column if it doesn't exist
ALTER TABLE content.categories 
ADD COLUMN subtitle_nl VARCHAR(255);

-- Add subtitle_en column if it doesn't exist
ALTER TABLE content.categories 
ADD COLUMN subtitle_en VARCHAR(255);
```

**Waarom deze aanpak:**
- Gebruikt `IF NOT EXISTS` check om idempotent te zijn (kan meerdere keren draaien zonder fout)
- VARCHAR(255) voor consistentie met andere tekstvelden zoals `title_nl` en `title_en`
- NULL toegestaan omdat subtitle optioneel is

---

## 2. JPA Entity (Infrastructure Layer)

**Bestand:** `backend/content-module/src/main/java/com/woi/content/infrastructure/persistence/entities/CategoryJpaEntity.java`

**Waarom:** JPA entities mappen database kolommen naar Java objecten. Zonder deze mapping kan JPA de nieuwe kolommen niet lezen/schrijven.

**Wat er aangepast werd:**
```java
@Column(name = "subtitle_nl")
private String subtitleNl;

@Column(name = "subtitle_en")
private String subtitleEn;

// + getters en setters
```

**Waarom deze aanpak:**
- `@Column` annotation mapt naar database kolom namen (`subtitle_nl`, `subtitle_en`)
- Geen `nullable = false` omdat subtitle optioneel is
- Getters en setters nodig voor JPA om de velden te kunnen lezen/schrijven

---

## 3. Domain Entity (Domain Layer)

**Bestand:** `backend/content-module/src/main/java/com/woi/content/domain/entities/Category.java`

**Waarom:** Domain entities bevatten de business logic en zijn onafhankelijk van database technologie. Dit is de "single source of truth" voor Category data.

**Wat er aangepast werd:**
```java
private String subtitleNl;
private String subtitleEn;

// Getters
public String getSubtitleNl() { return subtitleNl; }
public String getSubtitleEn() { return subtitleEn; }

// Setters (alleen voor mapping, niet voor business logic)
public void setSubtitleNl(String subtitleNl) { this.subtitleNl = subtitleNl; }
public void setSubtitleEn(String subtitleEn) { this.subtitleEn = subtitleEn; }
```

**Waarom deze aanpak:**
- Domain entity is een pure POJO (geen JPA annotations)
- Setters zijn gemarkeerd als "ONLY for entity mapping" - business logic gebruikt deze niet direct
- Getters maken de data beschikbaar voor andere lagen

---

## 4. Entity Mapper (Infrastructure Layer)

**Bestand:** `backend/content-module/src/main/java/com/woi/content/infrastructure/persistence/mappers/CategoryEntityMapper.java`

**Waarom:** Mappers converteren tussen Domain entities (pure POJOs) en JPA entities (database mapping). Zonder mapping worden de subtitle velden niet gekopieerd.

**Wat er aangepast werd:**
```java
// In toDomain() method:
category.setSubtitleNl(jpaEntity.getSubtitleNl());
category.setSubtitleEn(jpaEntity.getSubtitleEn());

// In toJpa() method:
jpaEntity.setSubtitleNl(domain.getSubtitleNl());
jpaEntity.setSubtitleEn(domain.getSubtitleEn());
```

**Waarom deze aanpak:**
- Twee-richting mapping: Domain ↔ JPA
- Zonder deze mapping worden subtitle velden niet gekopieerd bij conversie
- Dit is de "brug" tussen domain en infrastructure layer

---

## 5. Application Result DTO

**Bestand:** `backend/content-module/src/main/java/com/woi/content/application/results/CategoryResult.java`

**Waarom:** Application layer gebruikt Result DTOs om data tussen handlers en andere lagen te transporteren. Zonder subtitle in de Result wordt het niet doorgegeven.

**Wat er aangepast werd:**
```java
public record CategoryResult(
    // ... andere velden
    String subtitleNl,
    String subtitleEn,
    // ... andere velden
) {
    public static CategoryResult from(Category category) {
        return new CategoryResult(
            // ... andere velden
            category.getSubtitleNl(),
            category.getSubtitleEn(),
            // ... andere velden
        );
    }
}
```

**Waarom deze aanpak:**
- Record type voor immutable data transfer
- `from()` factory method converteert Domain entity naar Result
- Zonder subtitle in de record wordt het niet meegenomen in API responses

---

## 6. Web DTO (API Layer)

**Bestand:** `backend/content-module/src/main/java/com/woi/content/infrastructure/web/dtos/CategoryDTO.java`

**Waarom:** Web DTOs zijn wat de REST API teruggeeft aan clients. Zonder subtitle in de DTO wordt het niet in JSON responses opgenomen.

**Wat er aangepast werd:**
```java
private String subtitleNl;
private String subtitleEn;

// Getters en setters
public String getSubtitleNl() { return subtitleNl; }
public void setSubtitleNl(String subtitleNl) { this.subtitleNl = subtitleNl; }
// ... etc
```

**Waarom deze aanpak:**
- DTOs worden automatisch geserialiseerd naar JSON door Spring
- Getters/setters nodig voor Jackson JSON serialization
- Dit is wat de frontend ontvangt via de API

---

## 7. API Summary DTO

**Bestand:** `backend/content-module/src/main/java/com/woi/content/api/CategorySummary.java`

**Waarom:** CategorySummary wordt gebruikt voor module-to-module communicatie en public API responses. Zonder subtitle wordt het niet meegenomen.

**Wat er aangepast werd:**
```java
public record CategorySummary(
    Long id,
    String titleNl,
    String titleEn,
    String subtitleNl,      // TOEGEVOEGD
    String subtitleEn,      // TOEGEVOEGD
    String descriptionNl,
    String descriptionEn,
    List<BookSummary> books
) {
```

**Waarom deze aanpak:**
- Record type voor immutable data
- Gebruikt voor public API endpoints die categories met hierarchy teruggeven
- Alle plaatsen waar `new CategorySummary(...)` wordt aangeroepen moeten ook worden aangepast

---

## 8. Query Handlers

**Bestanden:**
- `GetCategoryWithHierarchyQueryHandler.java`
- `GetPublicCategoriesQueryHandler.java`

**Waarom:** Deze handlers bouwen CategorySummary objecten. Zonder subtitle in de constructor call wordt het niet meegenomen.

**Wat er aangepast werd:**
```java
return new CategorySummary(
    category.getId(),
    category.getTitleNl(),
    category.getTitleEn(),
    category.getSubtitleNl(),    // TOEGEVOEGD
    category.getSubtitleEn(),    // TOEGEVOEGD
    category.getDescriptionNl(),
    category.getDescriptionEn(),
    bookSummaries
);
```

**Waarom deze aanpak:**
- Handlers zijn verantwoordelijk voor het bouwen van response objecten
- Alle constructor calls moeten worden aangepast wanneer een record veld wordt toegevoegd
- Anders compileert de code niet (record constructors zijn strict)

---

## 9. Controller Mapping

**Bestand:** `backend/content-module/src/main/java/com/woi/content/infrastructure/web/controllers/ContentController.java`

**Waarom:** Controllers converteren Application Result DTOs naar Web DTOs. Zonder mapping wordt subtitle niet gekopieerd.

**Wat er aangepast werd:**
```java
private CategoryDTO toCategoryDTO(CategoryResult result) {
    CategoryDTO dto = new CategoryDTO();
    // ... andere mappings
    dto.setSubtitleNl(result.subtitleNl());
    dto.setSubtitleEn(result.subtitleEn());
    // ... andere mappings
    return dto;
}
```

**Waarom deze aanpak:**
- Handmatige mapping tussen Result en DTO
- Zonder deze mapping wordt subtitle niet in de JSON response opgenomen
- Dit is de laatste stap voordat data naar de frontend gaat

---

## 10. Frontend TypeScript Types

**Bestand:** `frontend/src/shared/api/types.ts`

**Waarom:** TypeScript types definiëren wat de frontend kan verwachten van de API. Zonder subtitle in de type wordt het niet herkend door TypeScript.

**Wat er aangepast werd:**
```typescript
export interface CategoryDTO {
  id: number
  categoryNumber: number | null
  titleNl: string
  titleEn: string
  subtitleNl: string | null    // TOEGEVOEGD
  subtitleEn: string | null     // TOEGEVOEGD
  descriptionNl: string | null
  descriptionEn: string | null
  createdAt: string
  updatedAt: string
}
```

**Waarom deze aanpak:**
- TypeScript types zorgen voor type safety in de frontend
- `| null` omdat subtitle optioneel is
- Zonder deze types kan de frontend subtitle niet type-safe gebruiken

---

## Samenvatting: Waarom Zoveel Wijzigingen?

De applicatie gebruikt **Clean Architecture** met strikte scheiding tussen lagen:

1. **Database** → Data opslag
2. **JPA Entity** → Database mapping (infrastructure)
3. **Domain Entity** → Business logic (domain)
4. **Mapper** → Converteert tussen domain en infrastructure
5. **Result DTO** → Application layer data transfer
6. **Web DTO** → API response format
7. **Summary DTO** → Public API format
8. **Handlers** → Bouwen response objecten
9. **Controller** → Mapt Result naar Web DTO
10. **Frontend Types** → TypeScript type definitions

Elke laag heeft een specifieke verantwoordelijkheid en moet worden aangepast om data door de hele stack te laten stromen. Dit zorgt voor:
- **Type safety** op elke laag
- **Scheiding van concerns** (database, business logic, API)
- **Testbaarheid** (elke laag kan onafhankelijk getest worden)
- **Onderhoudbaarheid** (wijzigingen zijn gelokaliseerd per laag)

---

## Checklist voor Toekomstige Attribuut Toevoegingen

Wanneer je een nieuw attribuut toevoegt aan een entity, pas dan deze lagen aan:

- [ ] Database migratie (SQL)
- [ ] JPA Entity (infrastructure/persistence/entities)
- [ ] Domain Entity (domain/entities)
- [ ] Entity Mapper (infrastructure/persistence/mappers)
- [ ] Application Result DTO (application/results)
- [ ] Web DTO (infrastructure/web/dtos)
- [ ] API Summary DTO (api) - indien van toepassing
- [ ] Query Handlers - alle plaatsen waar Summary/Result wordt gebouwd
- [ ] Controller mapping methoden
- [ ] Frontend TypeScript types

**Tip:** Gebruik "Find Usages" in je IDE om alle plaatsen te vinden waar een entity/DTO wordt gebruikt.

---

## Voorbeeld: Database Tabel Update

Als voorbeeld, hier is hoe de database tabel eruit ziet na de migratie:

```sql
-- Voor de migratie:
CREATE TABLE content.categories (
    id BIGSERIAL PRIMARY KEY,
    category_number INTEGER,
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Na migratie V12:
-- De tabel heeft nu ook:
-- subtitle_nl VARCHAR(255)
-- subtitle_en VARCHAR(255)
```

De migratie voegt de kolommen toe zonder bestaande data te beïnvloeden (NULL waarden voor bestaande rijen).
