# Profilo: Next.js 16

status: draft
version: 16.4 (App Router), verificato su 16.4.6. Vale per ogni 16.x: le regole legate a una minor lo dicono.
sources:
  - Guida di aggiornamento alla 16: https://nextjs.org/docs/app/guides/upgrading/version-16
  - proxy.js: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
  - Content Security Policy: https://nextjs.org/docs/app/guides/content-security-policy
  - Data Security: https://nextjs.org/docs/app/guides/data-security
  - Server e Client Component: https://nextjs.org/docs/app/getting-started/server-and-client-components
  - Variabili d'ambiente: https://nextjs.org/docs/app/guides/environment-variables
  - serverActions (next.config): https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions
  - revalidatePath: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
  - revalidateTag: https://nextjs.org/docs/app/api-reference/functions/revalidateTag
  - Caching senza Cache Components (route segment config): https://nextjs.org/docs/app/guides/caching-without-cache-components
  - sitemap.xml: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
  - Image: https://nextjs.org/docs/app/api-reference/components/image
  - serverExternalPackages: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
  - ESLint: https://nextjs.org/docs/app/api-reference/config/eslint
  - CLI: https://nextjs.org/docs/app/api-reference/cli/next
  - Server Actions (guida): https://nextjs.org/docs/app/guides/server-actions
  - agentRules: https://nextjs.org/docs/app/api-reference/config/next-config-js/agentRules
  - Agenti di codifica: https://nextjs.org/docs/app/guides/ai-agents
  - Telemetria: https://nextjs.org/telemetry
  - Deploy e adapter: https://nextjs.org/docs/app/getting-started/deploying
  - Documentazione allineata alla versione installata: `node_modules/next/dist/docs/`, inclusa nel pacchetto `next` dalla 16.2 (letta su 16.4.6). Con 16.0 e 16.1 la copia locale non c'è e vale il sito (guida «AI agents», «Version support»). Quando il sito e la copia locale divergono, vale la copia locale della versione del progetto.

Le fonti non ufficiali sono indicate nella regola, con «Fonte non ufficiale».

## Comandi

Forma per npm. Con un altro gestore si usa la sua forma equivalente, e il progetto la scrive in `project.md`. Con npm gli argomenti di uno script vanno dopo `--` (`npm run <script> -- <argomenti>`), altrimenti npm li tiene per sé.

- Installazione: `npm ci`. `npm install` solo quando si cambia una dipendenza.
- Avvio: `npm run dev` (`next dev`, Turbopack di default dalla 16). `next dev` scrive in `.next/dev`, `next build` in `.next`, e un lockfile impedisce due `next dev` o due `next build` nello stesso progetto.
- Test: Next non include un test runner. Il progetto indica i suoi (per esempio Vitest e Playwright) in `project.md`.
- Lint e tipi: `npm run lint`, con lo script `eslint` o `eslint .` (CLI di ESLint, flat config). Tipi: `next typegen && tsc --noEmit`, che genera i tipi delle rotte (`PageProps`, `LayoutProps`, `RouteContext`) senza una build.
- Build: `NEXT_TELEMETRY_DISABLED=1 npm run build`, da un checkout senza file `.env*` con valori reali e in un ambiente senza credenziali di produzione (NX-14). Poi `npm run start -- --hostname 127.0.0.1 --port 3000` e `curl -sI http://127.0.0.1:3000/<rotta>` per controllare gli header (NX-10).

## Struttura del progetto

- `app/` nella radice oppure in `src/app/`.
- `proxy.ts` allo stesso livello di `app/`: nella radice, oppure in `src/`.
- I file `.env*` stanno nella radice del progetto, mai in `src/`. Next li carica solo da lì.
- Le cartelle con le parentesi quadre (`[slug]`) sono input dell'utente.
- `next-env.d.ts` è generato (`next dev`, `next build`, `next typegen`). La documentazione consiglia di metterlo in `.gitignore`.
- Ogni slot di una route parallela (`@slot/`) ha il suo `default.tsx`. Senza, la build fallisce dalla 16.

## Regole

