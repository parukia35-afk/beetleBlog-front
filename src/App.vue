<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="bottom right"
      rounded="pill"
      elevation="24"
    >
      <div class="d-flex align-center">
        <v-icon
          start
          :icon="snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"
        />
        {{ snackbar.text }}
      </div>

      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">關閉</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
const snackbar = useSnackbarStore()
</script>

<style>
.font-lxgw {
  font-family: 'LXGW WenKai Mono TC', serif !important;
}

.font-taipei {
  font-family: 'TaipeiSansTC', sans-serif !important;
}
.font-open {
  font-family: 'Open Sans', sans-serif !important;
}
.font-grotesk {
  font-family: 'Space Grotesk', sans-serif !important;
}
.font-electrolize {
  font-family: 'Electrolize', sans-serif !important;
}
</style>
