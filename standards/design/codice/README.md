# Codice riusabile del catalogo di design

Codice estratto da motion-lab, la demo accettata a novembre 2026. È generico: niente testi, marchi o contenuti di un cliente.
Le schede in `../soluzioni/` descrivono quando usare ogni soluzione. Qui c'è il codice da copiare.

Tutti gli import interni sono relativi. Copia la cartella intera, o solo le parti che servono con le loro dipendenze interne, per esempio in `src/components/catalog/`.

## File

```
codice/
├── README.md
├── styles.css                 CSS richiesto dai componenti, con palette neutra
├── motion/
│   ├── gsap.ts                registra i plugin GSAP una volta sola; media query condivise (MQ)
│   ├── useMediaQuery.ts       useMediaQuery / usePrefersReducedMotion (useSyncExternalStore)
│   ├── SmoothScroll.tsx       Lenis sincronizzato con ScrollTrigger; ancore #id morbide
│   ├── BlurRevealText.tsx     testo da sfocato a nitido lettera per lettera (SplitText)
│   ├── MaskReveal.tsx         comparsa a maschera per righe o per blocco (clip-path)
│   ├── CountUp.tsx            numero che conta fino al valore finale
│   ├── GlowBorder.tsx         bordo luminoso conico animato, solo CSS (Server Component)
│   ├── HorizontalGallery.tsx  sezione bloccata con fila di card in orizzontale
│   └── ThemeShift.tsx         cambio dei colori della pagina quando una sezione è attiva
├── scroll-object-3d/
│   ├── pose.ts                tipi e objectPose(): pose dichiarate dalle sezioni (data-object-pose)
│   ├── ScrollObject3D.tsx     ingresso: controllo WebGL, fallback, import dinamico ssr:false
│   ├── ObjectCanvas.tsx       scena R3F: interpolazione con ScrollTrigger, smorzamento, luci
│   └── example-object.tsx     ESEMPIO: libro fatto di due box, da sostituire
├── ui/
│   ├── ContactForm.tsx        form contatti accessibile (useActionState), honeypot
│   └── CalendlyEmbed.tsx      embed Calendly caricato solo vicino alla vista
├── actions/
│   └── contact.ts             Server Action: validazione zod, honeypot, nessun invio
└── lib/
    └── contact.ts             tipi e stato iniziale condivisi tra form e action
```

Dipendenze interne:
- `motion/*` usa `motion/gsap.ts`.
- `scroll-object-3d/ObjectCanvas.tsx` usa `motion/gsap.ts` e `motion/useMediaQuery.ts`.
- `ui/ContactForm.tsx` usa `actions/contact.ts` e `lib/contact.ts`.

## Dipendenze (versioni esatte usate e verificate in motion-lab)

| Pacchetto | Versione | Serve a |
|---|---|---|
| next | 16.4.6 | tutto (App Router) |
| react, react-dom | 19.3.0 | tutto |
| tailwindcss, @tailwindcss/turbopack | 4.3.3 | classi nei componenti `ui/` e negli esempi |
| gsap | 3.15.1 | `motion/`, `scroll-object-3d/` (SplitText è incluso e gratuito da gsap 3.13) |
| @gsap/react | 2.1.2 | useGSAP |
| lenis | 1.3.27 | SmoothScroll |
| three, @types/three | 0.187.0 | scroll-object-3d |
| @react-three/fiber | 9.8.2 | scroll-object-3d |
| @react-three/drei | 10.7.9 | scroll-object-3d (Environment, Lightformer) |
| zod | 4.6.7 | actions/contact.ts |

Senza oggetto 3D non servono three, fiber e drei. Senza form non serve zod.

## Come collegarlo in un progetto Next.js 16 (App Router)

### 1. CSS

In `src/app/globals.css`:

```css
@import "tailwindcss";
@import "lenis/dist/lenis.css";
@import "../components/catalog/styles.css";

@theme inline {
  --font-display: var(--font-titoli), Georgia, serif; /* classe font-display usata da ContactForm */
}
```

Variabili CSS richieste, definite su `:root` in `styles.css` con una palette neutra da sostituire:
- `--bg`, `--fg`, `--muted`, `--accent`, `--line` e `--card`.
- ThemeShift le anima su `<html>`.
- `--card` deve essere **opaco** se un oggetto 3D passa dietro le card.

### 2. Layout

Il layout aggiunge la classe `js` a `<html>`. È il pre-nascondimento del testo animato, con un ritorno visibile dopo 4 s.
Monta SmoothScroll una volta e mette i due strati di texture.

```tsx
// src/app/layout.tsx
import "./globals.css";
import { SmoothScroll } from "@/components/catalog/motion/SmoothScroll";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SmoothScroll />
        {children}
        <div className="grain-overlay" aria-hidden="true" />
        <div className="theme-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` serve per due motivi:
- la classe `js` è aggiunta prima dell'idratazione;
- ThemeShift scrive stili inline su `<html>`.

### 3. Oggetto 3D che attraversa la pagina

`ScrollObject3D` è client e riceve l'oggetto come elemento R3F, quindi va montato da un Client Component:

```tsx
// src/components/Scene.tsx
"use client";
import { ScrollObject3D } from "@/components/catalog/scroll-object-3d/ScrollObject3D";
import { MioOggetto } from "./MioOggetto"; // vedi example-object.tsx

export function Scene() {
  return (
    <ScrollObject3D
      object={({ mobile }) => <MioOggetto lowPoly={mobile} />}
      fallback={<img src="/oggetto-statico.png" alt="" />}
    />
  );
}
```

