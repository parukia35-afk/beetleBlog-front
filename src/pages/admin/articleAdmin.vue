<template>
  <v-container fluid class="pa-6">
    <v-card border flat class="rounded-lg mb-6">
      <v-card-title class="pa-6 d-flex align-center">
        <v-icon icon="mdi-notebook-edit-outline" color="primary" class="mr-2" />
        <span class="text-h5 font-weight-black">文章內容管理</span>
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          :disabled="showEditor"
          @click="initNewArticle"
          >新增文章</v-btn
        >
      </v-card-title>

      <v-data-table :headers="headers" :items="articles" :loading="loading">
        <template #[`item.display`]="{ item }">
          <v-chip :color="item.display ? 'success' : 'grey'" size="small">
            {{ item.display ? '公開' : '隱藏' }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-btn icon="mdi-pencil" variant="text" color="blue" @click="editArticle(item._id)" />
          <v-btn icon="mdi-delete" variant="text" color="red" @click="removeArticle(item._id)" />
        </template>
      </v-data-table>
    </v-card>

    <v-expand-transition>
      <v-card
        v-if="showEditor"
        border
        flat
        class="rounded-lg elevation-4 mb-10"
        id="editor-section"
      >
        <v-card-title class="bg-primary text-white pa-4 d-flex align-center">
          <v-icon icon="mdi-pen" class="mr-2" />
          {{ form._id ? '正在編輯文章' : '撰寫新文章' }}
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="closeEditor" />
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.title"
                  label="文章標題"
                  variant="outlined"
                  hide-details
                  class="mb-4"
                />
                <v-row>
                  <v-col cols="6">
                    <v-select
                      v-model="form.category"
                      :items="['飼育紀錄', '翻譯文章', '科普知識']"
                      label="文章屬性"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="form.isCompleted"
                      :items="['連載中', '已完成']"
                      label="進度狀態"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" md="6">
                <v-combobox
                  v-model="form.aboutSpecies"
                  label="物種分類標籤 (輸入後按 Enter)"
                  multiple
                  chips
                  closable-chips
                  variant="outlined"
                  placeholder="例如：長戟大兜、日本鋸鍬"
                  class="mb-4"
                />
                <v-file-input
                  v-model="form.image"
                  label="上傳封面圖"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  accept="image/*"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  label="前言 / 簡短描述"
                  variant="outlined"
                  rows="2"
                />
              </v-col>

              <v-col cols="12">
                <div class="text-subtitle-1 mb-2 font-weight-bold">正文內容</div>
                <div class="editor-wrapper border rounded-lg">
                  <TiptapEditor v-model="form.content" />
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-6">
          <v-switch v-model="form.display" label="公開文章" color="success" hide-details />
          <v-spacer />
          <v-btn variant="outlined" class="mr-4" @click="closeEditor">取消返回</v-btn>
          <v-btn color="primary" size="large" width="150" @click="submit">儲存並發布</v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import serviceArticle from '@/services/article'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { useSnackbarStore } from '@/stores/snackbar'

const snackbar = useSnackbarStore()

const loading = ref(false)
const showEditor = ref(false)

const articles = ref([])
const form = reactive({
  _id: '',
  title: '',
  category: '飼育紀錄',
  isCompleted: '連載中',
  aboutSpecies: [],
  description: '',
  content: '',
  image: null,
  display: true
})

const headers = [
  { title: '日期', key: 'createdAt', width: '150px', value: item => new Date(item.createdAt).toLocaleDateString() },
  { title: '分類', key: 'category', width: '120px' },
  { title: '標題', key: 'title' },
  { title: '狀態', key: 'display', align: 'center' },
  { title: '操作', key: 'actions', align: 'end', sortable: false }
]

// 讀取所有文章資料
const fetchArticles = async () => {
  try {
    loading.value = true
    const { data } = await serviceArticle.getAllArticles() 
    articles.value = data.result
  } catch (error) {
    console.error(error)
    snackbar.showMessage('無法載入文章列表', 'error')
  } finally {
    loading.value = false
  }
}

// 初始化新文章
const initNewArticle = () => {
  resetForm()
  showEditor.value = true
  scrollToEditor()
}

const resetForm = () => {
  form._id = ''
  form.title = ''
  form.category = '飼育紀錄'
  form.isCompleted = '連載中'
  form.aboutSpecies = []
  form.description = ''
  form.content = ''
  form.image = null
  form.display = true
}

// 編輯文章
const editArticle = async (id) => {
  try {
    const { data } = await serviceArticle.getByArticleId(id)
    console.log(data.result)
    Object.assign(form, data.result)
    // 封面圖特殊處理：編輯時先設為舊網址
    form.image = data.result.imageUrl 
    showEditor.value = true
    scrollToEditor()
  } catch (error) {
    snackbar.showMessage('讀取文章詳情失敗', 'error')
  }
}

const closeEditor = () => {
  showEditor.value = false
  resetForm()
}

const scrollToEditor = () => {
  nextTick(() => {
    document.getElementById('editor-section')?.scrollIntoView({ behavior: 'smooth' })
  })
}

const submit = async () => {
  if (!form.title) return snackbar.showMessage('標題忘記寫囉！', 'error')
  if (!form.content || form.content === '<p></p>') return snackbar.showMessage('內容至少寫一點吧！', 'error')

  const fd = new FormData()
  fd.append('title', form.title)
  fd.append('category', form.category)
  fd.append('isCompleted', form.isCompleted)
  fd.append('description', form.description)
  fd.append('content', form.content)
  fd.append('display', form.display)

  if (form.aboutSpecies && form.aboutSpecies.length > 0) {
    form.aboutSpecies.forEach(tag => fd.append('aboutSpecies', tag))
  }

  // 封面圖處理
  if (form.image && typeof form.image !== 'string') {
    fd.append('image', form.image)
  }

  try {
    loading.value = true
    if (form._id) {
      await serviceArticle.editArticle(form._id, fd)
      snackbar.showMessage('文章更新成功 🌿', 'success')
    } else {
      await serviceArticle.createArticle(fd)
      snackbar.showMessage('新文章發布成功 ✨', 'success')
    }

    closeEditor()
    fetchArticles() 
  } catch (error) {
    console.error('儲存文章出錯：', error)
    snackbar.showMessage(error.response?.data?.message || '儲存失敗', 'error')
  } finally {
    loading.value = false
  }
}

// 刪除文章
const removeArticle = async (id) => {
  if (!confirm('確定要刪除這篇文章嗎？此動作無法復原。')) return
  
  try {
    await serviceArticle.removeArticle(id)
    snackbar.showMessage('文章已刪除', 'success')
    fetchArticles()
  } catch (error) {
    snackbar.showMessage('刪除失敗', 'error')
  }
}
onMounted(fetchArticles)
</script>

<style scoped>
.editor-wrapper {
  min-height: 500px;
  background: #fdfdfd;
}
</style>

<route lang="yaml">
meta:
  layout: adminLayout
  login: true
  admin: true
</route>
