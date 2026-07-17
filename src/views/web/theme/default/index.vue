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

<script setup name="ThemeDefaultIndex">
import MyHeader from '@/views/web/header/header.vue';
import WebAdvertise from '@/views/web/advertise';
import ArticleIndex from '@/views/web/article/index';
import MyFooter from '@/views/web/footer/index';
import { useThemeSite } from '@/views/web/composables/useThemeSite'

defineProps({
  siteCode: {
    type: String,
    default: ''
  }
})

const { categories } = useThemeSite()
</script>

<style scoped>

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

