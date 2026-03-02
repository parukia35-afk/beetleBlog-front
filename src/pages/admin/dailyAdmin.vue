<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card border flat class="rounded-lg">
          <v-card-title class="d-flex align-center py-4 px-6">
            <v-icon icon="mdi-camera-timer" color="primary" class="mr-2" />
            <span class="text-h5 font-weight-black">日常蟲事管理</span>
            <v-spacer />
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog(null)">
              發佈新動態
            </v-btn>
          </v-card-title>

          <v-divider />

          <v-data-table :headers="headers" :items="posts" :loading="loading" hover>
            <template #[`item.imageUrl`]="{ item }">
              <v-img
                :src="item.imageUrl"
                width="80"
                height="60"
                cover
                class="rounded-lg my-2 border"
              />
            </template>

            <template #[`item.content`]="{ item }">
              <div class="text-truncate" style="max-width: 300px">
                {{ item.content }}
              </div>
            </template>

            <template #[`item.createdAt`]="{ item }">
              {{ new Date(item.createdAt).toLocaleString() }}
            </template>

            <template #[`item.actions`]="{ item }">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="blue"
                size="small"
                @click="openDialog(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="red"
                size="small"
                @click="deleteItem(item)"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="pa-6 font-weight-bold text-h5">
          {{ editedId ? '修改動態' : '分享日常' }}
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <v-form ref="formRef">
            <v-img
              v-if="form.imageUrl"
              :src="form.imageUrl"
              height="200"
              cover
              class="rounded-lg border mb-4"
            />

            <v-textarea
              v-model="form.content"
              label="在想什麼呢？"
              variant="outlined"
              counter
              :rules="[(v) => !!v || '內容不能空著喔']"
              rows="5"
            />

            <v-file-input
              v-model="form.image"
              label="上傳照片"
              accept="image/*"
              prepend-icon="mdi-camera"
              variant="outlined"
              :rules="editedId ? [] : [(v) => !!v || '請選一張照片']"
              show-size
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">取消</v-btn>
          <v-btn color="primary" variant="flat" :loading="submitting" @click="submit"> 發佈 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import serviceDaily from '@/services/daily.js'
import { useSnackbarStore } from '@/stores/snackbar'

const snackbar = useSnackbarStore()

const loading = ref(false)
const submitting = ref(false)
const dialog = ref(false)
const posts = ref([])
const editedId = ref(null)
const formRef = ref(null)

const headers = [
  { title: '照片', key: 'imageUrl', sortable: false },
  { title: '內容預覽', key: 'content' },
  { title: '發佈時間', key: 'createdAt' },
  { title: '操作', key: 'actions', align: 'end', sortable: false }
]

const initialForm = {
  content: '',
  image: null,
  imageUrl: ''
}

const form = reactive({ ...initialForm })

const fetchPosts = async () => {
  loading.value = true
  try {
    const { data } = await serviceDaily.fetchDaily()
    posts.value = data.result
  } catch (error) {
    snackbar.showMessage('載入動態失敗')
  }
  loading.value = false
}

const openDialog = (item) => {
  if (item) {
    editedId.value = item._id
    Object.assign(form, item)
    form.image = null
  } else {
    editedId.value = null
    Object.assign(form, initialForm)
  }
  dialog.value = true
}

const submit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  submitting.value = true
  const fd = new FormData()
  fd.append('content', form.content)
  // 如果有選新檔案才加入
  if (form.image) {
    const file = Array.isArray(form.image) ? form.image[0] : form.image
    fd.append('image', file)
  }

  try {
    if (editedId.value) {
      await serviceDaily.updateDaily(editedId.value, fd)
    } else {
      await serviceDaily.createDaily(fd)
    }
    await fetchPosts()
    dialog.value = false
  } catch (error) {
    snackbar.showMessage(error.response?.data?.message || '操作失敗')
  }
  submitting.value = false
}

const deleteItem = async (item) => {
  if (confirm('確定要刪除這則日常動態嗎？')) {
    try {
      await serviceDaily.removeDaily(item._id)
      await fetchPosts()
    } catch (error) {
      snackbar.showMessage('刪除失敗')
    }
  }
}

onMounted(fetchPosts)
</script>

<route lang="yaml">
meta:
  layout: adminLayout
  login: true
  admin: true
</route>
