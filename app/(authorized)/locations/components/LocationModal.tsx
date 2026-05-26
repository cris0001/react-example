"use client"

import { useEffect, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { X, MapPin, Loader2, Crosshair } from "lucide-react"
import { Input, Select, Label } from "@/components/ui"
import { useCreateLocation, useUpdateLocation, useLocation } from "../hooks/useLocations"
import { ODB_LABELS } from "../types"
import type { OdbMode, CreateLocationPayload } from "../types"

interface FormValues {
  nazwa: string
  adres1: string
  adres2: string
  sposobOdb: OdbMode
}

interface LocationModalProps {
  editId: number | null
  onClose: () => void
}

export function LocationModal({ editId, onClose }: LocationModalProps) {
  const isEdit = !!editId
  const { data: existing, isLoading: loadingEdit } = useLocation(editId)
  const { mutateAsync: create, isPending: isCreating } = useCreateLocation()
  const { mutateAsync: update, isPending: isUpdating } = useUpdateLocation()
  const isPending = isCreating || isUpdating

  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [geocoding, setGeocoding] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { nazwa: "", adres1: "", adres2: "", sposobOdb: 1 }
  })

  // Wypełnij formularz przy edycji
  useEffect(() => {
    if (existing) {
      reset({
        nazwa: existing.nazwa,
        adres1: existing.adres1,
        adres2: existing.adres2,
        sposobOdb: existing.sposobOdb,
      })
      setLat(existing.gpsLat)
      setLng(existing.gpsLng)
    }
  }, [existing, reset])

  const close = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [close])

  // Geokodowanie adresu przez Nominatim
  const geocodeAddress = useCallback(async () => {
    const adres1 = watch("adres1")
    const adres2 = watch("adres2")
    if (!adres1 || !adres2) return

    setGeocoding(true)
    try {
      const q = `${adres1.trim()}, ${adres2.trim()}`
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(q)}`
      const res = await fetch(url, {
        headers: { Accept: "application/json" }
      })
      const arr = await res.json()
      if (Array.isArray(arr) && arr.length > 0) {
        setLat(Number(arr[0].lat))
        setLng(Number(arr[0].lon))
        setMessage({ ok: true, text: "Znaleziono lokalizację." })
      } else {
        setMessage({ ok: false, text: "Nie znaleziono adresu. Uzupełnij GPS ręcznie." })
      }
    } catch {
      setMessage({ ok: false, text: "Błąd geokodowania." })
    } finally {
      setGeocoding(false)
      setTimeout(() => setMessage(null), 4000)
    }
  }, [watch])

  const onSubmit = async (values: FormValues) => {
    if (!lat || !lng) {
      setMessage({ ok: false, text: "Podaj współrzędne GPS." })
      return
    }

    try {
      if (isEdit && existing) {
        await update({
          ...existing,
          nazwa: values.nazwa,
          adres1: values.adres1,
          adres2: values.adres2,
          sposobOdb: values.sposobOdb,
          gpsLat: lat,
          gpsLng: lng,
        })
      } else {
        const payload: CreateLocationPayload = {
          nazwa: values.nazwa,
          adres1: values.adres1,
          adres2: values.adres2,
          sposobOdb: values.sposobOdb,
          gpsLat: lat,
          gpsLng: lng,
        }
        await create(payload)
      }
      setMessage({ ok: true, text: isEdit ? "Zaktualizowano." : "Dodano lokalizację." })
      setTimeout(close, 1200)
    } catch (err: unknown) {
      setMessage({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd zapisu." })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {isEdit ? "Edytuj lokalizację" : "Nowa lokalizacja"}
          </h2>
          <button onClick={close} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loadingEdit && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loadingEdit && (
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">

            {message && (
              <div className={[
                "px-3 py-2.5 rounded-lg text-sm border",
                message.ok
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
                  : "bg-destructive/8 border-destructive/20 text-destructive",
              ].join(" ")}>
                {message.text}
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Nazwa lokalizacji</Label>
              <Input
                error={!!errors.nazwa}
                placeholder="np. Biuro główne"
                {...register("nazwa", { required: "Nazwa jest wymagana" })}
              />
              {errors.nazwa && <p className="text-xs text-destructive">{errors.nazwa.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Ulica i numer</Label>
              <Input
                placeholder="ul. Przykładowa 1"
                {...register("adres1")}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Kod pocztowy i miasto</Label>
              <Input
                placeholder="00-000 Warszawa"
                {...register("adres2")}
              />
            </div>

            {/* Geokodowanie */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={geocodeAddress}
                disabled={geocoding}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
              >
                {geocoding
                  ? <Loader2 className="w-3 h-3 animate-spin" />
                  : <Crosshair className="w-3 h-3" />
                }
                Znajdź GPS z adresu
              </button>

              {lat && lng && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {lat.toFixed(5)}, {lng.toFixed(5)}
                </span>
              )}
            </div>

            {/* Ręczny GPS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>GPS Lat</Label>
                <Input
                  type="number"
                  step="any"
                  value={lat ?? ""}
                  onChange={(e) => setLat(e.target.value ? Number(e.target.value) : null)}
                  placeholder="52.2297"
                />
              </div>
              <div className="space-y-1.5">
                <Label>GPS Lng</Label>
                <Input
                  type="number"
                  step="any"
                  value={lng ?? ""}
                  onChange={(e) => setLng(e.target.value ? Number(e.target.value) : null)}
                  placeholder="21.0122"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Sposób odbicia</Label>
              <Select {...register("sposobOdb", { valueAsNumber: true })}>
                {(Object.keys(ODB_LABELS) as unknown as OdbMode[]).map((k) => (
                  <option key={k} value={k}>{ODB_LABELS[k]}</option>
                ))}
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button type="button" onClick={close} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
                Anuluj
              </button>
              <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60 transition-colors">
                {isPending ? "Zapisywanie…" : isEdit ? "Zapisz" : "Dodaj"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
