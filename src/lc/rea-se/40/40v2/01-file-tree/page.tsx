"use client"

/*
    ZADANIE 40v2 / 01 — EKSPLORATOR PLIKÓW (drzewo)
    Poziom: ★★★☆  |  Czas jak na rozmowie: 60–90 min

    KONTEKST
    Budujesz panel boczny jak w VS Code: drzewo folderów i plików. Dane przychodzą jako
    zagnieżdżona struktura (poniżej, gotowa). Głębokość drzewa jest DOWOLNA.

    WYMAGANIA (MUST)
    1. Rekurencyjne renderowanie drzewa (folder → dzieci → ...). Wcięcie zależne od głębokości.
    2. Folder można rozwinąć / zwinąć kliknięciem. Plik nie ma strzałki.
    3. Checkboxy z TRZEMA stanami:
       - zaznaczenie folderu zaznacza/odznacza całe jego poddrzewo,
       - zaznaczenie dziecka aktualizuje rodziców w górę:
         wszystkie dzieci zaznaczone → rodzic zaznaczony,
         część dzieci → rodzic "indeterminate" (natywne input.indeterminate),
         żadne → odznaczony.
    4. Wyszukiwarka: filtruje drzewo po nazwie pliku/folderu. Wynik pokazuje dopasowania
       RAZEM ze ścieżką rodziców (rodzice widoczni, nawet jeśli sami nie pasują)
       i automatycznie rozwija te gałęzie. Dopasowany fragment nazwy podświetlony.
    5. Przyciski "Rozwiń wszystko" / "Zwiń wszystko".
    6. Pod drzewem: lista zaznaczonych PLIKÓW (pełne ścieżki, np. src/components/Button.tsx).

    UTRUDNIENIA (po MUST)
    - Nawigacja klawiaturą: ↑ ↓ między widocznymi węzłami, → rozwija / wchodzi w dziecko,
      ← zwija / wraca do rodzica, Space zaznacza. (wzorzec WAI-ARIA "tree", role="tree"/"treeitem")
    - Lazy loading: folder z flagą lazy: true nie ma dzieci w danych — przy pierwszym rozwinięciu
      "pobierz" je z fake API (setTimeout 500 ms), pokaż spinner, obsłuż błąd i retry.
    - Zmiana nazwy węzła (double click → input, Enter zapisuje, Esc anuluje).
    - Drzewo ma 5 000+ węzłów i nie może mulić (pomyśl: co się re-renderuje przy kliknięciu checkboxa?).

    OGRANICZENIA
    - Bez bibliotek do drzew. Stan zaznaczenia NIE może mutować danych wejściowych.

    NA CO PATRZY REKRUTER
    - Jak trzymasz stan: w drzewie czy w płaskich strukturach (Set/Map po id)? Dlaczego?
    - Czy stan "indeterminate" jest LICZONY (derive), czy trzymany i synchronizowany ręcznie?
    - Immutability przy aktualizacji zagnieżdżonych danych.
    - Czy filtrowanie nie gubi stanu rozwinięcia po wyczyszczeniu wyszukiwarki.

    PYTANIA NA KONIEC (odpowiedz sobie na głos)
    - Jaka jest złożoność zaznaczenia folderu z N potomkami? Da się lepiej?
    - Co byś zmienił, gdyby drzewo przychodziło z API jako PŁASKA lista {id, parentId}?
*/

type TreeNode = {
    id: string
    name: string
    type: "folder" | "file"
    children?: TreeNode[]
    lazy?: boolean
}

// DANE STARTOWE (gotowe — możesz rozbudować)
const tree: TreeNode[] = [
    {
        id: "1", name: "src", type: "folder", children: [
            {
                id: "2", name: "components", type: "folder", children: [
                    {id: "3", name: "Button.tsx", type: "file"},
                    {id: "4", name: "Modal.tsx", type: "file"},
                    {
                        id: "5", name: "form", type: "folder", children: [
                            {id: "6", name: "Input.tsx", type: "file"},
                            {id: "7", name: "Select.tsx", type: "file"},
                        ]
                    },
                ]
            },
            {
                id: "8", name: "hooks", type: "folder", children: [
                    {id: "9", name: "useDebounce.ts", type: "file"},
                    {id: "10", name: "useFetch.ts", type: "file"},
                ]
            },
            {id: "11", name: "App.tsx", type: "file"},
            {id: "12", name: "generated", type: "folder", lazy: true},
        ]
    },
    {
        id: "13", name: "public", type: "folder", children: [
            {id: "14", name: "favicon.ico", type: "file"},
        ]
    },
    {id: "15", name: "package.json", type: "file"},
]

export default function Page() {
    return <div>TODO: 01 — eksplorator plików ({tree.length} węzły w korzeniu)</div>
}
