"use client"

/*
    ZADANIE 40v2 / 09 — SYSTEM POWIADOMIEŃ (toasty) jako mini-biblioteka
    Poziom: ★★★☆  |  Czas: 60–75 min

    KONTEKST
    Zespół potrzebuje globalnych powiadomień do całej aplikacji. Masz zaprojektować API i implementację.

    WYMAGANIA (MUST)
    1. API do wywołania z DOWOLNEGO komponentu:
         const toast = useToast()
         toast.success("Zapisano"), toast.error("Błąd"), toast.info("..."),
         const id = toast.loading("Wysyłanie...") → później toast.update(id, {type: "success", message: "Wysłano"})
         toast.dismiss(id)
    2. Toasty renderowane w portalu (document.body), w prawym dolnym rogu, najnowszy na dole.
    3. Auto-zamykanie po 4 s (error: 8 s, loading: nigdy). Hover PAUZUJE odliczanie (i wznawia z pozostałym czasem,
       a nie od nowa). Pasek postępu pokazujący pozostały czas.
    4. Max 3 widoczne naraz — kolejne czekają w kolejce i wchodzą, gdy zwolni się miejsce.
    5. Przycisk "×" i opcjonalna akcja: toast.error("Usunięto", {action: {label: "Cofnij", onClick}}).
    6. Deduplikacja: ten sam komunikat wywołany 5× w sekundę pokazuje się raz (z licznikiem "×5").

    UTRUDNIENIA
    - Wywołanie toast() SPOZA Reacta (np. w interceptorze axiosa / funkcji api.ts) — bez hooka.
      (podpowiedź do przemyślenia: zewnętrzny store + useSyncExternalStore)
    - toast.promise(promise, {loading, success, error}).
    - Animacje wejścia/wyjścia (element musi zostać w DOM na czas animacji wyjścia).
    - a11y: role="status" dla info/success, role="alert" dla error; nie kradnij fokusu.
    - Komponenty wywołujące toast() NIE re-renderują się, gdy zmienia się lista toastów
      (rozdziel kontekst "akcji" od kontekstu "stanu" albo użyj store'a).

    NA CO PATRZY REKRUTER
    - Projekt API (ergonomia dla innych devów) — to zadanie bardziej o projektowaniu niż o CSS.
    - Timery: czyszczenie, pauza/wznowienie, brak wycieków przy unmount.
    - Context vs zewnętrzny store — trade-offy re-renderów.
    - Czysty reducer kolejki (ADD, DISMISS, UPDATE, PROMOTE_FROM_QUEUE) z testami.

    PYTANIA NA KONIEC
    - Jak przetestujesz auto-zamykanie i pauzę (fake timers)?
    - Co się stanie z toastami przy nawigacji między stronami w Next App Router? Gdzie umieścisz Provider?
*/

export default function Page() {
    return <div>TODO: 09 — system toastów</div>
}
