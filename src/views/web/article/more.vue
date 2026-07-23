<!-- 
 * 栏目的文章列表组件 首页中点击新闻的MORE、menu中的栏目，调用此组件动态加载category.vue
 * 路由：/web/article/:categoryCode/more

   统一走 useThemedComponent('category')，规则与 'post' 完全一致：
    - 主题有 category.vue      -> 用它
    - 主题没有，但有 default.vue -> 回退到 default.vue
    - 都没有                    -> 回退到系统默认主题
 -->

<template>
  <component :is="component" :key="componentKey" :category-code="categoryCode" />
</template>

<script setup name="ArticleMore">
import { useThemedComponent } from '@/views/web/composables/useThemedComponent'

const props = defineProps(['categoryCode'])
const categoryCode = toRef(props, 'categoryCode')

// 不传 explicitTheme：栏目列表页永远使用当前站点配置的主题，
// 与 post 一样不支持路由级主题预览覆盖。
const { component, componentKey } = useThemedComponent('category')
</script>
