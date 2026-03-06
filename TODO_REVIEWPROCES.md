# TODO Reviewproces

## Huidige situatie

- Content creator en reviewer kunnen dezelfde user zijn
- Vanaf content creation page (`/admin/content/creation`) gaat de **Comments**-knop naar de review detail page (`/admin/content/review/[id]`)
- Op de review detail page kan iedereen **Approve** en **Reject** klikken
- Content creators die alleen hun comments willen zien, krijgen nu ook de approve/reject-knoppen

## Gewenste situatie

Content creator en content reviewer zijn **twee aparte users**:

- **Content creator**: maakt content, dient in voor review, wil comments zien om te verbeteren
- **Content reviewer**: beoordeelt content, voegt comments toe, approve/reject

## Te doen

1. **Rollen scheiden**
   - Content creator mag geen approve/reject uitvoeren op de review detail page
   - Alleen users met reviewer-rol mogen approve/reject zien en uitvoeren

2. **Content creator view**
   - Wanneer een content creator op Comments klikt (vanaf content creation), moet hij:
     - De comments zien (field-level comments + rejection comment)
     - Geen approve/reject-knoppen zien
   - Opties:
     - **A**: Aparte read-only pagina voor content creators (bijv. `/admin/content/review/[id]/view` of `/admin/content/review/[id]/comments`)
     - **B**: Zelfde review detail page, maar approve/reject verbergen op basis van rol
     - **C**: Content creator gaat naar de content detail/edit page met een sectie "Review comments" – comments daar tonen zonder naar de review page te gaan

3. **Backend**
   - Endpoint(s) voor approve/reject: alleen toegankelijk voor users met reviewer-rol
   - Of: check of de user de reviewer is (niet de content author)

4. **Auth/roles**
   - Bepalen of er al een rol-systeem is (admin, reviewer, author, etc.)
   - Zo niet: implementeren van rollen en permissions
