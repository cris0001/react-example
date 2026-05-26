"use client"

import { useSearchParams } from "next/navigation"
import { formatYMD } from "@/app/(authorized)/employees/[id]/utils/date"

interface SchedulerParams {
  page: number
  day: string
  jt: number | null
}

// Wydzielone z page.tsx - parsowanie URL params grafiku
export function useSchedulerParams(): SchedulerParams {
  const sp = useSearchParams()

  const page = (() => {
    const p = Number(sp.get("page"))
    return Number.isFinite(p) && p > 0 ? p : 1
  })()

  const day = sp.get("day") ?? formatYMD(new Date())

  const jt = (() => {
    const j = sp.get("jt")
    return j ? Number(j) : null
  })()

  return { page, day, jt }
}
