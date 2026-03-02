<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card border flat class="rounded-xl pa-6 mb-6 bg-grey-lighten-4">
          <div class="d-flex align-center">
            <v-avatar color="primary" size="80" class="elevation-4">
              <span class="text-h4 white--text">{{ user.account.charAt(0).toUpperCase() }}</span>
            </v-avatar>
            <div class="ml-6">
              <h2 class="text-h5 font-weight-black">{{ user.account }}</h2>
              <v-chip size="small" color="secondary" class="mt-1">
                {{ user.isAdmin ? '管理員' : '普通蟲友' }}
              </v-chip>
              <div class="text-caption text-grey mt-2">
                <v-icon icon="mdi-calendar" size="14" />
                入坑日期：{{ new Date(user.createdAt).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </v-card>

        <v-row>
          <v-col cols="12" sm="6">
            <v-card border flat class="rounded-xl pa-4 text-center" to="/member/orders">
              <v-icon icon="mdi-package-variant-closed" color="primary" size="32" class="mb-2" />
              <div class="text-h6 font-weight-black">{{ orderCount }}</div>
              <div class="text-caption text-grey">累計訂單數</div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card border flat class="rounded-xl pa-4 text-center" to="/cart">
              <v-icon icon="mdi-cart-outline" color="orange" size="32" class="mb-2" />
              <div class="text-h6 font-weight-black">{{ cart.cartQuantityCount }}</div>
              <div class="text-caption text-grey">待結帳商品</div>
            </v-card>
          </v-col>
        </v-row>

        <v-card border flat class="rounded-xl mt-6 pa-6">
          <div class="text-subtitle-1 font-weight-bold mb-4">
            <v-icon icon="mdi-medal" color="amber-darken-2" class="mr-1" /> 蟲友成就
          </div>
          <p class="text-body-2 text-grey">
            目前您已參與了本站的飼育紀錄計畫。持續觀察、細心紀錄，您對每一隻甲蟲的付出，都是推動甲蟲文化的一大步。
          </p>
          <v-divider class="my-4" />
          <v-btn variant="text" color="primary" block to="/articles">
            查看最新的飼育文章 <v-icon icon="mdi-chevron-right" />
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import serviceOrder from '@/services/order'

const user = useUserStore()
const cart = useCartStore()
const orderCount = ref(0)

onMounted(async () => {
  try {
    const { data } = await serviceOrder.getMyOrders()
    orderCount.value = data.result.length
  } catch (error) {
    console.error('無法讀取數據')
  }
})
</script>
