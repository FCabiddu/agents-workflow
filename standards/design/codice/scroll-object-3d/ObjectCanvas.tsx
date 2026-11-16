"use client";

/**
 * Scena three.js del livello 3D (caricata solo nel browser da ./ScrollObject3D.tsx).
 * - Le sezioni con `data-object-pose` definiscono le pose; per ogni sezione dopo la
 *   prima, ScrollTrigger interpola l'oggetto `target` dalla posa precedente alla sua
 *   mentre la sezione sale dal fondo alla cima della vista (scrub).
 * - useFrame avvicina l'oggetto al target con uno smorzamento (`damping`) e aggiunge
 *   un leggero galleggiamento. Smorzamento più alto = meno ritardo, meno morbidezza.
 * - Luci di default: ambiente generato in locale con <Environment> + <Lightformer>
 *   di drei (nessun file HDR scaricato) e due luci dirette. Sostituibili con `lights`.
 */
import { useEffect, useRef, useSyncExternalStore, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { gsap, ScrollTrigger, MQ } from "../motion/gsap";
import { useMediaQuery, usePrefersReducedMotion } from "../motion/useMediaQuery";
import { OBJECT_POSE_ATTR, DEFAULT_POSE, resolvePose, type ObjectPoseValues } from "./pose";

export type ObjectRenderContext = { mobile: boolean };

export type ObjectCanvasProps = {
  /** L'oggetto 3D (nodo R3F) o una funzione che lo crea sapendo se si è su mobile. */
  object: ReactNode | ((ctx: ObjectRenderContext) => ReactNode);
  /** Luci e ambiente al posto di quelli di default. */
  lights?: ReactNode;
  /** DPR massimo su desktop (su mobile viene usato il minore tra questo e 1.25). */
  maxDpr?: number;
  /** Costante di smorzamento verso la posa (default 4). */
  damping?: number;
  /** Ampiezza del galleggiamento verticale in unità della scena (default 0.06, 0 = spento). */
  float?: number;
};

const DEG = Math.PI / 180;

function usePageVisible() {
  return useSyncExternalStore(
    (cb) => {
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => document.visibilityState === "visible",
    () => true,
  );
}

type RigProps = {
  target: RefObject<ObjectPoseValues>;
  instant: boolean;
  damping: number;
  floatAmp: number;
  children: ReactNode;
};

/** Applica la posa corrente a due gruppi annidati: posizione/inclinazione fuori, spin dentro. */
function PoseRig({ target, instant, damping, floatAmp, children }: RigProps) {
  const outer = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = outer.current;
    const m = spinner.current;
    const p = target.current;
    if (!g || !m || !p) return;
    const { width, height } = state.viewport;
    const t = state.clock.elapsedTime;
    const float = instant ? 0 : Math.sin(t * 0.8) * floatAmp;
    const wobble = instant || floatAmp === 0 ? 0 : Math.sin(t * 0.6) * 3;

    const goal = {
      x: (p.x * width) / 2,
      y: (p.y * height) / 2 + float,
      z: p.z,
      rx: (p.tiltX + wobble) * DEG,
      ry: p.tiltY * DEG,
      rz: p.tiltZ * DEG,
      spin: p.spin * DEG,
      s: p.scale * (height / 5),
    };

    if (instant) {
      g.position.set(goal.x, goal.y, goal.z);
      g.rotation.set(goal.rx, goal.ry, goal.rz);
      g.scale.setScalar(goal.s);
      m.rotation.y = goal.spin;
    } else {
      const k = damping;
      const d = THREE.MathUtils.damp;
      g.position.set(d(g.position.x, goal.x, k, delta), d(g.position.y, goal.y, k, delta), d(g.position.z, goal.z, k, delta));
      g.rotation.set(d(g.rotation.x, goal.rx, k, delta), d(g.rotation.y, goal.ry, k, delta), d(g.rotation.z, goal.rz, k, delta));
      g.scale.setScalar(d(g.scale.x, goal.s, k, delta));
      m.rotation.y = d(m.rotation.y, goal.spin, k, delta);
    }
    const canvas = state.gl.domElement;
    const o = String(Math.round(p.opacity * 100) / 100);
    if (canvas.style.opacity !== o) canvas.style.opacity = o;
  });

  return (
    <group ref={outer}>
      <group ref={spinner}>{children}</group>
    </group>
  );
}

function DefaultLights({ mobile }: { mobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 6]} intensity={1.6} color="#fff6ea" />
      <directionalLight position={[-5, -2, 2]} intensity={0.5} color="#bcd6ff" />
      <Environment resolution={mobile ? 64 : 256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.5} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#ffe7c2" />
        <Lightformer form="ring" intensity={1.2} position={[4, -2, 3]} scale={3} color="#ffffff" />
      </Environment>
    </>
  );
}

export default function ObjectCanvas({ object, lights, maxDpr = 1.5, damping = 4, float = 0.06 }: ObjectCanvasProps) {
  const reduced = usePrefersReducedMotion();
  const mobile = useMediaQuery(MQ.mobile);
  const visible = usePageVisible();
  const target = useRef<ObjectPoseValues>({ ...DEFAULT_POSE });

  // Pose dalle sezioni + ScrollTrigger (ricreati al passaggio desktop/mobile)
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(`[${OBJECT_POSE_ATTR}]`));
    if (!sections.length) return;
    const mm = gsap.matchMedia();

    mm.add({ isMobile: MQ.mobile, motion: MQ.motion }, (ctx) => {
      const isMobile = Boolean(ctx.conditions?.isMobile);
      const poses = sections.map((s) => resolvePose(s.getAttribute(OBJECT_POSE_ATTR), isMobile));
      Object.assign(target.current, poses[0]);
      if (!ctx.conditions?.motion) return;

      sections.slice(1).forEach((section, i) => {
        gsap.fromTo(target.current, { ...poses[i] }, {
          ...poses[i + 1],
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: true },
        });
      });
      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, []);

  const dpr: [number, number] = [1, mobile ? Math.min(1.25, maxDpr) : maxDpr];
  const frameloop = !visible ? "never" : reduced ? "demand" : "always";
  const node = typeof object === "function" ? object({ mobile }) : object;

  return (
    <Canvas
      dpr={dpr}
      frameloop={frameloop}
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: mobile ? "low-power" : "high-performance" }}
      onCreated={({ gl }) => {
        // Comparsa morbida: l'opacità vera arriva dalla posa al primo frame
        gl.domElement.style.opacity = "0";
        gl.domElement.style.transition = "opacity 0.6s ease";
      }}
      aria-hidden="true"
    >
      {lights ?? <DefaultLights mobile={mobile} />}
      <PoseRig target={target} instant={reduced} damping={damping} floatAmp={float}>
        {node}
      </PoseRig>
    </Canvas>
  );
}
