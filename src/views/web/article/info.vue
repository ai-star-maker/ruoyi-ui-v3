<!--
  文章详情组件
  ---------------------------------------------------------------
  根据 site.theme 加载 theme/<themeName>/post.vue。
    - 主题没有 post.vue -> 在同一主题内回退到 default.vue
    - 主题连 default.vue 都没有 -> 回退到系统默认主题（theme/default/default.vue）
  防止getArticle()未返回加载组件，未将article透传的问题，怎加<v-if>判断
  因为存在setSiteInfo的情况，可能导致useThemedComponent返回的组件错误，setSiteInfo后再加载的问题
     所以在useThemedComponent中加入enabled开关
-->
<template>
  <component v-if="ready" :is="component" :key="componentKey" :article="article" />
  <div v-else>文章加载中...</div>
</template>

<script setup name="ArticleInfo">
import useCmsStore from '@/store/modules/cms'
import { getArticle } from "@/api/cms/article"
import { getSiteInfo, setSiteInfo } from "@/utils/cms"
import { useThemedComponent } from '@/views/web/composables/useThemedComponent'

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true
  }
})

const cmsStore = useCmsStore()
const article = ref({ content: '' })
const ready = ref(false)

const { component, componentKey } = useThemedComponent('post', undefined, { enabled: ready })

async function loadArticle(articleId) {
  ready.value = false

  const res = await getArticle(articleId)
  article.value = res.data

  const site = getSiteInfo(article.value.siteCode)
  if (site && cmsStore.siteCode !== site.siteCode) {
    setSiteInfo(site.siteCode)
  } else if (!site) {
    // 站点主数据里查不到这篇文章所属的站点（可能还没加载完，或该站点已下线/被过滤）。
    // 不阻塞文章展示，但明确告警，避免误以为是"随机抽风"。
    console.warn(`[article] 未找到文章所属站点 (siteCode=${article.value.siteCode})，将使用当前站点主题渲染。`)
  }

  // 等一个 tick：如果上面调用了 setSiteInfo，store 的变化需要先被
  // useThemedComponent 内部的 watch 处理、解析出新主题的 componentKey，
  // 再把 ready 打开去挂载模板 —— 这样模板组件第一次 setup() 时，
  // props.article 拿到的就已经是这篇文章的最终数据，不会经历"先空后有"。
  await nextTick()
  ready.value = true
}

// 用 watch 而不是 onBeforeMount：同一路由记录下只切换 articleId 时
// Vue Router 会复用组件实例，onBeforeMount 不会再次触发。
watch(
  () => props.articleId,
  (id) => {
    if (id) loadArticle(id)
  },
  { immediate: true }
)
</script>
