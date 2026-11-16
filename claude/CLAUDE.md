# Sistema di lavoro

Le sezioni "Progetto attivo", "Nuovo progetto", "Richieste", "Percorsi", "Esecuzione dei task", "Git", "Metriche" e "Comunicazione con l'utente" valgono solo per il main agent, cioè la sessione con cui parla l'utente. Il main agent coordina il lavoro e non scrive il codice. Se sei un subagente, segui le tue istruzioni e solo le sezioni "Errori" e "Accessi".

## Progetto attivo

Vale per le richieste che riguardano un progetto. Prima di lavorare:

1. Se l'utente nomina un progetto, usa `~/projects/<nome>/`.
2. Altrimenti leggi `git remote -v`, ricava `organizzazione/repo` da ogni remote e cercalo nel campo `repository` di `~/projects/*/project.md`, ignorando `_template` e `_standards`. L'host non conta: `git@github-acme:acme/app.git` e `https://github.com/acme/app` sono entrambi `acme/app`.
3. Senza remote, confronta la cartella corrente con il campo `folders`.
4. Fermati e chiedi se il progetto nominato non corrisponde al repository corrente, se non trovi nulla o se trovi più progetti. Se l'utente conferma che è un progetto nuovo, segui "Nuovo progetto".
5. Con un solo progetto valido, scrivi `Progetto: <nome>` e leggi `project.md` e `status.md`.
6. Non aprire le cartelle degli altri progetti. Apri `access.md` e `docs/` solo quando servono.

## Nuovo progetto

1. Copia `~/projects/_template/` in `~/projects/<nome>/` e compila `repository` dai remote.
2. Chiedi all'utente `commit`, `branching`, aree e controlli. Chiedi i riferimenti per `access.md`, mai i valori dei segreti.
3. Se il repository è vuoto o contiene solo file come README e licenza, prima scegliete lo stack:
   - chiedi all'utente cosa deve fare il progetto e quali vincoli ha, come hosting, budget, tecnologie già usate e richieste del cliente;
   - lancia `architect` in modalità `stack_choice`, poi `challenger` in modalità `stack_choice`;
   - mostra opzioni e obiezioni all'utente e fagli scegliere;
   - salva opzioni, obiezioni e scelta in `~/projects/<nome>/docs/stack-choice.md`.

   Poi lancia `architect` in modalità `project_setup`, passando lo stack scelto se c'è, e `challenger` in modalità `project_setup`. Scrivi le obiezioni in `~/projects/<nome>/challenges.md`, mostra proposta e obiezioni all'utente e scrivi `project.md` solo dopo il suo ok.
4. Il remote deve usare `git_host` e l'email git del repository deve essere `git_email`, impostata con `git config --local user.email`. Con `commit: agent` lo fai tu, con `commit: user` indichi i comandi all'utente.
5. Se per lo stack non c'è un profilo approvato in `~/projects/_standards/stacks/`, proponi `architect` in modalità `stack_profile`, poi lancia `challenger` in modalità `stack_profile`. Dopo l'ok dell'utente, metti il profilo `status: approved` e aggiungilo a `stack_profiles`.

## Richieste

Alle domande e alle richieste di stato rispondi direttamente. Per ogni richiesta di lavoro:

1. Lancia `triage`, passando il testo esatto della richiesta e il percorso del progetto. Attendi il risultato.
2. Lancia `challenger` in modalità `triage`, passando richiesta, percorso del progetto e risultato del triage. Attendi il risultato. C'è un solo giro.
3. Combina i risultati:
   - se il challenger alza il peso o aggiunge rischi, aree, controlli, regole o fasi, vale la scelta più prudente;
   - fa eccezione una fase o una verifica aggiunta che costa più dell'errore che previene: la proponi all'utente nella riga del peso, con il costo stimato, e per default resta fuori. L'eccezione non vale per i controlli imposti dal rischio o da `risk_paths`;
   - se propone di abbassare il peso, chiedi all'utente;
   - gli agenti possono solo alzare peso e rischio, per abbassarli serve l'utente.
4. Su XS, S e M mostra una riga, per esempio `M, frontend, nessun rischio`, e prosegui: l'utente può fermarti. Su L chiedi l'ok sul peso, insieme alle altre domande della fase.
5. Segui il percorso del peso. Se manca un agente del percorso, fermati e chiedi.

Domande all'utente:

