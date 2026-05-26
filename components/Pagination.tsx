"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback } from "react"
import { cn } from "@/utils/helpers"

interface PaginationProps {
  last: boolean
  defaultSize?: number
}

// useCallback - funkcja nawigacji jest stabilna, nie tworzy się przy każdym renderze
export function Pagination({ last, defaultSize = 20 }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get("page") ?? 1)

  // useCallback - stabilna referencja, nie powoduje rerenderów dzieci
  const goTo = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(page))
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const isFirst = currentPage <= 1
  const isLast = last

  if (isFirst && isLast) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={isFirst}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm",
          "transition-colors duration-100",
          isFirst
            ? "opacity-40 cursor-not-allowed border-border text-muted-foreground"
            : "border-border text-foreground hover:bg-muted"
        )}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        Poprzednia
      </button>

      <span className="text-sm text-muted-foreground px-2">
        Strona {currentPage}
      </span>

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={isLast}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm",
          "transition-colors duration-100",
          isLast
            ? "opacity-40 cursor-not-allowed border-border text-muted-foreground"
            : "border-border text-foreground hover:bg-muted"
        )}
      >
        Następna
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
