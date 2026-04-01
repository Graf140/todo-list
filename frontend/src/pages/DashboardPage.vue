<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Навигация -->
    <nav class="bg-white shadow-sm border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center gap-2">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              <span class="text-xl font-bold text-gray-900">TodoList Pro</span>
            </div>
            <template v-if="authStore.isAuthenticated">
              <div class="ml-8 flex space-x-4">
                <button
                  @click="activeTab = 'myTasks'"
                  :class="activeTab === 'myTasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'"
                  class="px-3 py-2 text-sm font-medium hover:text-gray-900"
                >
                  Мои задачи
                </button>
                <button
                  v-if="authStore.isExecutor"
                  @click="activeTab = 'assignedTasks'"
                  :class="activeTab === 'assignedTasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'"
                  class="px-3 py-2 text-sm font-medium hover:text-gray-900"
                >
                  Задачи на исполнении
                </button>
                <button
                  v-if="authStore.isAdmin"
                  @click="activeTab = 'allTasks'"
                  :class="activeTab === 'allTasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'"
                  class="px-3 py-2 text-sm font-medium hover:text-gray-900"
                >
                  Все задачи
                </button>
              </div>
            </template>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <router-link
                to="/profile"
                class="text-sm text-gray-600 hover:text-gray-800"
              >
                {{ authStore.user?.name }}
                <span class="text-xs text-gray-400">({{ roleLabels[authStore.user?.role || 'client'] }})</span>
              </router-link>
              <button
                @click="handleLogout"
                class="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Выйти
              </button>
            </template>
            <template v-else>
              <router-link
                to="/login"
                class="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Войти
              </router-link>
              <router-link
                to="/register"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Регистрация
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Лендинг для неавторизованных -->
    <template v-if="!authStore.isAuthenticated">
      <!-- Hero секция -->
      <section class="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div class="max-w-7xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Управляйте задачами
            <span class="text-blue-600">эффективно</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            TodoList Pro — это современная платформа для управления задачами, где заказчики могут создавать задачи,
            а администраторы распределяют их между профессиональными исполнителями
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/register"
              class="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Начать бесплатно
            </router-link>
            <a
              href="#features"
              class="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Узнать больше
            </a>
          </div>
        </div>
      </section>

      <!-- Статистика -->
      <section class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div class="text-gray-600">Довольных клиентов</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-green-600 mb-2">5000+</div>
              <div class="text-gray-600">Выполненных задач</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div class="text-gray-600">Профессионалов</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div class="text-gray-600">Успешных проектов</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Преимущества -->
      <section id="features" class="py-20 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">Почему выбирают нас</h2>
            <p class="text-xl text-gray-600">Все инструменты для эффективного управления задачами в одном месте</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Быстрое выполнение</h3>
              <p class="text-gray-600">Задачи распределяются между исполнителями автоматически, что гарантирует минимальное время ожидания</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Контроль качества</h3>
              <p class="text-gray-600">Администраторы следят за качеством выполнения и своевременно решают любые вопросы</p>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">Прозрачность</h3>
              <p class="text-gray-600">Отслеживайте статус каждой задачи в реальном времени от создания до завершения</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Как это работает -->
      <section id="how-it-works" class="py-20 px-4 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">Как это работает</h2>
            <p class="text-xl text-gray-600">Простой процесс от создания до выполнения</p>
          </div>
          <div class="grid md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Создайте задачу</h3>
              <p class="text-gray-600">Опишите вашу задачу, укажите требования и сроки</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Модерация</h3>
              <p class="text-gray-600">Администратор проверит и уточнит детали задачи</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Назначение</h3>
              <p class="text-gray-600">Задача будет назначена подходящему исполнителю</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">Готово!</h3>
              <p class="text-gray-600">Исполнитель выполнит задачу в срок</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA секция -->
      <section class="py-20 px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Готовы начать?</h2>
            <p class="text-xl text-blue-100 mb-8">Зарегистрируйтесь и создайте свою первую задачу</p>
            <router-link
              to="/register"
              class="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
            >
              Зарегистрироваться
            </router-link>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-12 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="grid md:grid-cols-4 gap-8">
            <div>
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                <span class="text-lg font-bold">TodoList Pro</span>
              </div>
              <p class="text-gray-400 text-sm">Современная платформа для управления задачами</p>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Компания</h4>
              <ul class="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" class="hover:text-white">Преимущества</a></li>
                <li><a href="#how-it-works" class="hover:text-white">Как это работает</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Поддержка</h4>
              <ul class="space-y-2 text-gray-400 text-sm">
                <li><a href="#" class="hover:text-white">Помощь</a></li>
                <li><a href="#" class="hover:text-white">Контакты</a></li>
                <li><a href="#" class="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold mb-4">Контакты</h4>
              <ul class="space-y-2 text-gray-400 text-sm">
                <li>support@todolist.pro</li>
                <li>+7 (999) 000-00-00</li>
              </ul>
            </div>
          </div>
          <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 TodoList Pro. Все права защищены.
          </div>
        </div>
      </footer>
    </template>

    <!-- Авторизованные пользователи -->
    <template v-else>
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <!-- ЗАГОЛОВОК И КНОПКА СОЗДАНИЯ (только для клиента) -->
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">
              {{ pageTitle }}
            </h1>
            <button
              v-if="authStore.isClient"
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
                      <span v-else class="text-orange-500 font-medium">| Исполнитель не назначен</span>
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
    </template>

    <!-- Модальное окно создания задачи (только для клиента) -->
    <div
      v-if="showCreateModal && authStore.isClient"
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

    <!-- Модальное окно назначения исполнителя (только для админа) -->
    <div
      v-if="showAssignModal && authStore.isAdmin"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showAssignModal = false"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h2 class="text-xl font-bold mb-4">Назначить исполнителя</h2>
        <p class="text-gray-600 mb-4">Задача: {{ selectedTask?.title }}</p>
        <form @submit.prevent="handleAssignExecutor">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Исполнитель</label>
            <select
              v-model="selectedExecutorId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Выберите исполнителя</option>
              <option
                v-for="executor in executors"
                :key="executor.id"
                :value="executor.id"
              >
                {{ executor.name }} ({{ executor.email }})
              </option>
            </select>
          </div>
          <div v-if="tasksStore.error" class="text-red-500 text-sm mb-4">
            {{ tasksStore.error }}
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showAssignModal = false"
              class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="tasksStore.isLoading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ tasksStore.isLoading ? 'Назначение...' : 'Назначить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import type { TaskStatus, Task } from '@/types'

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
const activeTab = ref<'myTasks' | 'assignedTasks' | 'allTasks'>('myTasks')

