import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  LayoutGrid,
  List,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { Input, Textarea } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
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
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/common/EmptyState"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { productsApi } from "@/api/resources"
import { fmtMoney, fmtNumber } from "@/lib/format"
import { fashionProduct } from "@/lib/unsplash"
import { toast } from "@/components/ui/sonner"
import { apiErrorMessage } from "@/api/client"
import { cn } from "@/lib/utils"
import type { Product } from "@/types"

type View = "grid" | "list"

function stockTone(p: Product): { dot: string; label: string; variant: "success" | "warning" | "danger" } {
  const threshold = p.lowStockThreshold ?? 5
  if (p.stock <= 0)
    return { dot: "bg-[var(--color-danger)]", label: "Yo'q", variant: "danger" }
  if (p.stock <= threshold)
    return { dot: "bg-[var(--color-warning)]", label: "Kam", variant: "warning" }
  return { dot: "bg-[var(--color-success)]", label: "Stokda", variant: "success" }
}

export function Products() {
  const qc = useQueryClient()
  const [view, setView] = useState<View>("grid")
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<Product | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const listQ = useQuery({
    queryKey: ["products", { search }],
    queryFn: () => productsApi.list({ search, limit: 200 }),
  })

  const filtered = listQ.data ?? []

  const delMut = useMutation({
    mutationFn: (id: string) => productsApi.remove(id),
    onSuccess: () => {
      toast.success("Mahsulot o'chirildi")
      qc.invalidateQueries({ queryKey: ["products"] })
      setDeleting(null)
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Mahsulotlar"
        description={`${filtered.length} ta mahsulot`}
        actions={
          <>
            <div className="flex items-center hairline rounded-[6px] p-0.5">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "anim p-1 rounded-[4px]",
                  view === "grid" ? "bg-[var(--color-surface-2)]" : "text-[var(--color-muted)]"
                )}
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "anim p-1 rounded-[4px]",
                  view === "list" ? "bg-[var(--color-surface-2)]" : "text-[var(--color-muted)]"
                )}
              >
                <List className="size-3.5" />
              </button>
            </div>
            <Button variant="brand" size="sm" onClick={() => setShowCreate(true)}>
              <Plus className="size-3.5" /> Yangi
            </Button>
          </>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--color-muted)]" />
        <Input
          placeholder="Mahsulot nomi, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {listQ.isLoading ? (
        <div
          className={cn(
            view === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
              : "space-y-2"
          )}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={view === "grid" ? "aspect-[3/4]" : "h-14"} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-0">
          <EmptyState
            icon={Package}
            title="Mahsulot yo'q"
            description="Birinchi mahsulotingizni qo'shing."
            action={
              <Button variant="brand" size="sm" onClick={() => setShowCreate(true)}>
                <Plus className="size-3.5" /> Yangi mahsulot
              </Button>
            }
          />
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={() => setEditing(p)}
              onDelete={() => setDeleting(p)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Mahsulot</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Kategoriya</TableHead>
                <TableHead className="text-right">Narx</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const tone = stockTone(p)
                return (
                  <TableRow key={p._id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-[6px] hairline overflow-hidden bg-[var(--color-surface)] shrink-0">
                          <img
                            src={p.image ?? fashionProduct(p._id, 100, 100)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[12px] text-[var(--color-muted)]">
                      {p.sku ?? "—"}
                    </TableCell>
                    <TableCell className="text-[12px]">{p.category ?? "—"}</TableCell>
                    <TableCell className="text-right font-mono">
                      {fmtMoney(p.price).replace(" so'm", "")}
                    </TableCell>
                    <TableCell className="text-right font-mono">{fmtNumber(p.stock)}</TableCell>
                    <TableCell>
                      <Badge variant={tone.variant}>{tone.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditing(p)}>
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-[var(--color-danger)]"
                            onClick={() => setDeleting(p)}
                          >
                            <Trash2 /> O'chirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <ProductDialog
        open={showCreate || !!editing}
        onOpenChange={(v) => {
          if (!v) {
            setShowCreate(false)
            setEditing(null)
          }
        }}
        product={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Mahsulotni o'chirish"
        description={`"${deleting?.name}" o'chirilsinmi?`}
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

function ProductCard({
  product: p,
  onEdit,
  onDelete,
}: {
  product: Product
  onEdit: () => void
  onDelete: () => void
}) {
  const tone = stockTone(p)
  return (
    <article className="group rounded-[10px] hairline bg-white overflow-hidden anim hover:border-[var(--color-border-strong)]">
      <div className="relative aspect-[3/4] bg-[var(--color-surface)] overflow-hidden">
        <img
          src={p.image ?? fashionProduct(p._id, 400, 500)}
          alt={p.name}
          className="absolute inset-0 w-full h-full object-cover anim group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-medium">
          <span className={cn("size-1.5 rounded-full", tone.dot)} />
          {tone.label}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute top-2 right-2 size-6 grid place-items-center rounded-full bg-white/95 backdrop-blur-sm anim opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="size-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Tahrirlash</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[var(--color-danger)]" onClick={onDelete}>
              <Trash2 /> O'chirish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-3">
        {p.category && (
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] font-medium">
            {p.category}
          </div>
        )}
        <h3 className="text-[13px] font-medium mt-0.5 truncate">{p.name}</h3>
        <div className="mt-2 flex items-end justify-between">
          <span className="font-mono text-[14px] font-medium">
            {fmtMoney(p.price).replace(" so'm", "")}
          </span>
          <span className="text-[11px] font-mono text-[var(--color-muted)]">
            stok: {p.stock}
          </span>
        </div>
      </div>
    </article>
  )
}

function ProductDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  product: Product | null
}) {
  const qc = useQueryClient()
  const isEdit = !!product
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: 0,
    cost: 0,
    stock: 0,
    description: "",
  })

  useMemo(() => {
    if (open)
      setForm({
        name: product?.name ?? "",
        sku: product?.sku ?? "",
        category: product?.category ?? "",
        price: product?.price ?? 0,
        cost: product?.cost ?? 0,
        stock: product?.stock ?? 0,
        description: product?.description ?? "",
      })
  }, [open, product])

  const mut = useMutation({
    mutationFn: () =>
      isEdit && product
        ? productsApi.update(product._id, form)
        : productsApi.create(form),
    onSuccess: () => {
      toast.success(isEdit ? "Yangilandi" : "Qo'shildi")
      qc.invalidateQueries({ queryKey: ["products"] })
      onOpenChange(false)
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}</DialogTitle>
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
              <Label>Nom *</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Kategoriya</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Narx (so'm) *</Label>
              <Input
                type="number"
                required
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tannarx</Label>
              <Input
                type="number"
                value={form.cost || ""}
                onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Boshlang'ich stok</Label>
              <Input
                type="number"
                value={form.stock || ""}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Tavsif</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
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
