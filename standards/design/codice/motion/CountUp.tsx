"use client";

/**
 * CountUp
 * -------
 * Numero che conta da `from` al valore finale quando entra nella vista.
 *
 * - Il valore finale è già nell'HTML del server: senza JavaScript o con
 *   prefers-reduced-motion si vede subito il numero giusto.
 * - Gli screen reader leggono solo il valore finale (testo visivamente nascosto);
 *   le cifre che cambiano sono aria-hidden.
 * - Formattazione con Intl.NumberFormat (default it-IT: 1.800).
 *
 * Uso:
 *   <CountUp value={1800} suffix="+" />
 */
import { useRef } from "react";
import { gsap, useGSAP, MQ } from "./gsap";

type Props = {
  value: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  locale?: string;
  className?: string;
};

export function CountUp({
  value,
  from = 0,
  prefix = "",
  suffix = "",
  duration = 2,
  locale = "it-IT",
  className,
}: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const format = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: "always" }).format(n);
  const finalText = `${prefix}${format(value)}${suffix}`;

  useGSAP(
    () => {
      const el = numRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const counter = { n: from };
        el.textContent = `${prefix}${format(from)}${suffix}`;
        gsap.to(counter, {
          n: value,
          duration,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${format(counter.n)}${suffix}`;
          },
        });
        return () => {
          el.textContent = finalText;
        };
      });
      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [value, from, prefix, suffix, duration, locale] },
  );

  return (
    <span ref={wrapRef} className={className}>
      <span ref={numRef} aria-hidden="true" className="tabular-nums">
        {finalText}
      </span>
      <span className="sr-only">{finalText}</span>
    </span>
  );
}
