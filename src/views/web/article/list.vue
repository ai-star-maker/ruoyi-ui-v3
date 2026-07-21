<!-- 
 * 文章列表组件 
 * 首页中显示5个新闻
 -->
 <template>
    <div class="cms-page article-feature-grid"> 
        <router-link :to="`/web/article/${articles[0].articleId}`" class="cms-card-feature feature-col">
            <image-preview :src="articles[0].image" :preview-src-list="[]" :height="imageHeight" />
            <div class="cms-card-feature-overlay">
                <p class="cms-card-feature-title">{{ articles[0].title }}</p>
            </div>
        </router-link>

        <div class="list-col">
            <template v-for="(article, index) in articles" :key="index">
                <router-link :to="`/web/article/${article.articleId}`" class="cms-card-list-item">
                    <span class="cms-card-list-item-title">{{ article.title }}</span>
                    <span class="cms-card-list-item-meta">{{ parseTime(article.createTime, '{y}-{m}-{d}') }}</span>
                </router-link>
            </template>

            <router-link :to="`/web/article/${articles[0].categoryCode}/more`" class="cms-action-link more-link">
                MORE
            </router-link>
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
    .article-feature-grid {
        flex-direction: column !important;
    }
}

.article-feature-grid {
    width: 80%;
    display: flex;
    gap: 32px;
}

.feature-col {
    flex: 0 0 58%;
}

.list-col {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.more-link {
    margin-top: 20px;
    align-self: flex-end;
}
</style>