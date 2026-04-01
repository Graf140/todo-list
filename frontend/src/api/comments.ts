import { api } from './axios'

export interface Comment {
  id: number
  task_id: number
  user_id: number
  text: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface CreateCommentDto {
  text: string
}

export const commentsApi = {
  async getByTaskId(taskId: number): Promise<Comment[]> {
    // Предполагаем, что есть endpoint для получения комментариев задачи
    // Если нет - можно использовать GET /tasks/{task_id} и получить комментарии оттуда
    try {
      const response = await api.get<Comment[]>(`/tasks/${taskId}/comments`)
      return response.data
    } catch {
      // Если endpoint не существует, возвращаем пустой массив
      return []
    }
  },

  async create(taskId: number, comment: CreateCommentDto): Promise<Comment> {
    const response = await api.post<Comment>(`/tasks/${taskId}/comments`, comment)
    return response.data
  },

  async delete(taskId: number, commentId: number): Promise<void> {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`)
  },
}
