# Formato del catalogo di design

Il catalogo raccoglie le soluzioni di design e animazione già realizzate nei progetti, perché il designer e il frontend ripartano da lì invece di reinventarle. Non contiene regole obbligatorie: sono soluzioni da riusare o adattare.

- `index.md`: una riga per soluzione e una per riferimento. Si legge sempre per primo.
- `soluzioni/<nome-breve>.md`: una soluzione realizzata in un progetto e accettata dall'utente.
- `riferimenti/<nome-breve>.md`: ispirazioni esterne non ancora realizzate da noi.
- `codice/`: codice generico delle soluzioni, quando il progetto da cui vengono non esiste più o contiene testi del cliente. Il suo `README.md` spiega come collegarlo.

Una soluzione entra in `soluzioni/` solo dopo che l'utente ha accettato la feature che l'ha creata. La aggiunge il main agent, partendo da quanto segnalato da `design` e `frontend` alla consegna. Quando un riferimento viene realizzato, diventa una soluzione e il riferimento rimanda a lei.

## Costo

Il costo è quello di applicare la soluzione in un nuovo progetto, non di averla costruita la prima volta:

- `basso`: si copia il componente e si cambiano i contenuti, nessun materiale speciale, leggera anche su mobile.
- `medio`: va adattata alla pagina, oppure servono materiali preparati apposta (per esempio sequenze di fotogrammi), oppure su mobile va semplificata.
- `alto`: servono modelli 3D, shader o un grafico 3D, e su mobile serve una versione alternativa.

## Scheda di una soluzione

```markdown
# <Nome della soluzione>

tipo: animazione | layout | componente | transizione | 3d | altro
costo: basso | medio | alto
materiali: <cosa serve dal cliente o da un grafico, per esempio foto, render, modello 3D; oppure nessuno>
progetti: <progetto> (feature `<feature>`, accettata il <data>)
librerie: <libreria@versione>, ...

## Cosa fa
Una o due frasi, come la vede l'utente finale.

## Quando usarla
E quando non usarla.

## Dove si trova il codice
- `<progetto>/<percorso/file>`: <cosa contiene>

## Mobile e animazioni ridotte
Come si comporta su schermi piccoli e con `prefers-reduced-motion`.

## Prestazioni
Costo misurato o osservato, se c'è.

## Problemi incontrati
Cosa è andato storto e come si è risolto.
```

## Scheda di un riferimento

```markdown
# <Nome del riferimento>

fonte: <sito, video o file, con data>
realizzato: no | sì, vedi `soluzioni/<nome>.md`

## Effetti
| Effetto | Come si realizza | Costo stimato |
```
