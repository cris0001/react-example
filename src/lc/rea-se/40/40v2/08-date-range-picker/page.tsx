"use client"

/*
    ZADANIE 40v2 / 08 — DATE RANGE PICKER (rezerwacja jak Booking)
    Poziom: ★★★★  |  Czas: 75–90 min

    KONTEKST
    Wybór zakresu dat pobytu. Bez bibliotek kalendarza (date-fns do obliczeń jest OK — masz w projekcie).

    WYMAGANIA (MUST)
    1. Widok miesiąca: siatka 7 kolumn, tydzień od PONIEDZIAŁKU, nazwy dni i miesięcy po polsku
       (Intl.DateTimeFormat albo date-fns/locale). Dni z sąsiednich miesięcy wyszarzone.
    2. Nawigacja ‹ › między miesiącami. Widoczne DWA miesiące obok siebie.
    3. Wybór zakresu: 1. klik = początek, 2. klik = koniec; klik na datę PRZED początkiem → staje się nowym początkiem.
       Hover po wybraniu początku podświetla podgląd zakresu.
    4. Blokady: dni w przeszłości, dni z listy "zajęte" (poniżej) — i zakres NIE MOŻE przechodzić przez zajęty dzień.
       Minimalny pobyt: 2 noce.
    5. Pod kalendarzem: "12 paź – 15 paź 2026 · 3 noce" + przycisk wyczyść.
    6. Komponent kontrolowany: value + onChange od rodzica (rodzic trzyma stan).

    UTRUDNIENIA
    - Klawiatura (wzorzec APG "date picker dialog"): strzałki po dniach (przejście przez granicę miesiąca
      zmienia widok), PageUp/PageDown = miesiąc, Home/End = początek/koniec tygodnia, Enter wybiera.
    - Presety: "Ten weekend", "Najbliższe 7 dni".
    - Kalendarz w popoverze pod inputem (fokus wraca do inputa po zamknięciu, Esc zamyka).
    - Strefy czasowe: pracuj na datach "kalendarzowych" (YYYY-MM-DD), nie na Date z godziną.
      Sprawdź, co się dzieje przy zmianie czasu (ostatnia niedziela października!).

    NA CO PATRZY REKRUTER
    - Generowanie siatki miesiąca (czysta funkcja: rok, miesiąc → 35/42 komórki) — przetestowana.
    - Porównywanie dat bez pułapek (Date to obiekt → === nie działa; strefy czasowe; miesiące od 0).
    - Controlled component API (value/onChange), brak zduplikowanego stanu.
    - a11y: przyciski dni z aria-label "poniedziałek, 12 października 2026", aria-disabled, aria-selected.

    PYTANIA NA KONIEC
    - Dlaczego new Date("2026-10-25") i new Date(2026, 9, 25) mogą dać różne dni w UI?
    - Jak ułożyłbyś API tego komponentu, żeby działał też jako pojedynczy date picker?
*/

// Zajęte dni (YYYY-MM-DD) — dopasuj do bieżącego miesiąca, żeby było co testować
const BOOKED: string[] = ["2026-10-08", "2026-10-09", "2026-10-20", "2026-11-03"]

export default function Page() {
    return <div>TODO: 08 — date range picker ({BOOKED.length} zajęte dni)</div>
}
