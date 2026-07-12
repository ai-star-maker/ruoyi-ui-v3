<!--
* 删除{{siteCode}}.vue文件，新增网站要增加次文件扩展性差，个性化设置在theme中定
-->
<template>
  <KeepAlive>
    <component :is="currentSite" :siteCode="siteCode"></component>
  </KeepAlive>
</template>

<script setup name="WebIndex">
import a404 from "@/views/error/404";
import { getSiteTheme } from '@/utils/cms'

const props = defineProps(['siteCode', 'theme'])
const { siteCode, theme } = toRefs(props)
let currentSite = ""

watchEffect(() => {
  let themeName = getSiteTheme(siteCode.value)
  if (theme.value !== null && theme.value !== undefined && theme.value !== '') {
    themeName = theme.value
  }
  let componentName = './theme/' + themeName + '/index.vue'
  console.log("componentName=%s siteCode=%s", componentName, siteCode.value)

  currentSite = defineAsyncComponent({
      //loader: () => import(/* @vite-ignore */`./${siteCode.value}.vue`),
      loader: () => import(/* @vite-ignore */componentName),
      errorComponent: a404,
  }) 
})
</script>
