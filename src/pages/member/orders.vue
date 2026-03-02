<template>
  <v-container class="py-10">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-6">
          <v-icon icon="mdi-package-variant-closed" class="mr-2" />我的訂單紀錄
        </h1>
      </v-col>

      <v-col v-if="orders.length === 0" cols="12" class="text-center py-10">
        <v-icon size="80" color="grey-lighten-2">mdi-clipboard-text-off-outline</v-icon>
        <p class="text-h6 text-grey mt-4">尚無任何購買紀錄</p>
        <v-btn color="primary" variant="flat" class="mt-4" to="/shop">前往商店逛逛</v-btn>
      </v-col>

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

const orders = ref([])
const statusConfig = {
  待處理: 'orange',
  已確認: 'blue',
  已出貨: 'purple',
  已完成: 'green',
  已取消: 'red'
}

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
}

const fetchMyOrders = async () => {
  try {
    const { data } = await serviceOrder.getMyOrders() // 💡 串接剛寫好的後端 API
    orders.value = data.result
  } catch (error) {
    console.error('抓取訂單失敗')
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
