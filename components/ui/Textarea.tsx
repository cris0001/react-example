"use client"

import { forwardRef } from "react"
import { cn } from "@/utils/helpers"
import type { ComponentProps } from "react"

interface TextareaProps extends ComponentProps<"textarea"> {
  error?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={3}
      className={cn(
        "w-full px-3 py-2 rounded-lg border bg-input text-sm",
        "placeholder:text-muted-foreground/50",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "resize-none transition-colors duration-150",
        error
          ? "border-destructive focus:ring-destructive/30 focus:border-destructive"
          : "border-border",
        className
      )}
      {...props}
    />
  )
)

Textarea.displayName = "Textarea"
export { Textarea }
