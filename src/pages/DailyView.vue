<template>
  <v-container class="py-10">
    <div class="text-center mb-10">
      <h1 class="text-h4 font-weight-bold mb-2">日常蟲事</h1>
      <p class="text-primary">分享我的飼育日常、感觸與突發奇想</p>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <!-- 骨架屏 -->
        <template v-if="isFetching">
          <v-card  v-for="n in 4" :key="n" flat border class="mb-8 pa-4">
            <div class="d-flex flex-column flex-sm-row gap-4 align-center align-sm-start">
              <v-skeleton-loader width="300" height="220" type="image" class="mx-auto mx-sm-0 flex-shrink-0"></v-skeleton-loader>
              <v-skeleton-loader type="paragraph,paragraph" class="flex-grow-1 skeleton-text-width"></v-skeleton-loader>
            </div>
          </v-card>
        </template>

        <div v-else-if="posts.length === 0" class="text-center py-10">
          <v-icon size="64" color="grey-lighten-1">mdi-comment-text-outline</v-icon>
          <p class="text-primary mt-4">目前還沒有日常分享，過陣子再來看看吧！</p>
        </div>

        <v-card v-else v-for="post in posts" :key="post._id" border class="mb-8 pa-4 hover-card" flat>
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
const isFetching = ref(true)

const fetchPosts = async () => {
  try {
    isFetching.value = true
    const { data } = await serviceDaily.fetchDaily()
    posts.value = data.result
  } catch (error) {
    console.error('抓取日常失敗:', error)
  } finally {
    isFetching.value = false
  }
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

.skeleton-text-width {
  width: 100%;
  max-width: 300px; 
}

@media (min-width: 600px) { 
  .skeleton-text-width {
    max-width: none;
  }
}

:deep(.v-skeleton-loader__image) {
  height: 220px !important; /* 強制與你設定的高度一致 */
}

</style>

<route lang="yaml">
path: /daily
meta:
  layout: default
</route>
