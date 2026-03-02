/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com
 */

import { createVuetify } from 'vuetify'
// 1. 這裡放所有的「匯入 (Imports)」：必須放在檔案的最上方
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { zhHant } from 'vuetify/locale'

const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: '#112718', // 背景色
    'on-background': '#FDFBF7',
    surface: '#1E3526', // 元件色，例如:v-card,v-btn
    'on-surface': '#FDFBF7',
    primary: '#f4d125',
    secondary: '#4B5D45',
    accent: '#bb6b25',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00'
  }
}

// 2. 這裡放「導出 (Export)」：整個檔案只能有一個 default export
export default createVuetify({
  theme: {
    defaultTheme: 'myCustomDarkTheme',
    themes: {
      myCustomDarkTheme
    }
  },
  locale:{
    locale:'zhHant',
    messages:{zhHant}
  }
})
