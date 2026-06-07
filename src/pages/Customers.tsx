import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MoreHorizontal, Plus, Search, Trash2, Users } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { Input, Textarea } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { UserAvatar } from "@/components/common/UserAvatar"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { customersApi } from "@/api/resources"
import { fmtMoney, timeAgo } from "@/lib/format"
import { toast } from "@/components/ui/sonner"
import { apiErrorMessage } from "@/api/client"
import type { Customer } from "@/types"

type Segment = "all" | "vip" | "regular" | "new"

const SEGMENTS: { key: Segment; label: string }[] = [
  { key: "all", label: "Hammasi" },
  { key: "vip", label: "VIP" },
  { key: "regular", label: "Doimiy" },
  { key: "new", label: "Yangi" },
]

const SEGMENT_BADGE: Record<NonNullable<Customer["segment"]>, "brand" | "default" | "info"> = {
  vip: "brand",
  regular: "default",
  new: "info",
}

const SEGMENT_LABEL: Record<NonNullable<Customer["segment"]>, string> = {
  vip: "VIP",
  regular: "Doimiy",
  new: "Yangi",
}

export function Customers() {
  const qc = useQueryClient()
  const [segment, setSegment] = useState<Segment>("all")
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<Customer | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleting, setDeleting] = useState<Customer | null>(null)

  const listQ = useQuery({
    queryKey: ["customers", { search }],
    queryFn: () => customersApi.list({ search, limit: 200 }),
  })

  const filtered = useMemo(() => {
    const data = listQ.data ?? []
    if (segment === "all") return data
    return data.filter((c) => c.segment === segment)
  }, [listQ.data, segment])

  const counts = useMemo(() => {
    const c: Record<Segment, number> = { all: 0, vip: 0, regular: 0, new: 0 }
    listQ.data?.forEach((cu) => {
      c.all += 1
      if (cu.segment) c[cu.segment] += 1
    })
    return c
  }, [listQ.data])

  const delMut = useMutation({
    mutationFn: (id: string) => customersApi.remove(id),
    onSuccess: () => {
      toast.success("Mijoz o'chirildi")
      qc.invalidateQueries({ queryKey: ["customers"] })
      setDeleting(null)
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Mijozlar"
        description={`${listQ.data?.length ?? 0} ta mijoz`}
        actions={
          <Button variant="brand" size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="size-3.5" /> Yangi mijoz
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--color-muted)]" />
          <Input
            placeholder="Ism, telefon, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1">
          {SEGMENTS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSegment(s.key)}
              className={`anim text-[12px] px-2.5 h-7 rounded-[6px] inline-flex items-center gap-1.5 ${
                segment === s.key
                  ? "bg-[var(--color-foreground)] text-white"
                  : "hairline bg-white hover:bg-[var(--color-surface)]"
              }`}
            >
              {s.label}
              <span
                className={`font-mono text-[10px] ${
                  segment === s.key ? "text-white/70" : "text-[var(--color-muted)]"
                }`}
              >
                {counts[s.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {listQ.isLoading ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Mijoz topilmadi"
            description="Birinchi mijozingizni qo'shing."
            action={
              <Button variant="brand" size="sm" onClick={() => setShowCreate(true)}>
                <Plus className="size-3.5" /> Yangi mijoz
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Ism</TableHead>
                <TableHead>Aloqa</TableHead>
                <TableHead>Shahar</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead className="text-right">Buyurtmalar</TableHead>
                <TableHead className="text-right">Sotuv</TableHead>
                <TableHead>Qo'shildi</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserAvatar name={c.name} size="xs" />
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[12px] text-[var(--color-muted)]">
                    <div>{c.phone ?? "—"}</div>
                    <div className="text-[11px]">{c.email ?? ""}</div>
                  </TableCell>
                  <TableCell className="text-[12px]">{c.city ?? "—"}</TableCell>
                  <TableCell>
                    {c.segment ? (
                      <Badge variant={SEGMENT_BADGE[c.segment]}>{SEGMENT_LABEL[c.segment]}</Badge>
                    ) : (
                      <span className="text-[var(--color-muted)] text-[12px]">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono text-[12px]">
                    {c.ordersCount ?? 0}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {fmtMoney(c.totalSpent).replace(" so'm", "")}
                  </TableCell>
                  <TableCell className="text-[11px] text-[var(--color-muted)] font-mono">
                    {timeAgo(c.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing(c)}>
                          Tahrirlash
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-[var(--color-danger)]"
                          onClick={() => setDeleting(c)}
                        >
                          <Trash2 /> O'chirish
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <CustomerDialog
        open={showCreate || !!editing}
        onOpenChange={(v) => {
          if (!v) {
            setShowCreate(false)
            setEditing(null)
          }
        }}
        customer={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Mijozni o'chirish"
        description={`"${deleting?.name}" o'chirilsinmi? Bu amalni qaytarib bo'lmaydi.`}
        destructive
        confirmLabel="O'chirish"
        loading={delMut.isPending}
        onConfirm={() => {
          if (deleting) delMut.mutate(deleting._id)
        }}
      />
    </div>
  )
}

function CustomerDialog({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  customer: Customer | null
}) {
  const qc = useQueryClient()
  const isEdit = !!customer
  const [form, setForm] = useState(() => ({
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    city: customer?.city ?? "",
    address: customer?.address ?? "",
    notes: customer?.notes ?? "",
  }))

  // Reset form when dialog reopens with different customer
  useMemo(() => {
    if (open) {
      setForm({
        name: customer?.name ?? "",
        phone: customer?.phone ?? "",
        email: customer?.email ?? "",
        city: customer?.city ?? "",
        address: customer?.address ?? "",
        notes: customer?.notes ?? "",
      })
    }
  }, [open, customer])

  const mut = useMutation({
    mutationFn: () =>
      isEdit && customer
        ? customersApi.update(customer._id, form)
        : customersApi.create(form),
    onSuccess: () => {
      toast.success(isEdit ? "Yangilandi" : "Qo'shildi")
      qc.invalidateQueries({ queryKey: ["customers"] })
      onOpenChange(false)
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Mijozni tahrirlash" : "Yangi mijoz"}</DialogTitle>
          <DialogDescription>Mijoz ma'lumotlarini kiriting.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            mut.mutate()
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label>To'liq ism *</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Telefon</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+998..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Shahar</Label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Manzil</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Izoh</Label>
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Bekor
            </Button>
            <Button type="submit" variant="brand" disabled={mut.isPending}>
              {mut.isPending ? "..." : isEdit ? "Saqlash" : "Qo'shish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
