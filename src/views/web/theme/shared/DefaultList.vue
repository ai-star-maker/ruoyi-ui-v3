<!--
* 默认文章列表组件
* 当主题没有提供自定义的 list.vue 时使用此组件
* 
* Props:
* - category: 分类信息
* - articles: 文章列表
* - total: 文章总数
* - siteCode: 站点编码
-->
<template>
  <div class="default-list-container">
    <div class="list-header">
      <h2 class="list-title">{{ category.categoryName }}</h2>
      <p class="list-desc" v-if="category.description">{{ category.description }}</p>
    </div>

    <div class="list-content">
      <div v-if="articles.length === 0" class="empty-state">
        <p>暂无文章</p>
      </div>

      <div v-else>
        <router-link 
          v-for="article in articles" 
          :key="article.articleId"
          :to="`/web/article/${article.articleId}`"
          class="article-item"
        >
          <div class="article-image" v-if="article.image">
            <image-preview 
              :src="article.image" 
              :preview-src-list="[article.image]"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
          </div>
          <div class="article-body">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-desc">{{ article.description }}</p>
            <div class="article-meta">
              <span class="meta-date">{{ parseTime(article.createTime, '{y}-{m}-{d}') }}</span>
              <span class="meta-views" v-if="article.views">
                <i class="iconfont icon-eye"></i> {{ article.views }}
              </span>
            </div>
          </div>
        </router-link>

        <div class="pagination-wrapper" v-if="total > pageSize">
          <pagination 
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="DefaultList">
import { defineProps, ref, reactive } from 'vue'
import { parseTime } from '@/utils/ruoyi'

defineProps({
  category: {
    type: Object,
    default: () => ({
      categoryName: '',
      description: ''
    })
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

const pageSize = ref(10)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10
})

const handlePageChange = () => {
  // TODO: 实现分页逻辑
}
</script>

<style scoped>
.default-list-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.list-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e73434;
}

.list-title {
  font-size: 24px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 10px 0;
}

.list-desc {
  color: #6c757d;
  margin: 0;
  font-size: 14px;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.article-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s;
}

.article-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #e73434;
}

.article-image {
  width: 120px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.article-body {
  flex: 1;
  min-width: 0;
}

.article-title {
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

.article-desc {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #999;
}

.meta-date,
.meta-views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

@media screen and (max-width: 768px) {
  .default-list-container {
    padding: 10px;
  }

  .article-item {
    flex-direction: column;
  }

  .article-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }
}
</style>
