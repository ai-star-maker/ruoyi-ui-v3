<!-- 
 * 文章列表组件
 * 被theme/default/category调用，更多页中显示10个和分页
 * 样式（缩略图 + 标题 + 摘要 + 日期）
 -->
 <template>
  <div class="cms-page cms-row-list"> 
      <router-link
        v-for="(article, index) in articles"
        :key="index"
        :to="`/web/article/${article.articleId}`"
        class="cms-row-item"
      >
          <div class="cms-row-thumb">
              <image-preview :src="article.image" :preview-src-list="[]" class="elImage-no-preview" height="140px" />
          </div>
          <div class="cms-row-body">
              <h3 class="cms-row-title">{{ article.title }}</h3>
              <p class="cms-row-desc">{{ article.description }}</p>
              <span class="cms-row-date">{{ parseTime(article.createTime, '{y}-{m}-{d}') }}</span>
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
</style>
