# Form di contatto con Server Action

tipo: componente
costo: basso
materiali: nessuno; per l'invio serve un servizio email
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: next@16.4.6, zod@4.6.7

## Cosa fa
Un form con nome, email, messaggio e consenso privacy, con errori per campo, stato di invio e conferma.

## Quando usarla
Su siti vetrina per farsi ricontattare.

## Dove si trova il codice
- `~/projects/_standards/design/codice/actions/contact.ts`: validazione sul server e campo esca contro lo spam
- `~/projects/_standards/design/codice/ui/ContactForm.tsx`

## Mobile e animazioni ridotte
Uguale.

## Prestazioni
Leggero.

## Problemi incontrati
Non invia email: per ora scrive un riepilogo nel log del server, con l'email mascherata. L'invio va aggiunto per ogni progetto.
