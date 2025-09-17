<!--
* {{siteCode}}.vue文件可以没有，考虑到网站可能的个性化设置，暂保留
-->
<template>
  <KeepAlive>
    <component :is="currentSite" :siteCode="siteCode"></component>
  </KeepAlive>
</template>

<script setup name="WebIndex">
import a404 from "@/views/error/404";

const props = defineProps(['siteCode', 'theme'])
const { siteCode, theme } = toRefs(props)
let currentSite = ""

watchEffect(() => {
  let componentName = './' + siteCode.value + '.vue'
  if (theme.value !== null && theme.value !== undefined && theme.value !== '') {
    componentName = './theme/' + theme.value + '/index.vue'
  }
  console.log("componentName=%s siteCode=%s", componentName, siteCode.value)

  currentSite = defineAsyncComponent({
      //loader: () => import(/* @vite-ignore */`./${siteCode.value}.vue`),
      loader: () => import(/* @vite-ignore */componentName),
      errorComponent: a404,
  }) 
})
</script>