### NX-01: il proxy è `proxy.ts`, con la funzione `proxy`
`middleware.ts` e l'export `middleware` sono deprecati dalla 16. Il proxy gira solo con il runtime Node.js e non accetta l'opzione `runtime`. Le opzioni con «middleware» nel nome cambiano nome, per esempio `skipMiddlewareUrlNormalize` diventa `skipProxyUrlNormalize`.
Motivo: il vecchio nome è deprecato. Impostare `runtime` nel proxy genera un errore.
Eccezione: un middleware che deve restare sul runtime edge resta `middleware.ts`. La scelta si scrive nel design.
Verifica: `test ! -e middleware.ts && test ! -e src/middleware.ts`, salvo l'eccezione registrata nel design. La build elenca «Proxy» nell'output. `grep -n "runtime" proxy.ts src/proxy.ts` non trova un export `runtime`.
Fonte: https://nextjs.org/docs/app/guides/upgrading/version-16 («middleware to proxy», anche per l'eccezione edge), https://nextjs.org/docs/app/api-reference/file-conventions/proxy («Runtime»)

### NX-02: il proxy non è il controllo di accesso
Il proxy può reindirizzare chi non ha una sessione. Il permesso però si controlla di nuovo, lato server, in ogni Server Action, in ogni Route Handler e nel layout o nella pagina protetta.
Motivo: le Server Function non sono rotte separate. Sono POST verso la rotta in cui si usano, quindi un matcher che esclude un percorso esclude anche le sue action. Un cambio del matcher, o una action spostata in un'altra rotta, toglie la copertura del proxy senza errori. Un controllo nella pagina non si estende alle action definite al suo interno.
Eccezione: nessuna.
Verifica: security e test. Per ogni Server Action o Route Handler protetto c'è un test che lo chiama senza sessione, e uno con un utente senza il permesso, e si aspetta il rifiuto.
Fonte: https://nextjs.org/docs/app/api-reference/file-conventions/proxy («Execution order»), https://nextjs.org/docs/app/guides/data-security («Authentication and authorization»)

### NX-03: il matcher del proxy è costante e provato da un test
I valori di `config.matcher` sono letterali, perché Next li analizza staticamente in build: una variabile viene ignorata. Ogni rotta che ha bisogno del proxy (sessione, nonce della CSP, redirect) è nel matcher. Per includere anche l'indice di una sezione si usa `:path*` (zero o più), non `:path+` (uno o più).
Motivo: una rotta fuori dal matcher non riceve il proxy, e non c'è nessun errore che lo segnali.
Eccezione: nessuna.
Verifica: un test unitario elenca le rotte di `app/` che devono passare dal proxy e controlla che il matcher le copra, indice compreso. Si può usare `unstable_doesMiddlewareMatch` di `next/experimental/testing/server`, che è sperimentale, oppure un confronto proprio.
Fonte: https://nextjs.org/docs/app/api-reference/file-conventions/proxy («Matcher», «Unit testing (experimental)»)

### NX-04: al client arriva solo ciò che serve alla UI
Vale in due punti:
- il valore di ritorno di una Server Action viene serializzato e mandato al client. Non si restituisce un record del database così com'è, ma un oggetto con i soli campi che servono, per esempio un esito tipizzato;
- le props che un Server Component passa a un componente `"use client"` finiscono nel payload mandato al browser. Contengono solo i campi che il componente mostra o usa, con un tipo dichiarato che non è il tipo di una riga del database.
Motivo: un record completo porta al client campi interni o personali. Un tipo di props troppo largo permette di passare dati privati senza errori.
Eccezione: nessuna.
Verifica: reviewer sui file `"use server"` e `"use client"`. Il tipo di ritorno di ogni action e il tipo delle props di ogni componente client sono dichiarati e non sono il tipo di una riga del database.
Fonte: https://nextjs.org/docs/app/guides/data-security («Controlling return values», «Passing data from server to client», «Auditing»: «`"use client"` files: Are the Component props expecting private data? Are the type signatures overly broad?»), https://nextjs.org/docs/app/guides/server-actions («Security», «Constrain return values»)

