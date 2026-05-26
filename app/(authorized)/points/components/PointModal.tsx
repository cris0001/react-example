"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, QrCode } from "lucide-react"
import { Input, Label } from "@/components/ui"
import { useCreatePoint, useUpdatePoint, useUpdatePointPassword, usePoints } from "../hooks/usePoints"
import { cn } from "@/utils/helpers"
import type { CreatePointPayload } from "../types"

// ---------------------------------------------------------------------------
// Formularz tworzenia
// ---------------------------------------------------------------------------
interface CreateFormValues {
  nazwisko: string
  email: string
  password: string
  passwordConfirm: string
}

function CreateForm({ onClose }: { onClose: () => void }) {
  const { mutateAsync: create, isPending } = useCreatePoint()
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateFormValues>()

  const onSubmit = async (values: CreateFormValues) => {
    const payload: CreatePointPayload = {
      imie: "TABLET",
      nazwisko: values.nazwisko.trim(),
      email: values.email.trim(),
      password: values.password,
      passwordConfirm: values.passwordConfirm,
      idStanow: 0,
    }
    try {
      await create(payload)
      setMessage({ ok: true, text: "Punkt odbić dodany." })
      setTimeout(onClose, 1200)
    } catch (err: unknown) {
      setMessage({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd zapisu." })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <div className={cn(
          "px-3 py-2.5 rounded-lg text-sm border",
          message.ok
            ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
            : "bg-destructive/8 border-destructive/20 text-destructive"
        )}>
          {message.text}
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Nazwa punktu</Label>
        <Input error={!!errors.nazwisko} placeholder="np. Wejście główne"
          {...register("nazwisko", { required: "Nazwa jest wymagana" })} />
        {errors.nazwisko && <p className="text-xs text-destructive">{errors.nazwisko.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Login (email)</Label>
        <Input type="email" error={!!errors.email}
          {...register("email", { required: "Login jest wymagany" })} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Hasło</Label>
          <Input type="password" error={!!errors.password}
            {...register("password", { required: "Hasło jest wymagane", minLength: { value: 4, message: "Min 4 znaki" } })} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Powtórz hasło</Label>
          <Input type="password" error={!!errors.passwordConfirm}
            {...register("passwordConfirm", {
              required: "Wymagane",
              validate: (v) => v === watch("password") || "Hasła nie są zgodne"
            })} />
          {errors.passwordConfirm && <p className="text-xs text-destructive">{errors.passwordConfirm.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
          Anuluj
        </button>
        <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60 transition-colors">
          {isPending ? "Dodawanie…" : "Dodaj punkt"}
        </button>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Formularz edycji + zmiana hasła
// ---------------------------------------------------------------------------
interface EditFormValues { nazwisko: string; email: string }
interface PassFormValues { password: string; passwordConfirm: string }

function EditForm({ id, onClose }: { id: number; onClose: () => void }) {
  const { data } = usePoints(1)
  const point = data?.content.find((p) => p.id === id)
  const { mutateAsync: update, isPending: isUpdating } = useUpdatePoint()
  const { mutateAsync: updatePass, isPending: isChangingPass } = useUpdatePointPassword()

  const [tab, setTab] = useState<"info" | "password">("info")
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const { register: regInfo, handleSubmit: handleInfo, reset: resetInfo, formState: { errors: errInfo } } = useForm<EditFormValues>()
  const { register: regPass, handleSubmit: handlePass, watch: watchPass, formState: { errors: errPass } } = useForm<PassFormValues>()

  useEffect(() => {
    if (point) resetInfo({ nazwisko: point.nazwisko, email: point.email })
  }, [point, resetInfo])

  const onSubmitInfo = async (values: EditFormValues) => {
    if (!point) return
    try {
      await update({ id: point.id, firma: point.firma, imie: "TABLET", nazwisko: values.nazwisko, email: values.email })
      setMessage({ ok: true, text: "Zaktualizowano." })
      setTimeout(onClose, 1200)
    } catch (err: unknown) {
      setMessage({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd zapisu." })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const onSubmitPass = async (values: PassFormValues) => {
    if (!point) return
    try {
      await updatePass({ id: point.id, firma: point.firma, password: values.password, passwordConfirm: values.passwordConfirm })
      setMessage({ ok: true, text: "Hasło zmienione." })
      setTimeout(onClose, 1200)
    } catch (err: unknown) {
      setMessage({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd zmiany hasła." })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-muted/60 rounded-lg p-1">
        {(["info", "password"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors",
              tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}>
            {t === "info" ? "Dane" : "Hasło"}
          </button>
        ))}
      </div>

      {message && (
        <div className={cn(
          "px-3 py-2.5 rounded-lg text-sm border",
          message.ok
            ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
            : "bg-destructive/8 border-destructive/20 text-destructive"
        )}>
          {message.text}
        </div>
      )}

      {tab === "info" && (
        <form onSubmit={handleInfo(onSubmitInfo)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nazwa</Label>
            <Input error={!!errInfo.nazwisko} {...regInfo("nazwisko", { required: "Wymagane" })} />
          </div>
          <div className="space-y-1.5">
            <Label>Login (email)</Label>
            <Input type="email" error={!!errInfo.email} {...regInfo("email", { required: "Wymagane" })} />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Anuluj</button>
            <button type="submit" disabled={isUpdating} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {isUpdating ? "Zapisywanie…" : "Zapisz"}
            </button>
          </div>
        </form>
      )}

      {tab === "password" && (
        <form onSubmit={handlePass(onSubmitPass)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nowe hasło</Label>
            <Input type="password" error={!!errPass.password}
              {...regPass("password", { required: "Wymagane", minLength: { value: 4, message: "Min 4 znaki" } })} />
            {errPass.password && <p className="text-xs text-destructive">{errPass.password.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Powtórz hasło</Label>
            <Input type="password" error={!!errPass.passwordConfirm}
              {...regPass("passwordConfirm", {
                required: "Wymagane",
                validate: (v) => v === watchPass("password") || "Hasła nie są zgodne"
              })} />
            {errPass.passwordConfirm && <p className="text-xs text-destructive">{errPass.passwordConfirm.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Anuluj</button>
            <button type="submit" disabled={isChangingPass} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {isChangingPass ? "Zmiana…" : "Zmień hasło"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Modal wrapper
// ---------------------------------------------------------------------------
export function PointModal({ editId, onClose }: { editId: number | null; onClose: () => void }) {
  const isEdit = !!editId

  const close = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [close])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              {isEdit ? "Edytuj punkt odbić" : "Nowy punkt odbić"}
            </h2>
          </div>
          <button onClick={close} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {isEdit ? <EditForm id={editId} onClose={close} /> : <CreateForm onClose={close} />}
        </div>
      </div>
    </div>
  )
}
