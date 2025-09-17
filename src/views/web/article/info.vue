<!-- 
 * 文章详情组件，根据site.theme加载theme_name/post.vue 如果没有加载infoDefault.vue
 -->
 <template>
    <component :is="currentPost" :article="article"></component>
</template>

<script setup name="ArticleInfo">
import useCmsStore from '@/store/modules/cms';
import infoDefault from "@/views/web/article/infoDefault";
import { getArticle } from "@/api/cms/article";
import { getSiteInfo, setSiteInfo } from "@/utils/cms";

const props = defineProps(['articleId'])
const { articleId } = toRefs(props)
const currentPost = shallowRef("")
const cmsStore = useCmsStore()
const article = ref("{content: ''}")

onBeforeMount(() => {
  getArticle(props.articleId).then(res => {
    article.value = res.data;
    let site = getSiteInfo(article.value.siteCode)
    //如果直接访问article/:id需要赋值store
    if (cmsStore.site.siteCode != site.siteCode) {
      console.log("article info set siteCode = " + site.siteCode + ",old=" + cmsStore.site.siteCode)
      setSiteInfo(site.siteCode)
    }

    currentPost.value = defineAsyncComponent({
      loader: () => import(/* @vite-ignore */`../theme/${site.theme}/post.vue`),
      errorComponent: infoDefault,
    }) 
  });
})

</script>

<style scoped>
@import '@/assets/styles/cms.css' ;
</style>