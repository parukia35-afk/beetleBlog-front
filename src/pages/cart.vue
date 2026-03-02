<template>
  <v-container class="py-10">
    <h1 class="text-h4 font-weight-bold mb-8">購物車</h1>

    <v-row v-if="cart.cartItems.length === 0" justify="center">
      <v-col cols="12" md="6" class="text-center py-10">
        <v-icon size="100" color="grey-lighten-2" class="mb-4">mdi-cart-outline</v-icon>
        <p class="text-h6 text-grey">你的購物車空空的，快去帶些甲蟲回家吧！</p>
        <v-btn color="primary" variant="flat" class="mt-6" to="/shop" size="large" rounded="pill">
          前往商店
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" lg="8">
        <v-card border flat class="rounded-lg overflow-hidden">
          <v-table>
            <thead class="bg-grey-lighten-4">
              <tr>
                <th class="text-left">商品</th>
                <th class="text-center" style="width: 150px">數量</th>
                <th class="text-right">小計</th>
                <th class="text-center" style="width: 80px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart.cartItems" :key="item._id">
                <td class="py-4">
                  <div class="d-flex align-center">
                    <v-img
                      :src="item.imageUrl"
                      width="80"
                      height="80"
                      cover
                      class="rounded-lg border mr-4"
                    />
                    <div>
                      <div class="font-weight-bold">{{ item.name }}</div>
                      <div class="text-caption text-grey">NT$ {{ item.price }} / 個</div>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <div class="d-flex align-center justify-center">
                    <v-btn
                      icon="mdi-minus"
                      size="x-small"
                      variant="outlined"
                      @click="cart.updateQuantity(item._id, -1)"
                    />
                    <span class="mx-4 font-weight-bold">{{ item.quantity }}</span>
                    <v-btn
                      icon="mdi-plus"
                      size="x-small"
                      variant="outlined"
                      @click="cart.updateQuantity(item._id, 1)"
                    />
                  </div>
                </td>
                <td class="text-right font-weight-bold text-primary">
                  NT$ {{ item.price * item.quantity }}
                </td>
                <td class="text-center">
                  <v-btn
                    icon="mdi-delete-outline"
                    color="red"
                    variant="text"
                    size="small"
                    @click="cart.removeProduct(item._id)"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card border flat class="rounded-lg pa-6 sticky-top">
          <h2 class="text-h6 font-weight-bold mb-4">訂單摘要</h2>

          <div class="d-flex justify-space-between mb-2">
            <span class="text-grey">商品品項</span>
            <span>{{ cart.cartTypeCount }} 種</span>
          </div>

          <div class="d-flex justify-space-between mb-6">
            <span class="text-grey">商品總數</span>
            <span>{{ cart.cartQuantityCount }} 件</span>
          </div>

          <v-divider class="mb-4" />

          <div class="d-flex justify-space-between align-center mb-6">
            <span class="text-h6">總計金額</span>
            <span class="text-h5 font-weight-black text-primary">NT$ {{ cart.totalPrice }}</span>
          </div>

          <v-textarea
            v-model="orderNote"
            label="備註 (選填)"
            placeholder="有什麼想對店家說的嗎？"
            variant="outlined"
            rows="3"
            class="mb-4"
          />

          <v-btn
            block
            color="primary"
            size="x-large"
            variant="flat"
            rounded="lg"
            :loading="loading"
            @click="onCheckout"
          >
            確認結帳
          </v-btn>

          <p class="text-caption text-grey text-center mt-4">點擊結帳後，我們將為您保留商品紀錄</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import serviceOrder from '@/services/order'
import { useSnackbarStore } from '@/stores/snackbar'

const snackbar = useSnackbarStore()

const cart = useCartStore()
const router = useRouter()
const loading = ref(false)
const orderNote = ref('')

const onCheckout = async () => {
  loading.value = true
  try {
    await serviceOrder.createOrder({ note: orderNote.value })

    cart.cartItems = []

    snackbar.showMessage('感謝購買!訂單已成立。')
  } catch (error) {
    console.log(error)
    snackbar.showMessage(error.response?.data?.message || '結帳發生錯誤')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 100px;
}

/* 讓表格在手機版可以橫向捲動 */
.v-table {
  background: transparent !important;
}

@media (max-width: 960px) {
  .sticky-top {
    position: static;
  }
}
</style>
