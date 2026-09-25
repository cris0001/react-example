"use client"

/*
    ZADANIE 40v2 / 20 — TABS jako compound component  (SZYBKIE)
    Poziom: ★★★☆  |  Limit czasu: 30–40 min

    KONTEKST
    Zaprojektuj API jak w bibliotece komponentów:
        <Tabs defaultValue="profile">           // albo kontrolowane: value + onValueChange
            <Tabs.List>
                <Tabs.Trigger value="profile">Profil</Tabs.Trigger>
                <Tabs.Trigger value="billing" disabled>Płatności</Tabs.Trigger>
                <Tabs.Trigger value="security">Bezpieczeństwo</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Panel value="profile">...</Tabs.Panel>
            ...
        </Tabs>

    WYMAGANIA (MUST)
    1. Działa zarówno jako uncontrolled (defaultValue), jak i controlled (value + onValueChange).
    2. Stan dzielony przez Context; Trigger i Panel poza <Tabs> → czytelny błąd.
    3. Klawiatura wg WAI-ARIA APG: ← → między zakładkami (z zawijaniem, pomija disabled), Home/End;
       tylko aktywna zakładka ma tabIndex=0 (roving tabindex).
    4. ARIA: role="tablist"/"tab"/"tabpanel", aria-selected, aria-controls ↔ aria-labelledby (id z useId).

    UTRUDNIENIA
    - Aktywna zakładka w URL (?tab=security) — back/forward przełącza zakładki.
    - Panele montowane leniwie przy pierwszym otwarciu i NIE odmontowywane potem (zachowują stan formularzy).
    - Orientacja pionowa (↑ ↓ zamiast ← →).

    NA CO PATRZY REKRUTER
    - Wzorzec compound components + Context; controlled/uncontrolled w jednym komponencie.
    - Rejestracja triggerów w kolejności (jak znaleźć "następną" zakładkę dla strzałek?).
*/

export default function Page() {
    return <div>TODO: 20 — tabs</div>
}