### NX-05: i limiti delle Server Action si cambiano solo con un motivo
`experimental.serverActions.bodySizeLimit` resta al valore predefinito di 1 MB. Si alza solo se il design lo motiva, e la dimensione massima vera si controlla anche nell'action. `allowedOrigins` contiene solo gli host pubblici di un reverse proxy che non inoltra `x-forwarded-host`, scritti come li vede il browser. Il carattere jolly copre solo ciò che serve.
Motivo: il limite protegge da corpi enormi e da DoS. `allowedOrigins` allarga la difesa CSRF basata sul confronto tra `Origin` e host. Il controllo dell'`Origin` non sostituisce NX-02: una richiesta senza header `Origin` passa con un solo avviso, e chiunque può mandare la stessa POST fuori dal browser.
Gli ID delle action cambiano tra un deploy e l'altro (e comunque al massimo ogni 14 giorni): un client rimasto alla build precedente riceve «Failed to find Server Action». Con più istanze `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` resta uguale su tutte; il progetto scrive in `project.md` come la imposta l'hosting, senza il valore.
Eccezione: nessuna.
Verifica: reviewer su `next.config.*`. Un commento accanto al valore dice perché, e il design lo cita.
Fonte: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions («allowedOrigins»: «A request that carries no `Origin` header at all is allowed through with a warning»), https://nextjs.org/docs/app/guides/server-actions («Security», «Deployment considerations»)

### NX-06: il codice che usa segreti o il database importa `server-only`
Ogni modulo che legge un segreto da `process.env`, crea un client con privilegi o accede al database ha `import "server-only"` in testa.
Motivo: un modulo condiviso può finire per errore in un Client Component. Con `server-only` la build fallisce invece di distribuire il codice. Le variabili senza `NEXT_PUBLIC_` nel client diventano stringhe vuote, quindi l'errore resterebbe silenzioso.
Eccezione: i file `"use server"` possono importarlo, ma non è obbligatorio se tutto l'accesso ai dati passa da moduli che già lo importano.
Verifica: un test o una regola di analisi delle dipendenze elenca i moduli che usano le variabili segrete e controlla che importino `server-only`. Reviewer sui moduli nuovi.
Fonte: https://nextjs.org/docs/app/getting-started/server-and-client-components («Preventing environment poisoning»), https://nextjs.org/docs/app/guides/data-security («Preventing client-side execution of server-only code»)

### NX-07: le `NEXT_PUBLIC_*` si leggono solo con accesso statico
Si scrive `process.env.NEXT_PUBLIC_X`. Non si usano chiavi calcolate (`process.env[nome]`) né copie dell'oggetto (`const env = process.env; env.NEXT_PUBLIC_X`). Un segreto non ha mai il prefisso `NEXT_PUBLIC_`. Il valore viene fissato al momento di `next build`: un valore che cambia per ambiente dopo la build si legge lato server, in rendering dinamico.
Motivo: Next sostituisce nel bundle solo l'accesso statico. Con l'accesso dinamico, nel browser il valore manca. Una `NEXT_PUBLIC_` finisce in ogni JavaScript mandato al browser.
Eccezione: nessuna.
Verifica: `grep -rnE "process\.env\[|=\s*process\.env\s*;" app src` senza risultati nel codice client. Reviewer sui nomi delle variabili nuove.
Fonte: https://nextjs.org/docs/app/guides/environment-variables («Bundling Environment Variables for the Browser», «Runtime Environment Variables»)

### NX-08: le API della richiesta sono asincrone
`cookies()`, `headers()`, `draftMode()`, `params` e `searchParams` si usano con `await`. Lo stesso vale per `params` e `id` delle funzioni di `opengraph-image`, `twitter-image`, `icon` e `apple-icon`, e per `id` di `sitemap` con `generateSitemaps`. Per i tipi si usano `PageProps<'/percorso'>`, `LayoutProps` e `RouteContext`.
Motivo: dalla 16 l'accesso sincrono non c'è più.
Eccezione: nessuna.
Verifica: `next typegen && tsc --noEmit`. Nessun cast `UnsafeUnwrapped` nel codice.
Fonte: https://nextjs.org/docs/app/guides/upgrading/version-16 («Async Request APIs»)

