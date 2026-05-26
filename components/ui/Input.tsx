"use client"

import { forwardRef } from "react"
import { cn } from "@/utils/helpers"
import type { ComponentProps } from "react"

interface InputProps extends ComponentProps<"input"> {
  error?: boolean
  icon?: React.ReactNode
}

// forwardRef - żeby react-hook-form mógł podpiąć ref bezpośrednio
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground [&>svg]:w-4 [&>svg]:h-4">
            {icon}
          </span>
          <input
            ref={ref}
            className={cn(
              "w-full h-10 pl-9 pr-3 rounded-lg border bg-input text-sm",
              "placeholder:text-muted-foreground/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-150",
              error
                ? "border-destructive focus:ring-destructive/30 focus:border-destructive"
                : "border-border",
              className
            )}
            {...props}
          />
        </div>
      )
    }

    return (
      <input
        ref={ref}
        className={cn(
          "w-full h-10 px-3 rounded-lg border bg-input text-sm",
          "placeholder:text-muted-foreground/50",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-colors duration-150",
          error
            ? "border-destructive focus:ring-destructive/30 focus:border-destructive"
            : "border-border",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"
export { Input }
