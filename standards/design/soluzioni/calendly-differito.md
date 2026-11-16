# Prenotazione Calendly a caricamento differito

tipo: componente
costo: basso
materiali: link Calendly del cliente
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: next@16.4.6

## Cosa fa
Il calendario di Calendly si carica solo quando l'utente si avvicina alla sezione. Senza link mostra una card segnaposto.

## Quando usarla
Su siti vetrina con prenotazione di call o appuntamenti.

## Dove si trova il codice
- `~/projects/_standards/design/codice/ui/CalendlyEmbed.tsx`

## Mobile e animazioni ridotte
Uguale.

## Prestazioni
Lo script esterno si carica a 600px dalla sezione, non all'apertura della pagina.

## Problemi incontrati
Il link viene fissato in build (`NEXT_PUBLIC_CALENDLY_URL`). Accetta solo link `https://calendly.com`. Calendly imposta cookie di terze parti: in produzione serve il consenso. Non ancora provato con un link reale.
