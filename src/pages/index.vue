<template>
  <div>
    <!-- 輪播圖 -->
    <v-carousel cycle height="500" hide-delimiter-background show-arrows="hover">
      <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.src" cover>
        <div class="d-flex fill-height justify-center align-center">
          <div
            class="text-h5 text-sm-h4 text-lg-h2 font-lxgw"
            style="color: white; text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5)"
          >
            {{ slide.text }}
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>

    <!-- 最新文章 -->
    <v-card class="bg-secondary py-4 px-4 ma-4 ma-lg-16" rounded="xl">
      <div class="text-h6 text-md-h4 font-weight-bold my-4 mx-4 text-left">最新文章</div>
      <v-row>
        <template v-if="isFetching">
          <v-col v-for="i in 5" :key="i" cols="12" sm="6" md="4" class="custom-col-5">
            <v-card elevation="5" class="rounded-xl">
              <v-skeleton-loader type="image, article, chip"></v-skeleton-loader>
            </v-card>
          </v-col>
        </template>
        <v-col
          v-else
          v-for="article in latestArticles"
          :key="article._id"
          cols="12"
          sm="6"
          md="4"
          class="custom-col-5"
        >
          <v-card class="mx-auto rounded-xl" hover :to="'/articles/' + article._id">
            <v-img cover height="200px" :src="article.imageUrl" />

            <v-card-title class="font-weight-bold">
              {{ article.title }}
            </v-card-title>

            <p class="text-grey text-body-2 text-truncate-2 px-3">
              {{ article.description }}
            </p>

            <v-card-actions>
              <v-chip size="x-small" color="primary" variant="outlined">{{
                article.category
              }}</v-chip>
              <v-spacer />
              <div class="text-caption text-grey">
                {{ new Date(article.createdAt).toLocaleDateString() }}
                
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import serviceArticle from '@/services/article'
import caresoul_4 from '../assets/輪4.jpg'
import caresoul_5 from '../assets/輪5.jpg'
import caresoul_7 from '../assets/輪7.jpg'

const slides = [
  {
    // 自訂輪播圖
    src: caresoul_4,
    text: '探索甲蟲的奧秘'
  },
  {
    src: caresoul_5,
    text: 'BEKUWA 世界紀錄區'
  },
  {
    src: caresoul_7,
    text: '我的飼育日常'
  }
]

const latestArticles = ref([])
const isFetching = ref(true)

const fetchLatest = async () => {
  try {
    isFetching.value = true
    const { data } = await serviceArticle.getPublishedArticles()

    // 💡 邏輯：先按 createdAt 排序（由新到舊），再取前 5 筆
    latestArticles.value = (data.result || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5) // 只要前 5 篇
  } catch (error) {
    console.error('抓取首頁文章失敗', error)
  } finally {
    isFetching.value = false
  }
}

onMounted(fetchLatest)
</script>

<style scoped>
/* 💡 實現 5 欄位的 CSS 技巧 */
@media (min-width: 1904px) {
  /* Vuetify xl 斷點 */
  .custom-col-5 {
    flex: 0 0 20%;
    max-width: 20%;
  }
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
