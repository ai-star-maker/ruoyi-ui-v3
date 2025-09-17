<template>
  <KeepAlive>
    <component :is="currentTheme" :siteCode="siteCode"></component>
  </KeepAlive>
</template>

<script setup name="sub1Main">
import a404 from "@/views/error/404";
import useCmsStore from '@/store/modules/cms'

const props = defineProps(['siteCode'])
//const { siteCode } = toRefs(props)
const cmsStore = useCmsStore()
const { site } = storeToRefs(cmsStore)

const currentTheme = defineAsyncComponent({
    loader: () => import(/* @vite-ignore */`./theme/${site.value.theme}/index.vue`),
    errorComponent: a404,
}) 
</script>

<style scoped>
@import '@/assets/styles/cms.css' ;
</style>