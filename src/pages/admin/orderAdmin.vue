<template>
  <v-container fluid>
    <v-card border flat class="rounded-lg">
      <v-card-title class="pa-6 d-flex align-center">
        <v-icon icon="mdi-file-document" color="primary" class="mr-2" />
        <span class="text-h5 font-weight-black">訂單管理系統</span>
      </v-card-title>

      <v-data-table :headers="headers" :items="orders" :loading="loading" show-expand>
        <template #[`item.status`]="{ item }">
          <v-chip :color="statusConfig[item.status]" size="small" variant="flat">
            {{ item.status }}
          </v-chip>
        </template>

        <template #[`item.totalPrice`]="{ item }">
          <span class="font-weight-bold text-primary">
            NT$ {{ calculateTotal(item.orderItems) }}
          </span>
        </template>

        <template #[`item.createdAt`]="{ item }">
          {{ new Date(item.createdAt).toLocaleString() }}
        </template>

        <template #[`item.actions`]="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon="mdi-cog-outline" variant="text" v-bind="props" />
            </template>
            <v-list>
              <v-list-item
                v-for="status in statusOptions"
                :key="status"
                @click="updateStatus(item._id, status)"
              >
                <v-list-item-title>{{ status }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <template #expanded-row="{ columns, item }">
          <tr>
            <td :colspan="columns.length" class="bg-grey-lighten-4 pa-4">
              <div class="text-subtitle-2 mb-2 font-weight-bold">訂單明細 (ID: {{ item._id }})</div>

              <v-list lines="two" class="bg-transparent">
                <v-list-item
                  v-for="cartItem in item.orderItems"
                  :key="cartItem._id"
                  class="border-bottom mb-1"
                >
                  <template #prepend>
                    <v-img
                      :src="cartItem.product?.imageUrl"
                      width="50"
                      height="50"
                      cover
                      class="rounded mr-4"
                    />
                  </template>

                  <v-list-item-title class="font-weight-bold">
                    {{ cartItem.product?.name || '未知商品 (已刪除)' }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    NT$ {{ cartItem.product?.price }} x {{ cartItem.quantity }}
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="text-right">
                      小計:
                      <span class="text-primary font-weight-bold"
                        >NT$ {{ (cartItem.product?.price || 0) * cartItem.quantity }}</span
                      >
                    </div>
                  </template>
                </v-list-item>
              </v-list>

              <div v-if="item.note" class="mt-4 pa-3 bg-white rounded border">
                <v-icon icon="mdi-note-text" size="small" class="mr-1" color="red" />
                <span class="text-caption font-weight-bold">買家備註：</span>
                <span class="text-body-2">{{ item.note }}</span>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import serviceOrder from '@/services/order'
import { useSnackbarStore } from '@/stores/snackbar'

const snackbar = useSnackbarStore()

const loading = ref(false)
const orders = ref([])

const headers = [
  { title: '買家帳號', key: 'user.account' },
  { title: '下單時間', key: 'createdAt' },
  { title: '總金額', key: 'totalPrice' },
  { title: '狀態', key: 'status', align: 'center' },
  { title: '管理', key: 'actions', sortable: false, align: 'end' },
  { title: '詳細', key: 'data-table-expand' }
]

// 💡 對應字串的顏色配置
const statusConfig = {
  待處理: 'orange',
  已確認: 'blue',
  已出貨: 'purple',
  已完成: 'green',
  已取消: 'red'
}

// 💡 從 Model 的 enum 來的字串陣列
const statusOptions = ['待處理', '已確認', '已出貨', '已完成', '已取消']

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity
  }, 0)
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const { data } = await serviceOrder.getAllOrders()
    orders.value = data.result
  } catch (error) {
    snackbar.showMessage('讀取訂單資料失敗')
  }
  loading.value = false
}

const updateStatus = async (id, newStatus) => {
  try {
    await serviceOrder.updateStatus(id, { status: newStatus })
    // 更新成功後，直接在前端找該筆訂單修改狀態，避免整頁重新整理
    const index = orders.value.findIndex((o) => o._id === id)
    if (index !== -1) orders.value[index].status = newStatus
  } catch (error) {
    snackbar.showMessage('修改狀態失敗')
  }
}

onMounted(fetchOrders)
</script>

<route lang="yaml">
meta:
  layout: adminLayout
  login: true
  admin: true
</route>
