import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "anim inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] text-[13px] font-semibold select-none disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand-hover)]",
        brand:
          "bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand-hover)]",
        accent:
          "bg-[var(--color-foreground)] text-[var(--color-accent-foreground)] hover:bg-white",
        outline:
          "bg-transparent text-[var(--color-foreground)] hairline hover:bg-[var(--color-surface)] hover:border-[var(--color-brand)]",
        ghost:
          "bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-surface-2)]",
        soft:
          "bg-[var(--color-brand-soft)] text-[var(--color-brand)] hover:bg-[var(--color-brand-soft-2)]",
        destructive:
          "bg-[var(--color-danger)] text-white hover:bg-red-700",
        link: "text-[var(--color-foreground)] underline underline-offset-[3px] decoration-[var(--color-border-strong)] hover:decoration-[var(--color-brand)] px-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-[12px]",
        default: "h-9 px-4",
        lg: "h-11 px-6 text-[14px]",
        icon: "size-9 p-0",
        "icon-sm": "size-8 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { buttonVariants }
