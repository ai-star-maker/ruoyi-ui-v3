<template>
  <el-container direction="vertical">
    <my-header :is-transparent="true" class="butter-style" />
    <WebAdvertise :height="'100vh'" />
    <el-main class="main-body">
      <div style="height:400px;color:red">
        {{ site.theme }} 主题样式
      </div>
    </el-main>
    <my-footer />
  </el-container>
</template>

<script setup name="ThemeButterfly">
import MyHeader from '@/views/web/header/header.vue'
import WebAdvertise from '@/views/web/advertise'
import MyFooter from '@/views/web/footer/index'
import { useThemeSite } from '@/views/web/composables/useThemeSite'

defineProps({
  siteCode: {
    type: String,
    default: ''
  }
})

const { site, categories } = useThemeSite()

const heroImage = computed(() => categories.value[0]?.image ?? '')
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
.butter-style {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.1);
  color: #fff;
}
:deep(.search-box) {
  padding: 5px 80px 0 20px !important;
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>

