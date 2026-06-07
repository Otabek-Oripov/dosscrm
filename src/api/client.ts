import axios, { AxiosError } from "axios"

const TOKEN_KEY = "dosscrm_token"

export const apiClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
})

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

apiClient.interceptors.request.use((cfg) => {
  const t = getToken()
  if (t && cfg.headers) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

let onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(fn: () => void) {
  onUnauthorized = fn
}

apiClient.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ message?: string }>) => {
    if (err.response?.status === 401 && onUnauthorized) {
      onUnauthorized()
    }
    return Promise.reject(err)
  }
)

export function apiErrorMessage(err: unknown, fallback = "Xato yuz berdi"): string {
  if (axios.isAxiosError(err)) {
    return (
      (err.response?.data as { message?: string } | undefined)?.message ??
      err.message ??
      fallback
    )
  }
  if (err instanceof Error) return err.message
  return fallback
}
