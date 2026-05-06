<template>
  <v-dialog :model-value="modelValue" max-width="400px" persistent>
    <v-card class="rounded-xl">
      <v-card-title class="pa-6 font-weight-bold text-h6">
        {{ title }}
      </v-card-title>
      <v-card-text class="px-6 pt-0">
        {{ message }}
      </v-card-text>
      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">取消</v-btn>
        <v-btn :color="confirmColor" variant="flat" :loading="loading" @click="$emit('confirm')">
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: { type: String, default: '確認？' },
  message: { type: String, default: '確定要執行此操作嗎？' },
  confirmText: { type: String, default: '確認' },
  confirmColor:{type: String, default:'primary'},
  loading: { type: Boolean, default: false }
})

defineEmits(['update:modelValue', 'confirm'])
</script>