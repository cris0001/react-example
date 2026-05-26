"use client"

import { forwardRef } from "react"
import { cn } from "@/utils/helpers"
import type { ComponentProps } from "react"

interface SelectProps extends ComponentProps<"select"> {
  error?: boolean
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full h-10 px-3 rounded-lg border bg-input text-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-colors duration-150",
        error
          ? "border-destructive focus:ring-destructive/30 focus:border-destructive"
          : "border-border",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
)

Select.displayName = "Select"
export { Select }
