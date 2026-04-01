import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tasksApi } from '@/api/tasks'
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '@/types'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const newTasks = computed(() => tasks.value.filter(t => t.status === 'new'))
  const inProgressTasks = computed(() => tasks.value.filter(t => t.status === 'in_progress'))
  const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed'))

  async function fetchAll() {
    isLoading.value = true
    error.value = null

    try {
      tasks.value = await tasksApi.getAll()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки задач'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMyTasks() {
    isLoading.value = true
    error.value = null

    try {
      tasks.value = await tasksApi.getMyTasks()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки задач'
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(task: CreateTaskDto) {
    isLoading.value = true
    error.value = null

    try {
      const newTask = await tasksApi.create(task)
      tasks.value.push(newTask)
      return newTask
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка создания задачи'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(id: number, task: UpdateTaskDto) {
    isLoading.value = true
    error.value = null

    try {
      const updatedTask = await tasksApi.update(id, task)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка обновления задачи'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function deleteTask(id: number) {
    isLoading.value = true
    error.value = null

    try {
      await tasksApi.delete(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка удаления задачи'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function filterByStatus(status: TaskStatus) {
    return tasks.value.filter(t => t.status === status)
  }

  return {
    tasks,
    currentTask,
    isLoading,
    error,
    newTasks,
    inProgressTasks,
    completedTasks,
    fetchAll,
    fetchMyTasks,
    createTask,
    updateTask,
    deleteTask,
    filterByStatus,
  }
})
