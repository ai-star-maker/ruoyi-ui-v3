<!-- 
 * 文章列表组件
 * 被theme/default/category调用，更多页中显示10个和分页
 * 样式（缩略图 + 标题 + 摘要 + 日期）
 -->
 <template>
    <div class="cms-page article-more-list"> 
        <router-link
          v-for="(article, index) in articles"
          :key="index"
          :to="`/web/article/${article.articleId}`"
          class="more-row"
        >
            <div class="more-row-thumb">
                <image-preview :src="article.image" :preview-src-list="[]" class="elImage-no-preview" height="140px" />
            </div>
            <div class="more-row-body">
                <h3 class="more-row-title">{{ article.title }}</h3>
                <p class="more-row-desc">{{ article.description }}</p>
                <span class="more-row-date">{{ parseTime(article.createTime, '{y}-{m}-{d}') }}</span>
            </div>
        </router-link>

        <!-- 显示分页-->
        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getArticalList"
            />
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

.article-more-list {
  padding: var(--section-gap) 0;
  /* width: 80%;  */
}

.more-row {
  display: flex;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid var(--brand-line);
}

.more-row:first-child {
  padding-top: 0;
}

.more-row-thumb {
  flex: 0 0 220px;
}

.more-row-thumb :deep(.el-image) {
  width: 220px;
  height: 140px;
  display: block;
}

.more-row-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.more-row-title {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 18px;
  color: var(--brand-ink);
  line-height: 1.4;
  margin: 0 0 8px;
  transition: color 0.2s ease;
}

.more-row:hover .more-row-title {
  color: var(--brand-red);
}

.more-row-desc {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--brand-steel);
  line-height: 1.7;
  margin: 0 0 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.more-row-date {
  margin-top: auto;
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 0.02em;
  color: var(--brand-steel);
}

@media screen and (max-width: 768px) {
  .more-row {
    flex-direction: column;
    gap: 12px;
  }

  .more-row-thumb,
  .more-row-thumb :deep(.el-image) {
    width: 100%;
    height: 180px;
  }
}
</style>
