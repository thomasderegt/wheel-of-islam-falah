# Goals OKR Module

Module voor OKR (Objectives and Key Results) goal setting functionaliteit.

## Architectuur

**Clean Architecture + Modular Monolith (Maven Multi-Module)**

De goals-okr-module volgt Clean Architecture principes binnen een Modular Monolith structuur:
- **Domain Layer**: Pure POJOs met business logic (geen JPA dependencies)
- **Application Layer**: CQRS-lite pattern (Commands/Queries → Handlers)
- **Infrastructure Layer**: JPA entities, repositories, mappers, REST controllers
- **API Layer**: Public interface voor module-to-module communicatie

## Scope

De goals-okr-module beheert:
- **Life Domains**: Levensdomeinen voor 360° assessment (Religie, Familie, Werk, etc.)
- **Objectives**: Inspirerende, kwalitatieve doelen binnen een life domain (templates)
- **Key Results**: Meetbare resultaten die succes van een Objective aangeven (templates)
- **Initiatives**: Concrete acties/doelen om Key Results te bereiken (user-specific)
- **User Objective Instances**: Gebruiker-specifieke instances van Objectives
- **Key Result Progress**: Progressie tracking per Key Result
- **360° Assessment**: Huidige staat scores per levensdomein (1-10 schaal)

## Module Structuur

```
goals-okr-module/
├── api/                    # Public interface voor andere modules
├── domain/                 # Domain entities, enums, repositories
│   ├── entities/          # Objective, KeyResult, Initiative, UserObjectiveInstance, KeyResultProgress, LifeDomain, LifeDomainScore
│   ├── enums/             # GoalStatus, LifeDomainType
│   └── repositories/       # Repository interfaces
├── application/            # Application layer (CQRS)
│   ├── commands/          # CreateObjective, CreateInitiative, StartUserObjectiveInstance, etc.
│   ├── queries/           # GetObjective, GetKeyResults, GetInitiatives, etc.
│   ├── handlers/          # Command en Query handlers
│   └── results/           # Result DTOs
└── infrastructure/        # Infrastructure layer
    ├── api/               # GoalsOKRModuleInterfaceImpl
    ├── persistence/       # JPA entities, repositories, mappers
    └── web/              # REST controllers, DTOs
```

## Database Schema

Schema: `goals_okr`

Tabellen:
- `life_domains` - Levensdomeinen (RELIGION, FAMILY, WORK, etc.) - gedeeld met goals-module
- `objectives` - Inspirerende doelen (templates)
- `key_results` - Meetbare resultaten (templates)
- `initiatives` - Concrete acties (user-specific)
- `user_objective_instances` - Gebruiker instances van Objectives
- `key_result_progress` - Progressie tracking per Key Result
- `life_domain_scores` - 360° assessment scores - gedeeld met goals-module

## OKR Structuur

```
LifeDomain → Objective → KeyResult → Initiative
                    ↓
        UserObjectiveInstance (user-specific instance van Objective)
                    ↓
        KeyResultProgress (progressie per KeyResult)
```

## Dependencies

- `user-module` - Voor user validatie en referenties
