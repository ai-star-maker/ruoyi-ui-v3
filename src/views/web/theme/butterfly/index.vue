<!--
  butterfly 主题首页
  ---------------------------------------------------------------
  定位（见 theme/butterfly/config.json）："全屏广告位 + 透明导航的
  展示型布局，适合形象展示类站点"。这决定了它和 default 主题应该在
  内容密度、节奏上刻意不同，而不是同一套版式换个配色：

    default   —— 编辑室/资讯站节奏：每个栏目一个"标题+列表"密集分区，
                  适合内容更新频繁、需要快速浏览多条目的站点。
    butterfly —— 形象展示节奏：每个栏目一个全宽"图文半版"大板块，
                  一次只讲一件事，适合品牌/产品展示类站点。
-->
<template>
  <el-container direction="vertical" class="cms-page">
    <my-header :is-transparent="true" class="butter-style" />

    <WebAdvertise :height="'100vh'" />

    <el-main class="main-body">
      <section class="intro-band" v-if="site.title || site.description">
        <div class="cms-container intro-inner">
          <h2 class="intro-title">{{ site.title || site.siteName }}</h2>
          <p class="intro-desc">{{ site.description }}</p>
        </div>
      </section>

      <section
        v-for="(item, index) in showcaseItems"
        :key="item.category.categoryCode"
        class="showcase-row"
        :class="{ 'showcase-row--reverse': index % 2 === 1, 'showcase-row--mist': index % 2 === 1 }"
      >
        <router-link :to="`/web/article/${item.article.articleId}`" class="showcase-media">
          <image-preview :src="item.article.image" :preview-src-list="[]" class="elImage-no-preview" height="100%" />
        </router-link>

        <div class="showcase-copy">
          <div class="cms-eyebrow showcase-eyebrow">
            <span class="cms-eyebrow-title showcase-eyebrow-title">{{ item.category.categoryName }}</span>
          </div>
          <h2 class="showcase-title">{{ item.article.title }}</h2>
          <p class="showcase-desc">{{ item.article.description }}</p>
          <router-link :to="`/web/article/${item.article.articleId}`" class="cms-action-link">
            了解更多
          </router-link>
        </div>
      </section>
    </el-main>

    <my-footer />
  </el-container>
</template>

<script setup name="ThemeButterfly">
import MyHeader from '@/views/web/header/header.vue'
import WebAdvertise from '@/views/web/advertise'
import MyFooter from '@/views/web/footer/index'
import { listArticle } from '@/api/cms/article'
import { useThemeSite } from '@/views/web/composables/useThemeSite'

// siteCode 由 ThemeLoader 传入，仅作展示/埋点用途，实际数据走 useThemeSite()。
defineProps({
  siteCode: {
    type: String,
    default: ''
  }
})

const { site, categories } = useThemeSite()

const visibleCategories = computed(() =>
  categories.value.filter(category => category.inList === 'Y')
)

const showcaseItems = ref([])

// 每个栏目只取一条头条文章，组成"图文半版"展示板块。这里没有复用
// ArticleIndex/ArticleList（default 主题密集列表用的那一套），因为
// 展示型板块的数据需求很简单（每栏目 1 条），且展示形态和 default
// 完全不同，勉强复用反而需要在共享组件里加分支逻辑，不如themes各自
// 按自己的版式取数据更清楚。
async function loadShowcase() {
  const results = await Promise.all(
    visibleCategories.value.map(async (category) => {
      const res = await listArticle({
        categoryCode: category.categoryCode,
        isAudited: '0',
        pageNum: 1,
        pageSize: 1
      })
      return { category, article: res.rows?.[0] }
    })
  )
  showcaseItems.value = results.filter(item => item.article)
}

watch(visibleCategories, loadShowcase, { immediate: true })
</script>

<style scoped>
@import '@/assets/styles/cms.css';

.main-body {
  height: 100%;
  width: 100%;
  padding: 0px;
}

/* 透明导航悬浮在 Hero 图上——position:absolute 让它脱离文档流，
   不把下面的 WebAdvertise 顶下去；轻微的黑色蒙层只是为了保证文字/
   图标在任意一张轮播图上都还读得清楚，颜色本身由 header.vue 内部的
   --nav-fg-idle / --nav-fg-active 统一处理，这里不用再强行覆盖文字色。 */
.butter-style {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* background-color: rgba(0, 0, 0, 0.15); */
}

.intro-band {
  padding: var(--section-gap) 0;
  text-align: center;
}

.intro-inner {
  max-width: 720px;
}

.intro-title {
  font-size: 30px;
  margin-bottom: 16px;
}

.intro-desc {
  font-size: 16px;
}

.showcase-row {
  display: flex;
  min-height: 480px;
}

.showcase-row--reverse {
  flex-direction: row-reverse;
}

.showcase-row--mist {
  background: var(--brand-mist);
}

.showcase-media {
  flex: 0 0 50%;
  display: block;
  overflow: hidden;
}

.showcase-media :deep(.el-image) {
  width: 100%;
  height: 100%;
  display: block;
}

.showcase-media :deep(.el-image__inner) {
  object-fit: cover;
}

.showcase-copy {
  flex: 0 0 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px 72px;
}

.showcase-eyebrow-title {
  font-size: 15px;
  color: var(--brand-steel);
}

.showcase-title {
  font-size: 28px;
  line-height: 1.3;
  margin: 4px 0 16px;
}

.showcase-desc {
  margin-bottom: 24px;
  max-width: 440px;
}

:deep(.search-box) {
  padding: 5px 80px 0 20px !important;
  background-color: rgba(0, 0, 0, 0) !important;
}

@media screen and (max-width: 768px) {
  .showcase-row,
  .showcase-row--reverse {
    flex-direction: column;
    min-height: 0;
  }

  .showcase-media {
    flex: 0 0 auto;
    height: 260px;
  }

  .showcase-copy {
    flex: 0 0 auto;
    padding: 32px 24px;
  }
}
</style>
