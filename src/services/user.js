import { useApi } from '@/composables/api'

const { api, authApi } = useApi()

export default {
  register(form) {
    return api.post('/user/register', form)
  },
  login(form) {
    return api.post('/user/login', form)
  },
  logout() {
    return authApi.delete('/user/logout')
  },
  syncCart(cart) {
    return authApi.patch('/user/cart', cart)
  }
}
