"use client"

/*
    ZADANIE 40v2 / 12 — OKNO CZATU (real-time, scroll, wysyłka z retry)
    Poziom: ★★★★  |  Czas: 90 min

    KONTEKST
    Czat supportu. Nowe wiadomości przychodzą "na żywo" (fake socket: setInterval co 2–5 s losowa wiadomość),
    starsze wiadomości doładowujesz stronami z fake API (20 na stronę, 200 w historii).

    WYMAGANIA (MUST)
    1. Lista wiadomości (moje po prawej, cudze po lewej), grupowanie po dniach ("Dziś", "Wczoraj", "12 września").
    2. AUTOSCROLL: nowa wiadomość przewija na dół TYLKO, jeśli user już był na dole.
       Jeśli czyta historię wyżej → nie przewijaj, pokaż przycisk "↓ 3 nowe wiadomości".
    3. Scroll do góry doładowuje starsze wiadomości — i pozycja scrolla NIE skacze
       (user dalej widzi tę samą wiadomość, co przed doładowaniem).
    4. Wysyłanie: wiadomość pojawia się od razu ze statusem "wysyłanie..." (optimistic), potem "wysłano" ✓.
       Fake API failuje w 30% → status "nie wysłano" + "Ponów" / "Usuń". Kolejność wiadomości zachowana.
    5. Textarea: Enter wysyła, Shift+Enter nowa linia, auto-wysokość do 5 linii. Pusta wiadomość się nie wyśle.
    6. Wskaźnik "Ania pisze..." (fake socket wysyła zdarzenie typing, znika po 3 s bez kolejnego zdarzenia).

    UTRUDNIENIA
    - Deduplikacja: wiadomość wysłana optimistic i ta sama wiadomość wracająca z "socketu" (po clientId)
      nie może pojawić się dwa razy.
    - Rozłączenie socketu (symuluj przyciskiem): banner "Brak połączenia", wiadomości wysyłane w tym czasie
      trafiają do kolejki i idą po odzyskaniu połączenia; po reconnect dociągnij, co przegapiłeś.
    - Wirtualizacja listy przy 5000 wiadomości (zmienne wysokości!) — i żeby punkty 2–3 dalej działały.
    - Znacznik "przeczytane" przy użyciu IntersectionObserver.

    NA CO PATRZY REKRUTER
    - Trzymanie pozycji scrolla przy prependzie (scrollHeight przed/po, useLayoutEffect — dlaczego nie useEffect?).
    - Rozróżnienie "user jest na dole" — liczone przy scrollu, trzymane w refie czy w stanie?
    - Model wiadomości: clientId vs serverId, statusy, sortowanie.
    - Sprzątanie interwałów / subskrypcji socketu (StrictMode podwoi montowanie — sprawdź, że nie masz 2 socketów).

    PYTANIA NA KONIEC
    - WebSocket vs SSE vs polling dla czatu — co wybierasz i dlaczego?
    - Gdzie trzymałbyś wiadomości: useReducer, React Query (setQueryData z socketu), Zustand?
*/

type Message = {
    clientId: string
    serverId?: number
    author: "me" | "ania"
    text: string
    createdAt: string
    status: "sending" | "sent" | "failed"
}

export default function Page() {
    const messages: Message[] = []
    return <div>TODO: 12 — czat ({messages.length} wiadomości)</div>
}