Nella pagina, le sezioni dichiarano le pose, anche da Server Component. Il contenuto sta sopra il livello 3D:

```tsx
import { objectPose } from "@/components/catalog/scroll-object-3d/pose";

<Scene />
<main className="relative z-10">
  <section {...objectPose({ x: 0.52, y: 0.02, tiltY: -30, scale: 1.3,
                             mobile: { x: 0, y: 0.5, scale: 0.72 } })}>…</section>
  <section {...objectPose({ x: -0.6, tiltX: 38, spin: 360, scale: 0.95,
                             mobile: { x: 0.95, y: -0.78, scale: 0.34, opacity: 0.45 } })}>…</section>
</main>
```

Come funziona il movimento:
- **Interpolazione:** l'oggetto passa dalla posa della sezione precedente a quella della sezione corrente mentre la sezione sale dal fondo alla cima della vista.
- **Unità e mobile:** le unità sono descritte in `pose.ts`. Sotto i 768px valgono i valori di `mobile`.
- **Movimento ridotto:** con prefers-reduced-motion l'oggetto resta fermo nella prima posa e scorre via con la prima schermata.
- **Fallback:** senza WebGL compare `fallback` dentro `.object-fallback`. La sua posizione in `styles.css` va allineata alla prima posa, con la formula indicata nel commento.
- **Opzioni:**
  - `maxDpr` (default 1.5; su mobile è al massimo 1.25);
  - `damping` (default 4);
  - `float` (default 0.06);
  - `lights` (sostituisce le luci di default).

Per `HorizontalGallery` la posa si passa con `sectionProps={objectPose({...})}`.

### 4. Gli altri componenti

- **ThemeShift:** avvolge una sezione con sfondo trasparente, per esempio `<ThemeShift theme={{ bg: "#efe7d4", fg: "#1a1712", card: "#f9f3e6" }} name="light">`. Mentre la sezione è a metà schermo imposta `data-theme="light"` e accende `.theme-overlay`.
- **HorizontalGallery:** i figli sono le card.
  - Su desktop con movimento ammesso la sezione viene bloccata (pin) mentre le card scorrono.
  - Su mobile o con movimento ridotto la fila diventa uno scroll orizzontale nativo con snap.
- **BlurRevealText** e **MaskReveal** accettano `as`, `delay` e `start`.
- **CountUp** accetta `value`, `prefix`, `suffix` e `locale`.
- **ContactForm:** riceve le etichette di privacy e invio. L'action registra solo un riepilogo anonimo nel log. Per inviare davvero, aggiungi in `actions/contact.ts` il servizio email del progetto.
- **CalendlyEmbed:** valida l'URL lato server prima di montarlo (host `calendly.com`). Lo script esterno parte solo quando il blocco si avvicina alla vista. Il contenitore ha `data-lenis-prevent`, così la rotella scorre dentro il calendario.

## Lezioni imparate

1. **Verificare con uno scroll reale, non con fotogrammi fermi.**
   - Rotella o gesto touch continui, con i fotogrammi catturati durante lo scroll (per esempio CDP `Page.startScreencast`), e un video da guardare.
   - Le foto a scroll fermo nascondevano proprio i problemi visti dall'utente: ritardo dello smorzamento, oggetto tagliato, tema sbagliato durante il passaggio.
2. **Se l'oggetto copre il contenuto, spostare un po' la posa** (x, y, scale) invece di cambiare il layout.
   - Un rifacimento del layout per "fare spazio" all'oggetto è stato respinto dall'utente: la versione originale con piccoli ritocchi era migliore.
3. **Card opache dove l'oggetto 3D passa dietro.**
   - Con uno sfondo rgba l'oggetto traspare sotto il testo e sembra che lo tocchi.
   - Calcolare la tinta opaca equivalente sullo sfondo: l'aspetto non cambia.
4. **Pose di arrivo con `spin` multiplo di 360.**
   - Altrimenti l'oggetto si ferma ruotato e una scritta sulla faccia appare storta o capovolta.
   - Il numero di giri tra due sezioni è la differenza diviso 360.
5. **Il retro si ruota, non si specchia.**
   - Una texture sulla faccia posteriore, vista dopo mezzo giro sull'asse verticale, va ruotata di 180° (`translate(size,size); rotate(π)` sul canvas).
   - Specchiarla la fa leggere al contrario.
6. **Su mobile, oggetto piccolo e semitrasparente in un angolo** (scale circa 0.3, opacity 0.35-0.45). Con l'oggetto grande al centro il testo diventa illeggibile.
7. **ThemeShift legge i colori originali togliendo prima gli stili inline:** così un rimontaggio, per esempio con l'hot reload in sviluppo, non "congela" il tema chiaro come base.
8. **Il fallback senza WebGL va nella posizione della prima posa,** non in un punto qualsiasi: la pagina deve sembrare la stessa senza movimento.

## Avvisi noti

- **Avviso in console:** three 0.187 stampa "THREE.Clock: This module has been deprecated". Viene da R3F 9.8 ed è innocuo.
- **Ritardo voluto:** lo smorzamento (`damping` 4) dà un leggero ritardo dell'oggetto rispetto allo scroll. Alzarlo lo rende più reattivo e meno morbido.
- **Transizione hero → sezione successiva:** l'oggetto può attraversare per un attimo il titolo della seconda sezione. Va verificato nel video e corretto con la posa.
