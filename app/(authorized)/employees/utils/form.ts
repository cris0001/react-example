// Wspólne klasy inputów - żeby nie duplikować między NewModal i EditModal
export function inputCls(hasError: boolean): string {
  return [
    "w-full h-10 px-3 rounded-lg border bg-input text-sm",
    "placeholder:text-muted-foreground/50",
    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
    "transition-colors",
    hasError
      ? "border-destructive focus:ring-destructive/30"
      : "border-border",
  ].join(" ")
}

// Wyznacza typ aktualizacji na podstawie tego co się zmieniło
// Optymalizacja - backend robi mniej pracy gdy wiemy co się zmieniło
export function resolveUpdateType(
  infoChanged: boolean,
  rolesChanged: boolean
): "UPDATE_ALL" | "UPDATE_USER" | "UPDATE_ROLES" {
  if (infoChanged && rolesChanged) return "UPDATE_ALL"
  if (infoChanged) return "UPDATE_USER"
  if (rolesChanged) return "UPDATE_ROLES"
  return "UPDATE_ALL"
}

// Porównuje dwie tablice bez względu na kolejność
export function arraysEqualUnordered(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const setB = new Set(b)
  return a.every((x) => setB.has(x))
}

// Reguły walidacji dla React Hook Form - wspólne między modalami
export const validationRules = {
  required: (label: string) => ({ required: `${label} jest wymagane` }),
  email: {
    required: "Email jest wymagany",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Nieprawidłowy adres email",
    },
  },
  pesel: {
    required: "PESEL jest wymagany",
    minLength: { value: 11, message: "PESEL musi mieć 11 cyfr" },
    maxLength: { value: 11, message: "PESEL musi mieć 11 cyfr" },
    pattern: { value: /^\d{11}$/, message: "PESEL może zawierać tylko cyfry" },
  },
}
