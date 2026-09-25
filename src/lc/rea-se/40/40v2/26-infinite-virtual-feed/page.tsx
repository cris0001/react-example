"use client"

/*
    ZADANIE 40v2 / 26 — NIESKOŃCZONY FEED Z WIRTUALIZACJĄ  (SZYBKIE, ale wymagające)
    Poziom: ★★★★  |  Limit czasu: 45 min

    Dane: https://jsonplaceholder.typicode.com/posts?_page=1&_limit=20 (albo fake API z 10 000 postów).

    WYMAGANIA (MUST)
    1. Lista postów doładowywana przy dojściu do końca (IntersectionObserver na "sentinelu", nie onScroll).
    2. Brak podwójnego ładowania tej samej strony (szybki scroll, StrictMode), koniec danych → "To już wszystko".
    3. Błąd ładowania kolejnej strony → przycisk "Spróbuj ponownie" na dole, dotychczasowe posty zostają.
    4. Wirtualizacja: w DOM tylko widoczne elementy + bufor (napisz ręcznie dla STAŁEJ wysokości elementu 80 px:
       scrollTop / wysokość → zakres indeksów, spacer górny/dolny albo translateY).
    5. Powrót ze szczegółów posta (np. link i "wstecz") przywraca pozycję scrolla i załadowane strony.

    UTRUDNIENIA
    - Zmienna wysokość elementów (pomiar ResizeObserverem, cache wysokości) — albo @tanstack/react-virtual i uzasadnij.
    - "Są nowe posty (3)" na górze — wstawienie na początek bez skoku pozycji.
    - Wersja na TanStack Query useInfiniteQuery.

    NA CO PATRZY REKRUTER
    - Flaga "loading" w refie vs w stanie przy guardzie przed podwójnym fetchem.
    - Obliczenia zakresu wirtualizacji (overscan, pierwszy/ostatni indeks) bez off-by-one.
    - Cleanup observera.
*/

export default function Page() {
    return <div>TODO: 26 — infinite feed z wirtualizacją</div>
}
