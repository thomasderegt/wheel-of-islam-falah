# Scripts

## Create Falah Content

Scripts om de Falah Book en Dashboard Chapter aan te maken.

### Optie 1: SQL Migration (Aanbevolen)

De SQL migration wordt automatisch uitgevoerd wanneer je de backend start of migraties draait.

**Locatie:** `apps/backend-v2/application/src/main/resources/db/migration/V8__Create_falah_book_and_dashboard_chapter.sql`

**Uitvoeren:**
```bash
cd apps/backend-v2
mvn flyway:migrate -pl application
```

Of start de backend, dan worden migraties automatisch uitgevoerd.

### Optie 2: TypeScript Script (Via API)

Als je het handmatig wilt doen via de API:

**Locatie:** `apps/frontend-v2/scripts/create-falah-content.ts`

**Vereisten:**
- Je moet ingelogd zijn (token in localStorage)
- Of set `AUTH_TOKEN` environment variable

**Uitvoeren:**
```bash
cd apps/frontend-v2

# Met tsx (als geïnstalleerd)
npx tsx scripts/create-falah-content.ts

# Of met ts-node
npx ts-node scripts/create-falah-content.ts
```

**Met environment variable:**
```bash
AUTH_TOKEN=your_token_here npx tsx scripts/create-falah-content.ts
```

### Wat wordt aangemaakt?

1. **Falah Book** in Category #0
   - BookVersion met title "Falah" (EN/NL)
   - Intro tekst over Falah

2. **Dashboard Chapter** (position = 0)
   - ChapterVersion met title "Dashboard" (EN/NL)
   - Intro tekst over het dashboard

### Na uitvoeren

Na het uitvoeren van een van de scripts, kun je naar het dashboard navigeren:
- Via homepage: klik op het centrale Falah cirkel
- Direct: `/chapter/[chapterId]/overview` (chapterId wordt getoond na script uitvoer)
