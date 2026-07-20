<!--
  首页主题加载器
  ---------------------------------------------------------------
  只负责一件事：请求 'index' 模板并渲染。所有解析/回退/错误处理逻辑
  都在 useThemedComponent + registry 里，这里不重复实现。
-->

<template>
  <component :is="component" :key="componentKey" :site-code="siteCode" />
</template>

<script setup name="WebIndex">
import { useThemedComponent } from '@/views/web/composables/useThemedComponent'

const props = defineProps({
  siteCode: {
    type: String,
    required: true
  },
  // 路由上的可选 :theme 段，用于"预览指定主题"（见 cms/theme/index.vue 的
  // handleView / handleActivate）。正常访问不传，此时以站点自身配置的主题为准。
  theme: {
    type: String,
    default: ''
  }
})

const { component, componentKey } = useThemedComponent('index', computed(() => props.theme))

</script>

<style>
@import '@/assets/styles/cms.css';

body {
  --news-picture-width: 40%;
  --news-list-width: 60%;
  --pic-list-width: 33.3%;
  --media-width: 768px;
}

@media screen and (max-width:768px) {
  body {
    --news-picture-width: 100%;
    --news-list-width: 100%;
    --pic-list-width: 100%
  }
}
a:hover {
  color: var(--brand-red); transition: all .6s;
}
</style>
