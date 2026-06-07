import { useQuery } from "@tanstack/react-query"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PageHeader } from "@/components/common/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/common/EmptyState"
import { UserAvatar } from "@/components/common/UserAvatar"
import { statsApi } from "@/api/resources"
import { fmtMoney, fmtNumber } from "@/lib/format"
import { BarChart3 } from "lucide-react"

export function Reports() {
  const byCategoryQ = useQuery({ queryKey: ["stats", "category"], queryFn: statsApi.byCategory })
  const byCityQ = useQuery({ queryKey: ["stats", "city"], queryFn: statsApi.byCity })
  const topSalesQ = useQuery({ queryKey: ["stats", "topsales"], queryFn: statsApi.topSales })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Hisobotlar"
        description="Sotuv tahlili kategoriya, hudud va sotuvchi bo'yicha"
      />

      <div className="grid lg:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Kategoriya bo'yicha sotuv</CardTitle>
            <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
              Eng ko'p sotilgan kategoriyalar
            </p>
          </CardHeader>
          <CardContent>
            {byCategoryQ.isLoading ? (
              <Skeleton className="h-[280px]" />
            ) : (byCategoryQ.data?.length ?? 0) === 0 ? (
              <EmptyState icon={BarChart3} title="Ma'lumot yo'q" />
            ) : (
              <div style={{ width: "100%", minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={280} minWidth={0}>
                  <BarChart data={byCategoryQ.data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} dy={6} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={48}
                      tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--color-surface)" }}
                      contentStyle={{
                        background: "white",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                        padding: "6px 10px",
                      }}
                      formatter={(v) => [fmtMoney(Number(v)), "Sotuv"]}
                    />
                    <Bar dataKey="revenue" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hudud bo'yicha</CardTitle>
            <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
              Sotuv miqdori bo'yicha shaharlar
            </p>
          </CardHeader>
          <CardContent>
            {byCityQ.isLoading ? (
              <Skeleton className="h-[280px]" />
            ) : (byCityQ.data?.length ?? 0) === 0 ? (
              <EmptyState icon={BarChart3} title="Ma'lumot yo'q" />
            ) : (
              <div style={{ width: "100%", minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={280} minWidth={0}>
                  <BarChart
                    data={byCityQ.data}
                    layout="vertical"
                    margin={{ top: 5, right: 20, bottom: 0, left: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                    />
                    <YAxis
                      type="category"
                      dataKey="city"
                      axisLine={false}
                      tickLine={false}
                      width={60}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--color-surface)" }}
                      contentStyle={{
                        background: "white",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                        padding: "6px 10px",
                      }}
                      formatter={(v) => [fmtMoney(Number(v)), "Sotuv"]}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                      {byCityQ.data?.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === 0 ? "var(--color-brand)" : "var(--color-brand-soft-2)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top sotuvchilar</CardTitle>
          <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
            Eng ko'p sotgan jamoa a'zolari
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {topSalesQ.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : (topSalesQ.data?.length ?? 0) === 0 ? (
            <EmptyState icon={BarChart3} title="Ma'lumot yo'q" />
          ) : (
            <ol className="divide-y divide-[var(--color-border)]">
              {topSalesQ.data!.map((s, i) => (
                <li
                  key={s.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="font-mono text-[14px] font-medium text-[var(--color-muted)] w-6">
                    {i + 1}
                  </span>
                  <UserAvatar name={s.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium">{s.name}</div>
                    <div className="text-[11px] text-[var(--color-muted)] font-mono">
                      {fmtNumber(s.orders)} buyurtma
                    </div>
                  </div>
                  <div className="font-mono text-[14px] font-medium">
                    {fmtMoney(s.revenue).replace(" so'm", "")}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
