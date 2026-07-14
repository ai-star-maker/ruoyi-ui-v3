<!--
* 默认搜索结果组件
* 当主题没有提供自定义的 search.vue 时使用此组件
* 
* Props:
* - searchKey: 搜索关键词
* - articles: 搜索结果
* - total: 结果总数
* - siteCode: 站点编码
-->
<template>
  <div class="default-search-container">
    <div class="search-header">
      <h2>搜索结果</h2>
      <p class="search-result">找到关于 "{{ searchKey }}" 的结果 {{ total }} 条</p>
    </div>

    <div class="search-content">
      <div v-if="articles.length === 0" class="empty-state">
        <p>未找到相关内容</p>
      </div>

      <div v-else>
        <router-link 
          v-for="article in articles" 
          :key="article.articleId"
          :to="`/web/article/${article.articleId}`"
          class="search-item"
        >
          <div class="search-item-image" v-if="article.image">
            <image-preview 
              :src="article.image" 
              :preview-src-list="[article.image]"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
          </div>
          <div class="search-item-body">
            <h3 class="search-item-title" v-html="highlightKeyword(article.title)"></h3>
            <p class="search-item-desc" v-html="highlightKeyword(article.description)"></p>
            <div class="search-item-meta">
              <span>{{ parseTime(article.createTime, '{y}-{m}-{d}') }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup name="DefaultSearch">
import { defineProps, computed } from 'vue'
import { parseTime } from '@/utils/ruoyi'

const props = defineProps({
  searchKey: {
    type: String,
    default: ''
  },
  articles: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  siteCode: {
    type: String,
    default: ''
  }
})

// 高亮搜索关键词
const highlightKeyword = (text) => {
  if (!text || !props.searchKey) return text
  const regex = new RegExp(`(${props.searchKey})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
</script>

<style scoped>
.default-search-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.search-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e73434;
}

.search-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 10px 0;
}

.search-result {
  color: #6c757d;
  margin: 0;
  font-size: 14px;
}

.search-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.search-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s;
}

.search-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #e73434;
}

.search-item-image {
  width: 100px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.search-item-body {
  flex: 1;
  min-width: 0;
}

.search-item-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.search-item-desc {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.search-item-meta {
  font-size: 12px;
  color: #999;
}

/* 高亮样式 */
:deep(mark) {
  background-color: #fff9c4;
  color: #e73434;
  font-weight: 600;
}

@media screen and (max-width: 768px) {
  .default-search-container {
    padding: 10px;
  }

  .search-item {
    flex-direction: column;
  }

  .search-item-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }
}
</style>
