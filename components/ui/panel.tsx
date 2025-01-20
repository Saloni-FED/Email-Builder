import type * as React from "react"
import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"

export interface PanelProps extends HTMLMotionProps<"div"> {}

export function Panel({ className, ...props }: PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-lg border bg-white shadow-sm", className)}
      {...props}
    />
  )
}

export interface PanelHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PanelHeader({ className, ...props }: PanelHeaderProps) {
  return <div className={cn("flex items-center justify-between p-4 border-b", className)} {...props} />
}

