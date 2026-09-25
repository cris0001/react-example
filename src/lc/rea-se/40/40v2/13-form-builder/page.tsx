"use client"

/*
    ZADANIE 40v2 / 13 — FORMULARZ GENEROWANY Z SCHEMY (form builder / renderer)
    Poziom: ★★★★  |  Czas: 90 min

    KONTEKST
    Backend przysyła definicję formularza jako JSON (poniżej). Front ma go wyrenderować, zwalidować
    i zwrócić wynik. Tak działają ankiety, konfiguratory produktów, formularze w CMS-ach.

    WYMAGANIA (MUST)
    1. Rekurencyjny renderer pól: text, number, select, checkbox, radio, "group" (zagnieżdżona grupa pól)
       i "array" (lista powtarzalnych grup: dodaj / usuń / przesuń w górę-dół).
    2. Walidacja ze schemy: required, min/max, minLength, pattern (+ komunikat z schemy).
       Błędy przy polach, walidacja na blur i na submit.
    3. Warunkowa widoczność: pole ma "visibleIf" (np. pokaż "nip", gdy "customerType" === "company").
       Ukryte pola NIE są walidowane i NIE trafiają do wyniku.
    4. Wynik submitu: zagnieżdżony obiekt zgodny ze strukturą schemy
       (np. { customerType, company: { nip }, items: [{ name, qty }] }) — wypisz go pod formularzem jako JSON.
    5. Nieznany typ pola → czytelny komunikat w miejscu pola, a nie crash całego formularza.

    UTRUDNIENIA
    - Mapa typ → komponent (rejestr), żeby dodanie nowego typu pola nie wymagało zmiany renderera (open/closed).
    - Pola zależne: opcje selecta "model" zależą od wybranej "marki" (i reset "modelu" przy zmianie marki).
    - Wyliczane pola: "total" = suma qty × price z tablicy items (tylko do odczytu, liczone na żywo).
    - Wygeneruj z tej samej schemy schemat zod (funkcja schemaToZod) i waliduj nim.
    - Wydajność: 200 pól — wpisanie znaku w jedno pole nie re-renderuje wszystkich.

    NA CO PATRZY REKRUTER
    - Typy TS: discriminated union dla definicji pól (type: "text" | "select" ...), wąskie typy w switchu.
    - Ścieżki do wartości w zagnieżdżonym stanie ("items.2.qty") — get/set bez mutacji.
    - Klucze w tablicy pól (nie index — przy usuwaniu środkowego elementu!).
    - Rozdzielenie: schema → model stanu → walidacja → UI.

    PYTANIA NA KONIEC
    - Jak zrobiłbyś to na react-hook-form (useFieldArray, useWatch dla visibleIf)?
    - Co jeśli schema przyjdzie z błędem (np. visibleIf odwołuje się do nieistniejącego pola)?
*/

type FieldBase = { name: string; label: string; required?: boolean; visibleIf?: { field: string; equals: unknown } }
type FieldDef =
    | (FieldBase & { type: "text"; minLength?: number; pattern?: string; patternMessage?: string })
    | (FieldBase & { type: "number"; min?: number; max?: number })
    | (FieldBase & { type: "select" | "radio"; options: { value: string; label: string }[] })
    | (FieldBase & { type: "checkbox" })
    | (FieldBase & { type: "group"; fields: FieldDef[] })
    | (FieldBase & { type: "array"; itemLabel: string; minItems?: number; fields: FieldDef[] })

// DANE STARTOWE
const schema: FieldDef[] = [
    {
        type: "radio", name: "customerType", label: "Typ klienta", required: true,
        options: [{value: "person", label: "Osoba prywatna"}, {value: "company", label: "Firma"}],
    },
    {type: "text", name: "fullName", label: "Imię i nazwisko", required: true, minLength: 3},
    {
        type: "group", name: "company", label: "Dane firmy",
        visibleIf: {field: "customerType", equals: "company"},
        fields: [
            {type: "text", name: "name", label: "Nazwa", required: true},
            {type: "text", name: "nip", label: "NIP", required: true, pattern: "^\\d{10}$", patternMessage: "NIP to 10 cyfr"},
        ],
    },
    {
        type: "array", name: "items", label: "Produkty", itemLabel: "Produkt", minItems: 1,
        fields: [
            {type: "text", name: "name", label: "Nazwa", required: true},
            {type: "number", name: "qty", label: "Ilość", required: true, min: 1, max: 99},
            {type: "number", name: "price", label: "Cena", required: true, min: 0},
        ],
    },
    {type: "checkbox", name: "terms", label: "Akceptuję regulamin", required: true},
]

export default function Page() {
    return <div>TODO: 13 — form builder ({schema.length} pól na górnym poziomie)</div>
}
