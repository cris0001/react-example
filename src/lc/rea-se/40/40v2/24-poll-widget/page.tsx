"use client"

/*
    ZADANIE 40v2 / 24 — WIDGET ANKIETY  (SZYBKIE)
    Poziom: ★★☆☆  |  Limit czasu: 30 min

    KONTEKST
    Komponent <Poll pollId="p1" /> do osadzania w artykułach. Fake API: getPoll(id), vote(id, optionIds).

    WYMAGANIA (MUST)
    1. Pytanie + opcje. Tryb jednokrotnego i wielokrotnego wyboru (z danych: multiple: true/false, maxChoices).
    2. Po głosowaniu: wyniki jako paski z % i liczbą głosów, twój wybór oznaczony; procenty sumują się do 100
       (zaokrąglanie! 33,3 + 33,3 + 33,3 — jak wyświetlić, żeby było 100?).
    3. Optimistic update wyników, rollback przy błędzie API.
    4. Zapamiętanie, że już głosowałeś (localStorage per pollId) → od razu wyniki.
    5. "Zmień głos" (cofnięcie poprzedniego i oddanie nowego).

    UTRUDNIENIA
    - Kilka ankiet na jednej stronie — niezależne stany, jeden wspólny cache.
    - Wyniki odświeżane co 10 s, dopóki ankieta jest widoczna na ekranie (IntersectionObserver).
    - Ankieta z datą zakończenia: odliczanie i automatyczne przejście w tryb "zakończona".

    NA CO PATRZY REKRUTER
    - Procenty liczone, nie trzymane; zaokrąglanie metodą największej reszty.
    - Walidacja wyboru (maxChoices) przed wysłaniem.
    - Stany: ładowanie, błąd, zagłosowano, zakończona.
*/

export default function Page() {
    return <div>TODO: 24 — ankieta</div>
}
