"use client"

/*
    ZADANIE 40v2 / 10 — EDYTOR KSZTAŁTÓW (mini Figma / whiteboard) z undo/redo
    Poziom: ★★★★  |  Czas: 90 min

    KONTEKST
    Płótno (zwykły div, position: relative, 800×500), na którym użytkownik układa prostokąty.
    Bez canvas i bez bibliotek — elementy to divy pozycjonowane absolutnie.

    WYMAGANIA (MUST)
    1. Przycisk "Dodaj prostokąt" dodaje kształt w środku płótna (losowy kolor).
    2. Przeciąganie kształtu myszką (pointer events: pointerdown / pointermove / pointerup + setPointerCapture).
       Kształt nie może wyjechać poza płótno.
    3. Zaznaczanie: klik = zaznacz jeden, Shift+klik = dodaj do zaznaczenia, klik w puste tło = odznacz.
       Przeciąganie przesuwa WSZYSTKIE zaznaczone.
    4. Zmiana rozmiaru uchwytem w prawym dolnym rogu (min. 20×20).
    5. Delete/Backspace usuwa zaznaczone. Panel boczny: x, y, szerokość, wysokość, kolor zaznaczonego (edytowalne).
    6. Undo / Redo (Ctrl+Z / Ctrl+Shift+Z + przyciski). WAŻNE: całe przeciągnięcie to JEDEN krok historii,
       a nie 200 kroków z każdego pointermove.

    UTRUDNIENIA
    - Zaznaczanie prostokątem (lasso) przeciągniętym po pustym tle.
    - Przyciąganie do siatki 10 px (Shift wyłącza) i linie pomocnicze przy wyrównaniu krawędzi z innym kształtem.
    - Kolejność warstw: "na wierzch" / "na spód".
    - Zapis/odczyt do localStorage + eksport do JSON.
    - Wydajność: 500 kształtów, przeciąganie jednego ma być płynne (60 fps) — co się re-renderuje?
      (memo, transform zamiast top/left, requestAnimationFrame)

    NA CO PATRZY REKRUTER
    - Model historii: stos stanów (snapshoty) vs stos komend (do/undo) — trade-offy pamięci i złożoności.
    - Oddzielenie "stanu podczas przeciągania" (tymczasowego) od "zatwierdzonego" stanu w historii.
    - Pointer events i pointer capture zamiast mouse events + listenery na window.
    - Czyszczenie listenerów, brak stale closure w handlerach klawiatury.

    PYTANIA NA KONIEC
    - Dlaczego transform: translate jest tańszy niż zmiana left/top (reflow vs composite)?
    - Jak dodałbyś współpracę wielu osób na żywo (CRDT / OT — w skrócie)?
*/

type Shape = { id: string; x: number; y: number; width: number; height: number; color: string }

export default function Page() {
    const shapes: Shape[] = []
    return <div>TODO: 10 — edytor kształtów ({shapes.length})</div>
}
