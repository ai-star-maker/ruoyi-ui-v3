<!-- 
 * 搜索结果页面组件
 -->
<template>
  <el-container direction="vertical">
    <my-header />
    <el-main class='article-main-body'>
      <image-preview :src="category.image" :preview-src-list="[]" class="elImage-no-preview elImage-category"/>
      <div class="category-header" v-html="searchResult"> </div>
      <div class="search-result"> 
        <div class="search-resule-item">
            <el-row v-for="(article, index) in articles" :key="index" :gutter="20">
                <el-col :span="6" >
                  <image-preview :src="article.image" :preview-src-list="[]" class="elImage-no-preview" style="height:150px" />
                </el-col>
                <el-col :span="18" >
                  <router-link :to="`/web/article/${article.articleId}`" style="display:flex; width:100%"> 
                    <el-col :span="16" >
                      <div class="article-list-item2-wrap" v-html="highlineKey(article.title, searchKey)" />
                    </el-col>
                    <el-col :span="8"> {{parseTime(article.createTime, '{y}-{m}-{d}') }}</el-col>
                  </router-link>
                    <el-row ></el-row>
                    <el-col :span="24">文章概要：
                      <div class="article-desc" v-html="highlineKey(article.description, searchKey)"> </div>
                    </el-col>
                </el-col>
            </el-row> 
        </div>
        <pagination
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getArticalList"
            />
    </div>
    </el-main>
    <my-footer/>
  </el-container>
</template>

<script setup name="ArticleSearch">
import useCmsStore from '@/store/modules/cms';
import MyHeader from '../header/header';
import { getCategoryInfo, setSiteInfo} from '@/utils/cms.js';
import MyFooter from '../footer/index.vue';
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
@import '@/assets/styles/iconfont.css';
@import '@/assets/styles/cms.css';


.article-main-body :deep(.search-key) {
  color: #c7000b;
}

.article-desc {
  font-size: 15px;
  padding: 10px 10px 10px 0;
  line-height: 30px;
}

.el-row {
  border-bottom: 1px solid #dedfe2;
}
.pagination-container {
  margin-bottom: 30px;
}

</style>