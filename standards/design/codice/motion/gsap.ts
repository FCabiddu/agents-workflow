"use client";

/**
 * Registrazione unica dei plugin GSAP usati dagli effetti.
 * Importa `gsap`, `ScrollTrigger` e `SplitText` da qui, non direttamente da "gsap",
 * così i plugin sono registrati una sola volta e solo nel browser.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Media query condivise da tutti gli effetti (usate con gsap.matchMedia). */
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767.98px)",
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