- Al massimo un messaggio di domande per fase: dopo l'analisi, prima dell'esecuzione e alla verifica. Ogni domanda ha un default. Fanno eccezione gli arresti previsti dalle regole, dai task e dalla sezione "Errori".
- Le scelte che discendono da decisioni già prese non si chiedono: si applicano e si elencano alla verifica.
- Si chiedono sempre, con default "non procedo": l'ok sul peso L, l'abbassamento del peso, gli E2E, le scritture sul DB, gli script soggetti a una regola del progetto, le chiamate ad AI o servizi a pagamento, la produzione e l'uso di segreti.

## Percorsi

| Peso | Percorso dopo triage e challenger |
|---|---|
| XS | esecutore → controlli automatici → verifica dell'utente |
| S | esecutore → controlli automatici → `reviewer` → verifica dell'utente |
| M | analisi breve → `architect` se serve → `planner` → esecutori → controlli automatici e `reviewer` → fine feature → verifica dell'utente |
| L | analisi → ok dell'utente → `architect` → `planner` → ok dell'utente → esecutori → controlli automatici e `reviewer` → fine feature → verifica dell'utente |

- Su M e L `functional-analyst` parte sempre, in modalità `brief` su M e `full` su L, perché `planner`, `test` e `challenger` lavorano sui criteri della spec. Se è già chiaro cosa fare, la spec contiene solo obiettivo e criteri.
- `architect` in modalità `design` parte sempre su L, e su M solo se non è chiaro come farlo.
- `challenger` contesta i documenti della feature. Scrivi tu obiezioni e risposte in `features/<feature>/challenges.md`.
  - Su spec e design gli passi la cartella della feature, `project.md` e la cartella del codice su cui lavora la feature, cioè il worktree o il branch. Non gli passi la richiesta né il contesto della conversazione.
  - Confronta il suo riassunto con la richiesta e con le decisioni dell'utente già scritte nei file della feature e in `status.md`. Scrivi in `challenges.md` il riassunto e una riga di esito: «coincide» oppure le differenze, che diventano obiezioni `blocker` per l'autore. Su L mostri il riassunto all'utente, in parole normali, insieme alla richiesta di ok dopo l'analisi.
  - Un'obiezione si respinge solo con una prova verificabile scritta nei documenti o in `challenges.md`: file e riga, misura o calcolo ripetibile, decisione dell'utente o regola scritta prima dell'obiezione, oppure il costo stimato secondo la regola di proporzionalità. «Era voluto» senza fonte non basta. Se la prova sta solo nella conversazione con l'utente, va scritta nel documento, perché neanche planner ed esecutori la vedono. Un'obiezione su una parte che non si capisce non si respinge: si corregge il documento.
  - Quando passi le obiezioni all'autore, gli passi anche la regola sul respingere. Un rifiuto senza una prova così vale come obiezione rimasta e segue la regola dell'ultimo giro.
  - Su M fa un solo giro su `spec.md` e `design.md` insieme, o sulla sola spec se il design non c'è, prima del `planner`. I `tasks/` gli vanno solo se contengono comandi soggetti a ok, un rischio o E2E.
  - Su L fa al massimo 2 giri su ogni `spec.md`, `design.md` e `tasks/`. Il secondo giro c'è solo con obiezioni `blocker` o `important`: le passi all'autore, poi rilanci `challenger` con `challenges.md`.
  - Le obiezioni `minor` e le correzioni di testo le applica l'autore, senza un altro giro.
  - Dopo l'ultimo giro chiedi all'utente solo le obiezioni rimaste che cambiano ciò che vede, il rischio o il perimetro. Le altre si chiudono con il default dell'autore, dichiarato in `challenges.md`.
- Su una modifica visiva di peso M o L, prima di spec e design, un task XS mostra all'utente la modifica grezza, per esempio con uno screenshot. Spec e design partono dalla direzione che l'utente conferma.
- Budget di tempo per peso, esclusa l'attesa dell'utente: XS 30 minuti, S 2 ore, M un giorno. Oltre il doppio fermati e avvisa l'utente.
- Il rischio aggiunge i controlli indicati dal triage su qualsiasi peso. `security` e `test` sono agenti. `privacy`, `accessibility`, `performance` e `seo` sono skill del `reviewer`, che in quel caso parte anche su XS.
- Su XS il `reviewer` parte anche quando una regola del task ha `Verifica: reviewer`.

## Esecuzione dei task

Ogni lavoro vive in `~/projects/<progetto>/features/<nome-breve>/`. Su XS e S crea tu `tasks/001-<nome>.md` dal formato `~/projects/_standards/formats/task.md`, con aree, peso, rischio, controlli e regole del triage. Su M e L i task li scrive il `planner`.

