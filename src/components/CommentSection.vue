<template>
  <div class="comment-section">
    <div class="d-flex align-center mb-6">
      <v-icon color="primary" class="mr-2">mdi-message-reply-text</v-icon>
      <span class="text-h5 font-weight-bold">討論與交流 ({{ comments.length }})</span>
    </div>

    <v-card v-if="user.isLogin" flat border class="rounded-lg pa-4 mb-10 bg-grey-lighten-5">
      <div class="d-flex align-center mb-4">
        <v-avatar :color="getUserStyle(user._id).color" size="32" class="mr-3">
          <v-icon :icon="getUserStyle(user._id).icon" color="white" size="18" />
        </v-avatar>
        <span class="font-weight-bold">{{ user.account }}</span>
      </div>
      <!-- 發表留言區 -->
      <v-textarea
        v-model="newComment"
        placeholder="對於這篇紀錄，你有什麼想法或建議嗎？(限500字)"
        variant="solo"
        flat
        bg-color="white"
        rows="3"
        auto-grow
        hide-details
        class="mb-4 rounded-lg border"
      />

      <div class="d-flex justify-end">
        <v-btn
          color="primary"
          elevation="0"
          :disabled="!newComment.trim()"
          :loading="loading"
          rounded="pill"
          class="px-8"
          @click="submitComment"
        >
          發表留言
        </v-btn>
      </div>
    </v-card>

    <v-alert v-else type="info" variant="tonal" rounded="lg" class="mb-10 py-4">
      想要參與討論嗎？請先
      <v-btn variant="text" color="primary" class="px-1" to="/login">登入</v-btn> 帳號。
    </v-alert>
    <!-- 網友留言 -->
    <div v-if="comments.length > 0" class="comment-list">
      <v-fade-transition group>
        <div v-for="c in comments" :key="c._id" class="comment-item mb-6">
          <div class="d-flex">
            <v-avatar :color="getUserStyle(c.user._id).color" size="48" class="mr-4 elevation-1">
              <v-icon :icon="getUserStyle(c.user._id).icon" color="white" />
            </v-avatar>

            <div class="flex-grow-1">
              <div class="d-flex align-center">
                <span class="text-subtitle-1 font-weight-bold">{{ c.user.account }}</span>
                <v-spacer />
                <span class="text-caption text-grey">{{
                  new Date(c.createdAt).toLocaleString()
                }}</span>

                <v-btn
                  v-if="user._id === c.user._id || user.role === 'admin'"
                  icon="mdi-delete-outline"
                  size="x-small"
                  variant="text"
                  color="grey-lighten-1"
                  class="ml-2"
                  @click="removeComment(c._id)"
                />
              </div>

              <v-sheet
                color="grey-lighten-4"
                class="pa-4 mt-2 rounded-lg text-body-1"
                style="white-space: pre-wrap"
              >
                {{ c.content }}
              </v-sheet>
            </div>
          </div>
        </div>
      </v-fade-transition>
    </div>

    <div v-else class="text-center py-10 text-grey-lighten-1">
      <v-icon size="64" class="mb-4">mdi-comment-outline</v-icon>
      <p>蟲聲寂寂，至春雷而唧唧...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSnackbarStore } from '@/stores/snackbar'
import serviceComment from '@/services/comment.js'

const props = defineProps({ target: String }) // 由外部元件(文章內容頁)傳進來的props，傳的是該文章在資料庫的_id。
const user = useUserStore()
const snackbar = useSnackbarStore()
const comments = ref([])
const newComment = ref('')
const loading = ref(false)

const getUserStyle = (userId) => {
  if (!userId) return { color: 'grey', icon: 'mdi-account' }
  const colors = ['#4DB6AC', '#7986CB', '#A1887F', '#90A4AE', '#FF8A65', '#4DD0E1', '#81C784']
  const icons = [
    'mdi-bug',
    'mdi-leaf',
    'mdi-tree',
    'mdi-flower',
    'mdi-clover',
    'mdi-water',
    'mdi-shimmer'
  ]
  const index = userId.toString().charCodeAt(userId.length - 1)
  return {
    color: colors[index % colors.length],
    icon: icons[index % icons.length]
  }
}

const fetchComments = async () => {
  if (!props.target) return
  try {
    const { data } = await serviceComment.getCommentByTarget(props.target)
    comments.value = data.result
  } catch (error) {
    console.error(error)
  }
}

const submitComment = async () => {
  if (!newComment.value.trim()) return // 防止留言只是一堆空格時也被視為一則留言被傳進後端
  loading.value = true
  try {
    const { data } = await serviceComment.createComment({
      target: props.target,
      content: newComment.value
    })
    comments.value.unshift(data.result)
    newComment.value = ''
    snackbar.showMessage('留言成功')
  } catch (error) {
    snackbar.showMessage('留言失敗')
  } finally {
    loading.value = false
  }
}

const removeComment = async (id) => {
  if (!confirm('確定要刪除這則留言嗎？')) return
  try {
    await serviceComment.removeComment(id)
    comments.value = comments.value.filter((c) => c._id !== id)
  } catch (error) {
    snackbar.showMessage('刪除失敗')
  }
}

onMounted(fetchComments)
watch(() => props.target, fetchComments)
</script>
