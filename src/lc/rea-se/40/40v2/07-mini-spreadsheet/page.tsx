"use client"

/*
    ZADANIE 40v2 / 07 — MINI ARKUSZ KALKULACYJNY (formuły + zależności)
    Poziom: ★★★★★  |  Czas: 90–120 min (klasyk na rozmowach w firmach produktowych)

    KONTEKST
    Siatka 10 kolumn (A–J) × 20 wierszy. Komórki zawierają liczby, tekst albo formuły.

    WYMAGANIA (MUST)
    1. Render siatki z nagłówkami (A, B, C... / 1, 2, 3...).
    2. Klik w komórkę zaznacza ją; Enter lub double click → edycja surowej wartości;
       Enter zapisuje, Esc anuluje, Tab przechodzi w prawo. Pasek formuły nad siatką
       pokazuje surową wartość zaznaczonej komórki.
    3. Formuły zaczynające się od "=":
       - referencje: =A1, =A1+B2*2, nawiasy, + - * /
       - funkcja =SUM(A1:A5) (zakres)
       Komórka pokazuje WYNIK, edycja pokazuje formułę.
    4. Zmiana komórki przelicza wszystkie komórki od niej zależne (także pośrednio: C1=B1, B1=A1).
    5. Błędy: #REF! (zła referencja), #DIV/0!, #CYCLE! (A1=B1, B1=A1) — cykl nie może zawiesić strony.
    6. Nawigacja strzałkami po siatce.

    UTRUDNIENIA
    - Parser wyrażeń napisz sam (tokenizer + rekurencyjny parser z priorytetami operatorów) — bez eval()!
    - Przeliczaj TYLKO zależne komórki (graf zależności + sortowanie topologiczne), a nie cały arkusz.
    - Zaznaczanie zakresu myszką (drag) + kopiuj/wklej (Ctrl+C / Ctrl+V) z przesunięciem referencji
      względnych (=A1 wklejone o wiersz niżej → =A2).
    - Undo/redo.
    - React.memo komórki: edycja A1 re-renderuje tylko A1 i komórki od niej zależne (sprawdź w Profilerze).

    OGRANICZENIA
    - Zakaz eval() i new Function() — wyjaśnij rekruterowi dlaczego.

    NA CO PATRZY REKRUTER
    - Oddzielenie "silnika" (czyste TS: parse, evaluate, graf zależności — testy unit!) od UI.
    - Model: przechowujesz surowe wartości, a wyniki LICZYSZ (derive) — nie trzymasz dwóch źródeł prawdy.
    - Wykrywanie cykli (DFS z kolorowaniem / stos odwiedzanych).
    - Wydajność: 200 komórek × każda zmiana — co się re-renderuje?

    PYTANIA NA KONIEC
    - Jak skalowałbyś to do 100 000 komórek (wirtualizacja 2D, obliczenia w Web Workerze)?
    - Jak dodałbyś współbieżną edycję przez kilka osób?
*/

export default function Page() {
    return <div>TODO: 07 — arkusz kalkulacyjny</div>
}
