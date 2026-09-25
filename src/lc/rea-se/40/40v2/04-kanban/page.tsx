"use client"

/*
    ZADANIE 40v2 / 04 — TABLICA KANBAN z drag & drop
    Poziom: ★★★★  |  Czas: 90 min

    KONTEKST
    Mini Trello: kolumny "Do zrobienia", "W trakcie", "Gotowe". Karty można przeciągać.

    WYMAGANIA (MUST)
    1. Render kolumn i kart. Licznik kart w nagłówku kolumny.
    2. Drag & drop na NATYWNYM HTML5 DnD (draggable, onDragStart, onDragOver, onDrop) — bez bibliotek:
       - przenoszenie między kolumnami,
       - zmiana kolejności w obrębie kolumny (upuszczenie przed/po konkretnej karcie),
       - wizualny wskaźnik miejsca upuszczenia (linia między kartami),
       - przeciągana karta półprzezroczysta.
    3. Dodawanie karty (na dole kolumny), edycja tytułu (inline), usuwanie z potwierdzeniem.
    4. Limit WIP: kolumna "W trakcie" max 3 karty — upuszczenie 4. jest blokowane z komunikatem.
    5. Stan zapisywany w localStorage i odtwarzany po odświeżeniu (uwaga na SSR w Next!).

    UTRUDNIENIA
    - Undo ostatniego ruchu (Ctrl+Z) — historia ruchów, nie tylko jeden krok.
    - Przenoszenie klawiaturą (a11y): fokus na karcie, Space "podnosi", strzałki przenoszą,
      Space upuszcza, Esc anuluje; komunikat aria-live "Karta X przeniesiona do kolumny Y, pozycja 2".
    - Kolumny też da się przeciągać (zmiana kolejności kolumn).
    - Zapis do "API" z opóźnieniem i optimistic update; przy błędzie karta wraca na miejsce.
    - Wersja na dotyk (pointer events zamiast HTML5 DnD — HTML5 DnD nie działa na mobile).

    NA CO PATRZY REKRUTER
    - Model danych: czy kolejność trzymasz w tablicach id per kolumna, czy w polu "order" na karcie?
      Jakie są koszty każdej opcji przy zapisie do backendu?
    - Czysty reducer (MOVE_CARD, ADD_CARD...) przetestowany unitem — logika przeniesienia to
      najtrudniejsza część (indeksy przy przenoszeniu w dół w tej samej kolumnie!).
    - Brak mutacji przy przenoszeniu.
    - Obsługa onDragOver (preventDefault) i dlaczego bez tego drop nie działa.

    PYTANIA NA KONIEC
    - Dwie osoby przesuwają karty jednocześnie — jak rozwiązałbyś konflikty?
    - Fractional indexing (order = 1.5 między 1 a 2) — co to rozwiązuje?
*/

type Card = { id: string; title: string }
type Column = { id: "todo" | "doing" | "done"; title: string; cardIds: string[] }

// DANE STARTOWE (możesz zmienić model — to tylko propozycja)
const cards: Record<string, Card> = {
    c1: {id: "c1", title: "Setup projektu"},
    c2: {id: "c2", title: "Logowanie"},
    c3: {id: "c3", title: "Lista zamówień"},
    c4: {id: "c4", title: "Testy E2E"},
    c5: {id: "c5", title: "Deploy na staging"},
}
const columns: Column[] = [
    {id: "todo", title: "Do zrobienia", cardIds: ["c3", "c4", "c5"]},
    {id: "doing", title: "W trakcie", cardIds: ["c2"]},
    {id: "done", title: "Gotowe", cardIds: ["c1"]},
]

export default function Page() {
    return <div>TODO: 04 — kanban ({columns.length} kolumny, {Object.keys(cards).length} kart)</div>
}
