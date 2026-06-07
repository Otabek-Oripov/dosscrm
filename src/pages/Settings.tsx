import { useState } from "react"
import { Building2, Bell, Shield, CreditCard } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Input, Textarea } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

type Tab = "company" | "notifications" | "billing" | "security"

const TABS: { key: Tab; label: string; icon: typeof Building2 }[] = [
  { key: "company", label: "Kompaniya", icon: Building2 },
  { key: "notifications", label: "Bildirishnoma", icon: Bell },
  { key: "billing", label: "To'lov", icon: CreditCard },
  { key: "security", label: "Xavfsizlik", icon: Shield },
]

export function Settings() {
  const [tab, setTab] = useState<Tab>("company")

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sozlamalar"
        description="Kompaniya, bildirishnoma va xavfsizlik sozlamalari"
      />

      <div className="grid lg:grid-cols-[200px_1fr] gap-6 items-start">
        <nav className="flex flex-col gap-0.5 sticky top-20">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "anim flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-[13px] text-left",
                  tab === t.key
                    ? "bg-[var(--color-surface)] text-[var(--color-foreground)] font-medium"
                    : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
                )}
              >
                <Icon className="size-3.5" />
                {t.label}
              </button>
            )
          })}
        </nav>

        <div className="min-w-0">
          {tab === "company" && <CompanyTab />}
          {tab === "notifications" && <NotificationsTab />}
          {tab === "billing" && <BillingTab />}
          {tab === "security" && <SecurityTab />}
        </div>
      </div>
    </div>
  )
}

function SettingsCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <div className="px-5 py-4 hairline-b">
        <h2 className="text-[14px] font-semibold">{title}</h2>
        {description && (
          <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{description}</p>
        )}
      </div>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function CompanyTab() {
  const [form, setForm] = useState({
    name: "DossCrm Studio",
    email: "info@dosscrm.app",
    phone: "+998 99 999 99 99",
    address: "Toshkent shahar, Yunusobod tumani",
    currency: "UZS",
    tax: "12",
  })
  return (
    <div className="space-y-5">
      <SettingsCard title="Kompaniya ma'lumotlari" description="Hisob va kvitansiyalarda ko'rsatiladi">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            toast.success("Saqlandi")
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label>Kompaniya nomi</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
            <div className="space-y-1.5 col-span-2">
              <Label>Manzil</Label>
              <Textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Valyuta</Label>
              <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>QQS (%)</Label>
              <Input
                type="number"
                value={form.tax}
                onChange={(e) => setForm({ ...form, tax: e.target.value })}
              />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost">
              Bekor
            </Button>
            <Button type="submit" variant="brand">
              Saqlash
            </Button>
          </div>
        </form>
      </SettingsCard>
    </div>
  )
}

function NotificationsTab() {
  return (
    <SettingsCard
      title="Bildirishnoma sozlamalari"
      description="Qaysi voqealarda email yoki SMS olishni xohlaysiz"
    >
      <div className="divide-y divide-[var(--color-border)]">
        {[
          { label: "Yangi buyurtma", desc: "Har yangi buyurtma uchun email" },
          { label: "Kam stok ogohlantirish", desc: "Mahsulot stoki minimaldan kam bo'lganda" },
          { label: "Haftalik hisobot", desc: "Har dushanba ertalab sotuv hisoboti" },
          { label: "Mijoz harakatlar", desc: "Yangi mijoz qo'shilganda" },
          { label: "Tizim yangilanishi", desc: "DossCrm yangilanishlari haqida" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div>
              <div className="text-[13px] font-medium">{item.label}</div>
              <div className="text-[12px] text-[var(--color-muted)] mt-0.5">{item.desc}</div>
            </div>
            <Switch defaultChecked={i % 2 === 0} />
          </div>
        ))}
      </div>
    </SettingsCard>
  )
}

function BillingTab() {
  return (
    <SettingsCard title="Obuna va to'lov" description="Joriy reja va to'lov tarixi">
      <div className="space-y-4">
        <div className="p-4 rounded-[8px] bg-gradient-to-br from-[var(--color-brand-soft)] to-white hairline">
          <div className="text-[11px] uppercase tracking-wider text-[var(--color-brand-hover)] font-medium">
            Joriy reja
          </div>
          <div className="mt-1 flex items-end justify-between">
            <div>
              <div className="text-[20px] font-semibold">Pro</div>
              <div className="text-[12px] text-[var(--color-muted)] mt-0.5">
                Keyingi to'lov: 2026-07-04
              </div>
            </div>
            <div className="font-mono text-[18px] font-medium">290,000 so'm</div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm">
              Rejani o'zgartirish
            </Button>
            <Button variant="ghost" size="sm">
              Bekor qilish
            </Button>
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-medium mb-2">
            To'lov tarixi
          </div>
          <div className="rounded-[8px] hairline divide-y divide-[var(--color-border)]">
            {[
              { date: "2026-06-04", amount: "290,000" },
              { date: "2026-05-04", amount: "290,000" },
              { date: "2026-04-04", amount: "290,000" },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2.5 text-[13px]">
                <span className="font-mono text-[12px]">{p.date}</span>
                <span>Pro obuna</span>
                <span className="font-mono">{p.amount} so'm</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SettingsCard>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-5">
      <SettingsCard title="Parol" description="Hisob xavfsizligi uchun kuchli parol ishlating">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            toast.success("Parol yangilandi")
          }}
          className="space-y-3 max-w-md"
        >
          <div className="space-y-1.5">
            <Label>Joriy parol</Label>
            <Input type="password" />
          </div>
          <div className="space-y-1.5">
            <Label>Yangi parol</Label>
            <Input type="password" />
          </div>
          <div className="space-y-1.5">
            <Label>Yangi parolni tasdiqlash</Label>
            <Input type="password" />
          </div>
          <Button type="submit" variant="brand">
            Parolni yangilash
          </Button>
        </form>
      </SettingsCard>

      <SettingsCard title="Sessiyalar" description="Sizning aktiv sessiyalaringiz">
        <div className="divide-y divide-[var(--color-border)]">
          {[
            { device: "MacBook Pro 14", browser: "Safari 18", current: true },
            { device: "iPhone 16 Pro", browser: "DossCrm App", current: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <div className="text-[13px] font-medium flex items-center gap-2">
                  {s.device}
                  {s.current && (
                    <span className="text-[10px] font-medium text-[var(--color-brand)] uppercase tracking-wider">
                      Joriy
                    </span>
                  )}
                </div>
                <div className="text-[12px] text-[var(--color-muted)] mt-0.5">{s.browser}</div>
              </div>
              {!s.current && (
                <Button variant="ghost" size="sm" className="text-[var(--color-danger)]">
                  Chiqarish
                </Button>
              )}
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  )
}
