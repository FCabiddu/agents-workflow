"use client";

/**
 * Embed inline di Calendly caricato in modo pigro.
 * Lo script esterno viene aggiunto solo quando il contenitore si avvicina alla
 * vista (IntersectionObserver, 600px di margine), poi si usa
 * Calendly.initInlineWidget. Il componente si monta solo se l'URL è valido
 * (controllalo lato server prima di montarlo, per esempio con new URL() e host "calendly.com").
 */
import { useEffect, useRef } from "react";

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const STYLE_HREF = "https://assets.calendly.com/assets/external/widget.css";

type CalendlyGlobal = {
  initInlineWidget: (opts: { url: string; parentElement: HTMLElement; resize?: boolean }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyGlobal;
  }
}

function loadScript(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
  return new Promise((resolve, reject) => {
    const s = existing ?? document.createElement("script");
    s.addEventListener("load", () => resolve(), { once: true });
    s.addEventListener("error", () => reject(new Error("Calendly non caricato")), { once: true });
    if (!existing) {
      if (!document.querySelector(`link[href="${STYLE_HREF}"]`)) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = STYLE_HREF;
        document.head.appendChild(l);
      }
      s.src = SCRIPT_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
  });
}

export function CalendlyEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (done || !entries.some((e) => e.isIntersecting)) return;
        done = true;
        io.disconnect();
        loadScript()
          .then(() => {
            if (!window.Calendly || !ref.current) return;
            ref.current.replaceChildren();
            window.Calendly.initInlineWidget({ url, parentElement: ref.current, resize: true });
          })
          .catch(() => {
            if (ref.current) ref.current.dataset.failed = "true";
          });
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [url]);

  return (
    <div
      ref={ref}
      className="calendly-host min-h-[700px] w-full overflow-hidden rounded-2xl border border-[color:var(--line)] bg-[color:var(--card)]"
      data-lenis-prevent=""
    >
      <p className="p-8 text-sm text-[color:var(--muted)]">Caricamento del calendario…</p>
    </div>
  );
}
