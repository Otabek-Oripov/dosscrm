import { useLocation, Link } from "react-router-dom"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Search, ChevronsRight, Bell, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/orders": "Buyurtmalar",
  "/customers": "Mijozlar",
  "/products": "Mahsulotlar",
  "/inventory": "Ombor",
  "/users": "Foydalanuvchilar",
  "/activity": "Faollik",
  "/reports": "Hisobotlar",
  "/settings": "Sozlamalar",
  "/profile": "Profil",
}

interface Props {
  collapsed: boolean
  onExpand: () => void
  onOpenCommand: () => void
}

export function Topbar({ collapsed, onExpand, onOpenCommand }: Props) {
  const { user } = useAuth()
  const location = useLocation()

  const breadcrumb = useMemo(() => {
    const seg = location.pathname.split("/").filter(Boolean)
    const root = "/" + seg[0]
    const rootLabel = TITLES[root] ?? seg[0]
    return { rootLabel, root, rest: seg.slice(1) }
  }, [location.pathname])

  return (
    <header
      className={cn(
        "h-14 hairline-b bg-[var(--color-surface)] flex items-center gap-3 px-5 sticky top-0 z-30"
      )}
    >
      {collapsed && (
        <Button variant="ghost" size="icon-sm" onClick={onExpand} aria-label="Sidebar ochish">
          <ChevronsRight className="size-3.5" strokeWidth={1.75} />
        </Button>
      )}

      <div className="flex items-center gap-1.5 text-[13px] min-w-0">
        <Link
          to={breadcrumb.root}
          className="font-medium text-[var(--color-foreground)] hover:underline truncate"
        >
          {breadcrumb.rootLabel}
        </Link>
        {breadcrumb.rest.map((seg, i) => (
          <span key={i} className="flex items-center gap-1.5 text-[var(--color-muted)] truncate">
            <ChevronRight className="size-3 shrink-0" strokeWidth={1.5} />
            <span className="truncate font-mono text-[12px]">{seg}</span>
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCommand}
          className="gap-2 text-[var(--color-muted)] font-normal"
        >
          <Search className="size-3" strokeWidth={1.75} />
          <span className="hidden md:inline">Qidirish</span>
          <kbd className="hidden md:inline-flex items-center font-mono text-[10px] ml-1">
            ⌘K
          </kbd>
        </Button>

        <Button variant="ghost" size="icon-sm" aria-label="Bildirishnomalar">
          <Bell className="size-3.5" strokeWidth={1.75} />
        </Button>

        {user && (
          <div className="hidden sm:flex items-center gap-2 pl-3 ml-1 hairline-l">
            <div className="text-right hidden lg:block">
              <div className="text-[12px] font-medium leading-none">{user.name}</div>
              <div className="text-[10px] text-[var(--color-muted)] mt-0.5 capitalize">
                {user.role}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
