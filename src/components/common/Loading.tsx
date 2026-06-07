import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  )
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
    </div>
  )
}

export function CenterSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="size-4 animate-spin text-[var(--color-muted)]" />
    </div>
  )
}
