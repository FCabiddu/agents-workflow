# ORYZO

fonte: screen recording di un reel Instagram (Jerry the Web Dev, "Websites in 2026"), 12 novembre 2026. Sito di un finto sottobicchiere di sughero, probabilmente dello studio Lusion (attribuzione non verificata).
realizzato: in parte, vedi `soluzioni/oggetto-3d-scroll.md`, `testo-blur-reveal.md`, `galleria-orizzontale.md`, `cambio-tema-scroll.md`, `bordo-luminoso.md`

Un solo sito a scroll continuo: ogni movimento della rotella anima qualcosa, senza cambi di pagina.

## Effetti

| Effetto | Come si realizza | Costo stimato |
|---|---|---|
| Oggetto 3D persistente che ruota, si inclina e passa tra le sezioni | Modello glTF con Three.js o React Three Fiber, trasformazioni legate allo scroll con GSAP ScrollTrigger. Alternativa economica: sequenza di fotogrammi prerenderizzati in Blender, disegnati su `<canvas>` in base allo scroll | Alto in tempo reale, medio con fotogrammi |
| Scroll morbido | Lenis | Basso |
| Testo che passa da sfocato a nitido, lettera per lettera, con bagliore | GSAP SplitText, animazione di `filter: blur` e `opacity`; bagliore con `text-shadow` o bloom WebGL | Basso |
| Bordo arcobaleno pulsante attorno alla vista | Gradiente conico sfocato animato, in CSS o shader | Basso |
| Galleria orizzontale con card che si allargano a tutta vista | Sezione `pin` con ScrollTrigger, traslazione orizzontale, `clip-path` o `scale` legati allo scroll | Medio |
| Scena 3D (scrivania) e passaggio a visione termica | Scena prerenderizzata o in tempo reale con luci precalcolate; termico con shader che mappa la luminosità su una scala di colori | Alto |
| Cerchio disegnato a linee e punti che diventa il logo | SVG con `stroke-dashoffset` animato, oppure particelle che cambiano forma | Medio |
| Zoom macro sul materiale che si spacca e scopre il testo | Movimento di camera su texture ad alta risoluzione, due metà che si separano con una maschera sul testo dietro | Medio-alto |
| Passaggio da tema scuro a chiaro con ombra di pianta | Immagine o video dell'ombra con `mix-blend-mode: multiply`, colori di sfondo animati | Basso |
| Recensioni con oggetto 3D che fluttua al centro | Stesso oggetto 3D della prima riga, con colonne di testo e immagini ai lati | Medio |

## Da tenere presente

- Su mobile serve una versione più leggera: meno fotogrammi o niente 3D in tempo reale.
- Con `prefers-reduced-motion` le animazioni legate allo scroll si spengono o si riducono a dissolvenze.
- Il testo resta HTML vero, non disegnato nel canvas, per accessibilità e SEO.
- Il lavoro maggiore sono modelli e render 3D, non il codice.
