"use client";

/**
 * ThemeShift
 * ----------
 * Quando la sezione avvolta arriva a metà schermo, i colori della pagina
 * (variabili CSS --bg, --fg, --muted, --accent, --line su <html>) passano al tema
 * indicato; quando la sezione esce, tornano ai valori originali.
 * Imposta anche `data-theme` su <html>, che accende la texture sovrapposta
 * (`.theme-overlay`, mix-blend-mode: multiply) definita in styles.css.
 *
 * - Le sezioni devono avere sfondo trasparente e usare le variabili CSS.
 * - Con prefers-reduced-motion il cambio di colore è istantaneo.
 *
 * Uso:
 *   <ThemeShift theme={{ bg: "#efe8d8", fg: "#14110c" }} name="light">
 *     <section>…</section>
 *   </ThemeShift>
 */
import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "./gsap";

export type ThemeVars = Partial<Record<"bg" | "fg" | "muted" | "accent" | "line" | "card", string>>;

type Props = {
  children: ReactNode;
  theme: ThemeVars;
  /** Valore di data-theme su <html> mentre la sezione è attiva. */
  name?: string;
  /** Valore di data-theme fuori dalla sezione. */
  baseName?: string;
  className?: string;
  duration?: number;
};

export function ThemeShift({ children, theme, name = "light", baseName = "dark", className, duration = 0.9 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const root = document.documentElement;
      const keys = Object.keys(theme) as (keyof ThemeVars)[];
      const original: Record<string, string> = {};
      const target: Record<string, string> = {};
      // Valori originali letti dal foglio di stile, non dagli stili inline: se
      // l'effetto viene rimontato (Strict Mode, hot reload, cambio di media query)
      // mentre il tema chiaro è attivo, non deve "ricordare" i colori chiari.
      for (const k of keys) {
        const prop = `--${k}`;
        const inline = root.style.getPropertyValue(prop);
        root.style.removeProperty(prop);
        original[prop] = getComputedStyle(root).getPropertyValue(prop).trim();
        if (inline) root.style.setProperty(prop, inline);
        target[prop] = theme[k] as string;
      }
      const previousName = baseName;

      const mm = gsap.matchMedia();
      mm.add({ reduce: MQ.reduced, motion: MQ.motion }, (ctx) => {
        const d = ctx.conditions?.reduce ? 0 : duration;
        const apply = (active: boolean) => {
          root.dataset.theme = active ? name : previousName;
          gsap.to(root, { ...(active ? target : original), duration: d, ease: "power2.inOut", overwrite: true });
        };
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => apply(self.isActive),
        });
        return () => {
          st.kill();
          root.dataset.theme = previousName;
          gsap.set(root, original);
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
