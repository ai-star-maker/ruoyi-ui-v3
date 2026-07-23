<!--
  default主题的栏目/分类列表模板 (category.vue)
  ---------------------------------------------------------------
  与 post.vue 的处理方式不同：default 主题在这里选择直接实现 category.vue，
  而不是依赖 default.vue 兜底 —— 因为"栏目文章列表"是一个有明确、独立
  展示需求的页面类型（分页、列表项），用通用兜底模板硬套会体验很差。
  post 详情页则相反：内容本身（标题+正文）用一个通用容器就足够展示，
  所以那里特意演示了"回退到 default.vue"这条路径。

  两者共同点：都通过 useCategoryInfo 这个共享 composable 获取栏目信息，
  避免每个模板各自实现一遍 getCategoryInfo + watch。
-->
<template>
  <el-container direction="vertical" class="cms-page">
    <my-header />
    <el-main class="category-detail">
      <div class="category-hero">
        <image-preview :src="category.image" :preview-src-list="[]" class="elImage-no-preview elImage-category" />
      </div>

      <div class="cms-container">
        <div class="cms-eyebrow" style="margin-top: 12px;">
          <h2 class="cms-eyebrow-title">{{ category.categoryName }}</h2>
        </div>
        <ArticleMoreList :category-code="categoryCode" :page-size="10" />
      </div>
    </el-main>
    <my-footer />
  </el-container>
</template>

<script setup name="ThemeDefaultCategory">
import MyHeader from '@/views/web/header/header.vue'
import MyFooter from '@/views/web/footer/index'
import ArticleMoreList from '@/views/web/article/moreList'
import { useCategoryInfo } from '@/views/web/composables/useCategoryInfo'

const props = defineProps({
  categoryCode: {
    type: String,
    default: ''
  }
})

const categoryCode = toRef(props, 'categoryCode')
const category = useCategoryInfo(categoryCode)
</script>

<style scoped>
@import '@/assets/styles/cms.css';
@import '@/assets/styles/iconfont.css';

.category-detail {
  padding: 0;
}

.category-hero {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .category-hero :deep(.elImage-category) {
    height: 240px;
  }
}
</style>
