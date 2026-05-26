"use client"

import { useParams, useSearchParams } from "next/navigation"
import { isISODate, mondaySundayRange } from "@/app/(authorized)/employees/[id]/utils/date"

// Params dla raport page
export function useRaportParams() {
  const params = useParams()
  const sp = useSearchParams()
  const id = Number(params.id)

  const def = mondaySundayRange()
  const from = isISODate(sp.get("from")) ? sp.get("from")! : def.from
  const to = isISODate(sp.get("to")) ? sp.get("to")! : def.to

  return { id, from, to }
}

// Params dla leaves page
export function useLeavesParams() {
  const params = useParams()
  const sp = useSearchParams()
  const id = Number(params.id)
  const page = Number(sp.get("page") ?? 1)

  return { id, page }
}
