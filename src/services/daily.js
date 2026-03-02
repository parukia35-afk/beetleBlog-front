import { useApi } from '../composables/api.js'
const { api, authApi } = useApi()

export default{
  fetchDaily(){
    return api.get('/daily/')
  },
  createDaily(fd){
    return authApi.post('/daily/',fd)
  },
  updateDaily(id,fd){
    return authApi.patch(`/daily/${id}`,fd)
  },
  removeDaily(id){
    return authApi.delete(`/daily/${id}`)
  }
}