### NX-09: invalidazione della cache con le firme della 16
- `revalidateTag(tag, profilo)` ha sempre il secondo argomento, per esempio `'max'`.
- Quando l'utente deve vedere subito la propria modifica, nelle Server Action si usa `updateTag(tag)`.
- `revalidatePath` si chiama solo in Server Function e Route Handler, mai in un Client Component o nel proxy. Con un segmento dinamico (`/prodotti/[slug]`) si passa anche `type` (`'page'` o `'layout'`). Con le rewrite si usa il percorso di destinazione.
- `export const revalidate` è un numero letterale: `600`, non `60 * 10`.
- L'invalidazione si fa solo dopo che la modifica è riuscita.
Motivo: la forma con un argomento è deprecata e dà errore di tipo. Un `revalidate` calcolato non viene letto. Un `revalidatePath` senza `type` su un segmento dinamico non invalida le pagine attese.
Eccezione: nessuna.
Verifica: `tsc --noEmit` per `revalidateTag`. `grep -rnE "export const revalidate\s*=" app src | grep -vE "=\s*([0-9]+|false)\s*;?\s*(//.*)?$"` senza risultati: trova anche le espressioni che iniziano con una cifra, come `60 * 10`. In alternativa, una regola ESLint `no-restricted-syntax` sullo stesso caso. Reviewer sull'ordine tra modifica e invalidazione.
Fonte: https://nextjs.org/docs/app/guides/upgrading/version-16 («Caching APIs»), https://nextjs.org/docs/app/api-reference/functions/revalidatePath, https://nextjs.org/docs/app/guides/caching-without-cache-components («Route Segment Config»)

### NX-10: la CSP con nonce vale solo sulle pagine dinamiche
Il nonce si genera nel proxy, a ogni richiesta. Si scrive nell'header `Content-Security-Policy` della richiesta, che Next legge per mettere il nonce sui propri script, e della risposta. Le pagine che devono avere il nonce sono renderizzate in modo dinamico. Le pagine statiche, ISR o fuori dal matcher non ricevono il nonce: la loro CSP arriva da `headers()` in `next.config.*`, e il progetto scrive quali sono e con quale politica. `'unsafe-eval'` si ammette solo in sviluppo.
Motivo: una pagina generata in build non ha una richiesta da cui leggere il nonce. Il problema non si vede in build ma solo a runtime. Il nonce è incompatibile con il Partial Prerendering, perché gli script della shell statica non hanno il nonce. Fonte non ufficiale: la documentazione non nomina Cache Components accanto al nonce. Lo si deduce dal fatto che anche Cache Components genera una shell statica in build, quindi chi lo attiva con la CSP a nonce verifica gli header come sotto prima di adottarlo.
Eccezione: nessuna.
Verifica: dopo una build, con `next start`, `curl -sI` su almeno una rotta per tipo (dinamica nel matcher, statica, fuori dal matcher, Route Handler, 404). Si confronta la CSP attesa: `nonce-` e `'strict-dynamic'` dove serve, nessun `'unsafe-eval'`.
Fonte: https://nextjs.org/docs/app/guides/content-security-policy («How nonces work in Next.js», «Static vs Dynamic Rendering with CSP», e per il PPR: «Partial Prerendering (PPR) is incompatible with nonce-based CSP»)

### NX-11: immagini remote solo da `remotePatterns` precisi
`images.remotePatterns` indica `protocol`, `hostname` e `pathname`, il più stretti possibile. Non si usa `images.domains`, che è deprecato. Le opzioni `dangerouslyAllowLocalIP` e `dangerouslyAllowSVG`, e un `maximumRedirects` diverso dal predefinito, richiedono una decisione nel design. Le qualità usate nel prop `quality` sono elencate in `images.qualities`: dalla 16 il predefinito è solo `[75]`. Le immagini locali con query string richiedono `images.localPatterns.search`.
Motivo: l'ottimizzatore di immagini scarica dal server qualunque URL ammesso, quindi un pattern largo permette abusi o SSRF. Una qualità fuori elenco viene arrotondata, e una richiesta diretta a `/_next/image` con un `q` non ammesso risponde 400.
Eccezione: un carattere jolly sul sottodominio quando l'host cambia per ambiente, con il `pathname` fisso.
Verifica: reviewer su `next.config.*`. `grep -n "domains" next.config.*` senza risultati.
Fonte: https://nextjs.org/docs/app/api-reference/components/image («remotePatterns», «qualities»), https://nextjs.org/docs/app/guides/upgrading/version-16 («next/image changes»)

