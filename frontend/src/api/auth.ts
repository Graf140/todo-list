import { api } from './axios'
import type { LoginCredentials, AuthTokens, User, RegisterCredentials } from '@/types'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/login', credentials)
    return response.data
  },

  async register(credentials: RegisterCredentials): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/register', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/users/me')
    return response.data
  },

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refresh_token')
    const response = await api.post<AuthTokens>('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },
}
