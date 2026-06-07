import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Command } from "cmdk"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { filterNavByRole } from "@/lib/nav"
import { useAuth } from "@/context/AuthContext"
import { Search, LogOut } from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items = filterNavByRole(user?.role)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])

  const go = (to: string) => {
    onOpenChange(false)
    navigate(to)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" hideClose className="p-0 overflow-hidden">
        <Command className="w-full">
          <div className="flex items-center gap-2 px-3.5 h-12 hairline-b">
            <Search className="size-3.5 text-[var(--color-muted)]" />
            <Command.Input
              placeholder="Qidirish... sahifa, action..."
              className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-[var(--color-muted)]"
              autoFocus
            />
            <kbd className="text-[10px] font-mono text-[var(--color-muted)] hairline px-1.5 py-0.5 rounded">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[360px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-[12px] text-[var(--color-muted)]">
              Hech narsa topilmadi
            </Command.Empty>

            <Command.Group heading="Sahifalar" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--color-muted)]">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <Command.Item
                    key={item.to}
                    value={item.label + " " + item.to}
                    onSelect={() => go(item.to)}
                    className="anim flex items-center gap-2.5 px-2 py-1.5 rounded-[4px] cursor-pointer text-[13px] data-[selected=true]:bg-[var(--color-surface)]"
                  >
                    <Icon className="size-3.5 text-[var(--color-muted)]" />
                    <span>{item.label}</span>
                    <span className="ml-auto font-mono text-[10px] text-[var(--color-muted)]">
                      {item.to}
                    </span>
                  </Command.Item>
                )
              })}
            </Command.Group>

            <Command.Group heading="Hisob" className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-[var(--color-muted)]">
              <Command.Item
                value="profil hisob"
                onSelect={() => go("/profile")}
                className="anim flex items-center gap-2.5 px-2 py-1.5 rounded-[4px] cursor-pointer text-[13px] data-[selected=true]:bg-[var(--color-surface)]"
              >
                <span>Profilim</span>
              </Command.Item>
              <Command.Item
                value="chiqish logout"
                onSelect={() => {
                  onOpenChange(false)
                  logout()
                }}
                className="anim flex items-center gap-2.5 px-2 py-1.5 rounded-[4px] cursor-pointer text-[13px] text-[var(--color-danger)] data-[selected=true]:bg-[var(--color-danger-soft)]"
              >
                <LogOut className="size-3.5" />
                <span>Tizimdan chiqish</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
