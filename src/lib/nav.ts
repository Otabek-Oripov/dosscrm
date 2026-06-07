import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Boxes,
  UserCog,
  Activity,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react"
import type { Role } from "@/types"

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  roles?: Role[]
  group: "main" | "manage" | "admin"
  badge?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, group: "main" },
  { label: "Buyurtmalar", to: "/orders", icon: ShoppingBag, group: "main" },
  { label: "Mijozlar", to: "/customers", icon: Users, group: "main" },
  { label: "Mahsulotlar", to: "/products", icon: Package, group: "main" },
  {
    label: "Ombor",
    to: "/inventory",
    icon: Boxes,
    group: "manage",
    roles: ["admin", "manager"],
  },
  {
    label: "Hisobotlar",
    to: "/reports",
    icon: BarChart3,
    group: "manage",
    roles: ["admin", "manager"],
  },
  {
    label: "Foydalanuvchilar",
    to: "/users",
    icon: UserCog,
    group: "manage",
    roles: ["admin", "manager"],
  },
  {
    label: "Faollik",
    to: "/activity",
    icon: Activity,
    group: "manage",
    roles: ["admin", "manager"],
  },
  {
    label: "Sozlamalar",
    to: "/settings",
    icon: Settings,
    group: "admin",
    roles: ["admin"],
  },
]

export function filterNavByRole(role: Role | undefined): NavItem[] {
  if (!role) return []
  return NAV_ITEMS.filter((n) => !n.roles || n.roles.includes(role))
}
