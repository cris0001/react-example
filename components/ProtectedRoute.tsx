"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  // Zustand z sessionStorage potrzebuje chwili na hydratację po F5.
  // Bez flagi "mounted" przez pierwszą klatkę isAuthenticated=false
  // co powoduje redirect na login (flash).
  // Czekamy na mount zanim cokolwiek renderujemy lub przekierowujemy.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const hasSessionCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("session="))

    const storeOk = isAuthenticated && !!user?.token

    if (!hasSessionCookie || !storeOk) {
      router.replace("/login?reason=unauthorized")
    }
  }, [mounted, isAuthenticated, user, router])

  // Przed hydratacją - nie renderuj nic (ani dzieci, ani redirecta)
  if (!mounted) return null

  // Po hydratacji - jeśli brak sesji, null (redirect w useEffect powyżej)
  if (!isAuthenticated || !user?.token) return null

  return <>{children}</>
}
