import { useApi } from '@/composables/api'
const { api, authApi } = useApi()

export default {
  // 建立新文章 (需要權限)
  createArticle(fd) {
    return authApi.post('/article', fd)
  },
  // 取得所有文章清單 (公開)
  getPublishedArticles() {
    return api.get('/article')
  },
  // 取得所有文章清單 (非公開)
  getAllArticles() {
    return authApi.get('/article/all')
  },
  // 取得特定文章分類 (公開)
  aboutSpieces() {
    return api.get('/article/aboutSpecies')
  },
  // 取得單篇文章詳細內容 (公開)
  getByArticleId(id) {
    return api.get(`/article/${id}`)
  },
  removeArticle(id){
    return authApi.delete(`/article/${id}`)
  },
  editArticle(id,fd){
    return authApi.patch(`/article/${id}`,fd)
  }
}
