"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/utils/helpers"

export interface GlobalSingleSelectProps<T> {
  options: T[]
  value?: string | number | null
  onChange: (value: string | number | null, option?: T) => void
  getOptionValue: (opt: T) => string | number
  getOptionLabel: (opt: T) => string
  placeholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  clearable?: boolean
  error?: boolean
}

// Generyczny combobox z wyszukiwaniem - zastępuje GlobalSingleSelect z oryginału.
// Nie wymaga shadcn/ui Command - własna implementacja bez zewnętrznych zależności.
export function GlobalSingleSelect<T>({
  options,
  value = null,
  onChange,
  getOptionValue,
  getOptionLabel,
  placeholder = "Wybierz...",
  emptyText = "Brak wyników.",
  className,
  disabled,
  clearable = false,
  error,
}: GlobalSingleSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = useMemo(
    () => value != null ? options.find((o) => String(getOptionValue(o)) === String(value)) : undefined,
    [options, value, getOptionValue]
  )

  // Filtrowanie opcji po wyszukiwaniu
  const filtered = useMemo(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter((o) => getOptionLabel(o).toLowerCase().includes(q))
  }, [options, search, getOptionLabel])

  // Zamknij po kliknięciu poza komponentem
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Focus input po otwarciu
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const handleSelect = useCallback((opt: T) => {
    onChange(getOptionValue(opt), opt)
    setOpen(false)
    setSearch("")
  }, [onChange, getOptionValue])

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setSearch("")
  }, [onChange])

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          "w-full h-10 px-3 flex items-center justify-between gap-2",
          "rounded-lg border bg-input text-sm text-left",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors duration-150",
          error ? "border-destructive" : "border-border",
          open && "ring-2 ring-primary/30 border-primary"
        )}
      >
        <span className={cn("truncate flex-1", !selectedOption && "text-muted-foreground/60")}>
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {clearable && value != null && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground/60" />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className={cn(
          "absolute z-50 w-full mt-1",
          "bg-popover border border-border rounded-xl shadow-lg",
          "overflow-hidden"
        )}>
          {/* Wyszukiwarka */}
          <div className="p-2 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj..."
              className="w-full h-8 px-2.5 text-sm rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Lista opcji */}
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{emptyText}</p>
            ) : (
              filtered.map((opt, idx) => {
                const isSelected = value != null && String(getOptionValue(opt)) === String(value)
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left",
                      "hover:bg-muted transition-colors duration-75",
                      isSelected && "bg-primary/8 text-primary"
                    )}
                  >
                    <Check className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "opacity-100 text-primary" : "opacity-0")} />
                    <span className="truncate">{getOptionLabel(opt)}</span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
