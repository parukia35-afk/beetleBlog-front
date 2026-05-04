import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useSnackbarStore } from '@/stores/snackbar'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

authApi.interceptors.request.use((config) => {
  const user = useUserStore()
  config.headers.Authorization = `Bearer ${user.token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const snackbar = useSnackbarStore()
    const errorMsg = err.response?.data?.message || '網路連線異常'

    snackbar.showMessage(errorMsg,'error')

    return Promise.reject(err)
  }
)

export const useApi = () => {
  return { api, authApi }
}
