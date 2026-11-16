---
name: performance
description: Controlli di performance su query, pagine e carichi, usati dal reviewer quando il task li prevede. Non va usata nella sessione principale.
user-invocable: false
---

# Controllo performance

Applica solo se il task ha `performance` tra i controlli. Segnala un problema solo con un'evidenza nel codice o in una misura, non per sensazione.

### PERF-01: niente query N+1
Verifica: nessuna query dentro un ciclo su una lista di risultati.

### PERF-02: query su tabelle grandi con indici e limiti
Verifica: i filtri e gli ordinamenti nuovi usano colonne indicizzate.

### PERF-03: liste paginate
Verifica: nessuna lista che può crescere senza limite viene caricata tutta.

### PERF-04: niente lavoro pesante nel percorso critico
Verifica: calcoli costosi fuori dal rendering e dalla risposta sincrona, se possibile.

### PERF-05: nessuna dipendenza pesante per poco
Verifica: le nuove dipendenze sono giustificate rispetto al loro peso.

### PERF-06: cache dove i dati si ripetono
Verifica: dati letti spesso e cambiati di rado non vengono ricalcolati a ogni richiesta.
