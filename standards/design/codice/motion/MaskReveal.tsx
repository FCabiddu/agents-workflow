"use client";

/**
 * MaskReveal
 * ----------
 * Rivela titoli o blocchi dietro una maschera quando entrano nella vista.
 *
 * Modalità:
 * - "lines": SplitText divide il testo in righe, ogni riga sta in una maschera
 *   (`mask: "lines"`, overflow nascosto) e sale dal basso. Adatto ai titoli.
 * - "block": l'intero blocco si apre con `clip-path: inset(...)` dal basso
 *   verso l'alto (o nella direzione scelta). Adatto a card, immagini, riquadri.
 *
 * Con prefers-reduced-motion il contenuto è visibile subito, senza animazione.
 *
 * Uso:
 *   <MaskReveal as="h2" mode="lines">Il metodo</MaskReveal>
 *   <MaskReveal mode="block" direction="left"><Card /></MaskReveal>
 */
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MQ } from "./gsap";

type Direction = "up" | "down" | "left" | "right";

type Props = {
  children: ReactNode;
  as?: ElementType;
  mode?: "lines" | "block";
  direction?: Direction;
  className?: string;
  delay?: number;
  start?: string;
  id?: string;
};

const HIDDEN_INSET: Record<Direction, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
};

export function MaskReveal({
  children,
  as: Tag = "div",
  mode = "block",
  direction = "up",
  className,
  delay = 0,
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

        if (mode === "lines") {
          const split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            aria: "auto",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 105,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.09,
                delay,
                scrollTrigger: { trigger: el, start, once: true },
              });
            },
          });
          return () => split.revert();
        }

        gsap.fromTo(
          el,
          { clipPath: HIDDEN_INSET[direction] },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "expo.inOut",
            delay,
            clearProps: "clipPath",
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className} data-motion-hide="">
      {children}
    </Tag>
  );
}
