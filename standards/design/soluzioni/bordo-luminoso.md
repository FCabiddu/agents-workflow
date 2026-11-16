# Bordo luminoso animato

tipo: componente
costo: basso
materiali: nessuno
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: solo CSS

## Cosa fa
Un bordo con gradiente che ruota lentamente e un alone sfocato dietro, per mettere in risalto una card.

## Quando usarla
Per l'offerta di punta o un elemento da evidenziare. Uno per pagina, non di più.

## Dove si trova il codice
- `~/projects/_standards/design/codice/motion/GlowBorder.tsx`
- `~/projects/_standards/design/codice/styles.css`: classe `.glow-border`

## Mobile e animazioni ridotte
Uguale. Con animazioni ridotte il gradiente resta fermo.

## Prestazioni
Leggero.

## Problemi incontrati
Nei browser senza `@property` il gradiente non ruota. Lo sfondo interno usa `var(--bg)`: su sfondi diversi va passato il colore.
