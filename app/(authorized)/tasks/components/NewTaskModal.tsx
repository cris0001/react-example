"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import { Input, Select, Textarea, Label } from "@/components/ui"
import { useCreateTask } from "../hooks/useTasks"
import type { CreateTaskPayload, TaskPriority } from "../types"
import { PRIORITY_LABELS } from "../utils"

interface FormValues {
  temat: string
  tresc: string
  priorytet: TaskPriority
  dataRealizacji: string
}

interface NewTaskModalProps {
  onClose: () => void
}

export function NewTaskModal({ onClose }: NewTaskModalProps) {
  const { mutateAsync: createTask, isPending } = useCreateTask()
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: { temat: "", tresc: "", priorytet: "MEDIUM", dataRealizacji: "" }
  })

  const close = useCallback(() => onClose(), [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [close])

  const onSubmit = async (values: FormValues) => {
    const payload: CreateTaskPayload = {
      temat: values.temat.trim(),
      tresc: values.tresc.trim(),
      priorytet: values.priorytet,
      dataRealizacji: values.dataRealizacji || null,
      przypisanyDo: null,
    }

    try {
      await createTask(payload)
      setMessage({ ok: true, text: "Zadanie zostało utworzone." })
      setTimeout(close, 1200)
    } catch (err: unknown) {
      const text = (err as any)?.response?.data?.message ?? "Nie udało się utworzyć zadania."
      setMessage({ ok: false, text })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Nowe zadanie</h2>
          <button onClick={close} className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

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
            <Label>Temat</Label>
            <Input
              error={!!errors.temat}
              placeholder="Krótki opis zadania"
              {...register("temat", { required: "Temat jest wymagany" })}
            />
            {errors.temat && <p className="text-xs text-destructive">{errors.temat.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Opis</Label>
            <Textarea
              placeholder="Szczegółowy opis..."
              rows={4}
              {...register("tresc")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Priorytet</Label>
              <Select {...register("priorytet")}>
                {(Object.keys(PRIORITY_LABELS) as TaskPriority[]).map((p) => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Termin realizacji</Label>
              <Input type="date" {...register("dataRealizacji")} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button type="button" onClick={close} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
              Anuluj
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {isPending ? "Tworzenie…" : "Utwórz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
