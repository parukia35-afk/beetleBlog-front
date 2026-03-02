<template>
  <div class="d-flex flex-column justify-center align-center page-min-height">
    <v-icon icon="mdi-message-draw" size="80" color="grey-lighten-1" class="mb-4" />
    <h1 class="text-h4 font-weight-bold text-grey-darken-1">暫時沒有內容，敬請期待！</h1>
    <p class="text-body-1 text-grey mt-2">我們正在收集蟲友們精彩的飼育心得...</p>
  </div>
</template>

<style scoped>
.page-min-height {
  /* 100vh 是整個螢幕高度，扣掉 Header (80px) 和 Footer (約 250px) */
  /* 使用 dvh (Dynamic Viewport Height) 對手機瀏覽器更友好 */
  min-height: calc(100dvh - 80px - 250px);
  padding: 40px 0;
}
</style>

<route lang="yaml">
path: /share
meta:
  layout: default
</route>
