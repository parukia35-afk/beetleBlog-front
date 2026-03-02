<template>
  <v-container class="py-10">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <header class="mb-10 text-center">
          <h1 class="text-h3 font-weight-black mb-6">{{ article.title }}</h1>

          <div class="d-flex align-center justify-center flex-wrap gap-2">
            <v-chip color="primary" variant="flat" class="font-weight-bold mr-2">{{
              article.category
            }}</v-chip>
            <v-chip  variant="outlined" class="font-weight-bold">{{
              article.isCompleted
            }}</v-chip>

            <v-divider vertical class="mx-4 d-none d-sm-block" />

            <div class="text-caption">
              <v-icon size="small" class="mr-1">mdi-calendar-edit</v-icon>
              {{ new Date(article.createdAt).toLocaleDateString() }}
            </div>
          </div>

          <div class="mt-4 d-flex justify-center flex-wrap">
            <v-chip
              v-for="s in article.aboutSpecies"
              :key="s"
              size="large"
              variant="outlined"
            >
              # {{ s }}
            </v-chip>
          </div>
        </header>

        <v-card border flat class="rounded-xl overflow-hidden mb-12 bg-grey-lighten-3">
          <v-img
            v-if="article.imageUrl"
            :src="article.imageUrl"
            height="400"
            cover
          />

          <v-card-text class="pa-6 pa-md-12">
            <div class="article-content" v-html="article.content"></div>
          </v-card-text>
        </v-card>

        <v-divider class="mb-12" />
        <!-- 留言區元件 -->
        <section id="comments-anchor">
          <CommentSection :target="route.params.id" />
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import serviceArticle from '@/services/article'
import CommentSection from '@/components/CommentSection.vue'

const route = useRoute()
const article = ref({})

onMounted(async () => {
  try {
    const { data } = await serviceArticle.getByArticleId(route.params.id)
    article.value = data.result
  } catch (error) {
    console.error('抓取文章失敗')
  }
})
</script>

<style scoped>
.article-content {
  font-size: 1.1rem;
  line-height: 2;
}

/* 💡 讓 TipTap 的圖片在前台能自適應並置中 */
.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 24px auto;
  display: block;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 💡 讓 TipTap 的表格看起來像專業紀錄表 */
.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  border: 1px solid #e0e0e0;
}

.article-content :deep(th),
.article-content :deep(td) {
  border: 1px solid #e0e0e0;
  padding: 12px;
  text-align: left;
}

.article-content :deep(th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

.article-content :deep(h2) {
  color: #2e7d32;
  margin: 40px 0 20px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e8f5e9;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #81c784;
  padding-left: 20px;
  font-style: italic;
  color: #546e7a;
  margin: 24px 0;
}
</style>
