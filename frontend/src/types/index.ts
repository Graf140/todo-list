// Типы для проекта Todo List

export type UserRole = 'client' | 'admin' | 'executor'

export type TaskStatus = 'new' | 'in_progress' | 'completed'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  avatar?: string | null
}

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  client_id: number
  executor_id?: number | null
  admin_id?: number | null
  created_at: string
  updated_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface CreateTaskDto {
  title: string
  description: string
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: TaskStatus
  executor_id?: number
}

export interface Executor {
  id: number
  name: string
  email: string
}
