"use client"

/*
    ZADANIE 40v2 / 06 — MULTI-SELECT COMBOBOX z podpowiedziami z API (tagi / osoby)
    Poziom: ★★★★  |  Czas: 75–90 min

    KONTEKST
    Pole "Przypisz osoby" jak w Jira/GitHub: wpisujesz, dostajesz podpowiedzi z serwera,
    wybrane osoby lądują jako "chipy" w polu.
    Fake API: napisz searchUsers(query, signal) → Promise<User[]> z losowym opóźnieniem 100–800 ms
    (celowo! odpowiedzi mogą wrócić w innej kolejności niż wysłane zapytania).

    WYMAGANIA (MUST)
    1. Input + lista podpowiedzi pod spodem. Zapytanie leci z debounce 300 ms, od 2 znaków.
    2. Poprzednie zapytanie jest anulowane (AbortController) — nigdy nie pokazuj wyników dla starego tekstu.
    3. Cache wyników per query (wpisanie "an", potem "ann", potem backspace do "an" → bez requestu).
    4. Klawiatura: ↓ ↑ po liście (zawijanie), Enter wybiera, Esc zamyka listę, Backspace w pustym
       inpucie usuwa ostatni chip. Myszka i klawiatura dzielą ten sam "aktywny" element.
    5. Wybrane osoby jako chipy z "×". Wybranych nie pokazuj w podpowiedziach.
    6. Dopasowany fragment podświetlony (<mark>). Stany: ładowanie, brak wyników, błąd.
    7. Klik poza komponentem zamyka listę (ale klik w podpowiedź nie gubi fokusu inputa!).

    UTRUDNIENIA
    - Pełne ARIA: role="combobox", aria-expanded, aria-controls, aria-activedescendant, role="listbox"/"option",
      aria-selected; ogłaszanie liczby wyników przez aria-live.
    - Opcja "Utwórz tag „xyz”" gdy brak dokładnego dopasowania.
    - Limit wyboru (max 5) z komunikatem.
    - Lista podpowiedzi jako portal (żeby nie ucinał jej overflow: hidden rodzica) + pozycjonowanie.
    - Wydziel logikę do hooka useCombobox (headless) — komponent tylko renderuje.

    NA CO PATRZY REKRUTER
    - Race conditions (abort + ignorowanie spóźnionych odpowiedzi) — to jest SEDNO zadania.
    - Debounce jako hook vs w handlerze; czyszczenie timerów przy unmount.
    - onMouseDown + preventDefault vs onClick na opcji (dlaczego onClick potrafi przegrać z onBlur).
    - Czy nie ma zbędnych stanów (np. "filteredSuggestions" trzymane w useState zamiast liczone).

    PYTANIA NA KONIEC
    - Jak zrobiłbyś to na TanStack Query (queryKey z debounced query, placeholderData)?
    - Dlaczego w praktyce sięgnąłbyś po Radix/React Aria/Downshift zamiast pisać to od zera?
*/

type User = { id: number; name: string; email: string }

// DANE DO FAKE API
const USERS: User[] = [
    {id: 1, name: "Anna Kowalska", email: "anna@firma.pl"},
    {id: 2, name: "Andrzej Nowak", email: "andrzej@firma.pl"},
    {id: 3, name: "Anita Wiśniewska", email: "anita@firma.pl"},
    {id: 4, name: "Bartosz Zieliński", email: "bartek@firma.pl"},
    {id: 5, name: "Joanna Anuszewska", email: "joanna@firma.pl"},
    {id: 6, name: "Marek Mazur", email: "marek@firma.pl"},
    {id: 7, name: "Hanna Kamińska", email: "hanna@firma.pl"},
]

export default function Page() {
    return <div>TODO: 06 — combobox ({USERS.length} użytkowników w fake API)</div>
}
