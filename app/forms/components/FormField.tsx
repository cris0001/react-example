import { ReactNode } from "react"
import { FieldError } from "react-hook-form"

// Reużywalny wrapper: label + input + błąd.
// Trzyma spójny wygląd i a11y w jednym miejscu.

type FormFieldProps = {
  label: string
  error?: FieldError
  children: ReactNode
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div>
      <label>{label}</label>
      {children}
      {/* błąd renderujemy tylko gdy istnieje */}
      {error && <span role="alert">{error.message}</span>}
    </div>
  )
}
