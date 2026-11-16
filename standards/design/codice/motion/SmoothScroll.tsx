"use client";

/**
 * SmoothScroll
 * ------------
 * Scroll morbido con Lenis, sincronizzato con GSAP ScrollTrigger.
 * - Un solo ciclo RAF: Lenis avanza dentro `gsap.ticker` (autoRaf disattivato).
 * - Ogni evento di scroll di Lenis chiama `ScrollTrigger.update`.
 * - Gestisce i link ad ancora (#sezione) con lo stesso scroll morbido.
 * - Con prefers-reduced-motion non crea Lenis: resta lo scroll nativo.
 *
 * Uso: montalo una volta nel layout, senza figli: <SmoothScroll />
 */
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MQ } from "./gsap";

type Props = {
  /** Fattore di interpolazione (0-1). Più basso = più morbido. */
  lerp?: number;
};

export function SmoothScroll({ lerp = 0.1 }: Props) {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const lenis = new Lenis({
        lerp,
        autoRaf: false,
        anchors: { offset: -72 },
        stopInertiaOnNavigate: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    // I font cambiano le altezze: ricalcola le posizioni dei trigger quando sono pronti.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [lerp]);

  return null;
}
