---
name: drift
description: Confronta spec e design delle feature accettate di un progetto con il codice attuale ed elenca dove divergono. Si lancia solo su richiesta dell'utente.
disable-model-invocation: true
argument-hint: "[progetto] [feature ...]"
---

# Controllo documenti-codice

Istruzioni per il main agent. Argomenti: $ARGUMENTS

1. Individua il progetto come in "Progetto attivo", usando il primo argomento se c'è. Leggi `project.md`, `status.md` e `metrics.md`.
2. La cartella del codice è quella corrente, se corrisponde al progetto. Altrimenti chiedila all'utente. Annota branch e hash del commit, perché il confronto vale per quel codice.
3. Scegli le feature: quelle negli argomenti, altrimenti quelle con la verifica dell'utente `accettato` in `metrics.md` o segnate come accettate e unite in `status.md`, e già presenti nel branch controllato. Lo stato dei task non conta. Escludi le feature `da buttare`, quelle in corso e quelle senza `spec.md` né `design.md`, e elencale nel rapporto. La data di chiusura è la data dell'accettazione.
4. Lancia un agente `drift` per feature, al massimo 4 alla volta. A ognuno passa: la cartella della feature, la cartella del codice, `project.md`, `status.md` e le cartelle delle feature accettate dopo di essa, comprese quelle con soli task, con la data di accettazione.
5. Scrivi il rapporto in `~/projects/<progetto>/drift/<AAAA-MM-GG>.md`: branch e commit, feature controllate ed escluse, poi per ogni feature le differenze `manca` e `diverso`, quelle `superata` e i punti non verificati.
6. Riassumi all'utente in un solo messaggio e in parole normali: quante feature hai controllato, le differenze che possono essere difetti raggruppate per feature, quante sono solo decisioni successive. Per ogni `manca` o `diverso` proponi di correggere il codice, come nuova richiesta che passa dal triage, oppure di annotare il documento se la differenza era voluta. Default per tutte: nessuna modifica, resta il rapporto.
7. Se l'utente sceglie di annotare un documento, lo fa il suo autore: `functional-analyst` per la spec, `architect` per il design. Aggiunge in fondo una sezione «Dopo la chiusura» con data e differenza, senza riscrivere il resto.

Non modificare codice né documenti senza l'ok dell'utente.
