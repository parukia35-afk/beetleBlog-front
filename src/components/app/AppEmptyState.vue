<!-- components/AppEmptyState.vue -->
<template>
  <div class="d-flex flex-column align-center justify-center text-center py-16 px-4">
    <!-- icon -->
    <slot name="icon">
      <v-icon :icon="config.icon" size="72" :color="config.color" class="mb-5" />
    </slot>

    <!-- title -->
    <div class="text-h6 font-weight-bold mb-2">
      <slot name="title">{{ config.title }}</slot>
    </div>

    <!-- text -->
    <p class="text-body-2 text-grey mb-6" style="max-width: 360px">
      <slot name="text">{{ config.text }}</slot>
    </p>

    <!-- actions -->
    <slot name="actions">
      <v-btn v-if="config.actionText" :color="config.color" variant="tonal" @click="emit('action')">
        {{ config.actionText }}
      </v-btn>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    required: true // 'error' | 'empty'
  }
})

const emit = defineEmits(['action'])

const configs = {
  error: {
    icon: 'mdi-cloud-off-outline',
    color: 'error',
    title: '無法連線至伺服器',
    text: '目前連線似乎有點問題，請檢查網路或稍後再試一次。',
    actionText: '重新嘗試'
  },
  empty: {
    icon: 'mdi-inbox-outline',
    color: 'grey',
    title: '這裡還沒有任何內容',
    text: null,
    actionText: null
  }
}

const config = computed(() => configs[props.variant])
</script>
