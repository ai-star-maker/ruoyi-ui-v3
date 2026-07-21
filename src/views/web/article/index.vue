<!-- 
 * 首页中文章组件 支持News模式，左边图片右边列表
 * Product模式，三张图片
 -->
<template>
    <div class="mainBox">
        <template v-if="showModes === 'News'" > 
            <ArticleList :articles="articles" :pageSize="pageSize" > </ArticleList>
        </template>
        <div v-else class="article-list">
            <template v-for="(article, index) in articles.slice(0, 3)" :key="index">
                <image-preview :src="article.image" :preview-src-list="[]" />
            </template>
        </div>
    </div>
</template>

<script setup name = "ArticleIndex">
import { listArticle } from "@/api/cms/article";
import ArticleList from "./list";
import { toRefs } from "vue";
import useCmsStore from '@/store/modules/cms'

const props = defineProps(['categoryCode', 'showModes'])
const articles = ref([{image:null}]) 
const pageSize = ref(5)
const { categoryCode, showModes } = toRefs(props)

onBeforeMount(() => {
    if (showModes !== 'N') {
        getArticalList();
    }
})

function getArticalList() {
    let queryParams = {
        categoryCode: categoryCode.value,
        isAudited: '0',
        pageSize: pageSize.value,
    }
    listArticle(queryParams).then(res => {
        articles.value = res.rows;
    });
}

const cmsStore = useCmsStore()
const { siteCode } = storeToRefs(cmsStore)
watch(() => siteCode, (New, Old) => {
    if (showModes !== 'N') {
        getArticalList();
    }
    //console.log("articleIndex:watch.siteCode=" + siteCode.value + ",newVal=" + New + ",old=" + Old);
}, { immediate: false })

</script>

<style scoped>
@media screen and (max-width: 768px) {
    .article-list {
        flex-direction: column !important;
    }
}
.mainBox {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.article-list {
    width: 80%;
    display: flex;
    flex-direction: row;
    gap:20px
}

</style>