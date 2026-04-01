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
        <button
          @click="router.back()"
          class="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Назад
        </button>

        <div v-if="isLoading" class="text-center py-8 bg-white rounded-lg shadow">
          <span class="text-gray-500">Загрузка...</span>
        </div>

        <div v-else-if="!task" class="text-center py-8 bg-white rounded-lg shadow">
          <p class="text-gray-500">Задача не найдена</p>
        </div>

        <div v-else class="bg-white rounded-lg shadow p-6">
          <!-- Заголовок и статус -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ task.title }}</h1>
              <p class="text-sm text-gray-500 mt-1">
                Создана: {{ formatDate(task.created_at) }}
              </p>
            </div>
            <span
              :class="{
                'bg-gray-100 text-gray-800': task.status === 'new',
                'bg-yellow-100 text-yellow-800': task.status === 'in_progress',
                'bg-green-100 text-green-800': task.status === 'completed',
              }"
              class="px-3 py-1 text-sm font-semibold rounded-full"
            >
              {{ statusLabels[task.status] }}
            </span>
          </div>

          <!-- Описание -->
          <div class="border-t border-b py-4 my-4">
            <p class="text-gray-700 whitespace-pre-wrap">{{ task.description }}</p>
          </div>

          <!-- Информация о задаче -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500">Заказчик</p>
              <p class="font-medium">ID: {{ task.client_id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Исполнитель</p>
              <p class="font-medium">
                {{ task.executor_id ? `ID: ${task.executor_id}` : 'Не назначен' }}
              </p>
            </div>
          </div>

          <!-- ДЕЙСТВИЯ АДМИНИСТРАТОРА -->
          <div v-if="authStore.isAdmin" class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-blue-900 mb-3">
                Управление задачей (Администратор)
              </h3>
              
              <!-- Назначение исполнителя -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Назначить исполнителя
                </label>
                <div class="flex gap-2">
                  <select
                    v-model="selectedExecutorId"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Не назначен</option>
                    <option
                      v-for="executor in authStore.executors"
                      :key="executor.id"
                      :value="executor.id"
                    >
                      {{ executor.name }} ({{ executor.email }})
                    </option>
                  </select>
                  <button
                    @click="assignExecutor"
                    :disabled="isAssigning"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {{ isAssigning ? 'Назначение...' : 'Назначить' }}
                  </button>
                </div>
              </div>

              <!-- Изменение статуса -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Изменить статус
                </label>
                <select
                  v-model="selectedStatus"
                  @change="updateStatus"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="new">Новая</option>
                  <option value="in_progress">В работе</option>
                  <option value="completed">Выполнено</option>
                </select>
              </div>
            </div>
          </div>

          <!-- ДЕЙСТВИЯ ИСПОЛНИТЕЛЯ -->
          <div v-else-if="authStore.isExecutor" class="space-y-4">
            <div v-if="task.executor_id === authStore.user?.id" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-green-900 mb-3">
                ✓ Эта задача назначена вам
              </h3>
              <p class="text-sm text-gray-600 mb-4">
                Измените статус задачи, когда начнёте работу или завершите её:
              </p>
              <div class="flex gap-2">
                <button
                  @click="updateTaskStatus('in_progress')"
                  :disabled="task.status === 'in_progress'"
                  class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ task.status === 'in_progress' ? 'В работе' : 'Взять в работу' }}
                </button>
                <button
                  @click="updateTaskStatus('completed')"
                  :disabled="task.status === 'completed'"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ task.status === 'completed' ? 'Выполнено' : 'Выполнить' }}
                </button>
              </div>
            </div>
            <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p class="text-gray-600">
                Эта задача назначена другому исполнителю (ID: {{ task.executor_id }})
              </p>
              <p class="text-sm text-gray-500 mt-2">
                Вы можете только просмотреть информацию о задаче.
              </p>
            </div>
          </div>

          <!-- ДЕЙСТВИЯ КЛИЕНТА (ЗАКАЗЧИКА) -->
          <div v-else-if="authStore.isClient" class="space-y-4">
            <div v-if="task.client_id === authStore.user?.id" class="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 class="text-lg font-medium text-purple-900 mb-3">
                Ваша задача
              </h3>
              
              <!-- Статус задачи -->
              <div class="mb-4">
                <p class="text-sm text-gray-600">
                  Статус: <span class="font-medium">{{ statusLabels[task.status] }}</span>
                </p>
                <p v-if="task.executor_id" class="text-sm text-gray-600">
                  Исполнитель: <span class="font-medium">ID {{ task.executor_id }}</span>
                </p>
                <p v-else class="text-sm text-orange-600">
                  Исполнитель ещё не назначен. Ожидайте назначения администратором.
                </p>
              </div>

              <!-- Удаление задачи -->
              <button
                v-if="task.status === 'new'"
                @click="deleteTask"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Удалить задачу
              </button>
            </div>
            <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p class="text-gray-600">
                Это не ваша задача. Вы можете только просмотреть информацию.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import type { TaskStatus } from '@/types'

const router = useRouter()
const route = useRoute()
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

const isLoading = ref(true)
const isAssigning = ref(false)
const selectedExecutorId = ref<number | string>('')
const selectedStatus = ref<TaskStatus>('new')

const task = computed(() => tasksStore.tasks.find(t => t.id === Number(route.params.id)))

// Обновляем выбранный ID исполнителя при загрузке задачи
watch(task, (newTask) => {
  if (newTask?.executor_id) {
    selectedExecutorId.value = newTask.executor_id
  } else {
    selectedExecutorId.value = ''
  }
}, { immediate: true })

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function assignExecutor() {
  if (!task.value) return

  isAssigning.value = true
  try {
    const executorId = selectedExecutorId.value === '' ? null : Number(selectedExecutorId.value)
    await tasksStore.updateTask(task.value.id, { executor_id: executorId || undefined })
  } finally {
    isAssigning.value = false
  }
}

async function updateStatus() {
  if (!task.value) return
  await tasksStore.updateTask(task.value.id, { status: selectedStatus.value })
}

async function updateTaskStatus(status: TaskStatus) {
  if (!task.value) return
  await tasksStore.updateTask(task.value.id, { status })
}

async function deleteTask() {
  if (!task.value) return
  if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
    await tasksStore.deleteTask(task.value.id)
    router.push('/tasks')
  }
}

async function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  isLoading.value = true
  if (authStore.isAdmin || authStore.isExecutor) {
    await tasksStore.fetchAll()
  } else {
    await tasksStore.fetchMyTasks()
  }
  isLoading.value = false
})
</script>
