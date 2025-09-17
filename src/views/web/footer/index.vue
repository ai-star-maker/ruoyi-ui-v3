<template>
    <el-footer class='inline' height="160px">
      <div class="friend-link"> 
        <div style="padding:0 10px">友情链接: 
          <template v-for="(link, index) in cms_friend_link" :key="link.code">
            <a :href="link.value" target="">
              <span :key="link.code" >{{link.label}} &nbsp;
                {{index !== cms_friend_link.length - 1 ? '|  ' : ''}}
              </span>
            </a> 
          </template>
        </div>
          <!-- <el-select v-model="friendLink" placeholder="请选择链接">
            <el-option
              v-for="link in dict.type.cms_friend_link"
              :key="link.value"
              :label="link.label"
              :value="link.value"
            ></el-option>
          </el-select> -->
        <div class="switch-site">切换站点:
          <template v-for="(site, index) in sites" :key="index">
            <a >
              <span :key="site.siteCode" @click="goSite(site)">
                {{site.siteName}} &nbsp;{{index !== sites.length - 1 ? '|  ' : ''}}
              </span>
            </a>
          </template>
        </div>
      </div>
      <div>办公电话:{{site.phone}}  &nbsp;&nbsp;邮箱:<a href="mailto:site.email" >{{site.email}}</a> </div>
      <div>办公地址:{{site.address}}</div>
      <div>
        <a href="https://beian.miit.gov.cn/">{{site.icp}}</a>&nbsp;&nbsp;
        <a href="http://www.beian.gov.cn/portal/registerSystemInfo">{{site.registerNo}}</a>
      </div>
      <div>{{site.copyright}}</div>
    </el-footer>
</template>

<script setup name="MyFooter">

import useCmsStore from '@/store/modules/cms'
import { getHomePath } from '@/utils/cms.js'

const { proxy } = getCurrentInstance()
const { cms_friend_link } = proxy.useDict('cms_friend_link')

const cmsStore = useCmsStore()
const {siteCode, site, sites } = storeToRefs(cmsStore)
// 站点表格数据
const friendLinks = ref([])
const friendLink = ref("")

watch(siteCode, (New, Old) => {
  console.log("footer:sitecode Change:", New, Old)
  siteCode.value = cmsStore.siteCode
  site.value = cmsStore.site
}, { immediate: true })

function goSite(site) {
  proxy.$router.push({
    path: getHomePath(site),
  }).then(() => {
    /**需要强制刷新，否则一些组件的信息还是以前的，因这些组件没有watch siteCode
     * 强制刷新的问题是：用浏览器回退则信息没有更新
     */
    window.location.reload();  
  });
}

function goLink(link) {
  //window.location.href = '/web/' + site.siteCode
  window.open(link); 
}

</script>

<style scoped>

.inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e6e6e6;
  font-size: 14px;
  line-height: 25px;
}

.friend-link {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.switch-site {
  padding:0 10px 0 40px;
}

.el-footer {
  padding: 0 0 0 0;
}

@media screen and (max-width:768px) {
  .friend-link {
    flex-direction: column;
  }
  .switch-site {
    padding:0 0px 0 0px;
  }
}

</style>