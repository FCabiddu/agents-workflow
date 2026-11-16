"use client";

/**
 * BlurRevealText
 * --------------
 * Testo che passa lettera per lettera da sfocato e trasparente a nitido,
 * con bagliore opzionale, quando entra nella vista.
 *
 * - Il testo resta HTML vero: SplitText divide in <div> per parole e lettere
 *   e mette `aria-label` sul contenitore (aria: "auto"), così gli screen reader
 *   leggono la frase intera.
 * - `autoSplit` ridivide il testo al caricamento dei font e al resize; l'animazione
 *   è restituita da `onSplit`, così viene ricreata e pulita a ogni nuova divisione.
 * - Con prefers-reduced-motion non succede niente: il testo è subito visibile.
 * - Per evitare il lampo del testo prima dell'idratazione, l'elemento ha
 *   `data-motion-hide` (nascosto via CSS solo se JS è attivo e il movimento è ammesso,
 *   con un ritorno automatico visibile dopo 4 s se lo script non parte).
 *
 * Uso:
 *   <BlurRevealText as="h2" glow>Titolo della sezione</BlurRevealText>
 */
import { useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP, MQ } from "./gsap";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  /** Bagliore caldo che si spegne mentre la lettera si mette a fuoco. */
  glow?: boolean;
  /** Colore del bagliore (qualsiasi colore CSS con alfa). */
  glowColor?: string;
  /** Ritardo iniziale in secondi. */
  delay?: number;
  /** Intervallo tra una lettera e la successiva, in secondi. */
  stagger?: number;
  /** Posizione di partenza dello ScrollTrigger (sintassi ScrollTrigger). */
  start?: string;
  id?: string;
};

export function BlurRevealText({
  children,
  as: Tag = "p",
  className,
  glow = false,
  glowColor = "rgba(255, 214, 140, 0.85)",
  delay = 0,
  stagger = 0.025,
  start = "top 85%",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.set(el, { autoAlpha: 1 });
        const split = SplitText.create(el, {
          type: "words,chars",
          aria: "auto",
          autoSplit: true,
          onSplit(self) {
            return gsap.fromTo(
              self.chars,
              {
                opacity: 0,
                filter: "blur(12px)",
                yPercent: 12,
                textShadow: glow ? `0 0 24px ${glowColor}` : "none",
              },
              {
                opacity: 1,
                filter: "blur(0px)",
                yPercent: 0,
                textShadow: glow ? `0 0 0px ${glowColor.replace(/[\d.]+\)$/, "0)")}` : "none",
                duration: 1.1,
                ease: "power3.out",
                stagger,
                delay,
                clearProps: "filter,textShadow,willChange",
                scrollTrigger: { trigger: el, start, once: true },
              },
            );
          },
        });
        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [children] },
  );

  return (
    <Tag ref={ref} id={id} className={className} data-motion-hide="">
      {children}
    </Tag>
  );
}
