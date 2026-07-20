import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormValues } from "../schemas/registerSchema"
import { FormField } from "./FormField"

export function RegisterForm() {
  const {
    register,          // podpina input do formularza (uncontrolled -> ref!)
    handleSubmit,      // owija onSubmit: waliduje, dopiero potem woła Twoją funkcję
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),  // <- most: Zod waliduje, RHF pokazuje błędy
    mode: "onBlur",                          // kiedy walidować (onChange/onBlur/onSubmit)
    defaultValues: {
      name: "",
      email: "",
      age: 18,
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  // onSubmit dostaje JUŻ ZWALIDOWANE i otypowane dane
  const onSubmit = async (data: RegisterFormValues) => {
    await new Promise((r) => setTimeout(r, 1000)) // symulacja API
    console.log(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Imię" error={errors.name}>
        {/* spread {...register("name")} podpina: ref, onChange, onBlur, name */}
        <input {...register("name")} />
      </FormField>

      <FormField label="Email" error={errors.email}>
        <input type="email" {...register("email")} />
      </FormField>

      <FormField label="Wiek" error={errors.age}>
        <input type="number" {...register("age")} />
      </FormField>

      <FormField label="Hasło" error={errors.password}>
        <input type="password" {...register("password")} />
      </FormField>

      <FormField label="Powtórz hasło" error={errors.confirmPassword}>
        <input type="password" {...register("confirmPassword")} />
      </FormField>

      <FormField label="Akceptuję regulamin" error={errors.terms}>
        <input type="checkbox" {...register("terms")} />
      </FormField>

      <button type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? "Wysyłam..." : "Zarejestruj"}
      </button>
    </form>
  )
}
