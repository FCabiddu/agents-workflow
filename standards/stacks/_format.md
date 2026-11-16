# Formato dei profili di stack

Ogni profilo è un file `<stack>-<versione>.md`, per esempio `nextjs-16.md`. Lo scrive `architect` in modalità `stack_profile`, lo contesta `challenger` e lo approva l'utente. Finché non è approvato, resta `status: draft` e non si usa.

```markdown
# Profilo: <stack> <versione>

status: draft | approved
version: <versione di riferimento>
sources:
  - <documentazione ufficiale, con link>

## Comandi
- Installazione:
- Avvio:
- Test:
- Lint e tipi:
- Build:

## Struttura del progetto

## Regole

### <PREFISSO>-01: <regola>
Motivo:
Eccezione:
Verifica: <regola di lint, test o reviewer>
Fonte: <link alla documentazione>

## Come si applicano le regole Q
Solo le regole `Q-` che in questo stack si applicano in modo diverso, con l'equivalente.
```

Regole per scrivere un profilo:

- Solo documentazione ufficiale e della versione usata. Se una fonte non è ufficiale, va indicata.
- Ogni regola è verificabile. Se uno strumento può controllarla, indica la regola di lint o il comando.
- Niente regole generiche già presenti in `quality.md`.
