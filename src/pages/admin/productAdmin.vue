<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <!-- 管理主畫面 -->
        <v-card border flat class="rounded-lg">
          <v-card-title class="d-flex align-center py-4 px-6">
            <v-icon icon="mdi-shopping" color="primary" class="mr-2" />
            <span class="text-h5 font-weight-black">商品管理</span>
            <v-spacer />
            <!-- 搜尋框 -->
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="搜尋商品名稱"
              variant="outlined"
              hide-details
              density="compact"
              class="mr-4"
              style="max-width: 300px"
            />
            <!-- 新增按鈕 -->
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog(null)">
              新增商品
            </v-btn>
          </v-card-title>
          <v-divider />
          <!-- 商品總覽表格 -->
          <v-data-table
            :headers="headers"
            :items="products"
            :search="search"
            :loading="isFetching"
            hover
            class="product-table"
          >
            <template #[`item.image`]="{ item }">
              <v-img
                :src="item.imageUrl || 'https://placehold.co/100x100?text=No+Image'"
                width="60"
                height="60"
                cover
                class="rounded-lg my-2 border"
              />
            </template>

            <template #[`item.price`]="{ item }">
              <span class="font-weight-bold text-primary">${{ item.price }}</span>
            </template>

            <template #[`item.sell`]="{ item }">
              <v-chip :color="item.sell ? 'success' : 'grey'" size="small">
                {{ item.sell ? '上架中' : '未上架' }}
              </v-chip>
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
    <!-- 新增/編輯商品視窗 -->
    <v-dialog v-model="dialog" max-width="700px" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="pa-6 font-weight-bold text-h5">
          {{ editedId ? '編輯商品資訊' : '新增商品' }}
        </v-card-title>

        <v-card-text class="pa-6 pt-0">
          <v-form ref="formRef">
            <v-row>
              <v-col cols="12" class="d-flex flex-column align-center" v-if="form.imageUrl">
                <div class="text-caption mb-2 text-grey">當前商品圖片：</div>
                <v-img
                  :src="form.imageUrl"
                  max-height="200"
                  width="200"
                  aspect-ratio="1"
                  class="rounded-lg border mb-4"
                  cover
                />
              </v-col>

              <v-col cols="12" md="8">
                <v-text-field
                  v-model="form.name"
                  label="商品名稱"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="form.category"
                  :items="categories"
                  label="分類"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.price"
                  label="價格"
                  type="number"
                  prefix="$"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="form.sell"
                  label="上架狀態"
                  color="success"
                  hide-details
                  inset
                  class="mt-2"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  label="商品描述"
                  variant="outlined"
                  rows="3"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="form.image"
                  :label="editedId ? '更換商品圖片 (不更換請留空)' : '上傳商品圖片'"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  show-size
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="dialog = false">取消</v-btn>
          <v-btn color="primary" variant="flat" :loading="isSubmitting" @click="submit">
            確認儲存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 確認刪除彈窗 -->
    <ConfirmDialog
      v-model="deleteDialog"
      title="確認刪除？"
      :message="`確定要刪除商品 ${pendingDeleteItem?.name} 嗎？`"
      confirmColor="red"
      :loading="isDeleting"
      @confirm="confirmDelete"
    />
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import serviceProduct from '@/services/product'
import { useSnackbarStore } from '@/stores/snackbar'

const snackbar = useSnackbarStore()

// ====================通用狀態管理====================
const search = ref('')
// ====================靜態資料====================
const headers = [
  { title: '圖片', key: 'image', sortable: false },
  { title: '商品名稱', key: 'name', sortable: true },
  { title: '分類', key: 'category' },
  { title: '價格', key: 'price', align: 'center' },
  { title: '狀態', key: 'sell', align: 'center' },
  { title: '操作', key: 'actions', align: 'end', sortable: false }
]

const categories = ['成蟲', '幼蟲', '耗材 | 工具', '其他']

const rules = {
  required: (v) => !!v || '此欄位必填'
}

// ====================讀取====================

const products = ref([])
const isFetching = ref(false)
const fetchError = ref(false)

const fetchAllProducts = async () => {
  isFetching.value = true
  fetchError.value = false
  try {
    const { data } = await serviceProduct.fetchAllProducts()
    products.value = data.result
  } catch (error) {
    fetchError.value = true
  } finally {
    isFetching.value = false
  }
}

// ====================新增/編輯====================
const dialog = ref(false)
const editedId = ref(null)
const isSubmitting = ref(false)
const formRef = ref(null)

// 預設新表單(不會被覆蓋，以免汙染)
const initialForm = {
  name: '',
  price: 0,
  description: '',
  category: '成蟲',
  sell: false,
  image: null,
  imageUrl: '' // 用於顯示雲端網址的預覽
}

const form = reactive({ ...initialForm })

// 開啟新增/編輯彈窗
const openDialog = (item) => {
  if (item) {
    editedId.value = item._id
    const { name, price, description, category, sell, imageUrl } = item
    Object.assign(form, { name, price, description, category, sell, imageUrl })
    form.image = null // 檔案輸入框重置為空
  } else {
    editedId.value = null
    Object.assign(form, initialForm) // 重置為初始狀態
  }
  dialog.value = true
}

// 提交表單
const submit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isSubmitting.value = true

  // 使用 FormData 包裝包含檔案的資料
  const fd = new FormData()
  fd.append('name', form.name)
  fd.append('price', form.price)
  fd.append('description', form.description)
  fd.append('category', form.category)
  fd.append('sell', form.sell)
  if (form.image) {
    // Vuetify 的 v-file-input 有時會給陣列 [File]，有時直接給 File 物件
    // 這行是保險機制：如果是陣列就拿第一個 File，不是就直接用
    const file = Array.isArray(form.image) ? form.image[0] : form.image
    fd.append('image', file)
  }

  try {
    if (editedId.value) {
      await serviceProduct.updateProduct(editedId.value, fd)
    } else {
      await serviceProduct.createProduct(fd)
    }
    await fetchAllProducts()
    dialog.value = false
  } catch (error) {
    snackbar.showMessage(error.response?.data?.message || '儲存失敗')
  } finally {
    isSubmitting.value = false
  }
}

// ====================刪除====================
const deleteDialog = ref(false)
const pendingDeleteItem = ref(null)
const isDeleting = ref(false)

const deleteItem = (item) => {
  pendingDeleteItem.value = item
  deleteDialog.value = true
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    await serviceProduct.deleteProduct(pendingDeleteItem.value._id)
    await fetchAllProducts()
    deleteDialog.value = false
    snackbar.showMessage('刪除成功', 'success')
  } catch (error) {
    snackbar.showMessage('刪除失敗', 'error')
  } finally {
    isDeleting.value = false
  }
}

onMounted(fetchAllProducts)
</script>

<route lang="yaml">
meta:
  layout: adminLayout
  login: true
  admin: true
</route>
