import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { PageHeader } from "@/components/common/PageHeader"
import { StatCard } from "@/components/common/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/common/EmptyState"
import { OrderStatusBadge } from "@/components/common/StatusBadge"
import { ordersApi, statsApi } from "@/api/resources"
import { useAuth } from "@/context/AuthContext"
import { fmtMoney, fmtNumber, timeAgo } from "@/lib/format"
import { UserAvatar } from "@/components/common/UserAvatar"
import {
  ArrowRight,
  BarChart3,
  ShoppingBag,
  TrendingUp,
  Users as UsersIcon,
} from "lucide-react"
import type { Customer, OrderStatus } from "@/types"

export function Dashboard() {
  const { user } = useAuth()

  const overview = useQuery({
    queryKey: ["stats", "overview"],
    queryFn: statsApi.overview,
  })
  const monthly = useQuery({ queryKey: ["stats", "monthly"], queryFn: statsApi.monthly })
  const topProducts = useQuery({
    queryKey: ["stats", "top-products"],
    queryFn: () => statsApi.topProducts(5),
  })
  const recentOrders = useQuery({
    queryKey: ["orders", "recent"],
    queryFn: () => ordersApi.list({ limit: 6, sort: "-createdAt" }),
  })

  const data = overview.data
  const sparkRevenue = monthly.data?.slice(-8).map((m) => m.revenue) ?? []
  const sparkOrders = monthly.data?.slice(-8).map((m) => m.orders) ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Salom, ${user?.name?.split(" ")[0] ?? ""}`}
        description="Bugungi biznesingiz qisqacha ko'rinishi."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {overview.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          <>
            <StatCard
              label="Buyurtmalar"
              value={fmtNumber(data?.orderCount)}
              icon={ShoppingBag}
              spark={sparkOrders}
            />
            <StatCard
              label="Sotuv"
              value={fmtMoney(data?.revenue).replace(" so'm", "")}
              icon={TrendingUp}
              spark={sparkRevenue}
            />
            <StatCard
              label="Mijozlar"
              value={fmtNumber(data?.customerCount)}
              icon={UsersIcon}
            />
            <StatCard
              label="Kam stok"
              value={fmtNumber(data?.lowStock)}
              icon={BarChart3}
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-3">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sotuv tendensiyasi</CardTitle>
              <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
                So'nggi {monthly.data?.length ?? 0} oy
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {monthly.isLoading ? (
              <Skeleton className="h-[260px] mx-5 mb-5" />
            ) : (monthly.data?.length ?? 0) === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="Ma'lumot yetarli emas"
                description="Bir necha oy sotuv qilingandan keyin grafik shu yerda paydo bo'ladi."
              />
            ) : (
              <div style={{ width: "100%", minWidth: 0 }} className="px-2 pb-3">
                <ResponsiveContainer width="100%" height={260} minWidth={0}>
                  <AreaChart data={monthly.data} margin={{ top: 20, right: 16, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      dy={6}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={48}
                      tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                    />
                    <Tooltip
                      cursor={{ stroke: "var(--color-border-strong)" }}
                      contentStyle={{
                        background: "white",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        fontSize: 12,
                        padding: "6px 10px",
                      }}
                      formatter={(v) => [fmtMoney(Number(v)), "Sotuv"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-brand)"
                      strokeWidth={1.75}
                      fill="url(#rev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top mahsulot</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/products">
                Hammasi <ArrowRight className="size-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {topProducts.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-7" />
                ))}
              </div>
            ) : (topProducts.data?.length ?? 0) === 0 ? (
              <p className="text-[12px] text-[var(--color-muted)] py-6 text-center">
                Hozircha mahsulot sotilmagan
              </p>
            ) : (
              <ol className="space-y-2.5">
                {topProducts.data!.map((p, i) => (
                  <li key={p.productId} className="flex items-center gap-3 text-[13px]">
                    <span className="size-5 grid place-items-center rounded-[4px] font-mono text-[10px] font-medium text-[var(--color-muted)] hairline">
                      {i + 1}
                    </span>
                    <span className="flex-1 truncate">{p.name}</span>
                    <span className="font-mono text-[12px] text-[var(--color-foreground-muted)]">
                      {fmtMoney(p.total).replace(" so'm", "")}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>So'nggi buyurtmalar</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/orders">
              Hammasi <ArrowRight className="size-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.isLoading ? (
            <div className="px-5 pb-5 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-11" />
              ))}
            </div>
          ) : (recentOrders.data?.length ?? 0) === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Hozircha buyurtma yo'q"
              description="Birinchi buyurtmangiz shu yerda ko'rinadi."
            />
          ) : (
            <ul className="hairline-t">
              {recentOrders.data!.map((o) => {
                const customerName =
                  o.customerName ??
                  (typeof o.customer === "object" ? (o.customer as Customer).name : "—")
                return (
                  <li
                    key={o._id}
                    className="hairline-b last:hairline-b-0 px-5 py-3 flex items-center gap-3 hover:bg-[var(--color-surface)] anim"
                  >
                    <span className="font-mono text-[11px] text-[var(--color-muted)] w-12 shrink-0">
                      #{o.orderNumber}
                    </span>
                    <UserAvatar name={customerName} size="xs" />
                    <span className="flex-1 truncate text-[13px]">{customerName}</span>
                    <span className="hidden sm:block text-[11px] text-[var(--color-muted)] font-mono">
                      {timeAgo(o.createdAt)}
                    </span>
                    <span className="text-[13px] font-mono w-24 text-right">
                      {fmtMoney(o.total).replace(" so'm", "")}
                    </span>
                    <span className="w-28 shrink-0 hidden md:block">
                      <OrderStatusBadge status={o.status as OrderStatus} dot />
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
