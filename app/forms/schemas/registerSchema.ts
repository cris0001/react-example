import { z } from "zod"

// SCHEMA = JEDNO źródło prawdy: walidacja + typ TS.
// Nie piszesz typu ręcznie — wywodzisz go ze schemy (z.infer).

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Imię musi mieć min. 2 znaki")
      .max(50, "Imię jest za długie"),

    email: z.string().email("Nieprawidłowy email"),

    age: z.coerce            // coerce: input zwraca STRING -> zamień na number
      .number()
      .int("Wiek musi być liczbą całkowitą")
      .min(18, "Musisz mieć min. 18 lat"),

    password: z
      .string()
      .min(8, "Hasło musi mieć min. 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać wielką literę")
      .regex(/[0-9]/, "Hasło musi zawierać cyfrę"),

    confirmPassword: z.string(),

    terms: z.boolean().refine((val) => val === true, {
      message: "Musisz zaakceptować regulamin",
    }),
  })
  // refine na CAŁYM obiekcie — walidacja między polami
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"], // do którego pola przypiąć błąd
  })

// TYP wywiedziony ze schemy — zmienisz schemę, typ zmieni się sam.
export type RegisterFormValues = z.infer<typeof registerSchema>
