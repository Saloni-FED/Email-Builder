import type * as React from "react"
import { cn } from "@/lib/utils"

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Toolbar({ className, ...props }: ToolbarProps) {
  return (
    <div
      className={cn("flex items-center gap-1 rounded-lg border bg-white/50 backdrop-blur-sm p-1", className)}
      {...props}
    />
  )
}

export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function ToolbarButton({ className, active, ...props }: ToolbarButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md w-8 h-8 hover:bg-gray-100 transition-colors",
        active && "bg-gray-100",
        className,
      )}
      {...props}
    />
  )
}

