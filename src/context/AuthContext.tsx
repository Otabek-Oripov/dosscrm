import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { authApi, type LoginInput } from "@/api/auth"
import { getToken, setToken, setUnauthorizedHandler } from "@/api/client"
import type { Role, User } from "@/types"

interface AuthState {
  user: User | null
  loading: boolean
  login: (input: LoginInput) => Promise<User>
  logout: () => void
  refresh: () => Promise<void>
  hasRole: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(!!getToken())

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null)
      return
    }
    try {
      const u = await authApi.me()
      setUser(u)
    } catch {
      logout()
    }
  }, [logout])

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  useEffect(() => {
    let cancelled = false
    const t = getToken()
    if (!t) {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const u = await authApi.me()
        if (!cancelled) setUser(u)
      } catch {
        if (!cancelled) {
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const res = await authApi.login(input)
    setToken(res.token)
    setUser(res.user)
    return res.user
  }, [])

  const hasRole = useCallback(
    (...roles: Role[]) => !!user && roles.includes(user.role),
    [user]
  )

  const value = useMemo<AuthState>(
    () => ({ user, loading, login, logout, refresh, hasRole }),
    [user, loading, login, logout, refresh, hasRole]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
