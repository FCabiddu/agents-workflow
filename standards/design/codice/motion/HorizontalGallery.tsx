"use client";

/**
 * HorizontalGallery
 * -----------------
 * Sezione bloccata (pin) in cui una fila di card scorre in orizzontale mentre
 * si scrolla in verticale. Ogni card si "accende" (scala e opacità) quando entra
 * dalla destra, grazie a `containerAnimation`.
 *
 * - Desktop (>= 768px) con movimento ammesso: pin + traslazione legata allo scroll.
 * - Mobile (< 768px) o prefers-reduced-motion: nessun pin. La fila diventa
 *   uno scorrimento orizzontale nativo con scroll-snap (swipe col dito o
 *   shift+rotella), gestito solo via CSS (classi `.hg-*` in styles.css).
 *
 * Le card sono figli server-rendered: questo componente aggiunge solo il movimento.
 *
 * Uso:
 *   <HorizontalGallery header={<h2>Corsi</h2>} label="Corsi disponibili">
 *     <article>…</article>
 *     <article>…</article>
 *   </HorizontalGallery>
 */
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "./gsap";

type Props = {
  children: ReactNode;
  header?: ReactNode;
  /** Etichetta accessibile della fila scorrevole. */
  label: string;
  className?: string;
  id?: string;
  /** Attributi extra per la <section> (per esempio data-object-pose da objectPose()). */
  sectionProps?: Record<string, string>;
};

export function HorizontalGallery({ children, header, label, className = "", id, sectionProps }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

        const move = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        const cards = gsap.utils.toArray<HTMLElement>(track.children);
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { scale: 0.88, opacity: 0.35, rotate: 2 },
            {
              scale: 1,
              opacity: 1,
              rotate: 0,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: move,
                start: "left 100%",
                end: "left 55%",
                scrub: true,
              },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id={id} className={`hg ${className}`} {...sectionProps}>
      <div className="hg-viewport">
        {header}
        <div ref={trackRef} className="hg-track" role="list" aria-label={label} tabIndex={0}>
          {children}
        </div>
      </div>
    </section>
  );
}
