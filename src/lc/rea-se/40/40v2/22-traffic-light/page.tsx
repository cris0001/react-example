"use client"

/*
    ZADANIE 40v2 / 22 — SYGNALIZACJA ŚWIETLNA (maszyna stanów + timery)  (SZYBKIE)
    Poziom: ★★☆☆  |  Limit czasu: 20–30 min

    WYMAGANIA (MUST)
    1. Trzy światła. Cykl: zielone 4 s → żółte 1 s → czerwone 3 s → czerwone+żółte 1 s → zielone...
       Konfiguracja cyklu jako DANE (tablica/obiekt), a nie if-y w kodzie.
    2. Przycisk "Pieszy": na zielonym skraca bieżące zielone do max 1 s; w innych fazach nic nie robi.
    3. Tryb nocny (przełącznik): migające żółte co 0,5 s; wyłączenie wraca do czerwonego.

    UTRUDNIENIA
    - Dwie sygnalizacje na skrzyżowaniu, zsynchronizowane (nigdy obie zielone).
    - Pauza/wznowienie całego cyklu z zachowaniem pozostałego czasu fazy.
    - Maszyna stanów w useReducer (stany + zdarzenia TICK, PEDESTRIAN, NIGHT_ON, NIGHT_OFF) z testami.

    NA CO PATRZY REKRUTER
    - setTimeout rekurencyjny per faza vs setInterval co 1 s — co prostsze i dokładniejsze?
    - Sprzątanie timera przy zmianie fazy/trybu (brak "dwóch cykli naraz").
    - Myślenie w stanach i przejściach (state machine), a nie w flagach isGreen/isYellow.
*/

export default function Page() {
    return <div>TODO: 22 — sygnalizacja</div>
}
