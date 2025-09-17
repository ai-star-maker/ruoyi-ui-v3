<!-- 
 * 文章列表组件 
 * 首页中显示5个新闻
 -->
<template>
    <div class="article-list_news"> 
        <div class="article-list-item1">
            <image-preview :src="articles[0].image" :preview-src-list="[]" :height="imageHeight" />
            <div class="article-list-item1-item">
                <router-link :to="`/web/article/${articles[0].articleId}`">
                    {{articles[0].title}} 
                </router-link>
            </div>
        </div>
        <div class="article-list-item2">
            <template v-for="(article, index) in articles" :key="index">
                <el-row :gutter="20">
                    <el-col :span=14 class="article-list-item2-wrap"> 
                        <router-link :to="`/web/article/${article.articleId}`" > 
                            {{article.title}} 
                        </router-link> 
                    </el-col>
                    <el-col :span=10 > {{parseTime(article.createTime, '{y}-{m}-{d}') }}</el-col>
                </el-row> 
            </template>
            <!--首页中显示MORE -->
            <div class="article-list-item2-more">
                <router-link :to="`/web/article/${articles[0].categoryCode}/more`"> 
                    <a style="font-size:15px">MORE</a>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup name="ArticleList">
const props = defineProps(['articles', 'pageSize'])
const articles = toRef(props, 'articles')
const loading = ref(true)
const imageHeight = ref(100+'%')

onBeforeMount(() => {
    if (props.pageSize > 5) imageHeight.value = '300px';
    loading.value = false;
    if (articles.value.length <= 0) articles.value=[{ image:'' }]
})
   
</script>

<style scoped>
@import '@/assets/styles/cms.css';

@media screen and (max-width: 768px) {
    .article-list_news {
        flex-direction: column !important;
    }
    .article-list-item1-item {
        bottom: 10px;
    }
}

.article-list-item1-item {
    position: absolute;
    padding: 10px;
    color: white;
    font-size: 17px;
    margin-top: -40px;
}

.article-list-item2-more {
    position: absolute;
    color: #999; 
    font-size:18px; 
    bottom: -18px;
    right: 4px;
}

</style>