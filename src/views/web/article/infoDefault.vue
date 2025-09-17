<!-- 
 * 文章详情默认组件
 -->
<template>
  <el-container direction="vertical">
    <my-header />
    <el-main class='article-main-body'>
      <image-preview :src="category.image" :preview-src-list="[]" class="elImage-no-preview elImage-category"/>
      <div class="article-box">
        <div class="category-header"> {{article.title}} </div>
        <div class="article-info">发布时间：{{parseTime(article.createTime, '{y}-{m}-{d}') }} 浏览次数：{{article.articleCount.views}}</div>
        <p class="ql-editor" v-html="article.content"> </p>
      </div>
    </el-main>
    <my-footer/>
  </el-container>
</template>

<script setup name="infoDefault">

import MyHeader from '@/views/web/header/header.vue';
import MyFooter from '@/views/web/footer/index';
import { getCategoryInfo } from '@/utils/cms.js';
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

const props =defineProps(['article'])
const category = ref({image: null})
const { article } = toRefs(props)

onBeforeMount(() => {
    category.value = getCategoryInfo(article.value.categoryCode);
    console.log("infoDefault")
})

</script>

<style scoped>
@import '@/assets/styles/iconfont.css' ;
@import '@/assets/styles/cms.css';

/* --header-height: 60px; */

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