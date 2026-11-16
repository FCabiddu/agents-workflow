# Cambio di tema durante lo scroll

tipo: transizione
costo: basso
materiali: palette chiara; l'ombra può essere un gradiente CSS o un'immagine o video di ombre
progetti: motion-lab, sito demo cancellato dopo l'accettazione del 2026-11-16; codice estratto in `~/projects/_standards/design/codice/` (vedi il suo README)
librerie: gsap@3.15.1, @gsap/react@2.1.2

## Cosa fa
Quando una sezione arriva a metà schermo, tutta la pagina passa dai colori scuri a quelli chiari, con un'ombra a tapparella sovrapposta; poi torna scura.

## Quando usarla
Per staccare una sezione (testimonianze, sostenibilità, storia). Una sola sezione chiara alla volta.

## Dove si trova il codice
- `~/projects/_standards/design/codice/motion/ThemeShift.tsx`
- `~/projects/_standards/design/codice/styles.css`: `.theme-overlay` e `.grain-overlay`

## Mobile e animazioni ridotte
Uguale. Con animazioni ridotte il cambio è istantaneo.

## Prestazioni
Leggero.

## Problemi incontrati
Le sezioni devono avere sfondo trasparente e usare le variabili colore (`--bg`, `--fg`, `--muted`, `--accent`, `--line`, `--card`). In una versione intermedia il tema si applicava alle sezioni sbagliate: verificare sempre con uno scroll reale, non con schermate a pagina ferma.
