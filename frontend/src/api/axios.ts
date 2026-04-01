import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_PREFIX = '/api/v1'

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${API_URL}${API_PREFIX}`,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return instance
}

export const api = createAxiosInstance()
