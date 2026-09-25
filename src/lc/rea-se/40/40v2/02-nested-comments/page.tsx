"use client"

/*
    ZADANIE 40v2 / 02 — WĄTKOWANE KOMENTARZE (jak Reddit)
    Poziom: ★★★☆  |  Czas: 60–90 min

    KONTEKST
    API zwraca komentarze jako PŁASKĄ listę z parentId (null = komentarz główny).
    Twoim zadaniem jest zbudować z tego drzewo i obsłużyć typowe akcje.

    WYMAGANIA (MUST)
    1. Zamiana płaskiej listy na drzewo (osobna, czysta funkcja — przetestuj ją unitem).
       Ma działać dla dowolnej głębokości i dowolnej kolejności elementów w tablicy
       (dziecko może przyjść PRZED rodzicem).
    2. Render wątków z wcięciem. Przy każdym komentarzu: autor, "x min temu", treść, liczba odpowiedzi
       (WSZYSTKICH potomków, nie tylko bezpośrednich dzieci).
    3. "Odpowiedz" pod dowolnym komentarzem → inline formularz → dodaje komentarz na właściwym poziomie.
    4. Edycja własnego komentarza (author === "me") i usuwanie:
       - usunięcie komentarza BEZ odpowiedzi → znika,
       - usunięcie komentarza Z odpowiedziami → treść zamienia się na "[usunięty]", odpowiedzi zostają.
    5. Zwijanie/rozwijanie wątku ("[+] 5 odpowiedzi").
    6. Sortowanie głównych komentarzy: najnowsze / najstarsze / najwięcej głosów.
    7. Głosowanie ▲ ▼ (jeden głos na komentarz, ponowne kliknięcie cofa, zmiana ▲ na ▼ liczy się jako -2).

    UTRUDNIENIA
    - Stan trzymaj ZNORMALIZOWANY (np. byId + childrenIds), a drzewo licz w renderze.
      Porównaj z wersją, gdzie trzymasz zagnieżdżone drzewo — co łatwiej aktualizować?
    - Fake API z opóźnieniem 400 ms + optimistic update przy dodawaniu i głosowaniu, rollback przy błędzie
      (niech API losowo failuje w 20% przypadków).
    - Powyżej głębokości 5 zamiast dalszego wcięcia pokaż link "Kontynuuj wątek →", który
      pokazuje ten pod-wątek jako główny widok (z przyciskiem powrotu).
    - React.memo na komentarzu: kliknięcie głosu w jednym komentarzu nie re-renderuje pozostałych.

    NA CO PATRZY REKRUTER
    - Złożoność budowania drzewa (O(n) z mapą, a nie O(n²) z zagnieżdżonym filter).
    - Czy "liczba odpowiedzi" jest liczona, a nie trzymana w stanie.
    - Rekurencyjny komponent i poprawne key.
    - Obsługa edge case'ów: pusty formularz, bardzo długi tekst, usuwanie rodzica.

    PYTANIA NA KONIEC
    - Gdzie trzymałbyś stan formularza odpowiedzi — w komentarzu czy wyżej? Co się stanie po zwinięciu wątku?
    - Jak zrobiłbyś paginację odpowiedzi ("pokaż 10 kolejnych") przy danych z serwera?
*/

type Comment = {
    id: number
    parentId: number | null
    author: string
    text: string
    createdAt: string   // ISO
    votes: number
}

// DANE STARTOWE — celowo pomieszana kolejność
const comments: Comment[] = [
    {id: 5, parentId: 2, author: "ola", text: "Zgadzam się z przedmówcą", createdAt: "2026-09-25T10:20:00Z", votes: 1},
    {id: 1, parentId: null, author: "kuba", text: "Czy ktoś używał już React Compilera na produkcji?", createdAt: "2026-09-25T09:00:00Z", votes: 12},
    {id: 2, parentId: 1, author: "me", text: "Tak, u nas działa od miesiąca", createdAt: "2026-09-25T09:30:00Z", votes: 5},
    {id: 3, parentId: null, author: "ania", text: "Jaki router polecacie do SPA?", createdAt: "2026-09-25T11:00:00Z", votes: 3},
    {id: 4, parentId: 1, author: "piotr", text: "Nie, boimy się", createdAt: "2026-09-25T09:45:00Z", votes: 0},
    {id: 6, parentId: 5, author: "kuba", text: "A jakie mieliście problemy?", createdAt: "2026-09-25T10:40:00Z", votes: 2},
]

export default function Page() {
    return <div>TODO: 02 — komentarze ({comments.length})</div>
}
