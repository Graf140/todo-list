<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold text-center mb-8 text-gray-800">Регистрация</h1>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Имя
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Иван Иванов"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Пароль
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label for="passwordConfirm" class="block text-sm font-medium text-gray-700 mb-2">
            Подтвердите пароль
          </label>
          <input
            id="passwordConfirm"
            v-model="passwordConfirm"
            type="password"
            required
            minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div v-if="passwordMismatch" class="text-red-500 text-sm">
          Пароли не совпадают
        </div>

        <div class="flex items-center">
          <input
            id="isExecutor"
            v-model="isExecutor"
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="isExecutor" class="ml-2 block text-sm text-gray-700">
            Я исполнитель (хочу выполнять задачи)
          </label>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isLoading || passwordMismatch"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        Уже есть аккаунт?
        <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium">
          Войти
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isExecutor = ref(false)

const isLoading = ref(false)
const error = ref<string | null>(null)

const passwordMismatch = computed(() => {
  return password.value && passwordConfirm.value && password.value !== passwordConfirm.value
})

async function handleSubmit() {
  if (passwordMismatch.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      role: isExecutor.value ? 'executor' : 'client',
    })
    router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Ошибка регистрации'
  } finally {
    isLoading.value = false
  }
}
</script>
