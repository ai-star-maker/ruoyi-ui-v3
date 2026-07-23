<!--
  default 主题“文章详情”的通用兜底模板 (default.vue)
  ---------------------------------------------------------------
  内容迁移自旧版article/infoDefault.vue  router:web/article/:articleId
  注意：default 主题目前故意不提供专门的 post.vue —— 这正好演示了
  registry.js 里的模板回退链：当 useThemedComponent('post') 请求
  default 主题的 'post' 模板时，会在同一主题内自动回退到这个
  default.vue 上来渲染文章详情。

  如果未来 default 主题需要一个与"通用兜底"不同的、更精细的文章详情
  样式，再新增 theme/default/post.vue 即可，无需改动任何调用方
  （article/info.vue 完全不需要感知这个变化）。
-->
<template>
  <el-container direction="vertical" class="cms-page">
    <my-header />
    <el-main class="article-detail">
      <div class="article-hero">
        <image-preview :src="category.image" :preview-src-list="[]" class="elImage-no-preview elImage-category" />
      </div>

      <div class="cms-container">
        <div class="article-copy">
          <div class="cms-eyebrow article-eyebrow">
            <span class="cms-eyebrow-title article-eyebrow-title">{{ category.categoryName }}</span>
          </div>

          <h1 class="article-title">{{ article.title }}</h1>

          <div class="article-meta">
            <span>{{ parseTime(article.createTime, '{y}-{m}-{d}') }}</span>
            <span class="article-meta-dot">·</span>
            <span>浏览 {{ article.articleCount?.views ?? 0 }}</span>
          </div>

          <div class="article-rule"></div>

          <div class="ql-editor article-prose" v-html="article.content"></div>
        </div>
      </div>
    </el-main>
    <my-footer />
  </el-container>
</template>

<script setup name="ThemeDefaultFallback">
import MyHeader from '@/views/web/header/header.vue'
import MyFooter from '@/views/web/footer/index'
import { useCategoryInfo } from '@/views/web/composables/useCategoryInfo'
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"

// 目前只被 'post' 模板的回退链用到，因此约定接收 `article`。
// 若后续也被 'page' 等其它模板的回退链复用，注意保持 prop 名称的兼容性，
// 或改为按 templateName 分支渲染不同内容。
const props = defineProps(['article'])
const { article } = toRefs(props)

//17行经常出现category.image为空的情况，改为watch
//category.value = getCategoryInfo(article.value.categoryCode)
const category = useCategoryInfo(computed(() => article.value.categoryCode))
</script>

<style scoped>
@import '@/assets/styles/cms.css';
@import '@/assets/styles/iconfont.css';

.article-detail {
  padding: 0;
}

.article-hero {
  width: 100%;
}

/* 文章正文用一个比 --content-max 更窄的阅读列宽，图文头图仍然占满
   .cms-container 的完整宽度——头图"敢用整版"，正文"克制到易读宽度"，
   两种尺度的对比本身也是一种排版语言，不是疏漏。 */
.article-copy {
  /* max-width: 760px;
  margin: 0 auto;
  padding: var(--section-gap) 0; */
}

.article-eyebrow {
  margin-bottom: 20px;
  margin-top: 20px;
}

.article-eyebrow-title {
  font-size: 15px;
  color: var(--brand-steel);
}

.article-title {
  font-size: 34px;
  line-height: 1.25;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--brand-steel);
}

.article-meta-dot {
  opacity: 0.6;
}

.article-rule {
  height: 1px;
  background: var(--brand-line);
  margin: 24px 0 32px;
}

.article-prose {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.9;
  color: var(--brand-ink);
}

.cms-page :deep(h3) {
  font-weight: 500 !important;
  letter-spacing: 0em !important;
}

@media screen and (max-width: 768px) {
  .article-hero :deep(.elImage-category) {
    height: 240px;
  }

  .article-title {
    font-size: 26px;
  }
}
</style>
