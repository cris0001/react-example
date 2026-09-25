"use client"

/*
    ZADANIE 40v2 / 11 — MACIERZ UPRAWNIEŃ (role × uprawnienia) z zapisem zmian
    Poziom: ★★★☆  |  Czas: 60–75 min

    KONTEKST
    Panel admina: tabela, gdzie wiersze to uprawnienia, a kolumny to role. Checkbox = rola ma uprawnienie.

    WYMAGANIA (MUST)
    1. Tabela z danymi startowymi (poniżej). Nagłówki kolumn przyklejone przy scrollu (sticky).
    2. Zależności między uprawnieniami:
       - zaznaczenie "orders.edit" automatycznie zaznacza "orders.view" (bo edycja wymaga podglądu),
       - odznaczenie "orders.view" odznacza wszystko, co od niego zależy (edit, delete),
       - zależności mogą być wielopoziomowe (delete → edit → view).
    3. Rola "admin" ma wszystko i jest tylko do odczytu (zablokowane checkboxy + tooltip dlaczego).
    4. Checkbox w nagłówku kolumny: zaznacz/odznacz wszystko dla roli (z indeterminate).
    5. Tryb "brudny": zmienione komórki podświetlone; licznik "5 niezapisanych zmian"; przyciski "Zapisz" i "Odrzuć".
    6. Zapis wysyła do fake API tylko DIFF (lista {role, permission, granted}), nie całą macierz.
       Optimistic save; przy błędzie przywróć stan sprzed zapisu i pokaż, które zmiany się nie udały.
    7. Blokada opuszczenia strony z niezapisanymi zmianami.

    UTRUDNIENIA
    - Dodawanie nowej roli (kolumny) przez "Skopiuj z roli...".
    - Wyszukiwarka uprawnień + grupowanie po module (orders, users, reports) ze zwijaniem grup.
    - Nawigacja strzałkami po siatce checkboxów (jedna tabulacja do siatki, dalej strzałki — roving tabindex).
    - Porównanie dwóch ról ("pokaż tylko różnice").

    NA CO PATRZY REKRUTER
    - Model stanu: Set<string> kluczy "role:permission" vs zagnieżdżone obiekty — co łatwiej diffować i porównać?
    - Stan "oryginalny" vs "roboczy" — diff liczony, a nie ręcznie śledzony.
    - Czysta funkcja rozwiązywania zależności (z testami, w tym cykl w konfiguracji zależności).
    - UI to tylko UX — prawdziwa autoryzacja jest na backendzie (powiedz to na głos).

    PYTANIA NA KONIEC
    - Dwóch adminów edytuje jednocześnie — jak wykryjesz konflikt (wersja / ETag / 409)?
    - Czy trzymałbyś to w React Query, w useReducer, czy w obu? Gdzie granica?
*/

const ROLES = ["admin", "manager", "support", "viewer"] as const
const PERMISSIONS = [
    "orders.view", "orders.edit", "orders.delete",
    "users.view", "users.edit", "users.invite",
    "reports.view", "reports.export",
] as const

// uprawnienie → uprawnienia, których wymaga
const DEPENDS_ON: Record<string, string[]> = {
    "orders.edit": ["orders.view"],
    "orders.delete": ["orders.edit"],
    "users.edit": ["users.view"],
    "users.invite": ["users.view"],
    "reports.export": ["reports.view"],
}

const INITIAL: Record<string, string[]> = {
    admin: [...PERMISSIONS],
    manager: ["orders.view", "orders.edit", "users.view", "reports.view", "reports.export"],
    support: ["orders.view", "users.view"],
    viewer: ["reports.view"],
}

export default function Page() {
    return (
        <div>
            TODO: 11 — macierz uprawnień ({ROLES.length} ról, {PERMISSIONS.length} uprawnień,
            {Object.keys(DEPENDS_ON).length} zależności, {Object.keys(INITIAL).length} ról w danych)
        </div>
    )
}
