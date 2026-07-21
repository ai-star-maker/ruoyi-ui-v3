<!--
  default主题首页
  <el-container>
    <my-header>
    <el-main>
      <WebAdvertise>
      <ArticleIndex>（新闻行+产品行） -> <ArticleList>(5行新闻)
    <my-footer>
-->

<template>
  <el-container direction="vertical" class="cms-page">
    <my-header />
    <el-main class="main-body">
      <!-- Hero：已有的 WebAdvertise 轮播本身就是全宽、数据驱动的头图，
           这里不重新造一个"取第一篇文章"的专用 Hero 接口，只在视觉上
           把它的指示点/箭头改成品牌色，见下方 :deep() 规则。 -->
      <div class="hero-band">
        <WebAdvertise />
      </div>

      <div class="cms-container">
        <template v-for="category in visibleCategories" :key="category.categoryCode">
          <section class="cms-section">
            <div class="cms-eyebrow">
              <h2 class="cms-eyebrow-title">{{ category.categoryName }}</h2>
            </div>
            <ArticleIndex :category-code="category.categoryCode" :show-modes="category.showModes" />
          </section>
        </template>
      </div>
    </el-main>
    <my-footer />
  </el-container>
</template>

<script setup name="ThemeDefault">
import MyHeader from '@/views/web/header/header.vue'
import WebAdvertise from '@/views/web/advertise'
import ArticleIndex from '@/views/web/article/index'
import MyFooter from '@/views/web/footer/index'
import { useThemeSite } from '@/views/web/composables/useThemeSite'

// siteCode 由 ThemeLoader (views/web/index.vue) 传入，仅作展示/埋点用途。
// 实际站点数据一律通过 useThemeSite() 获取，不要在主题组件里自行读取 store。
defineProps({
  siteCode: {
    type: String,
    default: ''
  }
})

const { categories } = useThemeSite()

const visibleCategories = computed(() =>
  categories.value.filter(category => category.inList === 'Y')
)
</script>

<style scoped>
@import '@/assets/styles/cms.css';

.main-body {
  height: 100%;
  width: 100%;
  padding: 0px;
  background: var(--brand-paper);
}

.hero-band {
  position: relative;
  /* background: var(--brand-ink); */
}

/* WebAdvertise 内部用的是 el-carousel，这里只重绘指示点/箭头配色，
   不改动该组件本身的逻辑（保持"不修改共享区块组件"的原则）。 */
.hero-band :deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: var(--brand-red);
}

.hero-band :deep(.el-carousel__indicator .el-carousel__button) {
  background-color: rgba(255, 255, 255, 0.5);
}

.hero-band :deep(.el-carousel__arrow) {
  background-color: rgba(26, 26, 26, 0.5);
}
</style>
