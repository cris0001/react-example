import { useAuthStore } from "@/store/auth.store"

interface DashboardGreeting {
  greeting: string
  fullDate: string
  userName: string
}

// Wydzielone z page.tsx - czysta logika powitania
export function useDashboardGreeting(): DashboardGreeting {
  const { user } = useAuthStore()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Dzień dobry" : hour < 18 ? "Witaj" : "Dobry wieczór"

  const fullDate = new Date().toLocaleDateString("pl-PL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  return { greeting, fullDate, userName: user?.imie ?? "" }
}