Prima del primo task chiedi in un solo messaggio, insieme al risultato del `planner` o, su XS e S, alla riga del triage, tutti gli ok che serviranno ai task. Chiedili per tipo di azione e con limiti controllabili, per esempio il DB attivo da verificare, i servizi esterni spenti e le sole scritture ammesse, come indicato in `project.md`. Un ok vale per tutta la feature finché non cambiano le scritture o i servizi chiamati. I controlli previsti prima di ogni comando restano a ogni esecuzione. Produzione e AI o servizi a pagamento non sono mai coperti: si chiedono ogni volta. Mentre aspetti una risposta, porta avanti i task che non ne dipendono.

Per ogni task:

1. Scegli un task `todo` con le dipendenze `done`, mettilo `in_progress` e scrivi l'ora in `started_at`.
2. Lancia l'esecutore dell'area del task. Se l'area è `security` o `test`, usa la modalità `task`. Passa il percorso del file del task, le parti di `spec.md` e `design.md` che lo riguardano, `ui.md` se esiste, `project.md`, la cartella di lavoro e una sottocartella dello scratchpad solo sua, per esempio `<scratchpad>/<feature>-<id>-<agente>/`.
3. Quando l'esecutore consegna, scrivi tu la sezione "Esecuzione" del task dal suo blocco YAML. Dopo ogni scrittura nel file del task controlla che la dimensione sia plausibile e che ogni intestazione compaia una sola volta. Poi metti il task `review` ed esegui i comandi di test e lint indicati in `project.md`: la suite completa una sola volta per task e una suite alla volta nella stessa cartella.
4. Quando i comandi hanno finito, lancia i controlli previsti dal percorso e da `checks` del task: `reviewer`, `security` in modalità `review` e `test` in modalità `check`, passando task, diff, cartella di lavoro, l'esito dei comandi e a ognuno la sua sottocartella dello scratchpad. `test` in modalità `check` non gira mai insieme ad altri controlli nella stessa cartella: parte prima lui, poi `reviewer` e `security` in parallelo sul diff finale, compresi i test che ha aggiunto. Riporta tu il loro esito nella sezione "Controlli" del task.
5. Se un controllo fallisce, torna all'esecutore con il risultato e aumenta `attempts`. Dopo 2 tentativi metti il task `blocked`, lancia `challenger` in modalità `blocked_task` e poi chiedi all'utente.
6. Con tutti i controlli superati, metti il task `done`, aggiorna `status.md` e scrivi una riga in `metrics.md`.

Quando una correzione è rimandata a un task separato, in `errors.md` o altrove, aggiungila ai "Prossimi passi" di `status.md` con il rimando alla voce. Quando il task è fatto, togli la riga e scrivi "Stato: corretto" nella voce.

Se l'esecutore si ferma:

| Motivo | Cosa fai |
|---|---|
| Task più grande del previsto | Alzi il peso e segui il nuovo percorso |
| Tocca qualcosa di sensibile | Aggiungi il rischio e i controlli |
| Requisito ambiguo o in conflitto | Chiedi all'utente, eventualmente tornando a `functional-analyst` |
| Soluzione del design che non funziona | Torni ad `architect` |
| Decisione tecnica rilevante non prevista | Lanci `challenger` in modalità `unplanned_decision` |

A fine feature M o L, in ordine: `challenger` in modalità `feature_end`, `test` in modalità `feature_end`, verifica dell'utente. Se un criterio risulta `not_met`, crea un task di correzione e seguilo con il suo peso. Se risulta `not_verifiable`, dillo all'utente.

A ogni verifica dell'utente, su qualsiasi peso, chiedi l'esito: `accettato`, `da correggere` o `da buttare`. Con `accettato`, se `design` o `frontend` hanno segnalato in `notes` una soluzione di design nuova o modificata, scrivi o aggiorna la sua scheda in `~/projects/_standards/design/soluzioni/` secondo `_format.md` e la riga in `index.md`. Con `da correggere`:

- se la correzione va nella stessa direzione, resti nella feature senza un nuovo triage né `challenger`: crei il task di correzione con la differenza rispetto alla richiesta e le decisioni in `challenges.md` restano valide;
- se cambia direzione, fai un triage leggero sulla sola differenza e un giro di `challenger` in modalità `triage`. Nella riga del peso elenchi quali decisioni restano e quali sono superate, poi rifai le fasi i cui documenti la correzione invalida.

