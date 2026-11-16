"use client";

/**
 * ESEMPIO — oggetto segnaposto per ScrollObject3D. Da sostituire con l'oggetto vero.
 *
 * Un "libro" fatto di due box: copertina e blocco delle pagine. È centrato
 * nell'origine e misura circa 1,4 unità in altezza, quindi con scale 1 occupa
 * circa il 28% dell'altezza della vista.
 *
 * Regole per un oggetto vero:
 * - centrarlo nell'origine e tenerlo nell'ordine di grandezza di 1-2 unità;
 * - la faccia "frontale" guarda la camera (+Z) a spin 0: così con spin multipli
 *   di 360 l'oggetto si ferma diritto;
 * - una scritta o un logo sul retro, visto dopo mezzo giro sull'asse Y, va
 *   ruotato di 180° nella texture (non specchiato) per leggersi diritto;
 * - liberare geometrie, materiali e texture creati a mano (dispose) allo smontaggio;
 * - su mobile (`({ mobile }) => …`) usare meno segmenti e texture più piccole.
 *
 * Uso:
 *   <ScrollObject3D object={<ExampleBook />} />
 *   <ScrollObject3D object={({ mobile }) => <ExampleBook color={mobile ? "#555" : undefined} />} />
 */
type Props = { color?: string; pagesColor?: string };

export function ExampleBook({ color = "#3a4a8c", pagesColor = "#f2eee4" }: Props) {
  return (
    <group>
      {/* Copertina: leggermente più grande del blocco pagine */}
      <mesh>
        <boxGeometry args={[1.05, 1.4, 0.26]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Pagine: sporgono dal lato destro, fuori dalla copertina */}
      <mesh position={[0.04, 0, 0]}>
        <boxGeometry args={[1.0, 1.34, 0.22]} />
        <meshStandardMaterial color={pagesColor} roughness={0.9} />
      </mesh>
    </group>
  );
}
