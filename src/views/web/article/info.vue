<!--
* 文章详情组件，根据site.theme加载theme_name/post.vue 如果没有加载infoDefault.vue
-->
<template>
  <Suspense>
    <template #default>
      <component :is="currentPost" :article="article" v-if="currentPost"></component>
    </template>
    <template #fallback>
      <div class="article-loading">
        <el-skeleton :rows="10" animated />
      </div>
    </template>
  </Suspense>
</template>

<script setup name="ArticleInfo">
import { defineAsyncComponent, shallowRef, ref, toRefs, onBeforeMount } from 'vue'
import useCmsStore from '@/store/modules/cms';
import infoDefault from "@/views/web/article/infoDefault";
import { getArticle } from "@/api/cms/article";
import { getSiteInfo, setSiteInfo } from "@/utils/cms";

const props = defineProps(['articleId'])
const { articleId } = toRefs(props)
const currentPost = shallowRef(null)
const cmsStore = useCmsStore()
const article = ref({ content: '' })

onBeforeMount(() => {
  getArticle(props.articleId).then(res => {
    article.value = res.data;
    const articleSite = getSiteInfo(article.value.siteCode)
    
    if (!articleSite) {
      console.warn('[ArticleInfo] Site not found for article')
      return
    }
    
    // 如果直接访问article/:id需要赋值store
    if (cmsStore.site.siteCode !== articleSite.siteCode) {
      console.log("[ArticleInfo] set siteCode = " + articleSite.siteCode + ",old=" + cmsStore.site.siteCode)
      setSiteInfo(articleSite.siteCode)
    }

    const themeName = articleSite.theme || 'default'
    currentPost.value = defineAsyncComponent({
      loader: () => import(/* @vite-ignore */`../theme/${themeName}/post.vue`),
      loadingComponent: () => import('@/components/LoadingFallback.vue').catch(() => null),
      errorComponent: infoDefault,
      delay: 200,
      timeout: 10000,
      onError(error, retry, fail, attempts) {
        console.warn(
          `[ArticleInfo] Failed to load post from theme ${themeName}:`,
          error.message
        )
        if (attempts < 2) {
          retry()
        } else {
          fail()
        }
      }
    }) 
  }).catch(err => {
    console.error('[ArticleInfo] Error loading article:', err)
  });
})
</script>

<style scoped>
@import '@/assets/styles/cms.css' ;

.article-loading {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
</style>
