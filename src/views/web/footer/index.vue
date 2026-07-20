<template>
  <el-footer class="cms-page footer-root" height="auto">
    <div class="cms-container footer-columns">
      <div class="footer-col">
        <div class="footer-col-title">友情链接</div>
        <div class="footer-line footer-linklist">
          <template v-for="(link, index) in cms_friend_link" :key="link.code">
            <a :href="link.value" target="_blank">
              <span :key="link.code">
                {{ link.label }}{{ index !== cms_friend_link.length - 1 ? '  /  ' : '' }}
              </span>
            </a>
          </template>
        </div>
      </div>
      
      <div class="footer-col">
        <div class="footer-col-title">切换站点</div>
        <div class="footer-line footer-linklist">
          <template v-for="(item, index) in sites" :key="index">
            <a @click="goSite(item)">
              <span :key="item.siteCode">
                {{ item.siteName }}{{ index !== sites.length - 1 ? '  /  ' : '' }}
              </span>
            </a>
          </template>
        </div>
      </div>

      <div class="footer-col">
        <div class="footer-col-title">联系方式</div>
        <div class="footer-line">办公电话：{{ site.phone }}</div>
        <div class="footer-line">邮箱：<a :href="`mailto:${site.email}`">{{ site.email }}</a></div>
        <div class="footer-line">地址：{{ site.address }}</div>
      </div>

    </div>

    <div class="footer-legal">
      <span>{{ site.copyright }}</span>
      <a href="https://beian.miit.gov.cn/">{{ site.icp }}</a>
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo">{{ site.registerNo }}</a>
    </div>
  </el-footer>
</template>

<script setup name="MyFooter">
import useCmsStore from '@/store/modules/cms'
import { getHomePath } from '@/utils/cms.js'

const { proxy } = getCurrentInstance()
const { cms_friend_link } = proxy.useDict('cms_friend_link')

const cmsStore = useCmsStore()
const { site, sites } = storeToRefs(cmsStore)

async function goSite(site) {
  await proxy.$router.push({
    path: getHomePath(site),
  }).then(() => {
    /**需要强制刷新，否则一些组件的信息还是以前的，因这些组件没有watch siteCode
     * 强制刷新的问题是：用浏览器回退则信息没有更新
     */
    //window.location.reload();  
  });
}

function goLink(link) {
  window.open(link); 
}

</script>

<style scoped>
@import '@/assets/styles/cms.css';

.footer-root {
  background-color: var(--brand-mist);
  padding: 0;
}

.footer-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding-top: var(--section-gap);
  padding-bottom: 32px;
}

.footer-col {
  flex: 1 1 240px;
  min-width: 200px;
}

.footer-col-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #3f3535;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 2px solid var(--brand-red);
}

.footer-line {
  font-size: 13px;
  line-height: 1.9;
}

.footer-line a {
  color: rgba(7, 7, 7, 0.62);
  transition: color 0.2s ease;
}

.footer-line a:hover {
  color: #4b4141;
  cursor: pointer;
}

.footer-linklist a {
  white-space: nowrap;
}

.footer-legal {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 6px 16px;
  padding: 20px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  background-color: var(--brand-line);
  font-size: 12px;
  justify-content: center;
}

.footer-legal a {
  color: rgba(8, 8, 8, 0.4);
}

.footer-legal a:hover {
  color: rgba(87, 81, 81, 0.7);
}

@media screen and (max-width: 768px) {
  .footer-columns {
    gap: 28px;
  }
}

</style>
