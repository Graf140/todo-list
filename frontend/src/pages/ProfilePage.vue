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
            <span class="text-sm text-gray-600">
              {{ authStore.user?.name }} ({{ roleLabels[authStore.user?.role || 'client'] }})
            </span>
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
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Левая колонка - Информация о пользователе -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow p-6">
              <div class="text-center">
                <div class="relative inline-block">
                  <img
                    :src="avatarUrl"
                    alt="Аватар"
                    class="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200"
                  />
                  <button
                    @click="showAvatarModal = true"
                    class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"
                    title="Изменить аватар"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </div>
                <h2 class="mt-4 text-xl font-bold text-gray-900">{{ authStore.user?.name }}</h2>
                <p class="text-gray-500">{{ authStore.user?.email }}</p>
                <span
                  :class="{
                    'bg-blue-100 text-blue-800': authStore.user?.role === 'client',
                    'bg-green-100 text-green-800': authStore.user?.role === 'executor',
                    'bg-purple-100 text-purple-800': authStore.user?.role === 'admin',
                  }"
                  class="mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full"
                >
                  {{ roleLabels[authStore.user?.role || 'client'] }}
                </span>
              </div>

              <div class="mt-6 pt-6 border-t">
                <h3 class="text-sm font-medium text-gray-700 mb-3">Редактировать профиль</h3>
                <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                    <input
                      v-model="editName"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">URL аватара</label>
                    <input
                      v-model="editAvatar"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    :disabled="isUpdating"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {{ isUpdating ? 'Сохранение...' : 'Сохранить' }}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <!-- Правая колонка - Задачи -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow">
              <div class="px-6 py-4 border-b">
                <h2 class="text-lg font-bold text-gray-900">
                  {{ profileTitle }}
                </h2>
              </div>
              <div class="p-6">
                <div v-if="tasksStore.isLoading" class="text-center py-8">
                  <span class="text-gray-500">Загрузка...</span>
                </div>

                <div v-else-if="displayedTasks.length === 0" class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <p class="mt-2 text-gray-500">{{ emptyMessage }}</p>
                </div>

                <div v-else class="space-y-4">
                  <div
                    v-for="task in displayedTasks"
                    :key="task.id"
                    class="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div class="flex justify-between items-start">
                      <div class="flex-1">
                        <h3 class="text-lg font-medium text-gray-900">{{ task.title }}</h3>
                        <p class="mt-1 text-gray-600 text-sm">{{ task.description }}</p>
                        <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span>Создана: {{ formatDate(task.created_at) }}</span>
                          <span v-if="authStore.isClient && task.executor_id">
                            Исполнитель: ID {{ task.executor_id }}
                          </span>
                          <span v-if="authStore.isAdmin && task.client_id">
                            Заказчик: ID {{ task.client_id }}
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
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Модальное окно для выбора аватара -->
    <div
      v-if="showAvatarModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showAvatarModal = false"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-lg font-bold mb-4">Изменить аватар</h3>
        <p class="text-sm text-gray-600 mb-4">
          Введите URL изображения для аватара. Можно использовать ссылки на изображения из интернета.
        </p>
        <div class="flex gap-2 mb-4">
          <input
            v-model="editAvatar"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="showAvatarModal = false"
            class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Отмена
          </button>
          <button
            type="button"
            @click="handleUpdateAvatar"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Применить
          </button>
        </div>
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

const statusLabels: Record<TaskStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Выполнено',
}

const isUpdating = ref(false)
const showAvatarModal = ref(false)
const editName = ref('')
const editAvatar = ref('')

const avatarUrl = computed(() => {
  return authStore.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || 'User')}&size=128&background=random`
})

// Заголовок в зависимости от роли
const profileTitle = computed(() => {
  if (authStore.isExecutor.value) return 'Мои задачи на выполнение'
  if (authStore.isClient.value) return 'Мои задачи (заказанные)'
  if (authStore.isAdmin.value) return 'Все задачи (администрирование)'
  return 'Задачи'
})

// Сообщение когда задач нет
const emptyMessage = computed(() => {
  if (authStore.isExecutor.value) return 'Нет назначенных задач'
  if (authStore.isClient.value) return 'У вас пока нет задач'
  if (authStore.isAdmin.value) return 'Нет задач для отображения'
  return 'Задач нет'
})

// Задачи для отображения в зависимости от роли
const displayedTasks = computed(() => {
  if (authStore.isExecutor.value) {
    // Исполнитель видит задачи, которые назначены на него
    return tasksStore.tasks.filter(t => t.executor_id === authStore.user?.id)
  } else if (authStore.isClient.value) {
    // Заказчик видит задачи, которые он создал
    return tasksStore.tasks.filter(t => t.client_id === authStore.user?.id)
  } else if (authStore.isAdmin.value) {
    // Админ видит все задачи
    return tasksStore.tasks
  }
  return []
})

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

async function handleUpdateProfile() {
  isUpdating.value = true
  try {
    await authStore.updateProfile({
      name: editName.value,
      avatar: editAvatar.value || undefined,
    })
    showAvatarModal.value = false
  } finally {
    isUpdating.value = false
  }
}

async function handleUpdateAvatar() {
  await handleUpdateProfile()
  showAvatarModal.value = false
}

async function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  editName.value = authStore.user?.name || ''
  editAvatar.value = authStore.user?.avatar || ''

  // Загружаем задачи в зависимости от роли
  if (authStore.isAdmin.value || authStore.isExecutor.value) {
    await tasksStore.fetchAll()
  } else {
    await tasksStore.fetchMyTasks()
  }
})
</script>
