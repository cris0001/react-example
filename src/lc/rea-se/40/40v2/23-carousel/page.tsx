"use client"

/*
    ZADANIE 40v2 / 23 — KARUZELA ZDJĘĆ  (SZYBKIE)
    Poziom: ★★★☆  |  Limit czasu: 40 min

    Zdjęcia: https://picsum.photos/id/{10..20}/800/450

    WYMAGANIA (MUST)
    1. Jeden slajd widoczny, strzałki ‹ › i kropki (klik w kropkę = skok do slajdu). Zawijanie na końcach.
    2. Autoplay co 3 s; pauza na hover i gdy fokus jest w karuzeli; przycisk Pauza/Odtwórz.
    3. Przejście animowane (transform: translateX na torze slajdów, nie zmiana src).
    4. Klawiatura: ← → gdy karuzela ma fokus.
    5. Leniwe ładowanie: ładuj bieżący + sąsiednie slajdy, reszta dopiero przy zbliżeniu.

    UTRUDNIENIA
    - Swipe na dotyku (pointer events, próg przesunięcia, "gumowy" opór na końcach bez zawijania).
    - Nieskończona pętla bez "przewijania wstecz przez wszystkie" przy przejściu z ostatniego na pierwszy
      (klony slajdów na końcach).
    - Kilka slajdów widocznych naraz (responsywnie: 1 / 2 / 3 zależnie od szerokości).
    - a11y: aria-roledescription="carousel", "Slajd 3 z 10", prefers-reduced-motion wyłącza autoplay i animację.

    NA CO PATRZY REKRUTER
    - Timer autoplay resetowany po ręcznej zmianie slajdu (inaczej zaraz "przeskakuje" dalej).
    - Modulo dla zawijania z indeksami ujemnymi ((i - 1 + n) % n).
    - Brak wycieku interwału i poprawna pauza.
*/

export default function Page() {
    return <div>TODO: 23 — karuzela</div>
}
