<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">
          <v-icon icon="mdi-package-variant-closed" class="mr-2" />我的訂單紀錄
        </h1>
      </v-col>

      <!-- 骨架屏 -->
      <v-col v-if="isFetching" cols="12" class="d-flex flex-column align-center py-10">
        <v-progress-circular indeterminate color="primary" size="48" />
        <div class="py-10">頁面載入中，請稍後。</div>
      </v-col>
      <!-- 連線異常 -->
      <v-col v-else-if="fetchError" cols="12">
        <AppEmptyState variant="error" @action="fetchMyOrders" />
      </v-col>
      <!-- 空資料 -->
      <v-col v-else-if="orders.length === 0" cols="12">
        <AppEmptyState variant="empty">
          <template #title>尚無任何購買紀錄</template>
          <template #actions>
            <v-btn color="primary" variant="flat" to="/shop">前往商店逛逛</v-btn>
          </template>
        </AppEmptyState>
      </v-col>
      <!-- 真實資料 -->
      <v-col
        v-else
        v-for="order in orders"
        :key="order._id"
        cols="12"
        md="10"
        lg="8"
        class="mx-auto"
      >
        <v-card border flat class="rounded-xl mb-6 overflow-hidden">
          <v-card-item class="bg-grey-lighten-4">
            <template #prepend>
              <div class="text-subtitle-2 font-weight-bold">
                訂單日期：{{ new Date(order.createdAt).toLocaleDateString() }}
              </div>
            </template>
            <template #append>
              <v-chip :color="statusConfig[order.status]" size="small" variant="flat">
                {{ order.status }}
              </v-chip>
            </template>
          </v-card-item>

          <v-card-text class="pa-4">
            <div v-for="item in order.orderItems" :key="item._id" class="d-flex align-center mb-4">
              <v-img
                :src="item.product?.imageUrl"
                width="64"
                height="64"
                cover
                class="rounded-lg border mr-4"
              />
              <div class="flex-grow-1">
                <div class="font-weight-bold">{{ item.product?.name }}</div>
                <div class="text-caption text-grey">
                  NT$ {{ item.product?.price }} x {{ item.quantity }}
                </div>
              </div>
              <div class="text-right font-weight-bold">
                NT$ {{ item.product?.price * item.quantity }}
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="d-flex justify-space-between align-end">
              <div>
                <div v-if="order.note" class="text-caption text-red-lighten-1">
                  <v-icon icon="mdi-message-text-outline" size="14" /> 備註：{{ order.note }}
                </div>
                <div class="text-caption text-grey">訂單編號：{{ order._id }}</div>
              </div>
              <div class="text-right">
                <span class="text-grey mr-2">總計</span>
                <span class="text-h6 font-weight-black text-primary"
                  >NT$ {{ calculateTotal(order.orderItems) }}</span
                >
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import serviceOrder from '@/services/order'

// ====================靜態資料====================
const orders = ref([])
const statusConfig = {
  待處理: 'orange',
  已確認: 'blue',
  已出貨: 'purple',
  已完成: 'green',
  已取消: 'red'
}

// ====================通用函式====================
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
}

// ====================讀取====================
const isFetching = ref(true)
const fetchError = ref(false)

const fetchMyOrders = async () => {
  isFetching.value = true
  fetchError.value = false
  try {
    const { data } = await serviceOrder.getMyOrders()
    orders.value = data.result
  } catch (error) {
    fetchError.value = true
  } finally {
    isFetching.value = false
  }
}

onMounted(fetchMyOrders)
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}
.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}
</style>
