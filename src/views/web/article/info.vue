<!--
* 文章详情装配器组件
* 职责：
* 1. 根据当前主题动态加载对应的文章详情组件 (post.vue)
* 2. 如果主题没有自定义 post.vue，使用默认的
* 3. 获取文章数据并传递给主题组件
* 
* 使用方式：
* - URL: /web/article/:articleId
* - 根据当前 store 中的 site.theme 自动选择相应的主题组件
-->
<template>
  <Suspense>
    <template #default>
      <component 
        v-if="currentPost" 
        :is="currentPost" 
        :article="article"
        :siteCode="siteCode"
      ></component>
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
import useCmsStore from '@/store/modules/cms'
import { getArticle } from "@/api/cms/article"
import { getSiteInfo, setSiteInfo } from "@/utils/cms"
import { useTheme } from '@/composables/useTheme'

const props = defineProps(['articleId'])
const { articleId } = toRefs(props)
const cmsStore = useCmsStore()
const { loadThemeComponent } = useTheme()

const currentPost = shallowRef(null)
const article = ref({ content: '' })
const siteCode = ref('')

onBeforeMount(async () => {
  try {
    // 1. 获取文章数据
    const res = await getArticle(props.articleId)
    article.value = res.data
    siteCode.value = article.value.siteCode

    // 2. 如果直接访问文章URL，需要确保站点已切换
    const articleSite = getSiteInfo(article.value.siteCode)
    if (!articleSite) {
      console.warn('[ArticleInfo] Site not found for article')
      return
    }

    if (cmsStore.site.siteCode !== articleSite.siteCode) {
      console.log('[ArticleInfo] Switching site to:', articleSite.siteCode)
      setSiteInfo(articleSite.siteCode)
    }

    // 3. 动态加载主题的 post 组件
    // useTheme 会自动处理fallback，如果主题没有 post.vue 会使用 shared/DefaultPost.vue
    const themeName = articleSite.theme || 'default'
    console.log('[ArticleInfo] Loading post component for theme:', themeName)
    
    currentPost.value = await loadThemeComponent('post', themeName)

  } catch (err) {
    console.error('[ArticleInfo] Error loading article:', err)
  }
})
</script>

<style scoped>
@import '@/assets/styles/cms.css';

.article-loading {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
