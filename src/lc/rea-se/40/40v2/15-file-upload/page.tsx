"use client"

/*
    ZADANIE 40v2 / 15 — UPLOAD WIELU PLIKÓW (kolejka, progress, anulowanie)
    Poziom: ★★★★  |  Czas: 75–90 min

    KONTEKST
    Dodawanie załączników do zgłoszenia. Upload udajesz: funkcja fakeUpload(file, onProgress, signal)
    raportuje postęp co 200 ms (losowa prędkość), failuje w 20% przypadków, reaguje na abort.
    (Napisz ją sam; interfejs jak przy XMLHttpRequest.upload.onprogress.)

    WYMAGANIA (MUST)
    1. Strefa drag & drop + klasyczny input[type=file] (multiple). Podświetlenie strefy przy przeciąganiu nad nią
       (uwaga na dragenter/dragleave na elementach potomnych — klasyczny bug z migotaniem).
    2. Walidacja przed uploadem: typy (jpg, png, pdf), max 5 MB na plik, max 10 plików łącznie;
       odrzucone pliki pokazane z powodem.
    3. Kolejka z limitem współbieżności: max 2 uploady naraz, reszta czeka ("w kolejce").
    4. Per plik: nazwa, rozmiar (KB/MB), pasek postępu %, status (w kolejce / wysyłanie / gotowe / błąd / anulowano).
    5. Anuluj pojedynczy upload (abort) i "Ponów" dla błędnych. Anulowanie zwalnia slot w kolejce.
    6. Podgląd miniatur dla obrazków (URL.createObjectURL — i pamiętaj o revokeObjectURL!).
    7. Przycisk "Zapisz zgłoszenie" aktywny dopiero, gdy wszystko wysłane lub usunięte.

    UTRUDNIENIA
    - Łączny postęp (ważony rozmiarem plików, nie średnia procentów).
    - Wklejanie obrazka ze schowka (paste event) jako nowy plik.
    - Duplikaty: ten sam plik dodany drugi raz (nazwa + rozmiar + lastModified) → pomiń z komunikatem.
    - Wydziel hook useUploadQueue({concurrency}) — logika kolejki bez UI, z testami (fake timers).
    - Wersja "prawdziwa": presigned URL do S3 (opisz przepływ: front → backend po URL → PUT bezpośrednio do S3).

    NA CO PATRZY REKRUTER
    - Implementacja kolejki ze współbieżnością (kto startuje następny upload, gdy któryś się skończy/przerwie?).
    - Aktualizacja postępu wielu plików naraz bez gubienia update'ów (funkcyjny updater / reducer).
    - Wycieki: object URL-e, AbortController-y, timery przy unmount.
    - Walidacja po stronie klienta to UX — serwer i tak musi sprawdzić typ i rozmiar.

    PYTANIA NA KONIEC
    - Dlaczego fetch nie daje postępu UPLOADU, a XMLHttpRequest daje?
    - Jak zrobiłbyś wznawianie uploadu 2 GB pliku po zerwaniu sieci (chunking / multipart upload)?
*/

export default function Page() {
    return <div>TODO: 15 — upload plików</div>
}
