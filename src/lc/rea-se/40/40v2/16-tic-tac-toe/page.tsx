"use client"

/*
    ZADANIE 40v2 / 16 — KÓŁKO I KRZYŻYK N×N  (SZYBKIE)
    Poziom: ★★☆☆  |  Limit czasu: 30 min

    WYMAGANIA (MUST)
    1. Plansza N×N (input z N od 3 do 8) i warunek wygranej: M w linii (input, M ≤ N; dla 3×3 M = 3).
    2. Gracze X i O na zmianę; nie można kliknąć zajętego pola ani grać po końcu gry.
    3. Wykrywanie wygranej (poziom, pion, obie przekątne) i remisu. Podświetlenie zwycięskiej linii.
    4. "Nowa gra" + zmiana N/M resetuje planszę.

    UTRUDNIENIA
    - Sprawdzanie wygranej tylko wokół OSTATNIEGO ruchu (O(M), a nie całej planszy O(N²·M)).
    - Historia ruchów z "cofnij do ruchu nr 3" (jak w tutorialu Reacta, ale sam od zera).
    - Tryb vs komputer (losowy ruch, potem: blokuje twoją wygraną w następnym ruchu).
    - Nawigacja strzałkami po planszy, Enter stawia znak.

    NA CO PATRZY REKRUTER
    - Stan: jedna tablica (N*N) vs tablica tablic; "czyja tura" i "zwycięzca" LICZONE, nie trzymane.
    - Funkcja checkWinner jako czysta funkcja z testami (krawędzie planszy!).
*/

export default function Page() {
    return <div>TODO: 16 — kółko i krzyżyk</div>
}
