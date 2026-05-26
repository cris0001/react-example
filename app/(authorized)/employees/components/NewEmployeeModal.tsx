"use client"

import { useEffect, useState, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { X, User, Mail, Phone, IdCard, Info } from "lucide-react"
import { useCreateEmployee, useJobPositions, useRoles } from "../hooks/useEmployees"
import { FormAlert } from "./FormComponents"
import { Field } from "./FormComponents"
import { Input, Select } from "@/components/ui"
import { validationRules } from "../utils/form"
import type { CreateEmployeePayload, JobPosition, Role } from "../types"

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  ssn: string
  positionId: number
  roles: string[]
  start: string
  days: number
  overdue: number
}

export function NewEmployeeModal() {
  const router = useRouter()
  const { data: roles = [] } = useRoles()
  const { data: jobPositions = [] } = useJobPositions()
  const { mutateAsync: createEmployee, isPending } = useCreateEmployee()
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: "", lastName: "", email: "",
      phone: "", ssn: "", positionId: 0,
      roles: [], start: "", days: 0, overdue: 0,
    },
  })

  const onClose = useCallback(() => router.back(), [router])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const onSubmit = async (values: FormValues) => {
    const payload: CreateEmployeePayload = {
      imie: values.firstName.trim(),
      nazwisko: values.lastName.trim(),
      email: values.email.trim(),
      telefon: values.phone.trim(),
      pesel: values.ssn.trim(),
      idStanow: Number(values.positionId),
      doKadr: true,
      czyTablet: false,
      roles: values.roles,
      wymiarUrlopu: {
        rokKal: new Date().getFullYear(),
        dataZat: values.start,
        dniZalegle: Number(values.overdue),
        wymiarUrl: Number(values.days),
      },
    }
    try {
      await createEmployee(payload)
      setMessage({ ok: true, text: "Pracownik został dodany." })
      reset()
      setTimeout(onClose, 1500)
    } catch (err: unknown) {
      const text = (err as any)?.response?.data?.message ?? "Nie udało się dodać pracownika."
      setMessage({ ok: false, text })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Dodaj pracownika</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {message && <FormAlert ok={message.ok} text={message.text} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Imię" error={errors.firstName?.message}>
              <Input
                icon={<User />}
                error={!!errors.firstName}
                autoComplete="given-name"
                {...register("firstName", validationRules.required("Imię"))}
              />
            </Field>

            <Field label="Nazwisko" error={errors.lastName?.message}>
              <Input
                icon={<User />}
                error={!!errors.lastName}
                autoComplete="family-name"
                {...register("lastName", validationRules.required("Nazwisko"))}
              />
            </Field>

            <Field label="E-mail" error={errors.email?.message}>
              <Input
                type="email"
                icon={<Mail />}
                error={!!errors.email}
                {...register("email", validationRules.email)}
              />
            </Field>

            <Field label="PESEL" error={errors.ssn?.message}>
              <Input
                icon={<IdCard />}
                error={!!errors.ssn}
                maxLength={11}
                {...register("ssn", validationRules.pesel)}
              />
            </Field>

            <Field label="Telefon" error={errors.phone?.message}>
              <Input
                type="tel"
                icon={<Phone />}
                error={!!errors.phone}
                {...register("phone", validationRules.required("Telefon"))}
              />
            </Field>

            <Field label="Stanowisko" error={errors.positionId?.message}>
              <Controller
                name="positionId"
                control={control}
                rules={{ validate: (v) => Number(v) > 0 || "Wybierz stanowisko" }}
                render={({ field }) => (
                  <Select
                    error={!!errors.positionId}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <option value={0}>Wybierz stanowisko</option>
                    {jobPositions.map((jp: JobPosition) => (
                      <option key={jp.id} value={jp.id}>{jp.nazwa}</option>
                    ))}
                  </Select>
                )}
              />
            </Field>

            {/* Role */}
            <div className="col-span-full space-y-2">
              <label className="text-sm font-medium text-foreground">Role</label>
              {roles.length === 0 && <p className="text-xs text-muted-foreground">Ładowanie ról…</p>}
              <div className="flex flex-wrap gap-3">
                {roles.map((r: Role) => (
                  <Controller
                    key={r.rola}
                    name="roles"
                    control={control}
                    rules={{ validate: (v) => v.length > 0 || "Wybierz co najmniej jedną rolę" }}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded accent-primary"
                          checked={field.value.includes(r.rola)}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...field.value, r.rola]
                              : field.value.filter((x) => x !== r.rola)
                            field.onChange(next)
                          }}
                        />
                        <span>{r.rolaNazwa}</span>
                      </label>
                    )}
                  />
                ))}
              </div>
              {errors.roles && <p className="text-xs text-destructive">{errors.roles.message}</p>}
            </div>

            <div className="col-span-full border-t border-border" />

            <Field label="Data zatrudnienia" error={errors.start?.message} className="col-span-full">
              <Input
                type="date"
                error={!!errors.start}
                {...register("start", validationRules.required("Data zatrudnienia"))}
              />
            </Field>

            <Field label="Wymiar urlopu (dni)" error={errors.days?.message}>
              <Input type="number" min={0} {...register("days")} />
            </Field>

            <Field label="Dni zaległe" error={errors.overdue?.message}>
              <Input type="number" min={0} {...register("overdue")} />
            </Field>

            <div className="col-span-full flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
              <Info className="w-3.5 h-3.5 shrink-0" />
              Wymiar urlopu można zmienić w panelu pracownika
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
              Anuluj
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {isPending ? "Zapisywanie…" : "Zapisz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
