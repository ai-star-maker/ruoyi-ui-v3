<!--
  default 主题“文章详情”的通用兜底模板 (default.vue)
  ---------------------------------------------------------------
  注意：default 主题目前故意不提供专门的 post.vue —— 这正好演示了
  registry.js 里的模板回退链：当 useThemedComponent('post') 请求
  default 主题的 'post' 模板时，会在同一主题内自动回退到这个
  default.vue 上来渲染文章详情。

  如果未来 default 主题需要一个与"通用兜底"不同的、更精细的文章详情
  样式，再新增 theme/default/post.vue 即可，无需改动任何调用方
  （article/info.vue 完全不需要感知这个变化）。
-->
<template>
  <el-container direction="vertical">
    <my-header />
    <el-main class="article-main-body">
      <image-preview :src="category.image" :preview-src-list="[]" class="elImage-no-preview elImage-category" />
      <div class="article-box">
        <div class="category-header">{{ article.title }}</div>
        <div class="article-info">
          发布时间：{{ parseTime(article.createTime, '{y}-{m}-{d}') }}
          浏览次数：{{ article.articleCount?.views ?? 0 }}
        </div>
        <p class="ql-editor" v-html="article.content"></p>
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
@import '@/assets/styles/iconfont.css';
@import '@/assets/styles/cms.css';

.article-box {
  width: 80%;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.article-info {
  font-size: 16px;
  color: #808080;
}
</style>
