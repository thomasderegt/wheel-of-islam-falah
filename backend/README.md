# Backend V2 - Multi-Module Maven Project

## Project Structuur

Dit is een multi-module Maven project met de volgende modules:

- `user-module` - Gebruikersbeheer
- `content-module` - Content management
- `learning-module` - Leerfunctionaliteit
- `assessment-module` - Assessments
- `goals-okr-module` - Goals en OKR functionaliteit
- `application` - Main Spring Boot applicatie (start hier de backend)

## Build Workflow

### ⚠️ Belangrijk: Altijd vanuit de root directory bouwen!

Bij multi-module Maven projecten moet je **altijd** vanuit de `backend/` directory bouwen, niet vanuit individuele modules.

### Snelle Rebuild

Gebruik het rebuild script:

```bash
cd backend
./rebuild.sh
```

Dit script:
- Voert `mvn clean install -DskipTests` uit vanuit de root
- Installeert alle modules in de Maven repository
- Toont waar de JARs geïnstalleerd zijn

### Handmatige Build

```bash
# Vanuit backend/ directory
cd backend
mvn clean install -DskipTests
```

**Waarom `install` en niet `compile`?**
- `mvn compile` compileert alleen, maar installeert JARs niet in de repository
- `mvn install` compileert EN installeert JARs in `~/.m2/repository/`
- De `application` module heeft dependencies op andere modules, die moeten in de repository staan

### Na Code Wijzigingen

1. **Wijzig code in een module** (bijv. `goals-okr-module`)
2. **Rebuild alle modules:**
   ```bash
   cd backend
   ./rebuild.sh
   # Of: mvn install -DskipTests
   ```
3. **Herstart de backend:**
   ```bash
   cd application
   mvn spring-boot:run
   ```

### Backend Starten

⚠️ **Start altijd vanuit `backend/application` directory:**

```bash
cd backend/application
mvn spring-boot:run
```

## Troubleshooting

### JAR niet in repository na wijzigingen

**Probleem:** Backend gebruikt oude JAR, nieuwe endpoints werken niet.

**Oplossing:**
```bash
# 1. Rebuild alle modules
cd backend
./rebuild.sh

# 2. Check of JAR geïnstalleerd is
ls -lh ~/.m2/repository/com/woi/goals-okr-module/2.0.0/goals-okr-module-2.0.0.jar

# 3. Herstart backend
cd application
mvn spring-boot:run
```

### Module dependency niet gevonden

**Probleem:** `Could not find artifact com.woi:goals-okr-module:jar:2.0.0`

**Oplossing:**
```bash
# Installeer alle modules in repository
cd backend
mvn install -DskipTests
```

### Backend start niet

- Controleer of je vanuit `backend/application` start (niet vanuit `backend/`)
- Controleer of PostgreSQL draait
- Controleer of poort 8080 vrij is

## Dependency Management

Module versies worden centraal beheerd in `backend/pom.xml` via `dependencyManagement`. 
Submodules hoeven geen versies te specificeren - ze gebruiken automatisch de parent versie.

Dit voorkomt versie-conflicten en maakt het makkelijker om versies te updaten.
