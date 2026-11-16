# Formato dei task

Ogni task è un file `features/<feature>/tasks/<id>-<nome>.md`.

````markdown
# <id>: <titolo>

```yaml
id: "001"
feature: <nome della feature>
area: backend
weight: S
weight_assigned: S          # peso iniziale, non cambia
risk: []
checks: []
standards: []               # ID delle regole: Q-, profilo di stack, controlli
depends_on: []
files: []                   # file previsti, servono per il parallelo
status: todo                # todo, in_progress, review, done, blocked
attempts: 0
started_at: ""               # ora di inizio, scritta dal main agent
```

## Obiettivo

## Criteri di accettazione
- AC-01:

## Esecuzione
Compilata dal main agent dal risultato dell'esecutore.
- File modificati:
- Controlli eseguiti:
- Non verificato:
- Regole applicate:

## Controlli
Compilata dal main agent con l'esito di controlli automatici, reviewer, security e test.
````
