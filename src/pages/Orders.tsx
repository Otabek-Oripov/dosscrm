import { useMemo, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  ChevronDown,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TableSkeleton } from "@/components/common/Loading"
import { EmptyState } from "@/components/common/EmptyState"
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/common/StatusBadge"
import { UserAvatar } from "@/components/common/UserAvatar"
import { ordersApi } from "@/api/resources"
import { fmtDate, fmtMoney, timeAgo } from "@/lib/format"
import type { Customer, Order, OrderStatus } from "@/types"
import { toast } from "@/components/ui/sonner"
import { apiErrorMessage } from "@/api/client"

const STATUSES: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "Hammasi" },
  { key: "new", label: "Yangi" },
  { key: "processing", label: "Tayyorlanmoqda" },
  { key: "shipped", label: "Yo'lda" },
  { key: "delivered", label: "Yetkazildi" },
  { key: "cancelled", label: "Bekor" },
]

export function Orders() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState<OrderStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Order | null>(null)

  const ordersQ = useQuery({
    queryKey: ["orders", { filter, search }],
    queryFn: () =>
      ordersApi.list({
        ...(filter !== "all" ? { status: filter } : {}),
        ...(search ? { search } : {}),
        limit: 100,
      }),
  })

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: ordersQ.data?.length ?? 0 }
    ordersQ.data?.forEach((o) => {
      c[o.status] = (c[o.status] ?? 0) + 1
    })
    return c
  }, [ordersQ.data])

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.setStatus(id, status),
    onSuccess: (updated) => {
      toast.success("Status yangilandi")
      qc.invalidateQueries({ queryKey: ["orders"] })
      qc.invalidateQueries({ queryKey: ["stats"] })
      setSelected(updated)
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Buyurtmalar"
        description={`${ordersQ.data?.length ?? 0} ta buyurtma topildi`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="size-3.5" /> Filter
            </Button>
            <Button variant="brand" size="sm">
              <Plus className="size-3.5" /> Yangi
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--color-muted)]" />
          <Input
            placeholder="Buyurtma raqami, mijoz nomi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1 overflow-x-auto -mx-1 px-1">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`anim text-[12px] px-2.5 h-7 rounded-[6px] inline-flex items-center gap-1.5 shrink-0 ${
                filter === s.key
                  ? "bg-[var(--color-foreground)] text-white"
                  : "hairline bg-white hover:bg-[var(--color-surface)]"
              }`}
            >
              {s.label}
              <span
                className={`font-mono text-[10px] ${
                  filter === s.key ? "text-white/70" : "text-[var(--color-muted)]"
                }`}
              >
                {counts[s.key] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {ordersQ.isLoading ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : (ordersQ.data?.length ?? 0) === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Buyurtma topilmadi"
            description="Filterlarni o'zgartirib ko'ring yoki yangi buyurtma yarating."
            action={
              <Button variant="brand" size="sm">
                <Plus className="size-3.5" /> Yangi buyurtma
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">№</TableHead>
                <TableHead>Mijoz</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Jami</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>To'lov</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersQ.data!.map((o) => {
                const customerName =
                  o.customerName ??
                  (typeof o.customer === "object" ? (o.customer as Customer).name : "—")
                return (
                  <TableRow
                    key={o._id}
                    className="cursor-pointer"
                    onClick={() => setSelected(o)}
                  >
                    <TableCell className="font-mono text-[12px] text-[var(--color-muted)]">
                      #{o.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={customerName} size="xs" />
                        <span className="truncate">{customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[12px] text-[var(--color-muted)] font-mono">
                      {timeAgo(o.createdAt)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-[12px]">
                      {o.items?.length ?? 0}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {fmtMoney(o.total).replace(" so'm", "")}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={o.status as OrderStatus} />
                    </TableCell>
                    <TableCell>
                      {o.paymentStatus && <PaymentStatusBadge status={o.paymentStatus} />}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <OrderDetailSheet
        order={selected}
        onClose={() => setSelected(null)}
        onChangeStatus={(status) =>
          selected && statusMutation.mutate({ id: selected._id, status })
        }
      />
    </div>
  )
}

function OrderDetailSheet({
  order,
  onClose,
  onChangeStatus,
}: {
  order: Order | null
  onClose: () => void
  onChangeStatus: (s: OrderStatus) => void
}) {
  const customerName =
    order?.customerName ??
    (typeof order?.customer === "object" ? (order.customer as Customer)?.name : "—")
  return (
    <Sheet open={!!order} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right">
        {order && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-2">
                <SheetTitle>Buyurtma #{order.orderNumber}</SheetTitle>
                <OrderStatusBadge status={order.status as OrderStatus} />
              </div>
              <SheetDescription>{fmtDate(order.createdAt, true)}</SheetDescription>
            </SheetHeader>
            <SheetBody className="space-y-6">
              <section>
                <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-medium mb-2">
                  Mijoz
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-[8px] hairline">
                  <UserAvatar name={customerName} size="md" />
                  <div>
                    <div className="text-[13px] font-medium">{customerName}</div>
                    {typeof order.customer === "object" && (
                      <div className="text-[11px] text-[var(--color-muted)]">
                        {(order.customer as Customer).phone ??
                          (order.customer as Customer).email ??
                          "—"}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section>
                <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-medium mb-2">
                  Mahsulotlar ({order.items?.length ?? 0})
                </div>
                <ul className="rounded-[8px] hairline divide-y divide-[var(--color-border)] overflow-hidden">
                  {(order.items ?? []).map((it, idx) => (
                    <li key={idx} className="px-3 py-2.5 flex items-center gap-3 text-[13px]">
                      <span className="flex-1 truncate">
                        {it.name ??
                          (typeof it.product === "object" ? it.product.name : "—")}
                      </span>
                      <span className="font-mono text-[12px] text-[var(--color-muted)] w-12 text-center">
                        × {it.quantity}
                      </span>
                      <span className="font-mono w-24 text-right">
                        {fmtMoney(it.price * it.quantity).replace(" so'm", "")}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="rounded-[8px] hairline px-3 py-3 flex items-center justify-between">
                  <span className="text-[12px] uppercase tracking-wider text-[var(--color-muted)] font-medium">
                    Jami
                  </span>
                  <span className="font-mono text-[18px] font-medium">{fmtMoney(order.total)}</span>
                </div>
              </section>

              {order.paymentStatus && (
                <section>
                  <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-medium mb-2">
                    To'lov
                  </div>
                  <div className="flex items-center gap-2">
                    <PaymentStatusBadge status={order.paymentStatus} />
                    {order.paymentMethod && (
                      <Badge variant="outline">{order.paymentMethod}</Badge>
                    )}
                  </div>
                </section>
              )}

              {order.notes && (
                <section>
                  <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-medium mb-2">
                    Izoh
                  </div>
                  <p className="text-[13px] text-[var(--color-foreground-muted)] p-3 rounded-[8px] bg-[var(--color-surface)]">
                    {order.notes}
                  </p>
                </section>
              )}
            </SheetBody>
            <SheetFooter>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Statusni o'zgartirish <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(["new", "processing", "shipped", "delivered", "cancelled"] as OrderStatus[]).map(
                    (s) => (
                      <DropdownMenuItem key={s} onClick={() => onChangeStatus(s)}>
                        <OrderStatusBadge status={s} dot />
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="brand">To'lovni belgilash</Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
