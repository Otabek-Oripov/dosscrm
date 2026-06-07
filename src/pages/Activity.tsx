import { useQuery } from "@tanstack/react-query"
import { Activity as ActivityIcon } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/common/EmptyState"
import { UserAvatar } from "@/components/common/UserAvatar"
import { activitiesApi } from "@/api/resources"
import { fmtTime, fmtDate } from "@/lib/format"
import type { Activity, User } from "@/types"
import { useMemo } from "react"

const TYPE_LABEL: Record<string, string> = {
  order_created: "Yangi buyurtma",
  order_status_changed: "Status o'zgardi",
  order_cancelled: "Buyurtma bekor qilindi",
  product_created: "Mahsulot qo'shildi",
  product_updated: "Mahsulot tahrirlandi",
  customer_created: "Mijoz qo'shildi",
  user_created: "Foydalanuvchi qo'shildi",
  user_login: "Tizimga kirdi",
  stock_adjusted: "Stok korrektsiya",
}

const TYPE_DOT: Record<string, string> = {
  order_created: "bg-[var(--color-success)]",
  order_status_changed: "bg-[var(--color-info)]",
  order_cancelled: "bg-[var(--color-danger)]",
  product_created: "bg-[var(--color-brand)]",
  product_updated: "bg-[var(--color-warning)]",
  customer_created: "bg-[var(--color-success)]",
  user_login: "bg-[var(--color-muted)]",
  stock_adjusted: "bg-[var(--color-warning)]",
}

export function ActivityPage() {
  const q = useQuery({
    queryKey: ["activities"],
    queryFn: () => activitiesApi.list({ limit: 100 }),
  })

  const groups = useMemo(() => {
    const map = new Map<string, Activity[]>()
    ;(q.data ?? []).forEach((a) => {
      const key = fmtDate(a.createdAt)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(a)
    })
    return Array.from(map.entries())
  }, [q.data])

  return (
    <div className="space-y-5">
      <PageHeader title="Faollik" description="Tizimdagi so'nggi o'zgarishlar" />

      <Card className="p-0 overflow-hidden">
        {q.isLoading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="Hozircha hech narsa yo'q"
            description="Tizimdagi harakatlar shu yerda log shaklida ko'rinadi."
          />
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {groups.map(([day, items]) => (
              <section key={day}>
                <div className="bg-[var(--color-surface)] px-5 py-2 text-[10px] uppercase tracking-wider font-medium text-[var(--color-muted)] font-mono sticky top-0">
                  {day}
                </div>
                <ul>
                  {items.map((a) => {
                    const userName =
                      typeof a.user === "object" ? (a.user as User).name : undefined
                    return (
                      <li
                        key={a._id}
                        className="flex items-start gap-3 px-5 py-3 hairline-b last:hairline-b-0 hover:bg-[var(--color-surface)] anim"
                      >
                        <span className="font-mono text-[11px] text-[var(--color-muted)] mt-0.5 w-16 shrink-0">
                          {fmtTime(a.createdAt)}
                        </span>
                        <span
                          className={`mt-1.5 size-1.5 rounded-full shrink-0 ${
                            TYPE_DOT[a.type] ?? "bg-[var(--color-muted)]"
                          }`}
                        />
                        {userName && <UserAvatar name={userName} size="xs" />}
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px]">{a.description}</div>
                          <div className="text-[11px] text-[var(--color-muted)] mt-0.5">
                            {TYPE_LABEL[a.type] ?? a.type}
                            {userName && (
                              <>
                                {" · "}
                                <span className="font-medium text-[var(--color-foreground-muted)]">
                                  {userName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
