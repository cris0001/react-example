"use client"

/*
    ZADANIE 40v2 / 25 — PASKI POSTĘPU Z KOLEJKĄ  (SZYBKIE, bardzo popularne)
    Poziom: ★★★☆  |  Limit czasu: 30 min (rekruter dokłada kolejne warianty co 10 min)

    WARIANT 1
    Przycisk "Dodaj" dodaje pasek postępu, który napełnia się od 0 do 100% w 2 s.

    WARIANT 2
    Naraz mogą się napełniać MAX 3 paski. Kolejne czekają (puste) i startują, gdy któryś się skończy.

    WARIANT 3
    Przycisk "Pauza / Wznów" dla wszystkich (pauza zatrzymuje w miejscu, wznowienie kontynuuje od tego %).

    WARIANT 4
    "Wyczyść ukończone" + każdy pasek ma własny czas trwania (losowo 1–4 s).

    NA CO PATRZY REKRUTER
    - Animacja CSS (transition na width/transform) vs sterowanie % z JS (setInterval / rAF) —
      w której wersji łatwiej zrobić pauzę i limit współbieżności?
    - Gdzie żyje logika kolejki: rodzic decyduje, które paski są aktywne (derive z listy), a pasek tylko raportuje "skończyłem".
    - Brak wyścigów przy szybkim klikaniu "Dodaj" 10 razy.
*/

export default function Page() {
    return <div>TODO: 25 — paski postępu z kolejką</div>
}
