import { apiClient } from "./client"
import type {
  Activity,
  Customer,
  Order,
  OrderStatus,
  PaymentStatus,
  Product,
  StatsByCategory,
  StatsByCity,
  StatsMonthly,
  StatsOverview,
  StatsStatusBreakdown,
  StatsTopProduct,
  StatsTopSale,
  User,
} from "@/types"

interface ListParams {
  page?: number
  limit?: number
  q?: string
  search?: string
  sort?: string
  [k: string]: unknown
}

async function get<T>(url: string, params?: ListParams): Promise<T> {
  const { data } = await apiClient.get<T>(url, { params })
  return data
}

function unwrap<T>(data: unknown, key: string): T[] {
  if (Array.isArray(data)) return data as T[]
  const obj = data as Record<string, unknown>
  if (Array.isArray(obj?.[key])) return obj[key] as T[]
  if (Array.isArray(obj?.data)) return obj.data as T[]
  if (Array.isArray(obj?.items)) return obj.items as T[]
  return []
}

export const usersApi = {
  list: async (params?: ListParams) => unwrap<User>(await get("/users", params), "users"),
  get: (id: string) => get<User>(`/users/${id}`),
  create: async (input: Partial<User> & { password?: string }) =>
    (await apiClient.post<User>("/users", input)).data,
  update: async (id: string, input: Partial<User>) =>
    (await apiClient.put<User>(`/users/${id}`, input)).data,
  remove: async (id: string) => apiClient.delete(`/users/${id}`),
}

export const customersApi = {
  list: async (params?: ListParams) =>
    unwrap<Customer>(await get("/customers", params), "customers"),
  get: (id: string) => get<Customer>(`/customers/${id}`),
  create: async (input: Partial<Customer>) =>
    (await apiClient.post<Customer>("/customers", input)).data,
  update: async (id: string, input: Partial<Customer>) =>
    (await apiClient.put<Customer>(`/customers/${id}`, input)).data,
  remove: async (id: string) => apiClient.delete(`/customers/${id}`),
}

export const productsApi = {
  list: async (params?: ListParams) =>
    unwrap<Product>(await get("/products", params), "products"),
  get: (id: string) => get<Product>(`/products/${id}`),
  create: async (input: Partial<Product>) =>
    (await apiClient.post<Product>("/products", input)).data,
  update: async (id: string, input: Partial<Product>) =>
    (await apiClient.put<Product>(`/products/${id}`, input)).data,
  remove: async (id: string) => apiClient.delete(`/products/${id}`),
  adjustStock: async (id: string, delta: number, reason?: string) =>
    (
      await apiClient.post<Product>(`/products/${id}/stock`, { delta, reason })
    ).data,
}

export const ordersApi = {
  list: async (params?: ListParams) => unwrap<Order>(await get("/orders", params), "orders"),
  get: (id: string) => get<Order>(`/orders/${id}`),
  create: async (input: Partial<Order>) =>
    (await apiClient.post<Order>("/orders", input)).data,
  update: async (id: string, input: Partial<Order>) =>
    (await apiClient.put<Order>(`/orders/${id}`, input)).data,
  remove: async (id: string) => apiClient.delete(`/orders/${id}`),
  setStatus: async (id: string, status: OrderStatus) =>
    (await apiClient.patch<Order>(`/orders/${id}/status`, { status })).data,
  setPayment: async (id: string, paymentStatus: PaymentStatus) =>
    (await apiClient.patch<Order>(`/orders/${id}/payment`, { paymentStatus })).data,
}

export const activitiesApi = {
  list: async (params?: ListParams) =>
    unwrap<Activity>(await get("/activities", params), "activities"),
}

export const statsApi = {
  overview: () => get<StatsOverview>("/stats/overview"),
  monthly: () => get<StatsMonthly[]>("/stats/monthly"),
  statusBreakdown: () => get<StatsStatusBreakdown[]>("/stats/status-breakdown"),
  topProducts: (limit = 5) => get<StatsTopProduct[]>("/stats/top-products", { limit }),
  byCategory: () => get<StatsByCategory[]>("/stats/by-category"),
  byCity: () => get<StatsByCity[]>("/stats/by-city"),
  topSales: () => get<StatsTopSale[]>("/stats/top-sales"),
}
