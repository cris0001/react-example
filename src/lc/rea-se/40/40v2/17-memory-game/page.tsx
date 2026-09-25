"use client"

/*
    ZADANIE 40v2 / 17 — GRA MEMORY  (SZYBKIE)
    Poziom: ★★☆☆  |  Limit czasu: 30–40 min

    WYMAGANIA (MUST)
    1. Siatka 4×4 (8 par emoji), karty potasowane (napisz własne tasowanie — Fisher-Yates, nie sort(() => Math.random() - 0.5)).
    2. Klik odkrywa kartę. Dwie odkryte:
       - para → zostają odkryte,
       - nie para → zakrywają się po 1 s.
       W trakcie tej sekundy kolejne kliknięcia są ignorowane.
    3. Licznik ruchów i czas gry (start przy pierwszym kliknięciu, stop po wygranej).
    4. Ekran wygranej + "Zagraj ponownie" (nowe tasowanie).

    UTRUDNIENIA
    - Poziomy trudności (4×4, 4×6, 6×6), najlepszy wynik per poziom w localStorage.
    - Animacja odwracania karty (CSS 3D transform).
    - Szybkie klikanie w trakcie timeoutu i reset gry w trakcie timeoutu nie psują stanu (sprzątanie timera!).

    NA CO PATRZY REKRUTER
    - Timery i stale closure (setTimeout widzi stary stan?).
    - Model karty: {id, value, matched} + tablica odkrytych id — co jest stanem, a co da się policzyć.
    - Dlaczego sort z losowym komparatorem to złe tasowanie.
*/

export default function Page() {
    return <div>TODO: 17 — memory</div>
}
