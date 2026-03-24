import { api } from './axios'
import type { User } from '@/types'

export interface UpdateUserDto {
  name?: string
  email?: string
  avatar?: string
}

export const usersApi = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users')
    return response.data
  },

  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  },

  async update(id: number, user: UpdateUserDto): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, user)
    return response.data
  },

  async getExecutors(): Promise<User[]> {
    const response = await api.get<User[]>('/users')
    // Фильтруем только исполнителей на клиенте
    return response.data.filter(u => u.role === 'executor')
  },
}
