<template>
  
  <!-- <el-container direction="vertical" :style="{backgroundImage:'url('+getImage+')'}"> -->
  <el-container direction="vertical" >
    <my-header :isTransparent="true" class="butter-style" />
    <WebAdvertise :height="100+'vh'" />
    <el-main class='main-body' >
      <div style="height:400px;color:red">
        {{site.theme}} 主题样式
      </div>
    </el-main>
    <my-footer/>
  </el-container>
</template>

<script setup name="butterflyIndex">
import MyHeader from '@/views/web/header/header.vue';
import WebAdvertise from '@/views/web/advertise';
import ArticleIndex from '@/views/web/article/index';
import MyFooter from '@/views/web/footer/index';
import useCmsStore from '@/store/modules/cms'

import { getImagePath } from '@/utils/cms.js'

const props = defineProps(['siteCode'])
const categories = ref([])

//未用props的siteCode
const cmsStore = useCmsStore()
const { siteCode, site } = storeToRefs(cmsStore)
categories.value = site.categories;
  
watch(siteCode, (New, Old) => {
  categories.value = cmsStore.site.categories;
  console.log("butterfly:watch.siteCode=" + siteCode.value + ",newVal=" + New + ",old=" + Old);
}, { immediate: true })

let getImage = computed(() => {
    return getImagePath(categories[0].image);
})
 
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

.butter-style {
  position: absolute; 
  background-color:rgba(0,0,0,0.1); 
  color: #fff
}

:deep(.search-box) {
  padding: 5px 80px 0 20px !important; 
  background-color:rgba(0,0,0,0) !important; 
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
  color: #e73434; transition: all .6s
}
</style>