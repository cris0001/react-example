"use client"

/*
    ZADANIE 40v2 / 03 — TABELA DANYCH ze stanem w URL
    Poziom: ★★★☆  |  Czas: 75–90 min

    KONTEKST
    Panel admina: lista użytkowników. Dane: https://jsonplaceholder.typicode.com/users
    (10 rekordów — do testów wydajności wygeneruj sobie 10 000 fake rekordów).

    WYMAGANIA (MUST)
    1. Tabela: imię, email, miasto (address.city), firma (company.name).
    2. Sortowanie po kliknięciu w nagłówek: rosnąco → malejąco → brak. Wskaźnik ▲▼ przy kolumnie.
    3. Sortowanie WIELOKOLUMNOWE: Shift+klik dodaje kolejną kolumnę do sortowania (np. miasto, potem imię).
    4. Globalne wyszukiwanie + filtr per kolumna (input pod nagłówkiem).
    5. Paginacja z wyborem rozmiaru strony (10 / 25 / 50). Zmiana filtra wraca na stronę 1.
    6. CAŁY stan widoku (sort, filtry, strona, rozmiar) trzymany w URL (searchParams):
       - odświeżenie strony zachowuje widok,
       - przycisk "wstecz" w przeglądarce cofa ostatnią zmianę,
       - link można wysłać komuś i zobaczy to samo.
    7. Stany: ładowanie (skeleton wierszy), błąd z "Spróbuj ponownie", pusto po filtrze ("Brak wyników dla ..." + wyczyść filtry).

    UTRUDNIENIA
    - Zaznaczanie wierszy: checkbox per wiersz + "zaznacz wszystkie na stronie" (indeterminate)
      + baner "Zaznaczono 25. Zaznacz wszystkie 10 000 pasujących?" (jak Gmail).
      Zaznaczenie przeżywa zmianę strony, ale NIE zmianę filtra (przemyśl dlaczego / czy na pewno).
    - Wpisywanie w filtr nie zapisuje do URL co znak (debounce), ale input reaguje natychmiast.
    - Przy 10 000 rekordów sortowanie + filtr nie blokują inputa (useMemo / useDeferredValue — zmierz!).
    - Ukrywanie/pokazywanie kolumn i zmiana kolejności kolumn.
    - Wersja "server-side": udawaj API, które przyjmuje ?sort=&page=&q= i zwraca stronę + total.

    OGRANICZENIA
    - Bez TanStack Table (najpierw ręcznie; potem możesz porównać).

    NA CO PATRZY REKRUTER
    - URL jako źródło prawdy vs duplikowanie stanu w useState (i synchronizacja w obie strony — zapach).
    - Parsowanie i walidacja parametrów z URL (co jeśli ktoś wpisze ?page=abc albo ?size=99999?).
    - Stabilne sortowanie, sortowanie stringów z polskimi znakami (localeCompare).
    - Rozdzielenie logiki (czyste funkcje filter/sort/paginate) od UI — da się przetestować bez Reacta.

    PYTANIA NA KONIEC
    - Kiedy przeniósłbyś filtrowanie i sortowanie na serwer? Jaki próg?
    - push vs replace w historii — które zmiany powinny tworzyć wpis w historii, a które nie?
*/

export default function Page() {
    return <div>TODO: 03 — tabela danych</div>
}
