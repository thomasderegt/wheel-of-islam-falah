# Wheel of Islam - Falah

Full-stack applicatie met Next.js frontend en Spring Boot backend.

## Project Structuur

```
wheel-of-islam-falah/
├── frontend/          # Next.js frontend applicatie
└── backend/           # Spring Boot multi-module backend
    └── application/   # Main application module (hier start je de backend)
```

## Vereisten

- **Node.js** (v18 of hoger)
- **Java** 17
- **Maven** 3.9+
- **PostgreSQL** (lokaal draaiend op poort 5432)

## Snel Starten

### Backend Starten

⚠️ **Belangrijk:** Start de backend vanuit de `backend/application` directory, niet vanuit `backend/`!

```bash
cd backend/application
mvn spring-boot:run
```

De backend draait op: **http://localhost:8080**

### Frontend Starten

```bash
cd frontend
npm install  # Alleen de eerste keer of na dependency wijzigingen
npm run dev
```

De frontend draait op: **http://localhost:3000**

## Beide Servers Starten

Open twee terminal vensters:

**Terminal 1 - Backend:**
```bash
cd backend/application && mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

## Database Setup

Zorg ervoor dat PostgreSQL draait en de database `woi_backend_v2` bestaat. De database configuratie staat in `backend/application/src/main/resources/application.properties`.

## Troubleshooting

### Backend start niet
- Controleer of je vanuit `backend/application` start (niet vanuit `backend/`)
- Controleer of PostgreSQL draait
- Controleer of poort 8080 vrij is

### Frontend start niet
- Controleer of `node_modules` geïnstalleerd zijn: `npm install`
- Controleer of poort 3000 vrij is

## Meer Informatie

- Frontend documentatie: `frontend/README.md`
- Backend is een multi-module Maven project met modules:
  - `user-module` - Gebruikersbeheer
  - `content-module` - Content management
  - `learning-module` - Leerfunctionaliteit
  - `assessment-module` - Assessments
  - `application` - Main Spring Boot applicatie
