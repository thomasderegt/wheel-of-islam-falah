# Use Cases - Wheel of Islam Falah

Overzicht van alle gedocumenteerde use cases, georganiseerd per module.

## User & Auth

| Use Case | Bestand | Beschrijving |
|----------|---------|--------------|
| Registreren | USER_REGISTER_USECASE.md | Nieuwe gebruiker aanmaken |
| Inloggen | USER_LOGIN_USECASE.md | Inloggen met JWT tokens |
| Token vernieuwen | USER_REFRESH_TOKEN_USECASE.md | Access token refresh |
| Wachtwoord vergeten | USER_FORGOT_PASSWORD_USECASE.md | Reset link aanvragen |
| Wachtwoord resetten | USER_RESET_PASSWORD_USECASE.md | Wachtwoord wijzigen met token |
| Wachtwoord wijzigen | USER_CHANGE_PASSWORD_USECASE.md | Wachtwoord wijzigen (ingelogd) |
| Profiel bekijken | USER_PROFILE_USECASE.md | Gebruikersgegevens ophalen |
| Voorkeuren | USER_PREFERENCES_USECASE.md | Voorkeuren beheren |
| Mijn team invitations | USER_MY_TEAM_INVITATIONS_USECASE.md | Openstaande uitnodigingen |

## Teams

| Use Case | Bestand | Beschrijving |
|----------|---------|--------------|
| Team aanmaken en leden | TEAM_CREATION_AND_MEMBERS_USECASE.md | Team CRUD, uitnodigen, accepteren |
| Team kanban delen | TEAM_KANBAN_SHARE_USECASE.md | Kanban read-only delen met team |

## Goals / OKR

| Use Case | Bestand | Beschrijving |
|----------|---------|--------------|
| Wheels en life domains | GOALS_OKR_WHEEL_LIFEDOMAINS_USECASE.md | Template structuur bekijken |
| User goal instance | GOALS_OKR_USER_GOAL_INSTANCE_USECASE.md | Goal starten/voltooien |
| User objective/key result | GOALS_OKR_USER_OBJECTIVE_KEYRESULT_INSTANCE_USECASE.md | Objective/KR instances |
| Initiatives | GOALS_OKR_INITIATIVES_USECASE.md | Initiatives en key result progress |
| Persoonlijk kanban | GOALS_OKR_KANBAN_PERSONAL_USECASE.md | Kanban board beheren |
| Personal goals | GOALS_OKR_PERSONAL_GOALS_USECASE.md | Eigen goals/objectives aanmaken |
| Template admin | GOALS_OKR_TEMPLATE_ADMIN_USECASE.md | Goal/objective/KR templates beheren |

## Content

| Use Case | Bestand | Beschrijving |
|----------|---------|--------------|
| Publieke content lezen | CONTENT_READ_PUBLIC_USECASE.md | Books, chapters, sections lezen |
| Content beheren | CONTENT_MANAGEMENT_USECASE.md | CRUD categories, books, chapters, sections |
| Versioning | CONTENT_VERSIONING_USECASE.md | Versies en publiceren |
| Review workflow | CONTENT_REVIEW_USECASE.md | Indienen, goedkeuren, afwijzen |

## Learning

| Use Case | Bestand | Beschrijving |
|----------|---------|--------------|
| Learning templates | LEARNING_TEMPLATES_USECASE.md | Templates en steps beheren |
| Enrollment | LEARNING_ENROLLMENT_USECASE.md | Leerflow starten |
| Progress en antwoorden | LEARNING_PROGRESS_ANSWERS_USECASE.md | Antwoorden en voortgang |

## Overig

| Use Case | Bestand | Beschrijving |
|----------|---------|--------------|
| Falah dashboard | FALAH_DASHBOARD_USECASE.md | Gecombineerd overzicht |

---

**Totaal:** 24 use cases

**Format:** Elk use case document volgt de structuur: Overzicht, Actoren, Begin/End State, Flow, API Endpoints, Edge Cases, Implementatie Status.
