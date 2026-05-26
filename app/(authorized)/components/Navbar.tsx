"use client"

import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useAuthStore } from "@/store/auth.store"
import { useAuth } from "@/hooks/useAuth"
import { Sun, Moon, Monitor, LogOut, Settings, User } from "lucide-react"
import { cn } from "@/utils/helpers"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// Mapowanie ścieżek na czytelne nazwy
const ROUTE_LABELS: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/employees":  "Pracownicy",
  "/scheduler":  "Grafik",
  "/tasks":      "Zadania",
  "/leaves":     "Urlopy",
  "/locations":  "Lokalizacje",
  "/points":     "Punkty odbić",
  "/license":    "Licencja",
  "/messages":   "Wiadomości",
  "/settings":   "Ustawienia",
}

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Aktualny tytuł strony - bierze pierwszy segment ścieżki
  const pageTitle = Object.entries(ROUTE_LABELS).find(
    ([path]) => pathname === path || pathname.startsWith(`${path}/`)
  )?.[1] ?? ""

  // Zamknij dropdown po kliknięciu poza nim
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const themes = [
    { value: "light",  icon: Sun,     label: "Jasny" },
    { value: "dark",   icon: Moon,    label: "Ciemny" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const

  return (
    <div className="h-[60px] px-5 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b border-border">

      {/* Tytuł strony */}
      <h1 className="text-sm font-semibold text-foreground tracking-tight">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-2">

        {/* Theme switcher */}
        <div className="flex items-center gap-0.5 bg-muted rounded-lg p-1">
          {themes.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              title={label}
              className={cn(
                "p-1.5 rounded-md transition-colors duration-100",
                theme === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
              "border border-border bg-background",
              "hover:bg-muted transition-colors duration-100",
              dropdownOpen && "bg-muted"
            )}
          >
            <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[10px] font-semibold">
              {user?.imie?.[0] ?? "?"}
            </div>
            <span className="text-xs font-medium text-foreground hidden sm:block max-w-[120px] truncate">
              {[user?.imie, user?.nazwisko].filter(Boolean).join(" ") || user?.email}
            </span>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className={cn(
              "absolute right-0 top-full mt-1.5 w-48",
              "bg-popover border border-border rounded-xl shadow-lg shadow-black/5",
              "py-1 z-50"
            )}>
              {/* User info */}
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {[user?.imie, user?.nazwisko].filter(Boolean).join(" ")}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
              </div>

              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-100"
              >
                <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                Ustawienia
              </Link>

              <button
                onClick={() => { logout(); setDropdownOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/8 transition-colors duration-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                Wyloguj się
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
