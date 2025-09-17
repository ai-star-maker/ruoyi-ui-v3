<!-- 
 * 文章更多列表组件
 * 首页中点击新闻的MORE、menu中的栏目，调用此组件
 -->
<template>
  <el-container direction="vertical">
    <my-header />
    <el-main class='article-main-body'>
      <image-preview :src="category.image" :preview-src-list="[]" class="elImage-no-preview elImage-category" />
      <div class="category-header"> {{category.categoryName}} </div>
      <ArticleMoreList :category-code="categoryCode" :pageSize="10" > </ArticleMoreList>
    </el-main>
    <my-footer/>
  </el-container>
</template>

<script setup name="ArticleMore">
import useCmsStore from '@/store/modules/cms';
import MyHeader from '../header/header';
import { getCategoryInfo } from '@/utils/cms.js';
import ArticleMoreList from "./moreList";
import MyFooter from '../footer/index.vue';

const props = defineProps(['categoryCode'])
const category = ref([])
const siteCode = ref("")
const categoryCode = toRef(props, 'categoryCode')

watch(categoryCode, (newVal, oldVal) => {
  console.log("more categoryCode", categoryCode.value)
  category.value = getCategoryInfo(categoryCode.value);
})

onBeforeMount(() => {
  siteCode.value = useCmsStore().siteCode;
  category.value = getCategoryInfo(categoryCode.value);
})

</script>

<style scoped>
@import '@/assets/styles/iconfont.css' ;
@import '@/assets/styles/cms.css' ;
</style>