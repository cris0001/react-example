"use client"

/*
    ZADANIE 40v2 / 19 — MODAL / DIALOG od zera (a11y)  (SZYBKIE)
    Poziom: ★★★☆  |  Limit czasu: 40 min

    WYMAGANIA (MUST)
    1. Komponent <Modal open onClose title>{children}</Modal> renderowany przez portal do document.body.
    2. Zamykanie: przycisk ×, klawisz Esc, klik w tło (overlay) — ale NIE klik wewnątrz okna
       (i nie wtedy, gdy user zaczął zaznaczać tekst w środku i puścił mysz na tle!).
    3. Focus trap: Tab / Shift+Tab krążą tylko po elementach w modalu.
    4. Po otwarciu fokus na pierwszym interaktywnym elemencie (albo wskazanym przez initialFocusRef).
       Po zamknięciu fokus WRACA do przycisku, który otworzył modal.
    5. Blokada scrolla strony pod spodem (i brak "skoku" strony przez znikający scrollbar).
    6. role="dialog", aria-modal="true", aria-labelledby → tytuł.

    UTRUDNIENIA
    - Zagnieżdżone modale (modal otwiera modal potwierdzenia): Esc zamyka tylko górny, fokus wraca poprawnie.
    - Animacja otwarcia/zamknięcia (element zostaje w DOM do końca animacji).
    - Wersja 2 na natywnym <dialog> + showModal() — co dostajesz za darmo, a czego dalej musisz pilnować?
    - Hook useConfirm(): const ok = await confirm("Na pewno usunąć?") — Promise rozwiązywany kliknięciem.

    NA CO PATRZY REKRUTER
    - Portal i to, że zdarzenia z portalu bąbelkują przez drzewo REACTA.
    - Sprzątanie listenerów keydown i przywracanie overflow body przy unmount.
    - Szukanie elementów fokusowalnych (selektor) i ich zmiana w trakcie życia modala.
*/

export default function Page() {
    return <div>TODO: 19 — modal</div>
}
