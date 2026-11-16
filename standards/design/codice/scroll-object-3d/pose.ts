/**
 * Pose dell'oggetto 3D dichiarate dalle sezioni.
 *
 * Una sezione dichiara dove deve stare l'oggetto quando arriva in cima alla vista:
 *   <section {...objectPose({ x: 0.55, tiltY: -20, scale: 1.2 })}>
 *
 * Il file non ha "use client": si può importare anche dai Server Component.
 * L'ordine delle pose è l'ordine delle sezioni nel DOM. La prima sezione con
 * posa (di solito l'hero) è anche la posa statica usata con prefers-reduced-motion.
 *
 * Unità:
 * - x, y: frazione della mezza vista (-1 = bordo sinistro/basso, 1 = destro/alto)
 * - z: unità della scena (positivo = verso la camera)
 * - tiltX, tiltY, tiltZ, spin: gradi. `spin` è la rotazione dell'oggetto sul suo asse Y.
 *   Nelle pose di arrivo usare per `spin` un multiplo di 360 (0, 360, 720…): l'oggetto
 *   si ferma diritto, e il numero di giri tra due sezioni è la differenza / 360.
 * - scale: 1 = un'unità dell'oggetto vale 1/5 dell'altezza della vista
 * - opacity: 0-1 (applicata al canvas intero)
 * - mobile: valori che sostituiscono quelli sopra sotto i 768px. Su mobile conviene
 *   un oggetto piccolo e semitrasparente in un angolo, per non coprire il testo.
 */
export type ObjectPoseValues = {
  x: number;
  y: number;
  z: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  spin: number;
  scale: number;
  opacity: number;
};

export type ObjectPose = Partial<ObjectPoseValues> & { mobile?: Partial<ObjectPoseValues> };

export const DEFAULT_POSE: ObjectPoseValues = {
  x: 0,
  y: 0,
  z: 0,
  tiltX: 0,
  tiltY: 0,
  tiltZ: 0,
  spin: 0,
  scale: 1,
  opacity: 1,
};

export const OBJECT_POSE_ATTR = "data-object-pose";

/** Restituisce l'attributo da spargere sulla sezione: {...objectPose({...})}. */
export function objectPose(pose: ObjectPose): Record<string, string> {
  return { [OBJECT_POSE_ATTR]: JSON.stringify(pose) };
}

export function resolvePose(raw: string | null, mobile: boolean): ObjectPoseValues {
  let parsed: ObjectPose = {};
  try {
    parsed = raw ? (JSON.parse(raw) as ObjectPose) : {};
  } catch {
    parsed = {};
  }
  const { mobile: mobileOverrides, ...base } = parsed;
  return { ...DEFAULT_POSE, ...base, ...(mobile ? mobileOverrides : {}) };
}
