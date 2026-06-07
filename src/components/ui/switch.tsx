import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "anim peer inline-flex h-[20px] w-[34px] shrink-0 cursor-pointer items-center rounded-full p-[2px]",
      "bg-[var(--color-border-strong)] data-[state=checked]:bg-[var(--color-brand)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-ring)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "anim pointer-events-none block size-[16px] rounded-full bg-white shadow",
        "data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = "Switch"
