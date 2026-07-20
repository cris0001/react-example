import { Controller, Control } from "react-hook-form"
import type { RegisterFormValues } from "../schemas/registerSchema"

// Gdy komponent NIE przyjmuje ref (biblioteki: react-select, MUI, DatePicker)
// -> register() nie zadziała. Wtedy używasz <Controller>.
//
// Controller robi z niekontrolowanego pola pole kontrolowane przez RHF.

export function ControlledSelect({ control }: { control: Control<RegisterFormValues> }) {
  return (
    <Controller
      name="name"
      control={control}
      render={({ field, fieldState }) => (
        <div>
          {/* field = { value, onChange, onBlur, name, ref } */}
          <select {...field}>
            <option value="">Wybierz</option>
            <option value="Jan">Jan</option>
            <option value="Anna">Anna</option>
          </select>
          {fieldState.error && <span>{fieldState.error.message}</span>}
        </div>
      )}
    />
  )
}
