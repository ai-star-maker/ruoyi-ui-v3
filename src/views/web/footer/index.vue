<template>
  <el-footer class="footer-wrapper" height="auto">
    <div class="footer-content">
      <div class="footer-section">
        <div class="friend-link" v-if="cms_friend_link && cms_friend_link.length > 0">
          <template v-for="(link, index) in cms_friend_link" :key="link.value">
            <a :href="link.value" target="_blank" class="friend-link-item">
              <span>{{ link.label }}</span>
              <span v-if="index !== cms_friend_link.length - 1" class="separator">|</span>
            </a>
          </template>
        </div>
        <div class="switch-site" v-if="sites && sites.length > 0">
          <span class="switch-site-label">切换站点:</span>
          <template v-for="(siteItem, index) in sites" :key="siteItem.siteCode">
            <a
              :class="['site-link', { 'site-link-active': siteItem.siteCode === siteCode }]"
              @click="goSite(siteItem)"
            >
              {{ siteItem.siteName }}
              <span v-if="index !== sites.length - 1" class="separator">|</span>
            </a>
          </template>
        </div>
      </div>
      <div class="footer-section" v-if="site">
        <div v-if="site.phone">办公电话: {{ site.phone }}</div>
        <div v-if="site.email">邮箱: <a :href="`mailto:${site.email}`">{{ site.email }}</a></div>
      </div>
      <div class="footer-section" v-if="site && site.address">
        <div>办公地址: {{ site.address }}</div>
      </div>
      <div class="footer-section" v-if="site">
        <div>
          <a href="https://beian.miit.gov.cn/" target="_blank" v-if="site.icp">{{ site.icp }}</a>
          <span class="separator" v-if="site.icp && site.registerNo">|</span>
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo" target="_blank" v-if="site.registerNo">
            {{ site.registerNo }}
          </a>
        </div>
      </div>
      <div class="footer-section copyright" v-if="site && site.copyright">
        {{ site.copyright }}
      </div>
    </div>
  </el-footer>
</template>

<script setup name="MyFooter">
import { getCurrentInstance } from 'vue'
import useCmsStore from '@/store/modules/cms'
import { getHomePath } from '@/utils/cms.js'

const { proxy } = getCurrentInstance()
const { cms_friend_link } = proxy.useDict('cms_friend_link') || {}

const cmsStore = useCmsStore()
const { siteCode, site, sites } = storeToRefs(cmsStore)

/**
 * 切换站点
 * 改进：使用 router 的编程式导航 + 状态同步，避免强制刷新
 */
async function goSite(targetSite) {
  if (targetSite.siteCode === siteCode.value) {
    return // 已经是当前站点，不做操作
  }

  try {
    // 1. 先更新 store 中的站点信息
    cmsStore.setSite(targetSite.siteCode)

    // 2. 再进行路由跳转
    const path = getHomePath(targetSite)
    await proxy.$router.push({
      path: path,
      name: 'webindex'
    })

    // 3. 平滑滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })

    console.log('[Footer] Switched to site:', targetSite.siteCode)
  } catch (err) {
    console.error('[Footer] Error switching site:', err)
  }
}
</script>

<style scoped>
.footer-wrapper {
  background-color: #f5f5f5;
  border-top: 1px solid #e1e1e1;
  padding: 30px 0 !important;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  color: #666;
  font-size: 14px;
  line-height: 1.8;
}

.footer-section {
  margin-bottom: 15px;
  text-align: center;
}

.footer-section.copyright {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e1e1e1;
  font-size: 12px;
}

.friend-link {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-bottom: 10px;
}

.friend-link-item {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.friend-link-item:hover {
  color: var(--hover-color, #e73434);
}

.switch-site {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin: 10px 0;
}

.switch-site-label {
  font-weight: 500;
  margin-right: 10px;
}

.site-link {
  cursor: pointer;
  color: #333;
  text-decoration: none;
  transition: all 0.3s;
  padding: 2px 8px;
}

.site-link:hover {
  color: var(--hover-color, #e73434);
  text-decoration: underline;
}

.site-link.site-link-active {
  color: var(--hover-color, #e73434);
  font-weight: bold;
}

.separator {
  margin: 0 5px;
  color: #ccc;
}

a {
  color: #333;
  text-decoration: none;
}

a:hover {
  color: var(--hover-color, #e73434);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .footer-content {
    padding: 0 15px;
  }

  .footer-section {
    margin-bottom: 12px;
    font-size: 13px;
  }

  .friend-link,
  .switch-site {
    flex-direction: column;
    align-items: center;
  }

  .friend-link-item,
  .site-link {
    display: block;
    width: 100%;
    text-align: center;
  }
}
</style>
