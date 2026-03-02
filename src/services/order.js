import { api, authApi } from '@/composables/api'

export default {
  createOrder(note) {
    return authApi.post('/order/', note)
  },
  getAllOrders() {
    return authApi.get('/order/')
  },
  updateStatus(id, newStatus) {
    return authApi.patch(`/order/${id}`, newStatus)
  },
  getMyOrders(id) {
    return authApi.get(`/order/${id}`)
  }
}
