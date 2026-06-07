import { useState, type FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/layout/Logo"
import { apiErrorMessage } from "@/api/client"
import { toast } from "@/components/ui/sonner"
import { fashionPortrait } from "@/lib/unsplash"
import { ArrowRight, Eye, EyeOff, Loader2, Zap } from "lucide-react"

interface LocationState {
  from?: string
}

const DEMO = [
  { label: "Admin", email: "admin@fashionz.app", password: "admin123" },
  { label: "Menejer", email: "manager@fashionz.app", password: "manager123" },
  { label: "Sotuvchi", email: "sales@fashionz.app", password: "sales123" },
]

export function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState) ?? {}

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    navigate("/dashboard", { replace: true })
    return null
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login({ email, password })
      toast.success("Xush kelibsiz")
      navigate(state.from && state.from !== "/login" ? state.from : "/dashboard", { replace: true })
    } catch (err) {
      toast.error(apiErrorMessage(err, "Kirish amalga oshmadi"))
    } finally {
      setSubmitting(false)
    }
  }

  function fillDemo(d: (typeof DEMO)[number]) {
    setEmail(d.email)
    setPassword(d.password)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.05fr] bg-[var(--color-background)]">
      <div className="flex flex-col px-8 sm:px-12 lg:px-20 py-10 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-brand)]" />

        <Link to="/" className="self-start">
          <Logo />
        </Link>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-[400px] mx-auto">
            <div className="inline-flex items-center gap-2 px-2.5 h-7 rounded-[3px] bg-[var(--color-brand-soft)] mb-5">
              <Zap className="size-3 text-[var(--color-brand)]" strokeWidth={2.5} />
              <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-brand)] font-semibold">
                Kirish
              </span>
            </div>

            <h1 className="text-[44px] font-semibold tracking-display leading-[1.0]">
              Xush kelibsiz <span className="marker-y">qaytib</span>.
            </h1>
            <p className="text-[13px] text-[var(--color-muted)] mt-4 leading-relaxed">
              Ma'lumotlaringizni kiriting yoki demo akkaunt orqali sinab ko'ring.
            </p>

            <form onSubmit={onSubmit} className="mt-10 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Elektron pochta</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="siz@misol.com"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Parol</Label>
                  <button
                    type="button"
                    className="text-[11px] text-[var(--color-muted)] hover:text-[var(--color-brand)] anim"
                  >
                    Unutdingizmi?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-muted)] hover:text-[var(--color-brand)] anim"
                  >
                    {show ? <EyeOff className="size-3.5" strokeWidth={1.75} /> : <Eye className="size-3.5" strokeWidth={1.75} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" strokeWidth={2.25} />
                ) : (
                  <>
                    Kirish <ArrowRight className="size-3.5" strokeWidth={2.25} />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)] font-semibold">
                <span className="flex-1 h-px bg-[var(--color-border)]" />
                Demo
                <span className="flex-1 h-px bg-[var(--color-border)]" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {DEMO.map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => fillDemo(d)}
                    className="anim text-[12px] px-3 py-2.5 rounded-[3px] hairline bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] hover:border-[var(--color-brand)] text-left"
                  >
                    <div className="text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                      Rol
                    </div>
                    <div className="font-semibold mt-0.5">{d.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[var(--color-muted)] flex items-center justify-between mt-8">
          <span>© 2026 DossCrm</span>
          <Link to="/" className="hover:text-[var(--color-brand)] anim">
            ← Bosh sahifa
          </Link>
        </div>
      </div>

      <div className="relative hidden lg:block overflow-hidden hairline-l">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-brand)] z-20" />

        <img
          src={fashionPortrait("login-dosscrm", 1100, 1400)}
          alt="Streetwear editorial"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "grayscale(100%) contrast(1.08) brightness(0.85)" }}
          loading="eager"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.7) 100%)",
          }}
        />

        <div className="absolute top-12 right-12 bg-[var(--color-brand)] px-3 py-1.5">
          <span className="text-[11px] uppercase tracking-[0.16em] font-bold text-[var(--color-brand-foreground)]">
            DossCrm
          </span>
        </div>

        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-white text-[44px] leading-[1.0] tracking-display font-semibold text-balance">
            Biznesingiz <span className="marker-y">yorqin</span> bo'lsin.
          </blockquote>
          <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/70">
            <span className="size-1 rounded-full bg-[var(--color-brand)]" />
            Bold CRM Studio
          </div>
        </div>
      </div>
    </div>
  )
}