const statusLabels: Record<TaskStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Выполнено',
}

const showCreateModal = ref(false)
const showAssignModal = ref(false)
const selectedTask = ref<Task | null>(null)
const selectedExecutorId = ref<number | null>(null)
const newTask = ref({ title: '', description: '' })

// Заголовок страницы в зависимости от роли и вкладки
const pageTitle = computed(() => {
  if (!authStore.isAuthenticated) return ''

  if (authStore.isAdmin) {
    return activeTab.value === 'allTasks' ? 'Все задачи (управление)' : 'Мои задачи'
  }

  if (authStore.isExecutor) {
    if (activeTab.value === 'assignedTasks') {
      return 'Задачи на исполнении'
    }
    return 'Мои задачи (как заказчик)'
  }

  // Клиент
  return 'Мои задачи'
})

// Сообщение когда задач нет
const emptyMessage = computed(() => {
  if (authStore.isAdmin) {
    if (activeTab.value === 'allTasks') return 'Нет задач для отображения'
    return 'У вас нет задач как у заказчика'
  }

  if (authStore.isExecutor) {
    if (activeTab.value === 'assignedTasks') {
      return 'Нет назначенных задач на исполнении'
    }
    return 'У вас нет задач как у заказчика'
  }

  return 'У вас пока нет задач'
})

// Фильтрация задач по роли, вкладке и статусу
const filteredTasks = computed(() => {
  let tasks = tasksStore.tasks

  if (authStore.isAdmin) {
    // Админ видит все задачи на вкладке "Все задачи"
    if (activeTab.value !== 'allTasks') {
      // На вкладке "Мои задачи" - задачи которые админ создал как заказчик
      tasks = tasks.filter(t => t.client_id === authStore.user?.id)
    }
  } else if (authStore.isExecutor) {
    if (activeTab.value === 'assignedTasks') {
      // Исполнитель видит только назначенные на него задачи
      tasks = tasks.filter(t => t.executor_id === authStore.user?.id)
    } else {
      // На вкладке "Мои задачи" - задачи которые исполнитель создал как заказчик
      tasks = tasks.filter(t => t.client_id === authStore.user?.id)
    }
  } else if (authStore.isClient) {
    // Клиент видит только свои задачи (которые создал)
    tasks = tasks.filter(t => t.client_id === authStore.user?.id)
  }

  // Фильтр по статусу
  if (selectedFilter.value !== 'all') {
    tasks = tasks.filter(t => t.status === selectedFilter.value)
  }

  return tasks
})

// Получение исполнителей для админа
const executors = computed(() => authStore.executors)

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
    // ошибка уже в tasksStore.error.value
  }
}

async function handleAssignExecutor() {
  if (!selectedTask.value || !selectedExecutorId.value) return

  try {
    await tasksStore.updateTask(selectedTask.value.id, {
      executor_id: selectedExecutorId.value,
      status: 'in_progress',
    })
    showAssignModal.value = false
    selectedTask.value = null
    selectedExecutorId.value = null
  } catch (e) {
    // ошибка уже в tasksStore.error.value
  }
}

function openAssignModal(task: Task) {
  selectedTask.value = task
  showAssignModal.value = true
}

async function handleLogout() {
  authStore.logout()
  router.push('/')
}

// Загрузка задач при изменении вкладки или фильтра
async function loadTasks() {
  if (authStore.isAdmin) {
    // Админ загружает все задачи
    await tasksStore.fetchAll()
  } else if (authStore.isExecutor) {
    if (activeTab.value === 'assignedTasks') {
      // Исполнитель загружает назначенные задачи
      await tasksStore.fetchAll()
    } else {
      // Исполнитель как заказчик загружает свои задачи
      await tasksStore.fetchMyTasks()
    }
  } else {
    // Клиент загружает свои задачи
    await tasksStore.fetchMyTasks()
  }
}

watch(activeTab, () => {
  loadTasks()
})

watch(selectedFilter, () => {
  loadTasks()
})

onMounted(async () => {
  // Инициализация авторизации при загрузке
  if (!authStore.user) {
    await authStore.initializeAuth()
  }

  // Загрузка исполнителей для админа
  if (authStore.isAdmin) {
    await authStore.loadExecutors()
  }

  // Загрузка задач
  await loadTasks()
})

// Экспортируем функцию для открытия модального окна назначения
defineExpose({ openAssignModal })
</script>
