<!--
* 删除{{siteCode}}.vue文件，新增网站要增加次文件扩展性差，个性化设置在theme中定
-->
<template>
  <KeepAlive>
    <Suspense>
      <template #default>
        <component :is="currentSite" :siteCode="siteCode" :key="siteCode"></component>
      </template>
      <template #fallback>
        <div class="theme-loading">
          <el-skeleton :rows="5" animated />
        </div>
      </template>
    </Suspense>
  </KeepAlive>
</template>

<script setup name="WebIndex">
import { defineAsyncComponent, toRefs, watchEffect, shallowRef } from 'vue'
import a404 from "@/views/error/404";
import { getSiteTheme } from '@/utils/cms'
import useCmsStore from '@/store/modules/cms'

const props = defineProps(['siteCode', 'theme'])
const { siteCode, theme } = toRefs(props)
const cmsStore = useCmsStore()
let currentSite = shallowRef(null)

watchEffect(() => {
  let themeName = getSiteTheme(siteCode.value)
  if (theme.value !== null && theme.value !== undefined && theme.value !== '') {
    themeName = theme.value
  }
  let componentName = './theme/' + themeName + '/index.vue'
  console.log("[WebIndex] Loading theme component:", componentName, "siteCode:", siteCode.value)

  currentSite.value = defineAsyncComponent({
    loader: () => import(/* @vite-ignore */componentName),
    loadingComponent: () => import('@/components/LoadingFallback.vue').catch(() => null),
    errorComponent: a404,
    delay: 200,
    timeout: 10000,
    onError(error, retry, fail, attempts) {
      console.warn('[WebIndex] Failed to load component:', error.message)
      if (attempts < 2) {
        retry()
      } else {
        fail()
      }
    }
  })
})
</script>

<style scoped>
.theme-loading {
  padding: 20px;
  min-height: 400px;
}
</style>
