import { api } from './axios'
import type { Task, CreateTaskDto, UpdateTaskDto } from '@/types'

export const tasksApi = {
  async getAll(): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks')
    return response.data
  },

  async getById(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`)
    return response.data
  },

  async create(task: CreateTaskDto): Promise<Task> {
    const response = await api.post<Task>('/tasks', task)
    return response.data
  },

  async update(id: number, task: UpdateTaskDto): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, task)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },

  async getMyTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>('/tasks')
    // Фильтрация на клиенте, если бэкенд не предоставляет отдельный endpoint
    return response.data
  },
}
