# Siti 3D legati allo scroll

fonte: screen recording di un reel Instagram (Marcelo Design X, "POV: You mastered 3D Websites"), 16 novembre 2026. Sette siti dimostrativi; i nomi visibili sono Altura, KUKA, Pelago, Eiffel Tower Assembly Atlas, Alder & Stone, un sito di viaggi su Parigi e un sito di una giacca con LED. Autori dei siti non indicati.
realizzato: in parte, l'oggetto che segue lo scroll è in `soluzioni/oggetto-3d-scroll.md`

In tutti i siti lo scroll muove una camera o un modello 3D, e i testi compaiono e spariscono sopra la scena.

## Effetti

| Effetto | Come si realizza | Costo stimato |
|---|---|---|
| Camera che entra in una villa e passa da una stanza all'altra, con il nome della stanza che compare e svanisce (Altura, Casa Pietra) | Sequenza di fotogrammi o video renderizzati, disegnati su `<canvas>` in base allo scroll; titoli HTML con dissolvenza e sfocatura | Medio con render pronti, alto con scena in tempo reale |
| Logo gigante dietro la casa, con la casa che si sovrappone al testo | Due livelli: testo HTML dietro, immagine scontornata davanti, parallasse diverso | Basso |
| Braccio robotico che si monta da pezzi sparsi e poi ruota con primi piani sui giunti, testi a sinistra (KUKA) | Modello glTF diviso in parti, posizioni "esplose" interpolate verso quelle montate con ScrollTrigger; camera su un percorso con punti chiave | Alto |
| Montagna nella nebbia che si dissolve in particelle e diventa una scena subacquea turchese (Pelago) | Shader di particelle o nebbia volumetrica in Three.js, cambio di scena con dissoluzione a rumore | Alto |
| Torre Eiffel che si monta dai pezzi, poi la città compare attorno e la camera si allontana (Assembly Atlas) | Stessa tecnica delle parti esplose; la città come secondo modello che sale con dissolvenza | Alto |
| Edifici disegnati in wireframe, camera che vola tra i grattacieli, titolo con una lettera che si trasforma e testo che si sfalda in frammenti (Alder & Stone) | Modello con materiale wireframe o linee (`EdgesGeometry`), lettere divise con SplitText e animate con `opacity`, `blur` e spostamenti casuali | Medio-alto |
| Vista dal finestrino di un aereo, camera che attraversa le nuvole fino alla città (Paris begins before you land) | Video o fotogrammi renderizzati legati allo scroll, testi HTML che si alternano | Medio |
| Giacca 3D che ruota su sfondo scuro con barre di luce blu, scritte tecniche che le girano attorno e testo in movimento orizzontale (BLUE VOLT) | Modello glTF con materiale emissivo e bloom, testi in 3D o HTML posizionati sulla scena; nastro di testo con `translateX` infinito | Alto |

## Da tenere presente

- Quasi tutto il lavoro sono modelli e render 3D, non il codice: servono modelli del cliente o di un grafico 3D.
- L'alternativa economica è la sequenza di fotogrammi prerenderizzati, come per ORYZO.
- Su mobile serve una versione più leggera e con `prefers-reduced-motion` la scena resta ferma con i testi in dissolvenza.
- I testi restano HTML vero, non disegnati nel canvas.
