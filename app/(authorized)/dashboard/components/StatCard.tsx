"use client"

import { cn } from "@/utils/helpers"
import type { ElementType } from "react"

interface StatCardProps {
  label: string
  value: string
  icon: ElementType
  color: string
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
      <div className={cn("p-2.5 rounded-xl shrink-0", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  )
}
