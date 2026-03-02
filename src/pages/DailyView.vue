<template>
  <v-container class="py-10">
    <div class="text-center mb-10">
      <h1 class="text-h4 font-weight-bold mb-2">日常蟲事</h1>
      <p class="text-primary">分享我的飼育日常、感觸與突發奇想</p>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-skeleton-loader v-if="loading" type="card, card" />

        <div v-else-if="posts.length === 0" class="text-center py-10">
          <v-icon size="64" color="grey-lighten-1">mdi-comment-text-outline</v-icon>
          <p class="text-primary mt-4">目前還沒有日常分享，過陣子再來看看吧！</p>
        </div>

        <v-card
          v-for="post in posts"
          :key="post._id"
          border
          class="mb-8 pa-4 hover-card"
          flat
        >
          <div class="d-flex flex-column flex-sm-row gap-4">
            <v-img
              class="flex-shrink-0"
              cover
              max-height="250"
              rounded="lg"
              :src="post.imageUrl"
              width="300"
            >
              <template #placeholder>
                <v-row align="center" class="fill-height ma-0" justify="center">
                  <v-progress-circular indeterminate color="grey-lighten-4" />
                </v-row>
              </template>
            </v-img>

            <div class="flex-grow-1">
              <div class="d-flex align-center mb-2">
                <v-icon class="mr-2" color="brown-lighten-1" size="small">mdi-clock-outline</v-icon>
                <span class="text-caption text-grey">{{ formatDate(post.createdAt) }}</span>
              </div>

              <div class="text-body-1 text-grey-lighten-2 leading-relaxed">
                {{ post.content }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import serviceDaily from '@/services/daily'

const posts = ref([])
const loading = ref(true)

const fetchPosts = async () => {
  loading.value = true
  try {
    const { data } = await serviceDaily.fetchDaily()
    posts.value = data.result
  } catch (error) {
    console.error('抓取日常失敗:', error)
  }
  loading.value = false
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(fetchPosts)
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}
.hover-card {
  transition: transform 0.3s ease;
}
.hover-card:hover {
  transform: translateY(-4px);
  border-color: var(--v-primary-base) !important;
}
</style>

<route lang="yaml">
path: /daily
meta:
  layout: default
</route>