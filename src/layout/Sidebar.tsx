import { useMemo } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { filterNavByRole } from "@/lib/nav"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { Logo } from "./Logo"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/common/UserAvatar"
import { ChevronsLeft, LogOut, Search, Settings, User as UserIcon } from "lucide-react"

interface Props {
  collapsed: boolean
  onToggle: () => void
  onOpenCommand: () => void
}

export function Sidebar({ collapsed, onToggle, onOpenCommand }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const groups = useMemo(() => {
    const items = filterNavByRole(user?.role)
    return {
      main: items.filter((i) => i.group === "main"),
      manage: items.filter((i) => i.group === "manage"),
      admin: items.filter((i) => i.group === "admin"),
    }
  }, [user?.role])

  const width = collapsed ? "w-[60px]" : "w-[224px]"

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          "anim shrink-0 h-screen hairline-r bg-[var(--color-surface)] flex flex-col",
          width
        )}
      >
        <div
          className={cn(
            "h-14 flex items-center hairline-b shrink-0",
            collapsed ? "px-2 justify-center" : "px-4 justify-between"
          )}
        >
          {collapsed ? (
            <Logo showText={false} />
          ) : (
            <>
              <Logo />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onToggle}
                aria-label="Sidebar yopish"
              >
                <ChevronsLeft className="size-3.5" strokeWidth={1.75} />
              </Button>
            </>
          )}
        </div>

        <div className={cn("py-3", collapsed ? "px-2" : "px-3")}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="w-full"
                  onClick={onOpenCommand}
                >
                  <Search className="size-3.5" strokeWidth={1.75} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Qidirish</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={onOpenCommand}
              className="anim w-full flex items-center justify-between gap-2 h-9 px-3 rounded-[3px] hairline text-[12px] text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]"
            >
              <span className="flex items-center gap-2">
                <Search className="size-3.5" strokeWidth={1.75} />
                Qidirish
              </span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] text-[var(--color-muted)]">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        <nav className={cn("flex-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
          <NavGroup items={groups.main} collapsed={collapsed} />
          {groups.manage.length > 0 && (
            <>
              <SectionLabel label="BOSHQARUV" collapsed={collapsed} />
              <NavGroup items={groups.manage} collapsed={collapsed} />
            </>
          )}
          {groups.admin.length > 0 && (
            <>
              <SectionLabel label="ADMIN" collapsed={collapsed} />
              <NavGroup items={groups.admin} collapsed={collapsed} />
            </>
          )}
        </nav>

        <div className={cn("hairline-t py-3", collapsed ? "px-2" : "px-3")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "anim w-full flex items-center gap-2 rounded-[3px] hover:bg-[var(--color-surface-2)]",
                  collapsed ? "justify-center p-1.5" : "px-2 py-1.5"
                )}
              >
                <UserAvatar name={user?.name} size="sm" />
                {!collapsed && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-[12px] font-medium truncate">{user?.name}</div>
                    <div className="text-[10px] text-[var(--color-muted)] truncate">
                      {user?.email}
                    </div>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" sideOffset={8}>
              <DropdownMenuLabel>Hisob</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <UserIcon /> Profil
              </DropdownMenuItem>
              {user?.role === "admin" && (
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings /> Sozlamalar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-[var(--color-danger)]">
                <LogOut /> Chiqish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </TooltipProvider>
  )
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="my-3 h-px bg-[var(--color-border)] mx-2" />
  return (
    <div className="px-2 pt-5 pb-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
      {label}
    </div>
  )
}

function NavGroup({
  items,
  collapsed,
}: {
  items: ReturnType<typeof filterNavByRole>
  collapsed: boolean
}) {
  return (
    <ul className="flex flex-col gap-px">
      {items.map((item) => {
        const Icon = item.icon
        const link = (
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              cn(
                "anim relative flex items-center gap-2.5 rounded-[3px] text-[13px]",
                collapsed ? "justify-center p-2" : "px-2.5 py-2",
                isActive
                  ? "bg-[var(--color-surface-2)] text-[var(--color-foreground)] font-medium"
                  : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-foreground)]"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-[var(--color-brand)]" />
                )}
                <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        )

        if (collapsed) {
          return (
            <li key={item.to}>
              <Tooltip>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            </li>
          )
        }
        return <li key={item.to}>{link}</li>
      })}
    </ul>
  )
}
