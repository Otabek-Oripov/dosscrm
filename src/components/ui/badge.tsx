import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[2px] px-1.5 h-[20px] text-[11px] font-medium leading-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-surface-2)] text-[var(--color-foreground-muted)] hairline",
        brand: "bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]",
        success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
        warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
        danger: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
        info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
        accent: "bg-[var(--color-brand-soft)] text-[var(--color-brand)]",
        outline: "hairline text-[var(--color-foreground-muted)] bg-[var(--color-surface)]",
        solid: "bg-[var(--color-foreground)] text-[var(--color-accent-foreground)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
