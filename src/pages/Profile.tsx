import { useState, type FormEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/common/PageHeader"
import { UserAvatar } from "@/components/common/UserAvatar"
import { RoleBadge } from "@/components/common/StatusBadge"
import { useAuth } from "@/context/AuthContext"
import { usersApi } from "@/api/resources"
import { authApi } from "@/api/auth"
import { fmtDate } from "@/lib/format"
import { toast } from "@/components/ui/sonner"
import { apiErrorMessage } from "@/api/client"

export function Profile() {
  const { user, refresh } = useAuth()
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  })

  const updateMut = useMutation({
    mutationFn: () => usersApi.update(user!._id, form),
    onSuccess: () => {
      toast.success("Profil yangilandi")
      refresh()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const [pw, setPw] = useState({ old: "", new1: "", new2: "" })
  const pwMut = useMutation({
    mutationFn: () => authApi.changePassword(pw.old, pw.new1),
    onSuccess: () => {
      toast.success("Parol o'zgartirildi")
      setPw({ old: "", new1: "", new2: "" })
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  if (!user) return null

  return (
    <div className="space-y-5 max-w-2xl">
      <PageHeader title="Mening profilim" description="Shaxsiy ma'lumotlar va xavfsizlik" />

      <Card>
        <CardContent className="flex items-center gap-4 py-5">
          <UserAvatar name={user.name} size="lg" />
          <div className="flex-1">
            <div className="text-[16px] font-semibold">{user.name}</div>
            <div className="text-[12px] text-[var(--color-muted)] mt-0.5">{user.email}</div>
            <div className="mt-2 flex items-center gap-2">
              <RoleBadge role={user.role} />
              <span className="text-[11px] text-[var(--color-muted)] font-mono">
                Qo'shilgan: {fmtDate(user.createdAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="px-5 py-4 hairline-b">
          <h2 className="text-[14px] font-semibold">Shaxsiy ma'lumot</h2>
        </div>
        <CardContent>
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              updateMut.mutate()
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label>To'liq ism</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                <Label>Telefon</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button type="submit" variant="brand" disabled={updateMut.isPending}>
                {updateMut.isPending ? "..." : "Saqlash"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <div className="px-5 py-4 hairline-b">
          <h2 className="text-[14px] font-semibold">Parolni o'zgartirish</h2>
          <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
            Hisobingizni himoyalash uchun kuchli parol ishlating
          </p>
        </div>
        <CardContent>
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              if (pw.new1 !== pw.new2) {
                toast.error("Yangi parollar mos kelmadi")
                return
              }
              if (pw.new1.length < 6) {
                toast.error("Parol kamida 6 ta belgi bo'lishi kerak")
                return
              }
              pwMut.mutate()
            }}
            className="space-y-3 max-w-md"
          >
            <div className="space-y-1.5">
              <Label>Joriy parol</Label>
              <Input
                type="password"
                required
                value={pw.old}
                onChange={(e) => setPw({ ...pw, old: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Yangi parol</Label>
              <Input
                type="password"
                required
                value={pw.new1}
                onChange={(e) => setPw({ ...pw, new1: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Yangi parolni tasdiqlash</Label>
              <Input
                type="password"
                required
                value={pw.new2}
                onChange={(e) => setPw({ ...pw, new2: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="brand" disabled={pwMut.isPending}>
                {pwMut.isPending ? "..." : "Parolni yangilash"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
