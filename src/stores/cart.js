import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'
import serviceUser from '../services/user.js'
import { useSnackbarStore } from './snackbar'

export const useCartStore = defineStore(
  'cart',
  () => {
    const user = useUserStore() // 引用另一個 store 存的資料
    const snackbar = useSnackbarStore()

    const cartItems = ref([])

    const addCart = async (product) => {
      const idex = cartItems.value.findIndex((item) => item._id === product._id)
      if (idex > -1) {
        cartItems.value[idex].quantity++
      } else {
        cartItems.value.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1
        })
      }
      await syncCart()
    }
    // 計算共有幾"種"商品
    const cartTypeCount = computed(() => {
      return cartItems.value.length
    })

    const updateQuantity = async (productID, amount) => {
      const index = cartItems.value.findIndex((item) => item._id === productID)
      if (index > -1) {
        cartItems.value[index].quantity += amount
        if (cartItems.value[index].quantity <= 0) {
          cartItems.value.splice(index, 1)
        }
      }
      await syncCart()
    }
    // 計算總共幾件商品
    const cartQuantityCount = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.quantity, 0)
    })

    const totalPrice = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
    })

    // 同步購物車
    const syncCart = async () => {
      if (!user.isLogin) return
      const cartData = cartItems.value.map((item) => ({
        product: item._id,
        quantity: item.quantity
      }))
      await serviceUser.syncCart({ cart: cartData })
    }

    const removeProduct = async (product_id) => {
      const index = cartItems.value.findIndex((item) => item._id === product_id)
      if (index > -1) {
        cartItems.value.splice(index, 1)
      }
      await syncCart()

      snackbar.showMessage('商品已從購物車移除')
    }

    return {
      cartItems,
      addCart,
      cartTypeCount,
      updateQuantity,
      cartQuantityCount,
      totalPrice,
      syncCart,
      removeProduct
    }
  },
  {
    persist: true
  }
)
