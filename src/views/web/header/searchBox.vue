<template>
    <div class="search-box">
        <el-autocomplete style="search-box-input"
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入搜索内容"
            :maxlength=70 
            :select-when-unmatched=true
            @select="handleSelect"
        ></el-autocomplete>
        <a href="#" class="iconfont icon-search search-box-button" @click="handleSelect()"> </a>
        <a href="#" class="iconfont icon-close" @click="emitEvent()"> </a>
    </div>
</template>

<script setup name="SearchBox">
import useCmsStore from '@/store/modules/cms';
import { listTopKeywords} from "@/api/cms/search";

const state = ref("")
const loading = ref(false)
let timeout = null
let quickLinks = []
const cmsStore = useCmsStore()
const { proxy } = getCurrentInstance()
 
onBeforeMount(() => {
    getList();
})
  
function emitEvent() {
    proxy.$emit('search-close');
}

function handleSelect(item) {
    if (item == null) {
        item = state;
    }
    proxy.$router.push({
        path: '/web/search/'+item.value,
        query: {
            siteCode: cmsStore.siteCode,
            t: +new Date() 
        }
    })
}

function querySearchAsync(queryString, cb) {
    let links = quickLinks;
    var results = queryString ? links.filter(createStateFilter(queryString)) : links;
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
        cb(results);
    }, 100)
}
    
function createStateFilter(queryString) {
    return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    };
}

function getList() {
    loading.value = true;
    let queryParams = {
        siteCode: cmsStore.siteCode,  //区分大小写
        createTime: null,
    };
    listTopKeywords(queryParams).then(response => {
        response.rows.forEach((row)=>quickLinks.push({"value":row.keyword}));
        loading.value = false;
    });
}
 
</script>

<style scoped>
@import '@/assets/styles/iconfont.css' ;

.search-box {
    width: 500px;
    height: 80px;
    right: 8px;
    display: flex;
    align-items: center;
    position: absolute;
    transition: all 0.3s;
    transform: scale(1);
    transform-origin: 100% center;
    background-color: #fff;
    padding: 5px 50px 0 20px;
}

.el-autocomplete {
    width: 400px;
    height: 50px;
}

:deep(.el-input__inner) {
    height: 45px;
}

.search-box-button {
    margin: 0 20px 0 -30px;
    position: relative;
}

@media screen and (max-width:768px) {
    .search-box {
        width: 100%;
        height: 100%;
        padding: none;
    }
}


</style>