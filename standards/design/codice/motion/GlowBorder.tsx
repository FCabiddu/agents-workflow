/**
 * GlowBorder
 * ----------
 * Bordo luminoso animato attorno a un elemento: un gradiente conico che ruota
 * (proprietà CSS registrata `--glow-angle` con @property) più una copia sfocata
 * dietro, che fa da alone. Solo CSS: è un Server Component, nessun JavaScript.
 *
 * - Colori, spessore, raggio e velocità si passano come variabili CSS.
 * - Con prefers-reduced-motion il gradiente resta fermo (vedi styles.css).
 * - Nei browser senza @property il gradiente resta fermo ma visibile.
 *
 * Uso:
 *   <GlowBorder radius="1.5rem"><div className="p-8">…</div></GlowBorder>
 */
import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Raggio degli angoli (qualsiasi unità CSS). */
  radius?: string;
  /** Spessore del bordo. */
  thickness?: string;
  /** Durata di un giro completo, in secondi. */
  speed?: number;
  /** Colori del gradiente, separati da virgola come in conic-gradient. */
  colors?: string;
};

export function GlowBorder({
  children,
  className = "",
  radius = "1.25rem",
  thickness = "1.5px",
  speed = 6,
  colors = "var(--accent), #6b7cff 30%, #f5f5f5 50%, #3fb8a0 75%, var(--accent)",
}: Props) {
  const style = {
    "--glow-radius": radius,
    "--glow-thickness": thickness,
    "--glow-speed": `${speed}s`,
    "--glow-colors": colors,
  } as CSSProperties;

  return (
    <div className={`glow-border ${className}`} style={style}>
      <div className="glow-border__inner">{children}</div>
    </div>
  );
}
