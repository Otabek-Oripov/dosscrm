import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MoreHorizontal, Plus, Search, Trash2, UserCog } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { TableSkeleton } from "@/components/common/Loading"
import { EmptyState } from "@/components/common/EmptyState"
import { UserAvatar } from "@/components/common/UserAvatar"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { RoleBadge } from "@/components/common/StatusBadge"
import { usersApi } from "@/api/resources"
import { timeAgo } from "@/lib/format"
import { toast } from "@/components/ui/sonner"
import { apiErrorMessage } from "@/api/client"
import type { Role, User } from "@/types"

export function Users() {
  const qc = useQueryClient()
  const [search, setSearch] = useState("")
  const [editing, setEditing] = useState<User | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleting, setDeleting] = useState<User | null>(null)

  const listQ = useQuery({
    queryKey: ["users", { search }],
    queryFn: () => usersApi.list({ search, limit: 200 }),
  })

  const filtered = listQ.data ?? []

  const toggleMut = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      usersApi.update(id, { isActive }),
    onSuccess: () => {
      toast.success("Yangilandi")
      qc.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const delMut = useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      toast.success("Foydalanuvchi o'chirildi")
      qc.invalidateQueries({ queryKey: ["users"] })
      setDeleting(null)
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  return (
    <div className="space-y-5">
      <PageHeader
        title="Foydalanuvchilar"
        description={`${filtered.length} ta foydalanuvchi`}
        actions={
          <Button variant="brand" size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="size-3.5" /> Yangi
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-[var(--color-muted)]" />
        <Input
          placeholder="Ism, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      <Card className="p-0 overflow-hidden">
        {listQ.isLoading ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UserCog}
            title="Foydalanuvchi yo'q"
            description="Birinchi foydalanuvchini qo'shing."
            action={
              <Button variant="brand" size="sm" onClick={() => setShowCreate(true)}>
                <Plus className="size-3.5" /> Yangi
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Qo'shildi</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <UserAvatar name={u.name} size="sm" />
                      <div>
                        <div className="font-medium text-[13px]">{u.name}</div>
                        {u.phone && (
                          <div className="text-[11px] text-[var(--color-muted)]">{u.phone}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[12px] text-[var(--color-foreground-muted)]">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={u.role} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={u.isActive !== false}
                        onCheckedChange={(checked) =>
                          toggleMut.mutate({ id: u._id, isActive: checked })
                        }
                      />
                      <span className="text-[11px] text-[var(--color-muted)]">
                        {u.isActive !== false ? "Aktiv" : "O'chirilgan"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[11px] text-[var(--color-muted)] font-mono">
                    {timeAgo(u.createdAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing(u)}>
                          Tahrirlash
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-[var(--color-danger)]"
                          onClick={() => setDeleting(u)}
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

      <UserDialog
        open={showCreate || !!editing}
        onOpenChange={(v) => {
          if (!v) {
            setShowCreate(false)
            setEditing(null)
          }
        }}
        user={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Foydalanuvchini o'chirish"
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

function UserDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: User | null
}) {
  const qc = useQueryClient()
  const isEdit = !!user
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "sales" as Role,
    password: "",
  })

  useMemo(() => {
    if (open)
      setForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        role: user?.role ?? "sales",
        password: "",
      })
  }, [open, user])

  const mut = useMutation({
    mutationFn: () => {
      const payload = { ...form }
      if (isEdit && !payload.password) {
        const { password: _p, ...rest } = payload
        return usersApi.update(user!._id, rest)
      }
      return isEdit
        ? usersApi.update(user!._id, payload)
        : usersApi.create(payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? "Yangilandi" : "Qo'shildi")
      qc.invalidateQueries({ queryKey: ["users"] })
      onOpenChange(false)
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"}</DialogTitle>
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
              <Label>Email *</Label>
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Telefon</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Rol *</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as Role })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Menejer</SelectItem>
                  <SelectItem value="sales">Sotuvchi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Parol {isEdit ? "(o'zgartirish uchun)" : "*"}</Label>
              <Input
                type="password"
                required={!isEdit}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={isEdit ? "Bo'sh qoldiring agar o'zgarmasa" : ""}
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
