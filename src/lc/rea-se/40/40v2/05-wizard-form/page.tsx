"use client"

/*
    ZADANIE 40v2 / 05 — FORMULARZ WIELOKROKOWY (wizard)
    Poziom: ★★★☆  |  Czas: 75–90 min

    KONTEKST
    Onboarding firmy w aplikacji B2B. 4 kroki:
      1) Dane konta: email, hasło, powtórz hasło
      2) Firma: nazwa, NIP (10 cyfr + suma kontrolna), typ: "jdg" | "spółka"
      3) Tylko dla "spółka": KRS + lista wspólników (dynamiczna: dodaj/usuń, min. 1, suma udziałów = 100%)
      4) Podsumowanie + zgody (regulamin wymagany, marketing opcjonalny) → Wyślij

    WYMAGANIA (MUST)
    1. Pasek postępu z krokami. Krok 3 znika z paska, gdy typ = "jdg" (numeracja się przelicza).
    2. Walidacja per krok (zod) — nie przejdziesz "Dalej" z błędami; błędy przy polach, fokus na pierwszym błędnym.
    3. "Wstecz" nie gubi danych. Zmiana typu z "spółka" na "jdg" — co z danymi kroku 3? (zdecyduj i uzasadnij)
    4. Podsumowanie pokazuje wszystko z możliwością "Edytuj" → skok do danego kroku → powrót do podsumowania.
    5. Wysyłka do fake API (1 s, losowo błąd 409 "NIP już istnieje") — przy 409 przenieś usera do kroku 2
       i pokaż błąd przy polu NIP. Przycisk zablokowany w trakcie wysyłki (brak podwójnego submitu).
    6. Wersja robocza (draft) w localStorage — po odświeżeniu wraca na ten sam krok z danymi
       (BEZ haseł — dlaczego?).

    UTRUDNIENIA
    - Krok w URL (?step=2) — back/forward przeglądarki przechodzą między krokami,
      ale nie da się wejść linkiem na krok 3, jeśli krok 2 jest niepoprawny.
    - Ostrzeżenie przy opuszczeniu strony z niezapisanymi zmianami (beforeunload).
    - Asynchroniczna walidacja NIP-u (fake API "czy NIP istnieje w GUS") z debounce i anulowaniem.
    - Zrób to na react-hook-form + zod resolver (jeden form na wszystkie kroki czy form per krok? — trade-off).

    NA CO PATRZY REKRUTER
    - Gdzie żyje stan całego wizarda i jak kroki się z nim komunikują.
    - Schemat zod: osobny per krok vs jeden z .pick()/.superRefine; walidacja krzyżowa (hasła, suma udziałów).
    - Obsługa błędów z serwera mapowanych na pola.
    - Dostępność: aria-current na aktywnym kroku, błędy powiązane aria-describedby.

    PYTANIA NA KONIEC
    - Controlled vs uncontrolled dla tak dużego formularza — co wybrałeś i dlaczego?
    - Jak przetestowałbyś ten flow (unit schematów vs RTL vs E2E)?
*/

export default function Page() {
    return <div>TODO: 05 — wizard</div>
}
