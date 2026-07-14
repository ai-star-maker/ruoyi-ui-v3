<!--
* 搜索结果装配器组件
* 职责：
* 1. 根据当前主题动态加载对应的搜索结果组件 (search.vue)
* 2. 如果主题没有自定义 search.vue，使用默认的
* 3. 获取搜索结果并传递给主题组件
* 
* 使用方式：
* - URL: /web/search/:searchKey
* - 根据当前 store 中的 site.theme 自动选择相应的主题组件
-->
<template>
  <Suspense>
    <template #default>
      <component 
        v-if="currentSearch" 
        :is="currentSearch" 
        :searchKey="searchKey"
        :articles="articles"
        :total="total"
        :siteCode="siteCode"
      ></component>
    </template>
    <template #fallback>
      <div class="search-loading">
        <el-skeleton :rows="10" animated />
      </div>
    </template>
  </Suspense>
</template>

<script setup name="ArticleSearch">
import { defineAsyncComponent, shallowRef, ref, toRefs, onBeforeMount, watch } from 'vue'
import useCmsStore from '@/store/modules/cms'
import { listArticleByKeywords } from "@/api/cms/search"
import { setSiteInfo } from "@/utils/cms"
import { useTheme } from '@/composables/useTheme'

const props = defineProps(['searchKey'])
const { searchKey } = toRefs(props)
const cmsStore = useCmsStore()
const { loadThemeComponent } = useTheme()

const currentSearch = shallowRef(null)
const articles = ref([])
const total = ref(0)
const siteCode = ref('')
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  keyword: searchKey.value,
  isAudited: '0'
})

async function loadSearchResults() {
  try {
    // 1. 确保站点已初始化
    siteCode.value = cmsStore.siteCode

    // 2. 查询搜索结果
    queryParams.value.keyword = searchKey.value
    const res = await listArticleByKeywords(queryParams.value)
    articles.value = res.rows || []
    total.value = res.total || 0

    // 3. 动态加载主题的 search 组件
    const themeName = cmsStore.site?.theme || 'default'
    console.log('[ArticleSearch] Loading search component for theme:', themeName)
    
    currentSearch.value = await loadThemeComponent('search', themeName)

  } catch (err) {
    console.error('[ArticleSearch] Error loading search results:', err)
  }
}

onBeforeMount(() => {
  loadSearchResults()
})

// 监听搜索关键词变化
watch(
  () => searchKey.value,
  () => {
    queryParams.value.pageNum = 1
    loadSearchResults()
  }
)
</script>

<style scoped>
@import '@/assets/styles/cms.css';

.search-loading {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
