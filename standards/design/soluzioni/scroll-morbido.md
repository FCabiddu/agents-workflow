# Scroll morbido

tipo: animazione
costo: basso
materiali: nessuno
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: lenis@1.3.27, gsap@3.15.1, @gsap/react@2.1.2

## Cosa fa
Lo scroll della pagina diventa fluido e "pesante", come nei siti premium. È la base per tutti gli effetti legati allo scroll.

## Quando usarla
Su ogni sito con animazioni legate allo scroll. Non serve su siti senza effetti di scroll.

## Dove si trova il codice
- `~/projects/_standards/design/codice/motion/SmoothScroll.tsx`: Lenis dentro `gsap.ticker` (un solo ciclo di animazione), aggiornamento di ScrollTrigger, ancore morbide
- `~/projects/_standards/design/codice/motion/gsap.ts`: registrazione dei plugin GSAP

## Mobile e animazioni ridotte
Sul touch Lenis lascia lo scroll nativo del telefono. Con animazioni ridotte Lenis non parte.

## Prestazioni
Leggero.

## Problemi incontrati
Le aree con scroll interno (iframe, liste scorrevoli) vanno marcate con `data-lenis-prevent`. Lo spostamento delle ancore (-72px) dipende dall'altezza dell'header.
