import { apiClient } from "./client"
import type { User } from "@/types"

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authApi = {
  login: async (input: LoginInput): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>("/auth/login", input)
    return data
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<User | { user: User }>("/auth/me")
    return (data as { user?: User }).user ?? (data as User)
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post("/auth/change-password", { oldPassword, newPassword })
  },
}
