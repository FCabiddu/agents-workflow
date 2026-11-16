"use client";

/**
 * ScrollObject3D
 * --------------
 * Livello 3D fisso dietro la pagina con un oggetto qualsiasi che si sposta,
 * si inclina e ruota tra le sezioni seguendo lo scroll.
 *
 * - L'oggetto è un nodo R3F passato da fuori (`object`): una <mesh>, un <group>,
 *   un modello caricato con useGLTF… Vedi example-object.tsx.
 *   Si può passare anche una funzione `({ mobile }) => <MioOggetto lowPoly={mobile} />`.
 * - La scena è caricata con next/dynamic e ssr: false: three.js non entra nel
 *   bundle iniziale né nel rendering sul server.
 * - Senza WebGL mostra `fallback` (un'immagine statica) dentro `.object-fallback`,
 *   che in styles.css è posizionato dove sta l'oggetto nella prima posa.
 * - DPR massimo `maxDpr` (1.5 di default, 1.25 su mobile), rendering in pausa
 *   con la scheda nascosta.
 * - prefers-reduced-motion: posa fissa della prima sezione, niente animazione,
 *   e il livello scorre via con la pagina (vedi .object-layer in styles.css).
 *
 * Il livello sta a z-index 0: il contenuto della pagina va sopra (per esempio
 * <main className="relative z-10">). Le card sotto cui passa l'oggetto devono
 * avere sfondo opaco, altrimenti l'oggetto traspare sotto il testo.
 *
 * Questo componente è client: chi gli passa `object` deve essere a sua volta un
 * Client Component (o passare un componente client già pronto come elemento).
 *
 * Uso (una volta per pagina):
 *   <ScrollObject3D object={<ExampleBook />} fallback={<img src="/oggetto.png" alt="" />} />
 *   import { objectPose } from "…/scroll-object-3d/pose";
 *   <section {...objectPose({ x: 0.5, scale: 1.1, mobile: { x: 0.9, y: -0.8, scale: 0.3, opacity: 0.4 } })}>…</section>
 */
import dynamic from "next/dynamic";
import { useSyncExternalStore, type ReactNode } from "react";
import type { ObjectCanvasProps } from "./ObjectCanvas";

const ObjectCanvas = dynamic(() => import("./ObjectCanvas"), { ssr: false });

let webglCache: boolean | null = null;
function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const c = document.createElement("canvas");
    webglCache = Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webglCache = false;
  }
  return webglCache;
}

const noopSubscribe = () => () => {};

export type ScrollObject3DProps = ObjectCanvasProps & {
  /** Contenuto mostrato senza WebGL (immagine statica, SVG…). Se manca, niente. */
  fallback?: ReactNode;
};

export function ScrollObject3D({ fallback, ...props }: ScrollObject3DProps) {
  // null sul server e in idratazione: non si sa ancora se WebGL c'è.
  const supported = useSyncExternalStore<boolean | null>(noopSubscribe, hasWebGL, () => null);
  if (supported === null) return null;
  if (!supported) {
    return fallback ? (
      <div className="object-fallback" aria-hidden="true">
        {fallback}
      </div>
    ) : null;
  }
  return (
    <div className="object-layer" aria-hidden="true">
      <ObjectCanvas {...props} />
    </div>
  );
}

// objectPose() va importato da "./pose" (file senza "use client", usabile nei Server Component).
export type { ObjectPose } from "./pose";
