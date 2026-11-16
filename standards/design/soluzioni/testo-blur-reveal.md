# Testo da sfocato a nitido

tipo: animazione
costo: basso
materiali: un font caricato
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: gsap@3.15.1, @gsap/react@2.1.2

## Cosa fa
Un titolo compare lettera per lettera passando da sfocato e trasparente a nitido, con un bagliore dorato opzionale.

## Quando usarla
Per titoli e frasi brevi di impatto. Non per paragrafi: la sfocatura su molte lettere è costosa.

## Dove si trova il codice
- `~/projects/_standards/design/codice/motion/BlurRevealText.tsx`

## Mobile e animazioni ridotte
Uguale sul telefono. Con animazioni ridotte il testo è subito visibile.

## Prestazioni
Costoso con molte lettere: limitarlo ai titoli.

## Problemi incontrati
Accetta solo testo semplice. Il testo è nascosto via CSS finché parte JavaScript, con ritorno visibile dopo 4 secondi se non parte. Le lettere vanno ridivise quando arriva il font.
