import type { ReactNode } from "react"

interface FieldProps {
  label: string
  error?: string
  icon?: ReactNode
  className?: string
  children: ReactNode
}

// Wspólny wrapper pola formularza - label + ikona + children + błąd
// Wydzielony żeby nie duplikować między NewModal i EditModal
export function Field({ label, error, icon, className, children }: FieldProps) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none [&>svg]:w-4 [&>svg]:h-4">
            {icon}
          </span>
        )}
        <div className={icon ? "[&>input]:pl-9 [&>select]:pl-9" : ""}>
          {children}
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface AlertProps {
  ok: boolean
  text: string
}

// Komunikat sukcesu/błędu w modalach
export function FormAlert({ ok, text }: AlertProps) {
  return (
    <div className={[
      "px-3 py-2.5 rounded-lg text-sm border",
      ok
        ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300"
        : "bg-destructive/8 border-destructive/20 text-destructive",
    ].join(" ")}>
      {text}
    </div>
  )
}
