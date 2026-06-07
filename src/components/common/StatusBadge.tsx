import { Badge } from "@/components/ui/badge"
import type { OrderStatus, PaymentStatus, Role } from "@/types"
import { cn } from "@/lib/utils"

const ORDER_STATUS: Record<OrderStatus, { label: string; variant: "default" | "info" | "warning" | "success" | "danger" }> = {
  new: { label: "Yangi", variant: "info" },
  processing: { label: "Tayyorlanmoqda", variant: "warning" },
  shipped: { label: "Yo'lda", variant: "info" },
  delivered: { label: "Yetkazildi", variant: "success" },
  cancelled: { label: "Bekor qilindi", variant: "danger" },
}

const PAYMENT_STATUS: Record<PaymentStatus, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  unpaid: { label: "To'lanmagan", variant: "warning" },
  paid: { label: "To'langan", variant: "success" },
  refunded: { label: "Qaytarilgan", variant: "default" },
}

const ROLES: Record<Role, { label: string; variant: "brand" | "default" | "outline" }> = {
  admin: { label: "Admin", variant: "brand" },
  manager: { label: "Menejer", variant: "default" },
  sales: { label: "Sotuvchi", variant: "outline" },
}

const DOT: Record<OrderStatus, string> = {
  new: "bg-[var(--color-info)]",
  processing: "bg-[var(--color-warning)]",
  shipped: "bg-[var(--color-info)]",
  delivered: "bg-[var(--color-success)]",
  cancelled: "bg-[var(--color-danger)]",
}

export function OrderStatusBadge({ status, dot = false }: { status: OrderStatus | string; dot?: boolean }) {
  const cfg = ORDER_STATUS[status as OrderStatus] ?? { label: status ?? "—", variant: "default" as const }
  const dotClass = DOT[status as OrderStatus] ?? "bg-[var(--color-muted)]"
  if (dot) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px]">
        <span className={cn("size-1.5 rounded-full", dotClass)} />
        {cfg.label}
      </span>
    )
  }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus | string }) {
  const cfg = PAYMENT_STATUS[status as PaymentStatus] ?? { label: status ?? "—", variant: "default" as const }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

export function RoleBadge({ role }: { role: Role | string }) {
  const cfg = ROLES[role as Role] ?? { label: role ?? "—", variant: "default" as const }
  return <Badge variant={cfg.variant as "brand" | "default" | "outline"}>{cfg.label}</Badge>
}
