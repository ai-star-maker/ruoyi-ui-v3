<!--
* 文章列表装配器组件
* 职责：
* 1. 根据当前主题动态加载对应的文章列表组件 (list.vue)
* 2. 如果主题没有自定义 list.vue，使用默认的
* 3. 获取分类下的所有文章并传递给主题组件
* 
* 使用方式：
* - URL: /web/article/:categoryCode/more
* - 根据当前 store 中的 site.theme 自动选择相应的主题组件
-->
<template>
  <Suspense>
    <template #default>
      <component 
        v-if="currentList" 
        :is="currentList" 
        :category="category"
        :articles="articles"
        :total="total"
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

<script setup name="ArticleMore">
import { defineAsyncComponent, shallowRef, ref, toRefs, onBeforeMount } from 'vue'
import useCmsStore from '@/store/modules/cms'
import { listArticle } from "@/api/cms/article"
import { getCategoryInfo, setSiteInfo } from "@/utils/cms"
import { useTheme } from '@/composables/useTheme'

const props = defineProps(['categoryCode'])
const { categoryCode } = toRefs(props)
const cmsStore = useCmsStore()
const { loadThemeComponent } = useTheme()

const currentList = shallowRef(null)
const category = ref({})
const articles = ref([])
const total = ref(0)
const siteCode = ref('')
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  categoryCode: categoryCode.value,
  isAudited: '0'
})

onBeforeMount(async () => {
  try {
    // 1. 获取分类信息
    const categoryInfo = getCategoryInfo(categoryCode.value)
    if (!categoryInfo) {
      console.warn('[ArticleMore] Category not found')
      return
    }

    category.value = categoryInfo
    siteCode.value = categoryInfo.siteCode

    // 2. 切换到对应的站点
    if (cmsStore.site.siteCode !== categoryInfo.siteCode) {
      console.log('[ArticleMore] Switching site to:', categoryInfo.siteCode)
      setSiteInfo(categoryInfo.siteCode)
    }

    // 3. 获取分类下的所有文章
    queryParams.value.categoryCode = categoryCode.value
    const res = await listArticle(queryParams.value)
    articles.value = res.rows || []
    total.value = res.total || 0

    // 4. 动态加载主题的 list 组件
    const themeName = categoryInfo.site?.theme || cmsStore.site?.theme || 'default'
    console.log('[ArticleMore] Loading list component for theme:', themeName)
    
    currentList.value = await loadThemeComponent('list', themeName)

  } catch (err) {
    console.error('[ArticleMore] Error loading articles:', err)
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
