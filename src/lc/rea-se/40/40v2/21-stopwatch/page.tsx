"use client"

/*
    ZADANIE 40v2 / 21 — STOPER Z OKRĄŻENIAMI + MINUTNIK  (SZYBKIE)
    Poziom: ★★☆☆  |  Limit czasu: 30 min

    WYMAGANIA (MUST)
    1. Stoper: Start / Pauza / Wznów / Reset, format mm:ss.cs (setne sekundy).
    2. Okrążenia: "Okrążenie" zapisuje czas okrążenia i czas łączny; najszybsze na zielono, najwolniejsze na czerwono.
    3. Czas MUSI być dokładny: stoper nie może się "spóźniać" po 10 minutach ani po przełączeniu karty
       (przeglądarka dławi timery w tle!). Licz z różnicy znaczników czasu, a nie z liczby ticków.
    4. Minutnik: wpisujesz 1:30, odlicza do zera, na końcu komunikat + dźwięk/wibracja (opcjonalnie).

    UTRUDNIENIA
    - Hook useStopwatch() zwracający {elapsed, isRunning, start, pause, reset, lap} — bez UI.
    - Stan przeżywa odświeżenie strony (zapisz startedAt i accumulated, nie aktualny czas).
    - Wyświetlanie przez requestAnimationFrame zamiast setInterval — dlaczego płynniej?
    - Skróty: Space start/pauza, L okrążenie, R reset.

    NA CO PATRZY REKRUTER
    - performance.now() / Date.now() + różnica vs inkrementowanie licznika w setInterval.
    - Czyszczenie interwału/rAF, brak wielu równoległych interwałów po kilku kliknięciach Start.
    - Co jest stanem (startedAt, accumulated, laps), a co liczone (elapsed).
*/

export default function Page() {
    return <div>TODO: 21 — stoper</div>
}
