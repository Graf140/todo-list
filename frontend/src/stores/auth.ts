import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import { usersApi } from '@/api/users'
import type { User, LoginCredentials, RegisterCredentials, UserRole } from '@/types'

// Суперпользователь по умолчанию (для демо-режима)
const DEFAULT_ADMIN = {
  id: 1,
  email: 'admin@todo.local',
  password: 'admin',
  name: 'Администратор',
  role: 'admin' as UserRole,
}

// Инициализация суперпользователя при первом запуске (для демо-режима)
function initializeAdmin() {
  const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
  const adminExists = storedUsers.some((u: User & { password: string }) => u.email === DEFAULT_ADMIN.email)
  
  if (!adminExists) {
    storedUsers.push(DEFAULT_ADMIN)
    localStorage.setItem('users', JSON.stringify(storedUsers))
    console.log('✅ Суперпользователь создан (демо-режим):')
    console.log('   Email: admin@todo.local')
    console.log('   Пароль: admin')
  }
}

// Вызываем при загрузке модуля
initializeAdmin()

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const executorsList = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isExecutor = computed(() => user.value?.role === 'executor')
  const isClient = computed(() => user.value?.role === 'client')

  // Получить всех исполнителей (из API или localStorage для демо)
  const executors = computed(() => {
    if (executorsList.value.length > 0) {
      return executorsList.value
    }
    // Демо-режим
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    return storedUsers.filter((u: User) => u.role === 'executor')
  })

  async function loadExecutors() {
    try {
      executorsList.value = await usersApi.getExecutors()
    } catch (e) {
      console.log('Не удалось загрузить исполнителей из API, используем демо-режим')
    }
  }

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null

    try {
      // Пытаемся войти через API
      const tokens = await authApi.login(credentials)
      localStorage.setItem('access_token', tokens.access_token)
      localStorage.setItem('refresh_token', tokens.refresh_token)

      await fetchUser()
      await loadExecutors()
    } catch (e) {
      // Если API недоступно - используем демо-режим через localStorage
      console.log('API недоступно, используем демо-режим')
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = storedUsers.find((u: User & { password: string }) =>
        u.email === credentials.email && u.password === credentials.password
      )

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser
        user.value = userWithoutPassword
        localStorage.setItem('current_user', JSON.stringify(userWithoutPassword))
        localStorage.setItem('access_token', 'demo-token')
        await loadExecutors()
      } else {
        error.value = 'Неверный email или пароль'
        throw new Error('Неверный email или пароль')
      }
    } finally {
      isLoading.value = false
    }
  }

  async function register(credentials: RegisterCredentials) {
    isLoading.value = true
    error.value = null

    try {
      // Пытаемся зарегистрировать через API
      const tokens = await authApi.register(credentials)
      localStorage.setItem('access_token', tokens.access_token)
      localStorage.setItem('refresh_token', tokens.refresh_token)

      await fetchUser()
      await loadExecutors()
    } catch (e) {
      // Если API недоступно - используем демо-режим через localStorage
      console.log('API недоступно, используем демо-режим')

      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')

      // Проверяем, есть ли уже пользователь с таким email
      const existingUser = storedUsers.find((u: User) => u.email === credentials.email)
      if (existingUser) {
        error.value = 'Пользователь с таким email уже существует'
        throw new Error('Пользователь с таким email уже существует')
      }

      // Создаём нового пользователя
      const newUser: User & { password: string } = {
        id: Date.now(), // генерируем уникальный ID
        name: credentials.name,
        email: credentials.email,
        role: credentials.role,
        password: credentials.password,
      }

      storedUsers.push(newUser)
      localStorage.setItem('users', JSON.stringify(storedUsers))

      // Автоматически входим после регистрации
      const { password, ...userWithoutPassword } = newUser
      user.value = userWithoutPassword
      localStorage.setItem('current_user', JSON.stringify(userWithoutPassword))
      localStorage.setItem('access_token', 'demo-token')
      await loadExecutors()
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser() {
    try {
      user.value = await authApi.getMe()
    } catch (e) {
      // Если API недоступно - пробуем загрузить из localStorage
      const storedUser = localStorage.getItem('current_user')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      } else {
        logout()
      }
    }
  }

  function logout() {
    user.value = null
    executorsList.value = []
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('current_user')
  }

  async function initializeAuth() {
    const token = localStorage.getItem('access_token')
    if (token) {
      await fetchUser()
      await loadExecutors()
    }
  }

  async function updateProfile(updates: { name?: string; avatar?: string }) {
    if (!user.value) return

    try {
      // Пытаемся обновить через API
      const updatedUser = await usersApi.update(user.value.id, updates)
      user.value = updatedUser
      localStorage.setItem('current_user', JSON.stringify(updatedUser))
    } catch (e) {
      // Демо-режим
      const updatedUser = { ...user.value, ...updates }
      user.value = updatedUser
      localStorage.setItem('current_user', JSON.stringify(updatedUser))

      // Также обновляем в массиве users
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const index = storedUsers.findIndex((u: User) => u.id === user.value?.id)
      if (index !== -1) {
        storedUsers[index] = { ...storedUsers[index], ...updates }
        localStorage.setItem('users', JSON.stringify(storedUsers))
      }
    }
  }

  return {
    user,
    executors,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isExecutor,
    isClient,
    login,
    register,
    logout,
    fetchUser,
    initializeAuth,
    updateProfile,
    loadExecutors,
  }
})
