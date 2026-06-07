import { Link } from "react-router-dom"
import { Logo } from "@/layout/Logo"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <header className="px-6 py-5 hairline-b">
        <Link to="/">
          <Logo />
        </Link>
      </header>
      <main className="flex-1 grid place-items-center px-6">
        <div className="text-center max-w-md">
          <div className="text-[140px] leading-none font-medium tracking-display text-[var(--color-foreground)]">
            404
          </div>
          <h1 className="mt-8 text-[24px] font-medium tracking-tight">
            Sahifa topilmadi
          </h1>
          <p className="mt-3 text-[13px] text-[var(--color-muted)]">
            Siz qidirgan sahifa mavjud emas yoki ko'chirilgan.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="size-3.5" strokeWidth={1.75} /> Bosh sahifa
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">Dashboardga</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="px-6 py-5 hairline-t text-[11px] text-[var(--color-muted)] flex items-center justify-between">
        <span>© 2026 DossCrm</span>
        <span className="font-mono">404 · NOT_FOUND</span>
      </footer>
    </div>
  )
}
