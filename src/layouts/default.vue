<template>
  <v-app class="bg-background">
      <!-- header -->
      <v-app-bar :height="appBarHeight" flat class="py-1 position-fixed glassmorphism">
        <v-container fluid class="d-flex align-center">
          <!-- LOGO -->
          <v-col cols="auto" class="d-flex align-center">
            <v-img src="../assets/暫時logo.svg" class="mr-1 mr-md-4 logo-size" />
            <div class="d-flex flex-column justify-center">
              <div
                class="nav-title font-weight-bold text-primary letter-spacing-wide leading-tight font-taipei"
              >
                蟲生.蟲森
              </div>
              <!-- 
            Electrolize 字重只支援400，設粗體是瀏覽器強行把它拉肥
            text-medium-emphasis 抓 on-background色，並加一點透明度
            -->
              <div
                class="font-electrolize text-uppercase font-weight-bold leading-tight text-medium-emphasis nav-subtitle"
              >
                Nature loves diversity.
              </div>
            </div>
          </v-col>

          <v-spacer></v-spacer>
          <!-- 主選單 -->
          <v-col cols="auto" class="nav-menu">
            <!-- slider-color: 該按鈕下方的底線顏色 -->
            <v-tabs color="primary" slider-color="primary" density="compact">
              <v-tab
                v-for="item in menuItems"
                :key="item.title"
                :to="item.path"
                class="font-weight-bold tracking-widest px-1 px-lg-4"
                style="min-width: 0 !important"
              >
                {{ item.title }}
              </v-tab>
            </v-tabs>
          </v-col>

          <v-spacer></v-spacer>
          <!-- 按鈕區 -->
          <v-col cols="auto" class="d-flex align-center ga-1">
            <v-btn
              v-if="!user.isLogin"
              variant="tonal"
              color="primary"
              rounded="pill"
              prepend-icon="mdi-account-circle"
              @click="openDialog"
              class="d-none d-md-flex"
            >
              登入 / 註冊
            </v-btn>

            <v-menu v-else location="bottom end" transition="scale-transition">
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  color="surface-bright"
                  class="px-4 py-2 cursor-pointer"
                  rounded="pill"
                  elevation="2"
                >
                  <v-avatar start color="primary" size="24">
                    <v-icon icon="mdi-account" size="16" color="on-primary"></v-icon>
                  </v-avatar>
                  <span class="text-subtitle-2 font-weight-bold ml-2">{{ user.account }}</span>
                  <v-icon end icon="mdi-chevron-down" size="small"></v-icon>
                </v-chip>
              </template>

              <v-list
                class="rounded-xl mt-2 border border-opacity-25"
                bg-color="surface"
                elevation="4"
              >
                <v-list-item
                  prepend-icon="mdi-cog-outline"
                  title="帳號設定"
                  to="/member/settings"
                  color="primary"
                />
                <v-divider class="my-1 border-opacity-25" />
                <v-list-item
                  prepend-icon="mdi-logout"
                  title="登出"
                  class="text-error"
                  @click="logout"
                />
              </v-list>
            </v-menu>

            <v-btn
              icon
              to="/member/orders"
              title="訂單記錄"
              color="on-background"
              variant="text"
              class="btn-size"
            >
              <v-icon icon="mdi-clipboard-text-outline" />
            </v-btn>

            <v-btn
              icon
              to="/cart"
              class="mr-2 btn-size"
              title="購物車"
              color="on-background"
              variant="text"
            >
              <v-badge
                color="accent"
                :content="cart.cartTypeCount"
                :model-value="cart.cartTypeCount > 0"
                offset-x="6"
                offset-y="6"
              >
                <v-icon icon="mdi-cart-outline" />
              </v-badge>
            </v-btn>
            <v-btn
              icon="mdi-menu"
              variant="text"
              color="primary"
              class="nav-burger btn-size"
              @click="drawer = !drawer"
            ></v-btn>
            <v-btn
              v-if="user.isLogin && user.isAdmin"
              to="/admin"
              variant="flat"
              color="secondary"
              rounded="lg"
              size="small"
              prepend-icon="mdi-shield-crown"
            >
              後台管理
            </v-btn>
          </v-col>
        </v-container>
      </v-app-bar>
      <!-- 漢堡選單 -->
      <!-- temporary:點擊外面會縮回去 -->
      <v-navigation-drawer
        v-model="drawer"
        location="right"
        temporary
        class="bg-background pa-4"
        :width="drawerWidth"
      >
        <div class="d-flex flex-column">
          <div class="text-h6 font-weight-black text-primary mb-6 px-4">MENU</div>

          <v-list nav density="comfortable">
            <v-list-item
              v-for="item in menuItems"
              :key="item.title"
              :to="item.path"
              color="primary"
              rounded="lg"
              class="mb-3"
            >
              <v-list-item-title class="font-weight-bold tracking-widest">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <!-- variant: 改變按鈕的獨特外觀，有 text,flat,elevated,tonal,outline,plain -->
          <v-btn
            v-if="!user.isLogin"
            variant="tonal"
            color="primary"
            rounded="pill"
            size="default"
            @click="openDialog"
          >
            登入 / 註冊
          </v-btn>
          <v-spacer></v-spacer>
        </div>
      </v-navigation-drawer>
      <!------------------------------------------------------------------------------------------->

      <!-- 內容區 -->
      <v-main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-main>

      <!-- 彈窗 -->
      <v-dialog v-model="dialog" max-width="420" transition="dialog-bottom-transition">
        <v-card class="rounded-xl pa-2" color="surface" elevation="10">
          <div class="text-center pt-6 pb-2">
            <v-icon icon="mdi-leaf" color="primary" size="40" class="mb-3"></v-icon>
            <div class="text-h5 font-weight-black text-on-surface">
              {{ isRegister ? '加入蟲友' : '歡迎回來' }}
            </div>
            <div class="text-caption text-medium-emphasis mt-1">
              {{ isRegister ? '開啟你的飼育旅程' : '繼續你的探索' }}
            </div>
          </div>

          <v-card-text class="px-6">
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="form.account"
                label="帳號 / Email"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                color="primary"
                density="comfortable"
                class="mb-3"
                rounded="lg"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="密碼"
                type="password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                color="primary"
                density="comfortable"
                rounded="lg"
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                class="mt-6 rounded-pill font-weight-bold text-background"
                elevation="2"
              >
                {{ isRegister ? '立即註冊' : '登入系統' }}
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center pb-6">
            <v-btn
              variant="text"
              size="small"
              color="primary"
              class="text-decoration-underline"
              @click="isRegister = !isRegister"
            >
              {{ isRegister ? '已有帳號？點此登入' : '還沒帳號？點此註冊' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 頁尾 -->
      <v-footer class="text-center d-flex flex-column py-10 border-t border-opacity-12">
        <div class="mb-6">
          <v-btn
            href="https://parukiabeetle.wordpress.com/"
            target="_blank"
            variant="text"
            color="primary"
            prepend-icon="mdi-link-variant"
            class="text-none"
          >
            回訪原始部落格
          </v-btn>
        </div>

        <div class="px-4 text-body-2 text-medium-emphasis" style="max-width: 500px">
          這裡是我的甲蟲飼育與生活記錄。從雞母蟲到 BEKUWA 世界紀錄，記錄每一份對自然的熱愛與堅持。
        </div>

        <v-divider class="mx-auto my-8 border-opacity-12" style="max-width: 100px" />

        <div class="text-caption text-disabled d-flex flex-column align-center">
          <div class="mb-1">&copy; {{ new Date().getFullYear() }} Beetle Blog</div>
          <div class="d-flex align-center ga-2">
            <span>甲蟲飼育誌</span>
            <span class="text-grey-lighten-2">|</span>
            <span>Design by 小帕路</span>
          </div>
        </div>
      </v-footer>
  </v-app>
</template>

<script setup>
import { ref, reactive, computed,watch } from 'vue'
import { useDisplay } from 'vuetify/lib/composables/display.mjs'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useSnackbarStore } from '@/stores/snackbar'

const user = useUserStore()
const cart = useCartStore()
const snackbar = useSnackbarStore()

// 漢堡選單開闔
const drawer = ref(false)
// 用JS抓視窗寬度，控制漢堡選單彈出的寬度
const { name, width: windowWidth } = useDisplay()
const drawerWidth = computed(() => {
  if (name.value === 'xs') {
    return windowWidth.value * 0.6
  }
  return 300
})
// 當偵測到螢幕寬度足夠展示主選單時，把漢堡選單關掉(如果使用者先按了漢堡鈕後，切到大視窗，漢堡選單本來會留著)
watch(windowWidth,(newWidth)=>{
  if(newWidth >= 1050 && drawer.value){
    drawer.value = false
  }
})
// appBarHeight 根據螢幕大小為1280px以上決定 v-app-bar的高度
const appBarHeight = computed(() => {
  return windowWidth.value < 1280 ? 55 : 80
})
// 登入彈窗
const dialog = ref(false)
// 分頁
const menuItems = [
  { title: '首頁', path: '/' },
  { title: '甲蟲飼育', path: '/articles' },
  { title: 'BEKUWA 紀錄', path: '/records' },
  { title: '日常蟲事', path: '/daily' },
  { title: '蟲友分享', path: '/share' },
  { title: '商店', path: '/shop' },
  { title: '關於本站', path: '/about' }
]

/* 處理登入標單邏輯 */

const isRegister = ref(false)

const form = reactive({
  account: '',
  password: ''
})

const openDialog = () => {
  form.account = ''
  form.password = ''
  dialog.value = true
  isRegister.value = false
}

const submit = async () => {
  let result
  if (isRegister.value) {
    result = await user.register(form)
  } else {
    result = await user.login(form)
  }

  if (result.success) {
    snackbar.showMessage(result.message)
    dialog.value = false
  } else {
    snackbar.showMessage(result.message)
  }
}

const logout = () => {
  user.logout()
  snackbar.showMessage('已成功登出')
}
</script>

<style scoped>
/* ------------------------------------斷點 1050px 1280px------------------------------------ */
/* logo圖片大小 */
.logo-size {
  width: 45px;
  height: 45px;
  transition: all 0.3s ease;
}
/* 部落格名稱 */
.nav-title {
  font-size: 1.25rem;
  transition: all 0.3s ease;
}
/* 部落格副標題 */
.nav-subtitle {
  display: none;
  font-size: 0.65rem !important;
  /* 副標題縮小，形成極大反差 */
  letter-spacing: 0.1em !important;
  opacity: 0.7;
}
/* 主選單，1050px以下不顯示 */
.nav-menu {
  display: none;
}
/* 漢堡按鈕，1050px以上不顯示 */
.nav-burger {
  display: block;
}
@media (min-width: 1050px) {
  .nav-menu {
    display: flex;
  }
  .nav-burger {
    display: none;
  }
}

/* LOGO 與 標題 在1280px 時展到最大 */
@media (min-width: 1280px) {
  .logo-size {
    width: 80px;
    height: 80px;
  }
  .nav-title {
    font-size: 2.125rem;
  }
  .nav-subtitle {
    display: block;
  }
}
/* ----------------------------------------------- */
/* 控制按鈕區間距 */
.btn-size {
  --v-btn-height: 36px;
  width: 36px;
  transition: all 0.3s ease;
}
@media (min-width: 1280px) {
  .btn-size {
    --v-btn-height: 48px;
    width: 48px;
    transition: all 0.3s ease;
  }
}

/* 標題與副標題的微調 */
.leading-tight {
  line-height: 1.2;
}
/* 中文字間距 */
.tracking-widest {
  letter-spacing: 0.15em;
}

/* 玻璃擬態 */
.glassmorphism {
  background: rgba(var(--v-theme-background), 0.6) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
}

/* 固定漢堡選單 */
:deep(.v-navigation-drawer) {
  height: 100dvh !important; 
  position: fixed !important; 
  top: 0 !important;          
}
</style>
