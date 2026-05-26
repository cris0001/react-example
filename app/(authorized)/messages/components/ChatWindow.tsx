"use client"

import { useCallback, useRef, useEffect, useState } from "react"
import { Send, Loader2, ChevronLeft } from "lucide-react"
import { useMessagesInfinite, useSendMessage } from "../hooks/useMessages"
import { cn } from "@/utils/helpers"
import type { EmployeesData } from "@/app/(authorized)/employees/types"

const dtf = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit", month: "2-digit", year: "numeric",
  hour: "2-digit", minute: "2-digit",
})

const STATUS_LABELS = { 0: "Wysłana", 1: "Dostarczona", 2: "Odczytana" } as const

interface ChatWindowProps {
  employee: EmployeesData
  onBack: () => void
}

export function ChatWindow({ employee, onBack }: ChatWindowProps) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useMessagesInfinite(employee.id)

  const { mutateAsync: send, isPending: isSending } = useSendMessage()

  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [sendResult, setSendResult] = useState<{ ok: boolean; text: string } | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)

  const fullName = `${employee.imie} ${employee.nazwisko}`
  const initials = `${employee.imie?.[0] ?? ""}${employee.nazwisko?.[0] ?? ""}`.toUpperCase()

  // Flatten wszystkich stron w jedną posortowaną listę
  const messages = data?.pages.flatMap((p) => p.content) ?? []

  // Scroll do dołu po załadowaniu pierwszej strony lub nowej wiadomości
  useEffect(() => {
    if (!isLoading && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [isLoading, data?.pages.length])

  // Infinite scroll - ładuj starsze wiadomości przy scrollowaniu do góry
  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || loadingRef.current || !hasNextPage) return
    if (el.scrollTop < 80) {
      loadingRef.current = true
      const prevHeight = el.scrollHeight
      fetchNextPage().then(() => {
        // Zachowaj pozycję scrollu po załadowaniu
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight - prevHeight
          loadingRef.current = false
        })
      })
    }
  }, [hasNextPage, fetchNextPage])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [onScroll])

  const handleSend = useCallback(async () => {
    if (!title.trim() || !message.trim() || !employee.fcmToken) return

    try {
      await send({
        title: title.trim(),
        message: message.trim(),
        recivers: [{ userId: employee.id, fcmToken: employee.fcmToken }],
      })
      setTitle("")
      setMessage("")
      setSendResult({ ok: true, text: "Wiadomość wysłana." })
      refetch()
      setTimeout(() => setSendResult(null), 3000)
    } catch (err: unknown) {
      setSendResult({ ok: false, text: (err as any)?.response?.data?.message ?? "Błąd wysyłania." })
      setTimeout(() => setSendResult(null), 5000)
    }
  }, [title, message, employee, send, refetch])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <button
          onClick={onBack}
          className="sm:hidden p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{fullName}</p>
          {!employee.fcmToken && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400">Brak tokenu FCM</p>
          )}
        </div>
      </div>

      {/* Lista wiadomości - scrollowalny kontener */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain"
      >
        {/* Loader starszych wiadomości (góra) */}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
          </div>
        )}

        {hasNextPage && !isFetchingNextPage && (
          <p className="text-center text-[11px] text-muted-foreground py-1">
            Przewiń w górę aby załadować starsze
          </p>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Brak wiadomości z tym pracownikiem.
          </p>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="bg-muted/40 rounded-xl p-3 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground truncate">{msg.title}</p>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-muted-foreground">
                  {STATUS_LABELS[msg.status]}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {dtf.format(new Date(msg.creationData))}
                </span>
              </div>
            </div>
            <p className="text-xs text-foreground leading-relaxed">{msg.message}</p>
            <p className="text-[10px] text-muted-foreground">od: {msg.fromName}</p>
          </div>
        ))}
      </div>

      {/* Formularz wysyłania */}
      <div className="p-4 border-t border-border shrink-0 space-y-2">
        {sendResult && (
          <p className={cn(
            "text-xs",
            sendResult.ok ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
          )}>
            {sendResult.text}
          </p>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tytuł wiadomości"
          disabled={!employee.fcmToken}
          className="w-full h-9 px-3 text-sm rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
        />

        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Treść… (Enter = wyślij, Shift+Enter = nowa linia)"
            rows={2}
            disabled={!employee.fcmToken}
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none disabled:opacity-50 placeholder:text-muted-foreground/50"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !title.trim() || !message.trim() || !employee.fcmToken}
            className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors self-end"
          >
            {isSending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />
            }
          </button>
        </div>
      </div>
    </div>
  )
}
