# React Hook Form + Zod — struktura i użycie

```
forms/
├── schemas/
│   └── registerSchema.ts     # Zod: walidacja + typ (z.infer)
├── components/
│   ├── RegisterForm.tsx      # useForm + zodResolver
│   ├── FormField.tsx         # reużywalny label + input + błąd
│   └── ControlledSelect.tsx  # <Controller> dla bibliotek bez ref
└── index.ts
```

## Podział ról

- **Zod** — schema walidacji + **źródło typu** (`z.infer`)
- **zodResolver** — most między Zod a RHF
- **React Hook Form** — stan formularza, błędy, submit

## Dlaczego RHF jest szybki — UNCONTROLLED

`register("name")` podpina **ref** do inputa. Wartość żyje w **DOM**, nie w state.
Efekt: **wpisywanie NIE powoduje re-renderów** (inaczej niż controlled input z useState,
gdzie każdy znak = re-render).

Re-render leci dopiero gdy trzeba (pojawi się błąd, zmieni się isValid).

## Kluczowe API

| | |
|---|---|
| `register("pole")` | podpina input (ref, onChange, onBlur, name) |
| `handleSubmit(fn)` | waliduje -> dopiero potem woła `fn` ze zwalidowanymi danymi |
| `formState.errors` | błędy per pole (`errors.email.message`) |
| `formState.isSubmitting` | trwa submit -> zablokuj przycisk |
| `formState.isValid` | czy formularz przechodzi walidację |
| `reset()` | czyści formularz |
| `<Controller>` | dla komponentów bez ref (react-select, MUI, DatePicker) |
| `mode` | kiedy walidować: `onSubmit` (domyślnie) / `onBlur` / `onChange` |

## Zod — najczęstsze

```ts
z.string().min(2, "za krótkie")
z.string().email("zły email")
z.coerce.number().min(18)          // coerce: input daje string -> number
z.boolean().refine(v => v === true, { message: "wymagane" })

// walidacja MIĘDZY polami (hasła):
.refine(d => d.password === d.confirmPassword, {
  message: "Hasła nie są takie same",
  path: ["confirmPassword"],        // do którego pola przypiąć błąd
})

// typ ze schemy — jedno źródło prawdy:
type FormValues = z.infer<typeof schema>
```

## Zasada

Schema **najpierw**, typ **z niej** (`z.infer`). Nigdy odwrotnie —
inaczej typ i walidacja rozjadą się po pierwszej zmianie.
