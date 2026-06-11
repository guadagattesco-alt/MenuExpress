"use client"

import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean
}

export function Chip({ active, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "rounded-full border px-5 py-2 text-sm font-semibold transition-all active:scale-95",
        active
          ? "border-primary bg-primary text-white shadow-sm shadow-primary/20"
          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
