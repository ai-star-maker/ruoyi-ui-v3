<!-- 
 * 搜索结果页面组件
 * ---------------------------------------------------------------
 * 套用已经确立的内容页版式——头图 + .cms-container + .cms-eyebrow 
 *（见 theme/default/default.vue、category.vue）
 * 文章列表行复用 moreList.vue 
 -->
 <template>
  <el-container direction="vertical" class="cms-page">
    <my-header />
    <el-main class="search-detail">
      <div class="search-hero">
        <image-preview :src="category.image" :preview-src-list="[]" class="elImage-no-preview elImage-category" />
      </div>

      <div class="cms-container">
        <div class="cms-eyebrow">
          <h2 class="cms-eyebrow-title" v-html="searchResult"></h2>
        </div>

        <div class="cms-row-list">
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
              <h3 class="cms-row-title" v-html="highlineKey(article.title, props.searchKey)"></h3>
              <p class="cms-row-desc" v-html="highlineKey(article.description, props.searchKey)"></p>
              <span class="cms-row-date">{{ parseTime(article.createTime, '{y}-{m}-{d}') }}</span>
            </div>
          </router-link>

          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getArticalList"
          />
        </div>
      </div>
    </el-main>
    <my-footer />
  </el-container>
</template>

<script setup name="ArticleSearch">
import useCmsStore from '@/store/modules/cms';
import MyHeader from '@/views/web/header/header.vue';
import MyFooter from '@/views/web/footer/index.vue';
import { getCategoryInfo, setSiteInfo} from '@/utils/cms.js';
import { listArticleByKeywords } from "@/api/cms/search";
import { getCurrentInstance } from 'vue';

const props = defineProps(['searchKey']) 

const category = ref({ image: '' })
const articles = ref([{ image: '' }])
const categoryCode = ref("")
const total = ref(0)
const loading = ref(true)
const imageHeight = ref(100+'%')
const searchResult = ref("查询结果")
const cmsStore = useCmsStore()
const { proxy } = getCurrentInstance()

const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  siteCode: null,  //传递siteCode用于查询指定网站的文章 并插入cmsSearch
  keyword: toRef(props, 'searchKey') //描述包含searchKey
})

onBeforeMount(() => {
  let code = proxy.$route.query.siteCode;
  if (code == null) code = cmsStore.siteCode;
  else if (code !== cmsStore.siteCode) {
    //如果首先打开search页需要初始化
    setSiteInfo(code);
  }
  queryParams.value.siteCode = code;
  getArticalList();
})

watch(() => props.searchKey, (newVal, oldVal) => {
  getArticalList();
})

function getArticalList() {
  listArticleByKeywords(queryParams.value).then(res => {
      if (res.total > 0) {
        categoryCode.value = res.rows[0].categoryCode;
        articles.value = res.rows;
      }
      else {
        categoryCode.value = cmsStore.site.categories[0].categoryCode; 
      }
      category.value = getCategoryInfo(categoryCode.value);
      total.value = res.total;
      loading.value = false;
      let result = "找到关于'"+ props.searchKey+"'结果"+total.value+"条";
      searchResult.value = highlineKey(result, props.searchKey);
  })
}

function highlineKey(oldText, oldKey) {
  if (oldText == null) return;
  let newString = "";
  let startPos = 0;
  let text = oldText.toUpperCase();
  let key = oldKey.toUpperCase();
  while (startPos < text.length) {
    const index = text.indexOf(key, startPos);
    if (index == -1) break;
    newString = newString.concat(text.substring(startPos, index), 
      "<span class='search-key'>" + key + "</span>");
    startPos = index + key.length;
  }
  return newString.concat('', text.substring(startPos));
}
 
</script>

<style scoped>
@import '@/assets/styles/cms.css';
@import '@/assets/styles/iconfont.css';

.search-detail {
  padding: 0;
}

.search-hero {
  width: 100%;
}

.search-detail :deep(.search-key) {
  color: var(--brand-red);
}

@media screen and (max-width: 768px) {
  .search-hero :deep(.elImage-category) {
    height: 240px;
  }
}
</style>
