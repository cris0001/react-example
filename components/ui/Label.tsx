"use client"

import { forwardRef } from "react"
import { cn } from "@/utils/helpers"
import type { ComponentProps } from "react"

const Label = forwardRef<HTMLLabelElement, ComponentProps<"label">>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-foreground leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
)

Label.displayName = "Label"
export { Label }
