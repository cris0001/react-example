"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useAuthStore } from "@/store/auth.store"
import { cn, getInitials } from "@/utils/helpers"
import { useEffect, useState } from "react"
import {
  LayoutDashboard, Users, CalendarDays, CheckSquare,
  UmbrellaOff, MapPin, QrCode, BadgeCheck,
  Settings, MessageSquare, LogOut,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard",    icon: LayoutDashboard },
  { href: "/employees",  label: "Pracownicy",   icon: Users },
  { href: "/scheduler",  label: "Grafik",       icon: CalendarDays },
  { href: "/tasks",      label: "Zadania",      icon: CheckSquare },
  { href: "/leaves",     label: "Urlopy",       icon: UmbrellaOff },
  { href: "/locations",  label: "Lokalizacje",  icon: MapPin },
  { href: "/points",     label: "Punkty odbić", icon: QrCode },
  { href: "/license",    label: "Licencja",     icon: BadgeCheck },
  { href: "/messages",   label: "Wiadomości",   icon: MessageSquare, adminOnly: true },
  { href: "/settings",   label: "Ustawienia",   icon: Settings },
] as const

// Poniżej tego breakpointu sidebar automatycznie się zwija
const COLLAPSE_BREAKPOINT = 768

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { user } = useAuthStore()

  // Automatyczne zwijanie bazujące na szerokości okna
  // useState z lazy initializer - sprawdza szerokość tylko raz przy mount
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth < COLLAPSE_BREAKPOINT
  })

  // ResizeObserver - reaguje na zmianę szerokości okna
  useEffect(() => {
    const handler = () => {
      setCollapsed(window.innerWidth < COLLAPSE_BREAKPOINT)
    }
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  const isAdmin = user?.authorities.some((a) => a.authority === "ROLE_ADMIN")

  const visibleItems = NAV_ITEMS.filter(
    (item) => !("adminOnly" in item && item.adminOnly && !isAdmin)
  )

  const fullName = [user?.imie, user?.nazwisko].filter(Boolean).join(" ") || user?.email || "—"

  return (
    <nav className={cn(
      "flex flex-col h-full bg-sidebar border-r border-sidebar-border",
      "transition-all duration-200 ease-in-out",
      collapsed ? "w-[60px]" : "w-[220px]"
    )}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[60px] border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shadow-sm shadow-primary/30 shrink-0">
          <span className="text-white font-bold text-sm">HR</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-sidebar-foreground text-sm tracking-tight truncate">
            TopHR
          </span>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium relative",
                "transition-colors duration-100 group",
                isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/15"
                  : "text-sidebar-foreground/70 hover:bg-muted hover:text-sidebar-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
              )}
              <Icon className={cn(
                "shrink-0 transition-colors duration-100",
                collapsed ? "w-5 h-5" : "w-4 h-4",
                isActive
                  ? "text-primary"
                  : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
              )} />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          )
        })}
      </div>

      {/* User + logout */}
      <div className="shrink-0 border-t border-sidebar-border p-2">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sidebar-foreground/80">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-semibold shrink-0">
            {getInitials(fullName)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">{fullName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.firma}</p>
            </div>
          )}
          <button
            onClick={logout}
            title="Wyloguj"
            className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-100"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
