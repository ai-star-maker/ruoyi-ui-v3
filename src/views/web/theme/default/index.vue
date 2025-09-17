<template>
  <el-container direction="vertical">
    <my-header />
    <el-main class='main-body'>
      <WebAdvertise></WebAdvertise>
      <template v-for="(category, index) in categories" >
        <template v-if="category.inList === 'Y'">
          <div class="category-header" :key="index+100"> {{category.categoryName}} </div>
          <ArticleIndex :category-code="category.categoryCode" :showModes="category.showModes" :key="index"> </ArticleIndex>
        </template>
      </template>
    </el-main>
    <my-footer/>
  </el-container>
</template>

<script setup name="defaultIndex">
import MyHeader from '@/views/web/header/header.vue';
import WebAdvertise from '@/views/web/advertise';
import ArticleIndex from '@/views/web/article/index';
import MyFooter from '@/views/web/footer/index';
import useCmsStore from '@/store/modules/cms'

const props = defineProps(['siteCode'])
const categories = ref([])

//未用props的siteCode
const cmsStore = useCmsStore()
const { siteCode, site } = storeToRefs(cmsStore)
categories.value = site.categories;

watch(siteCode, (New, Old) => {
  categories.value = cmsStore.site.categories;
  console.log("default:watch.siteCode=" + siteCode.value + ",newVal=" + New + ",old=" + Old);
}, { immediate: true })

</script>

<style scoped>
@import '@/assets/styles/cms.css' ;

.main-body {
  height: 100%;
  width: 100%;
  padding: 0px;
}
.main-footer {
  height: 6vh;
  text-align: center;
}

</style>

<style>
body {
  --news-picture-width: 40%;
  --news-list-width: 60%;
  --pic-list-width: 33.3%;
  --media-width: 768px;
}

@media screen and (max-width:768px) {
  body {
    --news-picture-width: 100%;
    --news-list-width: 100%;
    --pic-list-width: 100%
  }
}
a:hover {
  color: var(--hover-color); transition: all .6s
}
</style>