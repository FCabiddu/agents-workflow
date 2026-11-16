# Galleria orizzontale bloccata

tipo: layout
costo: medio
materiali: card di larghezza simile, che stiano in una vista alta
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: gsap@3.15.1, @gsap/react@2.1.2

## Cosa fa
La sezione si blocca e, mentre l'utente scorre verso il basso, le card scorrono di lato e si accendono una alla volta.

## Quando usarla
Per servizi, corsi, prodotti o progetti: da 4 a 8 card. Con poche card lo scroll è troppo breve.

## Dove si trova il codice
- `~/projects/_standards/design/codice/motion/HorizontalGallery.tsx`
- `~/projects/_standards/design/codice/styles.css`: classi `.hg*`

## Mobile e animazioni ridotte
Sotto 768px niente blocco: scorrimento orizzontale nativo con aggancio. Con animazioni ridotte lo stesso anche da computer.

## Prestazioni
Medio.

## Problemi incontrati
Va creata prima degli altri effetti di scroll che stanno sotto nella pagina. Le card non devono superare l'altezza della vista meno l'header. Se un oggetto 3D ci passa dietro, le card devono avere sfondo pieno, non trasparente.
