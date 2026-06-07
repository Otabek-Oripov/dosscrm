import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { CommandPalette } from "./CommandPalette"

const STORAGE_KEY = "dosscrm_sidebar_collapsed"

export function AppShell() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1"
    } catch {
      return false
    }
  })
  const [cmdOpen, setCmdOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0")
    } catch {
      /* ignore */
    }
  }, [collapsed])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "[" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCollapsed((c) => !c)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        onOpenCommand={() => setCmdOpen(true)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          collapsed={collapsed}
          onExpand={() => setCollapsed(false)}
          onOpenCommand={() => setCmdOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="px-8 lg:px-10 py-8 max-w-[1280px]">
            <Outlet />
          </div>
        </main>
      </div>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  )
}
