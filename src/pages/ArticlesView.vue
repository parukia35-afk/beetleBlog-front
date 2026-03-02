<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" md="2">
        <v-card border class="pa-4 rounded-xl" flat>
          <div class="text-subtitle-1 font-weight-bold mb-4">
            <v-icon icon="mdi-filter-variant" class="mr-1" /> 文章分類
          </div>
          <v-list density="compact" nav>
            <v-list-item
              v-for="cat in categories"
              :key="cat"
              :active="selectedCategory === cat"
              color="primary"
              rounded="lg"
              :title="cat"
              @click="selectedCategory = cat"
            />
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="10">
        <v-text-field
          v-model="search"
          class="mb-6"
          hide-details
          label="搜尋文章標題或內容..."
          prepend-inner-icon="mdi-magnify"
          rounded="xl"
          variant="outlined"
          clearable
        />

        <v-row v-if="filteredArticles.length > 0">
          <v-col v-for="article in filteredArticles" :key="article._id" cols="12">
            <v-card
              border
              class="pa-0 overflow-hidden rounded-xl"
              flat
              hover
              :to="'/articles/' + article._id"
            >
              <div class="d-flex flex-column flex-sm-row">
                <v-img class="flex-shrink-0" cover height="200" :src="article.imageUrl" width="300">
                  <v-chip
                    :color="article.isCompleted === '已完成' ? 'success' : 'orange'"
                    size="x-small"
                    class="ma-2 font-weight-black"
                    variant="elevated"
                  >
                    {{ article.isCompleted }}
                  </v-chip>
                </v-img>

                <div class="pa-6 d-flex flex-column justify-center flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <span class="text-overline text-primary font-weight-bold">{{
                      article.category
                    }}</span>
                    <v-spacer />
                    <v-chip
                      v-for="species in article.aboutSpecies.slice(0, 2)"
                      :key="species"
                      size="x-small"
                      variant="outlined"
                      class="ml-1"
                    >
                      #{{ species }}
                    </v-chip>
                  </div>

                  <h3 class="text-h5 font-weight-black mb-2">{{ article.title }}</h3>

                  <p class="text-body-2 text-grey-lighten-1 mb-4 text-truncate-2">
                    {{ article.description }}
                  </p>

                  <div class="d-flex align-center text-caption text-grey">
                    <v-icon class="mr-1" size="small">mdi-calendar-edit</v-icon>
                    發布日期：{{ new Date(article.createdAt).toLocaleDateString() }}
                    <v-spacer />
                    <v-btn
                      variant="text"
                      color="primary"
                      append-icon="mdi-arrow-right"
                      size="small"
                    >
                      閱讀全文
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-sheet v-else class="pa-12 text-center rounded-xl" border>
          <v-icon icon="mdi-file-search-outline" size="64" color="grey-lighten-1" />
          <div class="text-h6 text-grey mt-4">找不到相關的文章紀錄...</div>
          <v-btn variant="text" color="primary" @click="resetFilters"> 清除所有條件 </v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import serviceArticle from '@/services/article'

const categories = ['所有文章', '飼育紀錄', '翻譯文章', '科普知識']
const selectedCategory = ref('所有文章')
const search = ref('')
const articles = ref([])

// 💡 獲取活數據
const fetchArticles = async () => {
  try {
    const { data } = await serviceArticle.getPublishedArticles()
    articles.value = data.result
  } catch (error) {
    console.error('無法讀取文章列表')
  }
}

// 💡 核心邏輯：過濾器 (同時處理搜尋與分類)
const filteredArticles = computed(() => {
  return articles.value.filter((article) => {
    // 1. 分類過濾
    const matchCategory =
      selectedCategory.value === '所有文章' || article.category === selectedCategory.value

    // 2. 搜尋過濾 (標題、描述、或是標籤)
    const searchText = search.value?.toLowerCase() || ''
    const matchSearch =
      article.title.toLowerCase().includes(searchText) ||
      article.description.toLowerCase().includes(searchText)

    return matchCategory && matchSearch
  })
})

const resetFilters = () => {
  search.value = ''
  selectedCategory.value = '所有文章'
}

onMounted(fetchArticles)
</script>

<style scoped>
/* 限制前言只顯示兩行，超過顯示點點點 */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<route lang="yaml">
path: /articles
meta:
  layout: default
</route>
