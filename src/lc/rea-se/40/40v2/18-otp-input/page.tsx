"use client"

/*
    ZADANIE 40v2 / 18 — POLE KODU OTP (6 cyfr)  (SZYBKIE)
    Poziom: ★★★☆  |  Limit czasu: 30–40 min

    KONTEKST
    Ekran "Wpisz kod z SMS-a" — 6 osobnych pól po jednej cyfrze. Komponent wielokrotnego użytku:
    <OtpInput length={6} value={code} onChange={setCode} onComplete={verify} />

    WYMAGANIA (MUST)
    1. Tylko cyfry. Wpisanie cyfry przenosi fokus do następnego pola.
    2. Backspace w pustym polu cofa fokus do poprzedniego i czyści je; w pełnym — czyści bieżące.
    3. Strzałki ← → przesuwają fokus. Klik w pole zaznacza jego zawartość.
    4. Wklejenie "123456" (albo "12 34 56", "kod: 123456") w DOWOLNE pole rozkłada cyfry na pola od tego miejsca.
    5. Po uzupełnieniu wszystkich pól → onComplete(code) (dokładnie RAZ).
    6. Stany: weryfikacja (pola zablokowane), błąd (czerwone obramowanie, wyczyść pola, fokus na pierwsze).

    UTRUDNIENIA
    - autocomplete="one-time-code" + inputMode="numeric" (autouzupełnianie z SMS na iOS/Android).
    - Zamiast 6 inputów: jeden ukryty input + 6 "wizualnych" pól — porównaj trade-offy (a11y, wklejanie, autofill).
    - Odliczanie "Wyślij ponownie za 30 s".
    - a11y: etykieta "Cyfra 1 z 6", komunikat błędu przez aria-live.

    NA CO PATRZY REKRUTER
    - Tablica refów do inputów (useRef z tablicą / callback refs).
    - Controlled component — stan u rodzica, komponent tylko emituje zmiany.
    - Obsługa onPaste i onKeyDown, a nie tylko onChange.
*/

export default function Page() {
    return <div>TODO: 18 — OTP input</div>
}
