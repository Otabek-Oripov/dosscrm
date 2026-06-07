import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Boxes, Minus, Plus, Search } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import { productsApi } from "@/api/resources"
import { fmtNumber } from "@/lib/format"
import { fashionProduct } from "@/lib/unsplash"
import { toast } from "@/components/ui/sonner"
import { apiErrorMessage } from "@/api/client"
import type { Product } from "@/types"

type Filter = "all" | "low" | "out" | "ok"

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Hammasi" },
  { key: "ok", label: "Yetarli" },
  { key: "low", label: "Kam" },
  { key: "out", label: "Tugagan" },
]

function progressTone(p: Product): { value: number; tone: "brand" | "warning" | "danger" } {
  const threshold = (p.lowStockThreshold ?? 5) * 4
  const value = Math.min(100, (p.stock / Math.max(threshold, 1)) * 100)
  if (p.stock <= 0) return { value: 0, tone: "danger" }
  if (p.stock <= (p.lowStockThreshold ?? 5)) return { value, tone: "warning" }
  return { value, tone: "brand" }
}

function bucket(p: Product): Filter {
  const threshold = p.lowStockThreshold ?? 5
  if (p.stock <= 0) return "out"
  if (p.stock <= threshold) return "low"
  return "ok"
}

export function Inventory() {
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")

  const productsQ = useQuery({
    queryKey: ["products", "inventory", { search }],
    queryFn: () => productsApi.list({ search, limit: 200 }),
  })

  const filtered = useMemo(() => {
    const data = productsQ.data ?? []
    if (filter === "all") return data
    return data.filter((p) => bucket(p) === filter)
  }, [productsQ.data, filter])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: 0, ok: 0, low: 0, out: 0 }
    productsQ.data?.forEach((p) => {
      c.all += 1
      c[bucket(p)] += 1
    })
    return c
  }, [productsQ.data])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Ombor"
        description={`Stok darajalari va inventarizatsiya`}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--color-muted)]" />
          <Input
            placeholder="Mahsulot qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`anim text-[12px] px-2.5 h-7 rounded-[6px] inline-flex items-center gap-1.5 ${
                filter === f.key
                  ? "bg-[var(--color-foreground)] text-white"
                  : "hairline bg-white hover:bg-[var(--color-surface)]"
              }`}
            >
              {f.label}
              <span
                className={`font-mono text-[10px] ${
                  filter === f.key ? "text-white/70" : "text-[var(--color-muted)]"
                }`}
              >
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {productsQ.isLoading ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="Hech narsa topilmadi"
            description="Filterlarni o'zgartirib ko'ring."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Mahsulot</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="w-[200px]">Stok darajasi</TableHead>
                <TableHead className="text-right">Joriy</TableHead>
                <TableHead className="text-right">Min</TableHead>
                <TableHead className="w-32 text-right">Tahrirlash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const { value, tone } = progressTone(p)
                return (
                  <TableRow key={p._id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-[6px] hairline overflow-hidden bg-[var(--color-surface)] shrink-0">
                          <img
                            src={p.image ?? fashionProduct(p._id, 80, 80)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <span className="font-medium text-[13px]">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-[12px] text-[var(--color-muted)]">
                      {p.sku ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Progress value={value} tone={tone} />
                    </TableCell>
                    <TableCell className="text-right font-mono">{fmtNumber(p.stock)}</TableCell>
                    <TableCell className="text-right font-mono text-[12px] text-[var(--color-muted)]">
                      {p.lowStockThreshold ?? 5}
                    </TableCell>
                    <TableCell className="text-right">
                      <AdjustPopover product={p} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}

function AdjustPopover({ product }: { product: Product }) {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [delta, setDelta] = useState(0)
  const [reason, setReason] = useState("")

  const mut = useMutation({
    mutationFn: () => productsApi.adjustStock(product._id, delta, reason),
    onSuccess: () => {
      toast.success("Stok yangilandi")
      qc.invalidateQueries({ queryKey: ["products"] })
      setOpen(false)
      setDelta(0)
      setReason("")
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Korrektsiya
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="space-y-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-medium">
              Stok korrektsiyasi
            </div>
            <div className="text-[12px] text-[var(--color-foreground-muted)] mt-0.5">
              Joriy: <span className="font-mono">{product.stock}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setDelta((d) => d - 1)}
            >
              <Minus className="size-3" />
            </Button>
            <Input
              type="number"
              value={delta}
              onChange={(e) => setDelta(Number(e.target.value))}
              className="text-center font-mono"
            />
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setDelta((d) => d + 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <div className="space-y-1.5">
            <Label>Sabab</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="masalan: yetkazib berildi"
            />
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[var(--color-muted)]">Yangi:</span>
            <span className="font-mono font-medium">{product.stock + delta}</span>
          </div>
          <Button
            variant="brand"
            className="w-full"
            disabled={delta === 0 || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? "..." : "Saqlash"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
