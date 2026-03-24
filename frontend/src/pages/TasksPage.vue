<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Навигация -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-800">Todo List</h1>
            <div class="ml-8 flex space-x-4">
              <router-link
                to="/"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Главная
              </router-link>
              <router-link
                to="/tasks"
                class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                Задачи
              </router-link>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <router-link
              to="/profile"
              class="text-sm text-gray-600 hover:text-gray-800"
            >
              {{ authStore.user?.name }} ({{ roleLabels[authStore.user?.role || 'client'] }})
            </router-link>
            <button
              @click="handleLogout"
              class="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- ЗАГОЛОВОК И КНОПКА СОЗДАНИЯ (только для клиента) -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ pageTitle }}
          </h1>
          <button
            v-if="authStore.isClient.value"
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Создать задачу
          </button>
        </div>

        <!-- ФИЛЬТРЫ ПО СТАТУСУ -->
        <div class="mb-4 flex gap-2">
          <button
            v-for="status in statuses"
            :key="status"
            @click="selectedFilter = status"
            :class="{
              'bg-blue-600 text-white': selectedFilter === status,
              'bg-white text-gray-700 hover:bg-gray-50': selectedFilter !== status,
            }"
            class="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition-colors"
          >
            {{ status === 'all' ? 'Все' : statusLabels[status] }}
          </button>
        </div>

        <!-- СПИСОК ЗАДАЧ -->
        <div v-if="tasksStore.isLoading" class="text-center py-8 bg-white rounded-lg shadow">
          <span class="text-gray-500">Загрузка...</span>
        </div>

        <div v-else-if="filteredTasks.length === 0" class="text-center py-8 bg-white rounded-lg shadow">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="mt-2 text-gray-500">{{ emptyMessage }}</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ task.title }}</h3>
                <p class="mt-1 text-gray-600">{{ task.description }}</p>
                <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span>Создана: {{ formatDate(task.created_at) }}</span>
                  <span v-if="authStore.isClient && task.executor_id">
                    Исполнитель: ID {{ task.executor_id }}
                  </span>
                  <span v-if="authStore.isAdmin">
                    Заказчик: ID {{ task.client_id }}
                    <span v-if="task.executor_id">| Исполнитель: ID {{ task.executor_id }}</span>
                    <span v-else class="text-red-500 font-medium">| Исполнитель не назначен</span>
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="{
                    'bg-gray-100 text-gray-800': task.status === 'new',
                    'bg-yellow-100 text-yellow-800': task.status === 'in_progress',
                    'bg-green-100 text-green-800': task.status === 'completed',
                  }"
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                >
                  {{ statusLabels[task.status] }}
                </span>
                <router-link
                  :to="`/tasks/${task.id}`"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Подробнее →
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Модальное окно создания задачи (только для клиента) -->
    <div
      v-if="showCreateModal && authStore.isClient.value"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showCreateModal = false"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h2 class="text-xl font-bold mb-4">Новая задача</h2>
        <form @submit.prevent="handleCreateTask">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Заголовок</label>
            <input
              v-model="newTask.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Описание</label>
            <textarea
              v-model="newTask.description"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          <div v-if="tasksStore.error" class="text-red-500 text-sm mb-4">
            {{ tasksStore.error }}
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="tasksStore.isLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ tasksStore.isLoading ? 'Создание...' : 'Создать' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import type { TaskStatus } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()

const roleLabels: Record<string, string> = {
  client: 'Заказчик',
  executor: 'Исполнитель',
  admin: 'Администратор',
}

const statuses = ['all', 'new', 'in_progress', 'completed'] as const
const selectedFilter = ref<(typeof statuses)[number]>('all')

const statusLabels: Record<TaskStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Выполнено',
}

const showCreateModal = ref(false)
const newTask = ref({ title: '', description: '' })

// Заголовок страницы в зависимости от роли
const pageTitle = computed(() => {
  if (authStore.isAdmin.value) return 'Все задачи (управление)'
  if (authStore.isExecutor.value) return 'Мои задачи на выполнение'
  return 'Мои задачи'
})

// Сообщение когда задач нет
const emptyMessage = computed(() => {
  if (authStore.isAdmin.value) return 'Нет задач для отображения'
  if (authStore.isExecutor.value) return 'Нет назначенных задач'
  return 'У вас пока нет задач'
})

// Фильтрация задач по роли и статусу
const filteredTasks = computed(() => {
  let tasks = tasksStore.tasks

  // Фильтр по роли
  if (authStore.isExecutor.value) {
    // Исполнитель видит только назначенные на него задачи
    tasks = tasks.filter(t => t.executor_id === authStore.user?.id)
  } else if (authStore.isClient.value) {
    // Клиент видит только свои задачи
    tasks = tasks.filter(t => t.client_id === authStore.user?.id)
  }
  // Админ видит все задачи

  // Фильтр по статусу
  if (selectedFilter.value !== 'all') {
    tasks = tasks.filter(t => t.status === selectedFilter.value)
  }

  return tasks
})

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

async function handleCreateTask() {
  try {
    await tasksStore.createTask(newTask.value)
    showCreateModal.value = false
    newTask.value = { title: '', description: '' }
  } catch (e) {
    // ошибка уже в tasksStore.error
  }
}

async function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  if (authStore.isAdmin.value || authStore.isExecutor.value) {
    await tasksStore.fetchAll()
  } else {
    await tasksStore.fetchMyTasks()
  }
})
</script>
