import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface Props extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  tone?: "brand" | "warning" | "danger" | "neutral"
}

export const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Props>(
  ({ className, value, tone = "brand", ...props }, ref) => {
    const toneClass =
      tone === "brand"
        ? "bg-[var(--color-brand)]"
        : tone === "warning"
        ? "bg-[var(--color-warning)]"
        : tone === "danger"
        ? "bg-[var(--color-danger)]"
        : "bg-[var(--color-foreground)]"

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full w-full anim", toneClass)}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    )
  }
)
Progress.displayName = "Progress"
