# Oggetto 3D che segue lo scroll

tipo: 3d
costo: alto
materiali: l'oggetto del cliente: forme semplici fatte in codice (scatole, cilindri) oppure un modello glTF con le texture
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: three@0.187.0, @react-three/fiber@9.8.2, @react-three/drei@10.7.9, gsap@3.15.1, @gsap/react@2.1.2

## Cosa fa
Un oggetto 3D (nel prototipo una fiche da poker, nel codice salvato un libro di esempio) sta fisso dietro la pagina e ruota, si inclina e si sposta da una sezione all'altra seguendo lo scroll.

## Quando usarla
Quando il prodotto o il simbolo del marchio è un oggetto che vale la pena mostrare. Ogni sezione dichiara la posa dell'oggetto.

## Dove si trova il codice
- `~/projects/_standards/design/codice/scroll-object-3d/`: `ScrollObject3D.tsx` (strato fisso, controllo WebGL, immagine di riserva), `ObjectCanvas.tsx` (interpolazione e smorzamento), `pose.ts` (pose per sezione e per telefono), `example-object.tsx` (libro di esempio da sostituire con l'oggetto del cliente)

## Mobile e animazioni ridotte
Sul telefono pose separate: piccola e semitrasparente nell'angolo in basso a destra. Con animazioni ridotte resta ferma nella prima sezione. Senza WebGL compare un'immagine fissa.

## Prestazioni
Caricata solo nel browser; risoluzione massima 1.25, niente antialias, texture 512px.

## Problemi incontrati
Le pose di arrivo devono avere rotazioni multiple di 360 gradi, altrimenti l'oggetto si ferma capovolto. Il retro va disegnato ruotato, non specchiato. Rifare l'impaginazione per eliminare ogni sovrapposizione ha peggiorato il risultato: meglio piccoli spostamenti delle pose. Nel passaggio dall'apertura alla sezione successiva l'oggetto attraversa per un attimo un titolo. Avviso `THREE.Clock` in console da @react-three/fiber.
