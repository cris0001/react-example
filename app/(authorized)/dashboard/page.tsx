"use client"

import { CalendarPlus, Users, CalendarDays, CheckSquare } from "lucide-react"
import { StatCard } from "./components/StatCard"
import { ActivityFeed } from "./components/ActivityFeed"
import { useDashboardGreeting } from "./hooks/useDashboardGreeting"

export default function DashboardPage() {
  const { greeting, fullDate, userName } = useDashboardGreeting()

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">{greeting}, {userName}!</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{fullDate}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Pracownicy" value="—" icon={Users} color="bg-primary/10 text-primary" />
        <StatCard label="Grafik" value="—" icon={CalendarDays} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" />
        <StatCard label="Zadania" value="—" icon={CheckSquare} color="bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
        <StatCard label="Urlopy" value="—" icon={CalendarPlus} color="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" />
      </div>

      <ActivityFeed />
    </div>
  )
}