### NX-12: `serverExternalPackages` solo per pacchetti che non si possono includere nel bundle
Un pacchetto entra in `serverExternalPackages` solo se usa funzioni specifiche di Node.js (per esempio `require` dinamici o moduli nativi) e fallisce una volta incluso nel bundle. Si scrive il motivo accanto alla voce.
Motivo: di default Next include nel bundle le dipendenze dei Server Component e dei Route Handler. L'eccezione va motivata, perché cambia come il pacchetto viene caricato in produzione.
Eccezione: i pacchetti che Next esclude già da solo (l'elenco è nella documentazione) non si ripetono.
Verifica: reviewer su `next.config.*`. Un test o la build seguita da una chiamata alla rotta che usa il pacchetto.
Fonte: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages

### NX-13: il lint è la CLI di ESLint, separato dalla build
`next lint` non esiste più e `next build` non esegue il lint. La configurazione è flat (`eslint.config.mjs`), con `eslint-config-next/core-web-vitals` e, nei progetti TypeScript, `eslint-config-next/typescript`. L'opzione `eslint` di `next.config.*` non esiste più. ESLint 9 o 10: con ESLint 10 serve `eslint-config-next` 16.4.0 o successivo, e Node `^20.19.0`, `^22.13.0` o `>=24`.
Motivo: una build verde non dice niente sul lint.
Eccezione: un progetto che usa Biome lo scrive in `project.md`.
Verifica: `grep -n "next lint" package.json` senza risultati. `npm run lint` tra i controlli di ogni task.
Fonte: https://nextjs.org/docs/app/api-reference/config/eslint, https://nextjs.org/docs/app/guides/upgrading/version-16 («next lint Command», «ESLint Flat Config»)

### NX-14: la build di verifica non vede la produzione
`next build` esegue il codice delle pagine e dei metadati generati in build. Un esempio è `sitemap`, che è un Route Handler in cache di default. La build fissa anche le `NEXT_PUBLIC_*`. Per questo le build degli agenti:
- partono da un checkout che non contiene file `.env*` con valori reali. Un ambiente pulito non basta: per ogni variabile che manca in `process.env`, Next la cerca in `.env.$(NODE_ENV).local`, `.env.local`, `.env.$(NODE_ENV)` e `.env` della radice, quindi `env -i` la toglie dall'ambiente e Next la ricarica dal file. `project.md` dice da quale checkout si fa la build e chi ha confermato che non ha quei file;
- girano in un ambiente pulito (`env -i PATH="$PATH" HOME="$HOME"`), con `NEXT_TELEMETRY_DISABLED=1` e con valori fittizi per le variabili che il codice richiede, mai con le credenziali di produzione. I valori fittizi passati nell'ambiente vincono sui file, ma solo per le variabili che si elencano. `.next/` si cancella prima di una build di confronto. `next/font/google` scarica i font in build e in `next dev`: è una chiamata esterna che il progetto ammette o vieta per scritto.
Motivo: una build con le variabili reali legge, e a volte scrive, sui servizi di produzione e invia la telemetria.
Eccezione: la build di produzione, che fa l'hosting.
Verifica: il comando di build scritto in `project.md` contiene `NEXT_TELEMETRY_DISABLED=1` e i valori fittizi, e `project.md` nomina il checkout da cui si lancia. Reviewer sui task che lanciano una build: la build è partita da quel checkout. Gli agenti non aprono e non elencano i file `.env*` per controllarlo: la conferma che il checkout non li ha è dell'utente.
Fonte: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap, https://nextjs.org/docs/app/guides/environment-variables («Environment Variable Load Order»), https://nextjs.org/telemetry, https://nextjs.org/docs/app/getting-started/fonts

### NX-15: versioni allineate e requisiti minimi
- Node `>=20.9.0`, TypeScript `>=5.1.0`.
- `react` e `react-dom` nell'intervallo delle dipendenze peer di `next`, con la stessa versione tra loro. `@types/react` e `@types/react-dom` aggiornati insieme.
- `next` ed `eslint-config-next` alla stessa versione esatta. Fonte non ufficiale: prassi verificata nel primo progetto che usa il profilo, per evitare che il lint segua regole di un'altra versione.
- Turbopack è il default di `dev` e `build`. Una configurazione `webpack`, anche aggiunta da un plugin, fa fallire `next build`: per usare `--webpack` serve una decisione scritta.
Motivo: sono i requisiti dichiarati dalla 16. Una versione diversa tra `next` e la sua configurazione di lint rende difficile capire da dove arriva una regola.
Eccezione: nessuna.
Verifica: `node -v`, `npm ls next eslint-config-next react react-dom`, `npm view next@<versione> peerDependencies engines --json`.
Fonte: https://nextjs.org/docs/app/guides/upgrading/version-16 («Node.js runtime and browser support», «Turbopack by default»)

### NX-16: un aggiornamento di versione minore ha una checklist scritta
Prima di cambiare `next` all'interno della 16, il task:
1. legge la guida di aggiornamento della versione di arrivo e le note di rilascio intermedie. Toglie da `next.config.*` le opzioni sperimentali rimosse: per esempio `experimental.viewTransition` è stata rimossa nella 16.3.0 e `experimental.appNewScrollHandler` nella 16.4.0;
2. controlla che l'adapter o l'integrazione dell'hosting dichiari il supporto della versione di arrivo, dalle sue note di rilascio. Se il supporto non è dimostrato, si ferma e chiede;
3. controlla gli avvisi di sicurezza sulla versione di arrivo;
4. confronta prima e dopo: build, elenco delle rotte con il loro tipo, header delle rotte di NX-10, test ed E2E.

Gli strumenti che leggono il testo stampato da `next build` si riprovano a ogni aggiornamento. Dalla 16.0 la build non stampa più `size` e `First Load JS` (guida di aggiornamento, «Performance Improvements»). Fonte non ufficiale: tra 16.2 e 16.4 la tabella delle rotte ha spostato il simbolo del tipo dalla riga del percorso dinamico alle righe dei percorsi generati.
Motivo: le versioni minori della 16 hanno rimosso opzioni e cambiato comportamenti predefiniti. Per un adapter dell'hosting, il supporto si ricava solo dalle sue note di rilascio.
Eccezione: le patch (16.x.y → 16.x.z) fanno solo i punti 2-4.
Verifica: reviewer. Il task di aggiornamento contiene i quattro punti con i comandi e gli esiti.
Fonte: https://nextjs.org/docs/app/guides/upgrading/version-16 («Other experimental flags removed in Next.js 16», «Performance Improvements»), https://nextjs.org/docs/app/getting-started/deploying («Adapters»)

### NX-17: `next dev` non lascia file non tracciati per gli agenti
Dalla 16.3, quando riconosce un agente di codifica, `next dev` crea o aggiorna un blocco in `AGENTS.md`. Il progetto sceglie una delle due strade e la scrive in `project.md`:
- versionare `AGENTS.md` con il blocco;
- impostare `agentRules: false` in `next.config.*`. Dalla 16.4 il `next dev` successivo toglie anche un blocco già scritto.

Il progetto sceglie e scrive in `project.md` anche `experimental.agentFeedback`, che è indipendente da `agentRules`. Se è attivo, `next dev` scrive in `AGENTS.md` un secondo blocco che autorizza l'agente a preparare segnalazioni per Next e lo rimette se viene tolto.
Motivo: un file non tracciato che ricompare a ogni avvio sporca il diff e lo stato dei worktree. Il blocco di feedback dà all'agente un'istruzione che il progetto deve aver deciso.
Eccezione: nessuna.
Verifica statica, senza avviare `next dev`: `grep -nE "agentRules|agentFeedback" next.config.*` coerente con la scelta di `project.md`; con la strada «versionare», `git ls-files AGENTS.md` lo elenca.
Fonte: https://nextjs.org/docs/app/api-reference/config/next-config-js/agentRules («Disable agent rules»), https://nextjs.org/docs/app/guides/ai-agents («Automatic agent feedback»)

## Come si applicano le regole Q

- **Q-05 (input validati ai confini).** In Next i confini sono gli argomenti e il `FormData` delle Server Action, la richiesta dei Route Handler, `params` e `searchParams` (le cartelle con le parentesi quadre), gli header e i cookie. La validazione con uno schema sta dentro l'action o nello strato di accesso ai dati che l'action chiama, non nel componente che mostra il form.
- **Q-06 (nessun segreto nel codice, nei log o negli errori).** I segreti si leggono solo nei moduli con `server-only` (NX-06) e non hanno mai il prefisso `NEXT_PUBLIC_` (NX-07). Le variabili catturate da una Server Action definita dentro un componente vanno al client cifrate e tornano indietro: la documentazione dice di non fidarsi della sola cifratura, quindi non si catturano segreti né dati personali in una chiusura.
- **Q-08 (permessi controllati lato server).** Il controllo nel proxy o nella pagina non basta: si ripete in ogni Server Action e in ogni Route Handler, e comprende la proprietà della risorsa, non solo la sessione (NX-02).
- **Q-14 (valori per ambiente fuori dal codice).** Le `NEXT_PUBLIC_*` vengono fissate in build. Un valore che deve cambiare tra ambienti senza ricostruire si legge lato server in rendering dinamico, per esempio dopo `await connection()` (NX-07).
