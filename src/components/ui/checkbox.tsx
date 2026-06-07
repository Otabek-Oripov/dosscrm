import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "anim peer size-[16px] shrink-0 rounded-[4px] hairline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-ring)] disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[var(--color-brand)] data-[state=checked]:text-white data-[state=checked]:border-[var(--color-brand)]",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="size-3" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = "Checkbox"
