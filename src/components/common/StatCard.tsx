import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Props {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  icon?: LucideIcon
  spark?: number[]
  className?: string
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length === 0) return null
  const w = 84
  const h = 28
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const step = w / Math.max(data.length - 1, 1)
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ")

  return (
    <svg width={w} height={h} className="block" viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StatCard({ label, value, delta, deltaLabel, icon: Icon, spark, className }: Props) {
  const positive = delta != null && delta >= 0
  return (
    <Card className={cn("px-5 py-5 flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)] font-medium">
          {label}
        </span>
        {Icon && <Icon className="size-3.5 text-[var(--color-muted)]" strokeWidth={1.75} />}
      </div>
      <div className="flex items-end justify-between gap-3">
        <div className="text-[28px] font-medium leading-none text-[var(--color-foreground)] tracking-tight">
          {value}
        </div>
        {spark && spark.length > 1 && <Sparkline data={spark} />}
      </div>
      {delta != null && (
        <div className="flex items-center gap-1.5 text-[12px]">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium",
              positive ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
            )}
          >
            {positive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          {deltaLabel && <span className="text-[var(--color-muted)]">{deltaLabel}</span>}
        </div>
      )}
    </Card>
  )
}
