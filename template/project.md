# Project

```yaml
project: nome-progetto
repository:
  - organizzazione/repo
folders: []              # solo per cartelle senza remote git

areas: [design, frontend, backend, database, devops, test, documentation, security]   # aggiungi mobile per le app native
checks: [security, test, privacy, accessibility, performance, seo]

commit: user             # user: commit, push e merge dell'utente. agent: li fa l'agente
branching: gitflow       # oppure: custom
branching_notes: ""      # regole del repository, se branching è custom

stack_profiles: []       # file in ~/projects/_standards/stacks/, per esempio nextjs-16
standards_scope: all     # oppure: changed_code, per applicare le regole solo al codice modificato

risk_paths:              # parti sensibili del progetto
  login: []
  payments: []
  personal_data: []
  migrations: []
  secrets: []
```

## Stack e comandi

- Stack:
- Avvio:
- Test:
- Lint:

## Convenzioni del repository

Hanno la precedenza sulle regole generali. Ogni voce cita il file da cui è ricavata.

- Convenzioni:
- Debito tecnico, da non imitare e da non correggere senza richiesta:
- Da decidere con l'utente:

## Documenti

Indice di `docs/`: cosa contiene ogni documento e quando leggerlo.

## Divieti

Cosa gli agenti non devono fare in questo progetto.
