import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface Props {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 grid size-10 place-items-center rounded-full bg-[var(--color-surface)] hairline">
          <Icon className="size-4 text-[var(--color-muted)]" />
        </div>
      )}
      <h3 className="text-[14px] font-semibold">{title}</h3>
      {description && (
        <p className="text-[12px] text-[var(--color-muted)] mt-1 max-w-sm text-pretty">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
