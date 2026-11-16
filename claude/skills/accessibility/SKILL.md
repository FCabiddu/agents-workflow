---
name: accessibility
description: Controlli di accessibilità delle interfacce, usati dal reviewer quando il task li prevede. Non va usata nella sessione principale.
user-invocable: false
---

# Controllo accessibilità

Applica solo se il task ha `accessibility` tra i controlli. Riferimento: WCAG 2.2, livello AA. Se il progetto ha uno strumento automatico, come axe, usalo.

### A11Y-01: ogni elemento interattivo ha un nome accessibile
Verifica: pulsanti, link e campi hanno testo, label o `aria-label`.

### A11Y-02: tutto è usabile da tastiera, con il focus visibile
Verifica: ordine di tabulazione logico, nessuna trappola del focus.

### A11Y-03: contrasto minimo di 4,5:1 per il testo normale e 3:1 per quello grande
Verifica: colori nuovi o modificati.

### A11Y-04: immagini con testo alternativo adeguato, vuoto se decorative
Verifica: ogni `img` o icona con significato.

### A11Y-05: form con label, errori descritti e annunciati
Verifica: errori collegati al campo e non indicati solo dal colore.

### A11Y-06: HTML semantico
Verifica: titoli in ordine, landmark, `button` per le azioni e `a` per la navigazione.

### A11Y-07: l'informazione non dipende solo dal colore
Verifica: stati, errori e grafici hanno anche testo o forma.

### A11Y-08: le animazioni rispettano `prefers-reduced-motion`
Verifica: animazioni nuove o modificate.
