# Comparsa a maschera

tipo: animazione
costo: basso
materiali: nessuno
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: gsap@3.15.1, @gsap/react@2.1.2

## Cosa fa
Le righe di un titolo salgono da dietro una maschera, oppure un blocco si apre con un taglio che si allarga, in una delle quattro direzioni.

## Quando usarla
Per titoli di sezione, immagini e card che entrano nella vista.

## Dove si trova il codice
- `~/projects/_standards/design/codice/motion/MaskReveal.tsx`: modalità `lines` e `block`

## Mobile e animazioni ridotte
Uguale; le righe si ricalcolano al ridimensionamento. Con animazioni ridotte il contenuto è subito visibile.

## Prestazioni
Leggero.

## Problemi incontrati
In modalità righe il contenuto deve essere testo. Il taglio nasconde anche ombre e badge che escono dal blocco.
