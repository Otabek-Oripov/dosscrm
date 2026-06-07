import { cn } from "@/lib/utils"

interface Props {
  className?: string
  showText?: boolean
  size?: "sm" | "md"
}

export function Logo({ className, showText = true, size = "sm" }: Props) {
  const textSize = size === "sm" ? "text-[15px]" : "text-[18px]"
  const markSize = size === "sm" ? "size-5" : "size-6"
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          markSize,
          "grid place-items-center rounded-[3px] bg-[var(--color-brand)]"
        )}
      >
        <span className="text-[10px] font-bold text-[var(--color-brand-foreground)] tracking-tighter">
          D
        </span>
      </span>
      {showText && (
        <span
          className={cn(
            textSize,
            "font-semibold tracking-tight text-[var(--color-foreground)]"
          )}
        >
          DossCrm
        </span>
      )}
    </div>
  )
}
