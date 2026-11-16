# Numeri che contano

tipo: animazione
costo: basso
materiali: nessuno
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: gsap@3.15.1, @gsap/react@2.1.2

## Cosa fa
Un numero conta fino al valore finale quando entra nella vista, con il formato italiano (1.800).

## Quando usarla
Per statistiche e risultati.

## Dove si trova il codice
- `~/projects/_standards/design/codice/motion/CountUp.tsx`

## Mobile e animazioni ridotte
Uguale. Con animazioni ridotte compare subito il valore finale.

## Prestazioni
Leggero.

## Problemi incontrati
Gli screen reader leggono solo il valore finale; le cifre animate sono nascoste a loro.
