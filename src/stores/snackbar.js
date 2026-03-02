import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const show = ref(false)
  const text = ref('')
  const color = ref('success') // 預設綠色

  /**
   * 顯示通知函式
   * @param {string} msg 訊息內容
   * @param {string} col 顏色 (success, error, warning, info 或色碼)
   */
  const showMessage = (msg, col = 'success') => {
    text.value = msg
    color.value = col
    show.value = true
  }

  return { show, text, color, showMessage }
})
