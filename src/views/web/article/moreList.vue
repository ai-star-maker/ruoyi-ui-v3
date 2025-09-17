<!-- 
 * 文章列表组件
 * 被articleMore调用，更多页中显示10个和分页
 -->
<template>
    <div class="search-result"> 
        <div class="search-resule-item">
        <el-row v-for="(article, index) in articles" :key="index" :gutter="20">
            <el-col :span="6" >
                <image-preview :src="article.image" :preview-src-list="[]" class="elImage-no-preview" style="height:150px" />
            </el-col>
            <el-col :span="18" >
                <router-link :to="`/web/article/${article.articleId}`" style="display:flex; width:100%"> 
                <el-col :span="16" >
                    <div class="article-list-item2-wrap" > {{article.title}} </div>
                </el-col>
                <el-col :span="8"> {{parseTime(article.createTime, '{y}-{m}-{d}') }}</el-col>
                </router-link>
                <el-row ></el-row>
                <el-col :span="24"> 文章概要： 
                    <div class="article-desc" > {{article.description}} </div>
                </el-col>
            </el-col>
        </el-row> 
           
        <!-- 显示分页-->
        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getArticalList"
            />
        </div>
    </div>
</template>

<script setup name="ArticleMoreList">
import { listArticle } from "@/api/cms/article";

const props = defineProps(['categoryCode', 'pageSize'])
const articles = ref([{image:null}])
const total = ref(0)
const loading = ref(true)
const imageHeight = ref(100+'%')

const queryParams = ref({
    pageNum: 1,
    pageSize: props.pageSize,
    categoryCode: props.categoryCode,
    isAudited: '0'
})

watch(() => props.categoryCode, (newVal, oldVal) => {
    queryParams.value.categoryCode = props.categoryCode;
    getArticalList();
})

onBeforeMount(() => {
    getArticalList();
    if (queryParams.value.pageSize > 5) imageHeight.value = '300px';
})
   
function getArticalList() {
    listArticle(queryParams.value).then(res => {
        if (res.total > 0) articles.value = res.rows;
        else articles.value = [{image: null }];
        total.value = res.total;
        loading.value = false;
    });
}
   
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

.el-row {
  border-bottom: 1px solid #dedfe2;
}

</style>