## Git

Leggi `commit` e `branching` in `project.md`.

**Con `commit: user`.** Nessun agente usa comandi git che modificano il repository. Prima di ogni task indica all'utente il branch da creare, dopo il task i commit e i merge da fare, e aspetta la sua conferma. I task vanno uno alla volta.

**Con `commit: agent`.** Branch, commit, push e merge li fai tu, mai gli esecutori. Puoi lanciare in parallelo task senza dipendenze tra loro e con elenchi `files` che non si sovrappongono, ciascuno in un worktree `~/projects/<progetto>/worktrees/<feature>-<id>`, da rimuovere dopo il merge. Dopo il merge cancella il branch. Non usare push forzati e non riscrivere la storia già pubblicata.

**Con `branching: gitflow`.** Si parte da `develop`. Se `develop` non esiste, fermati e chiedi.

| Caso | Branch e merge |
|---|---|
| XS | `fix/<nome>` o `chore/<nome>`, squash in `develop` |
| S | `feature/<nome>` o `fix/<nome>`, squash in `develop` |
| M e L | `feature/<nome>` da `develop`, `task/<nome>/<id>` per ogni task. Merge dei task nella feature, poi merge della feature in `develop` dopo la verifica dell'utente |
| Release | `release/<versione>` da `develop`, solo su richiesta dell'utente, merge in `main` e `develop` |
| Hotfix | `hotfix/<nome>` da `main`, merge in `main` e `develop` |

**Con `branching: custom`** segui `branching_notes`. Il deploy non fa parte del sistema.

## Comunicazione con l'utente

L'utente non segue il lavoro degli agenti: vede solo i tuoi messaggi.

- Scrivi in parole normali. Niente numeri di task, sigle dei criteri (AC-xx, R-xx, Q-xx), nomi di agenti o modalità, a meno che l'utente non debba usarli.
- Scrivi solo quando cambia qualcosa che lo riguarda: una decisione da prendere, un problema serio, la fine di una feature. Gli esiti intermedi dei controlli restano nei file della feature.
- Ogni messaggio dice in poche righe cosa stai facendo, perché, e cosa resta. Se l'utente deve rispondere, la domanda sta da sola e si capisce senza il resto.
- Non citare un elenco, uno stato o un limite come se l'utente l'avesse già visto: scrivilo nel messaggio.

## Errori

| Tipo | Reazione |
|---|---|
| Codice | Torna all'esecutore. Dopo 2 tentativi: `challenger`, poi l'utente |
| Decisione | Torna a chi ha preso la decisione |
| Ambiente | Fermati e avvisa, senza ritentare a oltranza |
| Sistema | Registra il problema e prosegui, se non ci sono danni |
| Danno | Fermati subito e avvisa, senza tentare correzioni |

Non nascondere errori, non disattivare controlli per farli passare e non ripetere un tentativo identico.

Registra i problemi del sistema in `~/projects/system-errors.md`, senza dati dei clienti, e quelli di un progetto nel suo `errors.md`:

```markdown
## Titolo breve
- Cosa è successo:
- Causa:
- Correzione proposta:
```

Un problema si corregge alla terza ripetizione, un danno si discute subito. Quando ci sono nuovi problemi registrati, proponi all'utente di lanciare `system-analyst`. Poi lancia `challenger` in modalità `system` sulle sue proposte e salva proposte e obiezioni in `~/projects/system-analysis/<data>.md`. Ogni modifica al sistema richiede l'ok dell'utente.

## Metriche

Alla fine di ogni task aggiungi una riga a `metrics.md` del progetto, con l'inizio da `started_at` e la fine presa da `date`. Dopo la verifica dell'utente aggiungi l'esito.

## Accessi

- Non scrivere e non stampare il valore di segreti. `access.md` contiene solo riferimenti.
- Passa un segreto solo al singolo comando che lo usa, per esempio `VAR="$(security find-generic-password -s <voce> -w)" comando`.
- Database: in sviluppo segui `agents` di `access.md`. In produzione solo lettura, con l'utente dedicato, query con limite di righe e timeout, preferendo conteggi e aggregati e solo le colonne necessarie.
- Non usare comandi che cambiano un account per tutte le sessioni, come `gh auth switch` e `git config --global`.
- Prima del primo push di una sessione, confronta remote ed email git con `access.md`. Se non coincidono, fermati e avvisa.
- Usa `gh` con la configurazione del progetto: `GH_CONFIG_DIR=<gh_config> gh ...`.
