import { useApi } from '../composables/api.js'
const { api, authApi } = useApi()

export default{
  createComment(form){
    return authApi.post('/comment',form)
  },
  getCommentByTarget(target){
    return api.get(`/comment/${target}`)
  },
  removeComment(id){
    return authApi.delete(`/comment/${id}`)
  }
}