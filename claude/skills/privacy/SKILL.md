---
name: privacy
description: Controlli privacy sui dati personali, usati dal reviewer quando il task li prevede. Non va usata nella sessione principale.
user-invocable: false
---

# Controllo privacy

Applica solo se il task ha `privacy` tra i controlli. Non sostituisce un consulente legale: se un obbligo va valutato, segnalalo all'utente.

### PRIV-01: si raccolgono solo i dati necessari
Verifica: ogni nuovo campo personale è richiesto da un requisito della spec.

### PRIV-02: dati personali fuori da log, URL, analytics e messaggi di errore
Verifica: cerca i campi personali nei punti di log e di tracciamento toccati.

### PRIV-03: accesso ai dati personali limitato a chi ne ha bisogno, controllato lato server
Verifica: ogni lettura o modifica controlla l'utente e i suoi permessi.

### PRIV-04: conservazione e cancellazione definite per i nuovi dati
Verifica: la spec o il design dicono per quanto si tengono e come si cancellano.

### PRIV-05: consenso dove serve
Verifica: cookie non tecnici, marketing e profilazione hanno un consenso. Se non è chiaro, segnalalo.

### PRIV-06: dati inviati a terze parti dichiarati
Verifica: ogni nuovo servizio esterno che riceve dati personali è indicato nel design.
