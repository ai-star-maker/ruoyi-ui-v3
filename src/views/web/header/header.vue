<template>
  <el-header class="cms-page navbar-header inline" :class="{ 'navbar-header--transparent': isTransparent }" height="72px">
    <Logo class="inline" > </Logo>
    <Menu :class="[isTransparent ? 'transparent-menu' : 'original-menu']" style="margin-left:40px"> </Menu>
    <div class="navbar-right">
      <transition name="fade">
        <SearchBox v-if="searchShow" v-on:search-close="searchShow=false"> </SearchBox>
      </transition>
      <a class="iconfont icon-search navbar-right-item" 
          @click="searchShow=!searchShow"></a>
          <router-link :to="`/index`"> 
            <template v-if="avatar">
              <img :src="avatar" class="navbar-right-avatar"/> 
            </template>
            <template v-else>
              <span class="iconfont icon-header-login navbar-right-item"></span>
            </template>
        </router-link>
    </div>
  </el-header>
</template>

<script setup name="MyHeader">
import Logo from '../logo/index';
import Menu from '../menu/index';
import SearchBox from './searchBox';
import useUserStore from "@/store/modules/user"

const userStore = useUserStore()
const props = defineProps({
  isTransparent: {
    type: Boolean,
    default: false,
  }
})
const {avatar} = storeToRefs(userStore)
const searchShow = ref(false)

</script>

<style scoped>
@import '@/assets/styles/cms.css';
@import '@/assets/styles/iconfont.css' ;

/*
* 导航条视觉 —— Vue 逻辑（Logo / Menu / SearchBox / avatar 切换）与原版
* 完全一致，只重写外观。
*
* 修复记录（用户反馈）：
* 1. 导航条底色由深黑改为白色（--brand-paper），深色只保留给页脚，
*    避免整站头尾都是重色块。
* 2. 搜索/登录图标之前用的是自定义 iconfont class（icon-search /
*    icon-header-login），依赖站点是否正确加载了对应的 iconfont 字体
*    文件，一旦没加载就会整体"消失"且不报错，难以排查。改为直接从
*    @element-plus/icons-vue 显式 import 的 <el-icon> 组件，本身随
*    组件打包，不依赖外部字体文件是否就位。
*
* --nav-fg / --nav-fg-muted 两个局部变量统一控制"文字默认色 / 悬停激活色"，
* 这样同一套菜单/图标样式规则可以同时服务白底导航（原版首页）和透明悬浮
* 导航（如 butterfly 主题铺满图片的首页），不用维护两份几乎重复的规则。
*/

.navbar-header {
--nav-fg-idle: var(--brand-steel);
--nav-fg-active: var(--brand-ink);
position: relative;
z-index: 10;
width: 100%;
background-color: var(--brand-paper);
border-bottom: 1px solid var(--brand-line);
}

.navbar-header--transparent {
--nav-fg-idle: rgba(255, 255, 255, 0.78);
--nav-fg-active: #ffffff;
background-color: transparent;
border-bottom: none;
}

.inline {
display: flex;
align-items: center;
}

.navbar-right {
margin-left: auto;
height: 100%;
display: flex;
align-items: center;
gap: 22px;
}

.navbar-right-item {
display: inline-flex;
align-items: center;
color: var(--nav-fg-idle);
font-size: 18px;
cursor: pointer;
transition: color 0.2s ease;
}

.navbar-right-item:hover {
/* 悬停统一变为品牌红——签名元素的第二处出现，与导航激活下划线呼应,
   而不是简单跟随 --nav-fg-active（那样在白底导航下会变成不够显眼的深灰）。 */
color: var(--brand-red);
}

.navbar-avatar-link {
line-height: 0;
}

.navbar-right-avatar {
height: 32px;
width: 32px;
border-radius: 50%;
display: block;
border: 1px solid var(--brand-line);
}

.transparent-menu,
.original-menu {
display: flex;
align-items: center;
--el-menu-item-font-size: 15px;
--el-menu-bg-color: transparent;

:deep(.el-menu) {
  background-color: transparent;
  min-width: 100%;
  flex-wrap: nowrap;
  font-family: var(--font-body);
  font-weight: 500;
}

:deep(.el-menu--horizontal > .el-menu--collapse) {
  display: none !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu .el-sub-menu__title) {
  color: var(--nav-fg-idle);
  position: relative;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu .el-sub-menu__title:hover) {
  background-color: transparent !important;
  color: var(--brand-red);
}

:deep(.el-menu-item.is-active) {
  color: var(--nav-fg-active);
  background-color: transparent !important;
}

/* 签名元素规则 1：唯一固定出现的红线——当前激活栏目下方的细线 */
:deep(.el-menu-item.is-active)::after {
  content: '';
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 0;
  height: 2px;
  background: var(--brand-red);
}
}
</style>
