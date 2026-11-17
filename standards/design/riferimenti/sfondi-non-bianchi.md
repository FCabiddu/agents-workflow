# Sfondi non bianchi

fonte: screen recording di un reel Instagram (Marcelo Design X, "Stop using white, instead use this"), 17 novembre 2026. Rassegna di siti vetrina su sfondi grigio chiaro o bianco sporco; i nomi dei siti non sono indicati nel video.
realizzato: no

Il messaggio del video è di colore: al posto del bianco puro si usa un bianco leggermente colorato o un grigio chiaro, e i siti mostrati sono esempi di come rende. Le transizioni sfocate con aberrazione cromatica tra un sito e l'altro sono montaggio del video, non effetti dei siti.

## Colori proposti

| Colore | Tono |
|---|---|
| `#E5E5E5` | grigio chiaro neutro |
| `#DCDCDC` | grigio più scuro, regge testi neri molto grandi |
| `#F3F3F3` | quasi bianco neutro |
| `#FBF7FD` | bianco con una punta di lilla |
| `#FCFEFF` | bianco con una punta di azzurro |

## Effetti

| Effetto | Come si realizza | Costo stimato |
|---|---|---|
| Sfondo bianco sporco al posto del bianco puro, con foto e render che si staccano meglio | Token di colore di sfondo, testo in nero quasi puro, card bianche o con ombra morbida sopra lo sfondo | Basso |
| Titoli a tutta larghezza in caratteri display stencil o tecnici (FLEXIBLE PUBLIC SEATING, LOW-PROFILE MECHANICAL KEYBOARD) | Font display con `font-size` in `vw` o `clamp()`, righe allineate a destra e sinistra alternate | Basso |
| Griglia a mosaico di foto con badge rotondo "GET IN TOUCH" che ruota | CSS grid con angoli arrotondati, testo su cerchio in SVG `textPath` con rotazione continua | Basso |
| Titolo che si inclina e scorre via allo scroll (RETHINKING URBAN MOBILITY) | `skewY` o `rotate` e `translateY` legati alla velocità di scroll con GSAP ScrollTrigger o Lenis | Basso |
| Prodotto in primo piano con miniature laterali e pallini di navigazione (candela LUMINESCENCE) | Carosello con immagine principale grande, miniature cliccabili, dissolvenza o zoom tra le immagini | Basso-medio |
| Interfaccia "vetro" su sfondo pastello rosa-azzurro con oggetto 3D al centro (360 POD) | Gradiente di sfondo, pannelli con `backdrop-filter: blur`, oggetto come render statico o modello glTF | Medio, alto con 3D in tempo reale |

## Da tenere presente

- Il contrasto del testo grigio su `#DCDCDC` va controllato: i testi piccoli mostrati nel video sono al limite.
- I colori leggermente tinti (`#FBF7FD`, `#FCFEFF`) vanno scelti in base al tono delle foto del cliente.
