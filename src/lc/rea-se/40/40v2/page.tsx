"use client"

/*
    40v2 — REALNE ZADANIA LIVECODINGOWE (React, poziom mid+/senior)

    Zasada: to nie są zadania typu "napisz debounce", tylko kawałki prawdziwych aplikacji,
    w których wychodzi wszystko naraz: model stanu, rekurencja, async i race conditions,
    wydajność, a11y, czyste funkcje z testami. Treść każdego zadania jest w komentarzu
    w jego page.tsx. Rozwiązania piszesz sam.

    JAK ROBIĆ (symulacja rozmowy)
    1. Przeczytaj treść, zanim zaczniesz kodować; zadaj sobie pytania doprecyzowujące (zapisz je w komentarzu).
    2. Najpierw MUST — działająca wersja end-to-end, potem UTRUDNIENIA.
    3. Mów na głos, co robisz i dlaczego (albo pisz krótkie komentarze z decyzjami).
    4. Logikę bez UI (reducery, parsery, budowanie drzew) wydzielaj do czystych funkcji + test w Vitest.
    5. Na koniec odpowiedz na "PYTANIA NA KONIEC" i wklej mi rozwiązanie do review.

    LISTA ZADAŃ (★ = trudność)
    [ ] 01-file-tree            ★★★☆   Eksplorator plików: rekurencja, checkboxy tri-state, filtr ze ścieżką, lazy load
    [ ] 02-nested-comments      ★★★☆   Komentarze wątkowe: płaska lista → drzewo, reply/edit/delete, głosy, optimistic
    [ ] 03-data-table           ★★★☆   Tabela: sort wielokolumnowy, filtry, paginacja, cały stan w URL, zaznaczanie jak w Gmailu
    [ ] 04-kanban               ★★★★   Kanban: natywny drag & drop, reorder, limit WIP, localStorage, undo
    [ ] 05-wizard-form          ★★★☆   Formularz wielokrokowy: zod per krok, krok warunkowy, draft, błędy z serwera
    [ ] 06-tag-combobox         ★★★★   Multi-select z API: debounce, abort, cache, klawiatura, pełne ARIA
    [ ] 07-mini-spreadsheet     ★★★★★  Arkusz: parser formuł, graf zależności, wykrywanie cykli, nawigacja
    [ ] 08-date-range-picker    ★★★★   Kalendarz zakresu: siatka miesiąca, blokady, klawiatura, strefy czasowe
    [ ] 09-toast-system         ★★★☆   Toasty jako mini-biblioteka: API, kolejka, pauza timera, wywołanie spoza Reacta
    [ ] 10-whiteboard           ★★★★   Edytor kształtów: pointer events, multi-select, resize, undo/redo
    [ ] 11-permissions-matrix   ★★★☆   Macierz ról: zależności uprawnień, dirty state, zapis diffu, rollback
    [ ] 12-chat                 ★★★★   Czat: autoscroll, doładowanie historii bez skoku, optimistic + retry, reconnect
    [ ] 13-form-builder         ★★★★   Formularz ze schemy JSON: rekurencyjny renderer, visibleIf, tablice pól
    [ ] 14-polling-dashboard    ★★★☆   Dashboard: usePolling, backoff, Page Visibility, isLoading vs isFetching
    [ ] 15-file-upload          ★★★★   Upload: drag & drop, kolejka ze współbieżnością 2, progress, abort, retry

    SUGEROWANA KOLEJNOŚĆ (od "rozgrzewki" do najtrudniejszych)
    01 → 02 → 05 → 09 → 14 → 03 → 11 → 06 → 04 → 15 → 08 → 12 → 10 → 13 → 07
*/

export default function Page() {
    return <div>40v2 — lista zadań w komentarzu tego pliku</div>
}
