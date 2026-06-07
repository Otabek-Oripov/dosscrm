import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "anim flex h-10 w-full rounded-[3px] bg-[var(--color-surface)] px-3 text-[13px] hairline",
          "placeholder:text-[var(--color-muted-foreground)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-ring)] focus:border-[var(--color-brand)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "anim flex min-h-[88px] w-full rounded-[3px] bg-[var(--color-surface)] px-3 py-2 text-[13px] hairline",
      "placeholder:text-[var(--color-muted-foreground)]",
      "focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-ring)] focus:border-[var(--color-brand)]",
      "disabled:opacity-50",
      className
    )}
    {...props}
  />
))
Textarea.displayName = "Textarea"
