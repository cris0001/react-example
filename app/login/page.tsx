"use client"

import { useForm } from "react-hook-form"
import { useAuth } from "@/hooks/useAuth"
import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { LoginCredentials } from "@/types"

export default function LoginPage() {
  const { login, isLoading, error } = useAuth()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>()

  // Jeśli już zalogowany - przekieruj
  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard")
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1>{process.env.NEXT_PUBLIC_API_URL}</h1>
        {/* Logo / nagłówek */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary mb-4 shadow-lg shadow-primary/25">
            <span className="text-white font-bold text-lg">HR</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Witaj z powrotem
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Zaloguj się do swojego konta
          </p>
        </div>

        {/* Karta formularza */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-5">

          {/* Błąd logowania */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-3 py-2.5">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(login)} className="space-y-4" noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="jan@firma.pl"
                className={`
                  w-full h-10 px-3 rounded-lg border bg-input text-sm
                  placeholder:text-muted-foreground/60
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-colors duration-150
                  ${errors.email ? "border-destructive focus:ring-destructive/30 focus:border-destructive" : "border-border"}
                `}
                {...register("email", {
                  required: "Email jest wymagany",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Podaj prawidłowy adres email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Hasło */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Hasło
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={`
                  w-full h-10 px-3 rounded-lg border bg-input text-sm
                  placeholder:text-muted-foreground/60
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                  transition-colors duration-150
                  ${errors.password ? "border-destructive focus:ring-destructive/30 focus:border-destructive" : "border-border"}
                `}
                {...register("password", {
                  required: "Hasło jest wymagane",
                  minLength: {
                    value: 3,
                    message: "Hasło musi mieć minimum 3 znaki",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full h-10 rounded-lg bg-primary text-white text-sm font-medium
                hover:bg-primary/90 active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-150 shadow-sm shadow-primary/20
                flex items-center justify-center gap-2
              "
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Logowanie...
                </>
              ) : (
                "Zaloguj się"
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          TopHR &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
