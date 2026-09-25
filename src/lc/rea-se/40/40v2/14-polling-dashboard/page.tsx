"use client"

/*
    ZADANIE 40v2 / 14 — DASHBOARD Z ODŚWIEŻANYMI WIDGETAMI (polling, retry, widoczność karty)
    Poziom: ★★★☆  |  Czas: 60–90 min

    KONTEKST
    Dashboard monitoringu: 4 widgety (np. "Zamówienia dziś", "Aktywni użytkownicy", "Błędy 5xx", "Kolejka zadań").
    Każdy ma własne fake API (losowe liczby, losowe opóźnienie 200–1500 ms, losowy błąd w 15%).

    WYMAGANIA (MUST)
    1. Napisz hook usePolling(fetcher, intervalMs) i użyj go w każdym widgecie (różne interwały: 5 s, 10 s, 30 s).
    2. Kolejny request startuje DOPIERO po zakończeniu poprzedniego (bez nakładania się requestów przy wolnym API).
    3. Stany widgetu: pierwsze ładowanie (skeleton), odświeżanie w tle (stare dane + mały spinner — BEZ skeletona),
       błąd (stare dane zostają + "Nie udało się odświeżyć, ostatnia aktualizacja 2 min temu").
    4. Retry z exponential backoff przy błędach (1 s, 2 s, 4 s... max 30 s) + powrót do normalnego interwału po sukcesie.
    5. Pauza pollingu, gdy karta przeglądarki jest niewidoczna (Page Visibility API);
       po powrocie — natychmiastowe odświeżenie.
    6. Przycisk "Odśwież teraz" per widget i globalny "Wstrzymaj / Wznów wszystko".
    7. "Zaktualizowano 12 s temu" — tekst tyka co sekundę, ale NIE re-renderuje całego dashboardu.

    UTRUDNIENIA
    - Anulowanie requestu przy unmount widgetu i przy ręcznym odświeżeniu w trakcie trwającego requestu.
    - Trend: strzałka ↑/↓ względem poprzedniej wartości + mini wykres (sparkline z ostatnich 20 wartości, SVG).
    - Użytkownik może ukrywać widgety i zmieniać ich kolejność (zapis w localStorage).
    - Zrób wersję 2 na TanStack Query (refetchInterval, refetchIntervalInBackground, retry, placeholderData)
      i porównaj ilość kodu.

    NA CO PATRZY REKRUTER
    - Timery: setTimeout rekurencyjny vs setInterval (dlaczego setInterval + async to pułapka).
    - Stale closure w callbackach timera (fetcher zmieniający się między renderami → ref na najnowszą wersję).
    - Rozróżnienie isLoading vs isFetching.
    - Sprzątanie: każdy timer, listener visibilitychange i AbortController.

    PYTANIA NA KONIEC
    - Polling vs SSE vs WebSocket dla takiego dashboardu — co i przy jakiej skali?
    - Jak przetestujesz backoff (fake timers + mock fetchera)?
*/

export default function Page() {
    return <div>TODO: 14 — dashboard z pollingiem</div>
}
