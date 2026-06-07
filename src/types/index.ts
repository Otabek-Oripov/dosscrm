export type Role = "admin" | "manager" | "sales"

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: Role
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Customer {
  _id: string
  name: string
  email?: string
  phone?: string
  city?: string
  address?: string
  segment?: "vip" | "regular" | "new"
  totalSpent?: number
  ordersCount?: number
  notes?: string
  assignedTo?: string | User
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  _id: string
  name: string
  sku?: string
  category?: string
  price: number
  cost?: number
  stock: number
  lowStockThreshold?: number
  description?: string
  image?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface OrderItem {
  product: string | Product
  name?: string
  price: number
  quantity: number
  subtotal?: number
}

export type OrderStatus = "new" | "processing" | "shipped" | "delivered" | "cancelled"
export type PaymentStatus = "unpaid" | "paid" | "refunded"

export interface Order {
  _id: string
  orderNumber: string | number
  customer: string | Customer
  customerName?: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentStatus?: PaymentStatus
  paymentMethod?: string
  notes?: string
  assignedTo?: string | User
  createdAt?: string
  updatedAt?: string
}

export interface Activity {
  _id: string
  type: string
  description: string
  user?: string | User
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface StatsOverview {
  revenue: number
  orderCount: number
  customerCount: number
  productCount: number
  userCount?: number
  pending?: number
  lowStock?: number
}

export interface StatsMonthly {
  month: string
  orders: number
  revenue: number
}

export interface StatsStatusBreakdown {
  status: OrderStatus
  count: number
}

export interface StatsTopProduct {
  productId: string
  name: string
  qty: number
  total: number
}

export interface StatsByCategory {
  category: string
  qty: number
  revenue: number
}

export interface StatsByCity {
  city: string
  total: number
}

export interface StatsTopSale {
  id: string
  name: string
  orders: number
  revenue: number
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string>
}
