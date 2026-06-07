import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Props {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumb?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, breadcrumb, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-1.5 pb-5", className)}>
      {breadcrumb && (
        <div className="text-[12px] text-[var(--color-muted)] flex items-center gap-1.5">
          {breadcrumb}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold tracking-tight leading-tight">{title}</h1>
          {description && (
            <p className="text-[13px] text-[var(--color-muted)] mt-1 text-pretty">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
