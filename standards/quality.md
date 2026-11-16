# Regole di qualità

Regole generali per tutti i progetti. Valgono dopo le convenzioni del repository e il profilo dello stack. Ogni regola ha un ID: il task elenca quelle che valgono, e il controllo finale riporta per ognuna se è rispettata, violata o non applicabile.

### Q-01: i nomi dicono cosa fa e perché esiste
Motivo: si capisce il codice senza ricostruire il contesto.
Eccezione: nomi brevi convenzionali, come gli indici dei cicli.
Verifica: reviewer.

### Q-02: una sola responsabilità per funzione e modulo, con un solo livello di astrazione
Motivo: modifiche più piccole e meno effetti inattesi.
Eccezione: non estrarre un frammento che ha senso solo lì e diventa più difficile da leggere.
Verifica: reviewer. Lint sulla complessità, se disponibile.

### Q-03: ogni regola di business in un solo punto
Motivo: una regola copiata in più punti prima o poi diverge.
Eccezione: codice simile per caso, che rappresenta regole diverse.
Verifica: reviewer.

### Q-04: nessun errore ignorato
Motivo: un errore nascosto diventa un dato sbagliato o un bug difficile da trovare.
Eccezione: errori attesi gestiti in modo esplicito e motivato.
Verifica: lint, se disponibile, e reviewer.

### Q-05: input validati ai confini
Motivo: API, form, file e servizi esterni possono mandare dati non validi.
Eccezione: nessuna.
Verifica: test e reviewer.

### Q-06: nessun segreto nel codice, nei log o nei messaggi di errore
Motivo: un segreto nel codice finisce nella cronologia e nelle copie del repository.
Eccezione: nessuna.
Verifica: security e reviewer. Scanner dei segreti, se disponibile.

### Q-07: query e comandi non costruiti concatenando input
Motivo: evita injection.
Eccezione: nessuna.
Verifica: security e lint, se disponibile.

### Q-08: permessi controllati lato server per ogni operazione protetta
Motivo: il client si può aggirare.
Eccezione: nessuna.
Verifica: security e test.

### Q-09: ogni cambiamento di comportamento ha un test che fallirebbe senza la modifica
Motivo: dimostra che la modifica funziona e la protegge dalle regressioni.
Eccezione: modifiche solo visive o di testo, se il progetto non ha test visivi.
Verifica: test e reviewer.

### Q-10: test deterministici
Motivo: un test che fallisce a caso viene ignorato.
Eccezione: nessuna.
Verifica: reviewer. Niente dipendenza da ora, ordine di esecuzione o rete reale.

### Q-11: niente codice morto o commentato
Motivo: confonde chi legge e non viene mantenuto.
Eccezione: nessuna.
Verifica: lint, se disponibile, e reviewer.

### Q-12: i commenti spiegano il perché, non il cosa
Motivo: il cosa lo dice il codice, il perché si perde.
Eccezione: API pubbliche documentate.
Verifica: reviewer.

### Q-13: nuove dipendenze solo se motivate nel task o nel design
Motivo: ogni dipendenza porta manutenzione e rischi di sicurezza.
Eccezione: nessuna.
Verifica: reviewer.

### Q-14: valori che cambiano per ambiente fuori dal codice
Motivo: lo stesso codice deve girare in sviluppo e in produzione.
Eccezione: valori predefiniti sicuri per lo sviluppo.
Verifica: reviewer.

### Q-15: modifica limitata a ciò che chiede il task
Motivo: modifiche estranee rendono la review difficile e aumentano i rischi.
Eccezione: piccole correzioni nel codice toccato, indicate nel task.
Verifica: reviewer.
