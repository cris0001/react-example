"use client"

import { useEffect, useRef, useMemo, useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { AlarmClock, CalendarPlus, Activity } from "lucide-react"
import { cn } from "@/utils/helpers"
import { useDashboardActivity, type DashboardItem } from "../hooks/useDashboard"
import {
  parseDateToTs, fromNow, badgeLabel, badgeColor, iconColor,
} from "../utils/activity"

// Moduł-level cache — persystuje w session (tak jak w oryginale)
type CacheEntry = {
  list: DashboardItem[]
  seen: Set<string>
  lastPage: number
  ended: boolean
}
const FEED_CACHE: Record<string, CacheEntry> = {}

function BadgeIcon({ temat }: { temat: string }) {
  if (temat === "Spoznienie pracownika") return <AlarmClock className="w-3.5 h-3.5" />
  if (temat === "Wyjscie pracownika") return <CalendarPlus className="w-3.5 h-3.5" />
  return null
}

export function ActivityFeed() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  // useMemo - nie parsuj searchParams przy każdym renderze
  const page = useMemo(() => {
    const p = Number(sp.get("page"))
    return Number.isFinite(p) && p > 0 ? p : 1
  }, [sp])

  const { data, isLoading } = useDashboardActivity(page, 10)

  if (!FEED_CACHE[pathname]) {
    FEED_CACHE[pathname] = { list: [], seen: new Set(), lastPage: 0, ended: false }
  }
  const cache = FEED_CACHE[pathname]

  const [feed, setFeed] = useState<DashboardItem[]>(cache.list)
  const [ended, setEnded] = useState(cache.ended)

  // Reset przy powrocie do page=1
  useEffect(() => {
    if (page <= 1) {
      cache.list = []; cache.seen = new Set()
      cache.lastPage = 0; cache.ended = false
      setFeed([]); setEnded(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Doklejanie nowych stron do cache
  useEffect(() => {
    if (!data?.content?.length || cache.lastPage >= page) {
      if (data?.last) { cache.ended = true; setEnded(true) }
      return
    }
    for (const it of data.content) {
      const key = `${it.id}-${it.dataWpisu}`
      if (!cache.seen.has(key)) { cache.seen.add(key); cache.list.push(it) }
    }
    cache.lastPage = page
    cache.ended = data.last || cache.ended
    setFeed([...cache.list])
    setEnded(cache.ended)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page])

  // useMemo - sortowanie tylko gdy feed się zmieni
  const activity = useMemo(
    () =>
      feed
        .map((it) => ({ ...it, at: parseDateToTs(it.dataWpisu) }))
        .filter((it) => it.at > 0)
        .sort((a, b) => b.at - a.at),
    [feed]
  )

  // Infinite scroll - nasłuchuje scroll na liście, nie IntersectionObserver
  // IO powodował nieskończone odpalanie bo sentinel był zawsze widoczny w viewport
  const listRef = useRef<HTMLUListElement>(null)
  const loadingRef = useRef(false) // ref zamiast state - nie powoduje rerendera

  useEffect(() => {
    const list = listRef.current
    if (!list || ended) return

    const onScroll = () => {
      if (loadingRef.current || ended) return
      const nearBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 60
      if (!nearBottom) return

      loadingRef.current = true
      const params = new URLSearchParams(sp)
      params.set("page", String(page + 1))
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    list.addEventListener("scroll", onScroll, { passive: true })
    return () => list.removeEventListener("scroll", onScroll)
  }, [page, ended, pathname, router, sp])

  // Odblokuj po załadowaniu nowej strony
  useEffect(() => {
    loadingRef.current = false
  }, [feed.length])

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Activity className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Ostatnia aktywność</span>
      </div>

      <ul
        ref={listRef}
        className="divide-y divide-border max-h-[420px] overflow-y-auto overscroll-contain"
      >
        {isLoading && feed.length === 0 && (
          <li className="flex items-center justify-center py-10">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </li>
        )}

        {!isLoading && activity.length === 0 && (
          <li className="text-center text-sm text-muted-foreground py-10">
            Brak aktywności.
          </li>
        )}

        {activity.map((a) => (
          <li
            key={`${a.id}-${a.at}`}
            className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
          >
            <div className={cn("shrink-0 mt-0.5 p-1.5 rounded-lg", iconColor(a.temat))}>
              <BadgeIcon temat={a.temat} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={cn(
                  "text-[11px] font-medium px-2 py-0.5 rounded-full",
                  badgeColor(a.temat)
                )}>
                  {badgeLabel(a.temat)}
                </span>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {fromNow(a.at)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 break-words">{a.tresc}</p>
            </div>
          </li>
        ))}


        {ended && activity.length > 0 && (
          <li className="text-center text-[11px] text-muted-foreground py-3">
            To już wszystko.
          </li>
        )}
      </ul>
    </div>
  )
}
