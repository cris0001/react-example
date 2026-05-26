"use client"

import { useEffect, useState, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { X, User, Mail, Phone, IdCard, Loader2 } from "lucide-react"
import { useEmployee, useUpdateEmployee, useJobPositions, useRoles } from "../hooks/useEmployees"
import { Field, FormAlert } from "./FormComponents"
import { Input, Select } from "@/components/ui"
import { resolveUpdateType, arraysEqualUnordered, validationRules } from "../utils/form"
import type { UpdateEmployeePayload, JobPosition, Role } from "../types"

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  ssn: string
  positionId: number
  roles: string[]
  blocked: boolean
  active: boolean
}

export function EditEmployeeModal({ id }: { id: number }) {
  const router = useRouter()
  const { data: employee, isLoading } = useEmployee(id)
  const { data: roles = [] } = useRoles()
  const { data: jobPositions = [] } = useJobPositions()
  const { mutateAsync: updateEmployee, isPending } = useUpdateEmployee()
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>()

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.uzytkownik.imie,
        lastName: employee.uzytkownik.nazwisko,
        email: employee.uzytkownik.email,
        phone: employee.uzytkownik.telefon,
        ssn: employee.uzytkownik.pesel,
        positionId: employee.uzytkownik.idStanow ?? 0,
        roles: employee.role,
        blocked: employee.uzytkownik.zablokowany,
        active: employee.uzytkownik.aktywny,
      })
    }
  }, [employee, reset])

  const onClose = useCallback(() => router.back(), [router])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const onSubmit = async (values: FormValues) => {
    if (!employee) return
    const u = employee.uzytkownik
    const infoChanged =
      values.firstName !== u.imie || values.lastName !== u.nazwisko ||
      values.email !== u.email || values.phone !== u.telefon ||
      values.ssn !== u.pesel || Number(values.positionId) !== u.idStanow

    const payload: UpdateEmployeePayload = {
      updateType: resolveUpdateType(infoChanged, !arraysEqualUnordered(values.roles, employee.role)),
      uzytkownik: {
        id: u.id, firma: u.firma, login: u.login,
        nazwisko: values.lastName.trim(), imie: values.firstName.trim(),
        email: values.email.trim(), pesel: values.ssn.trim(), telefon: values.phone.trim(),
        aktywny: values.active, zablokowany: values.blocked,
        dataWpisu: u.dataWpisu, dataZmiany: u.dataZmiany,
        wpisal: u.wpisal, zmienil: u.zmienil,
        idStanow: Number(values.positionId),
      },
      role: values.roles,
    }

    try {
      await updateEmployee({ id, payload })
      setMessage({ ok: true, text: "Pracownik zaktualizowany." })
      setTimeout(onClose, 1200)
    } catch (err: unknown) {
      const text = (err as any)?.response?.data?.message ?? "Nie udało się zaktualizować pracownika."
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
          <h2 className="text-sm font-semibold text-foreground">Edytuj pracownika</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && employee && (
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

            {message && <FormAlert ok={message.ok} text={message.text} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Field label="Imię" error={errors.firstName?.message}>
                <Input icon={<User />} error={!!errors.firstName}
                  {...register("firstName", validationRules.required("Imię"))} />
              </Field>

              <Field label="Nazwisko" error={errors.lastName?.message}>
                <Input icon={<User />} error={!!errors.lastName}
                  {...register("lastName", validationRules.required("Nazwisko"))} />
              </Field>

              <Field label="E-mail" error={errors.email?.message}>
                <Input type="email" icon={<Mail />} error={!!errors.email}
                  {...register("email", validationRules.email)} />
              </Field>

              <Field label="PESEL" error={errors.ssn?.message}>
                <Input icon={<IdCard />} error={!!errors.ssn} maxLength={11}
                  {...register("ssn")} />
              </Field>

              <Field label="Telefon" error={errors.phone?.message}>
                <Input type="tel" icon={<Phone />} error={!!errors.phone}
                  {...register("phone")} />
              </Field>

              <Field label="Stanowisko" error={errors.positionId?.message}>
                <Controller
                  name="positionId"
                  control={control}
                  render={({ field }) => (
                    <Select error={!!errors.positionId} {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}>
                      <option value={0}>Wybierz stanowisko</option>
                      {jobPositions.map((jp: JobPosition) => (
                        <option key={jp.id} value={jp.id}>{jp.nazwa}</option>
                      ))}
                    </Select>
                  )}
                />
              </Field>

              <div className="col-span-full">
                <Controller
                  name="blocked"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input type="checkbox" className="w-4 h-4 rounded accent-primary"
                        checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                      Konto zablokowane
                    </label>
                  )}
                />
              </div>

              <div className="col-span-full space-y-2">
                <label className="text-sm font-medium text-foreground">Role</label>
                {roles.length === 0 && <p className="text-xs text-muted-foreground">Ładowanie ról…</p>}
                <div className="flex flex-wrap gap-3">
                  {roles.map((r: Role) => (
                    <Controller
                      key={r.rola}
                      name="roles"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded accent-primary"
                            checked={(field.value ?? []).includes(r.rola)}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...(field.value ?? []), r.rola]
                                : (field.value ?? []).filter((x) => x !== r.rola)
                              field.onChange(next)
                            }}
                          />
                          <span>{r.rolaNazwa}</span>
                        </label>
                      )}
                    />
                  ))}
                </div>
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
        )}
      </div>
    </div>
  )
}
