<template>
    <el-header class='navbar-header inline' height="80px">
      <Logo class="inline" > </Logo>
      <Menu :class="[isTransparent ? 'transparent-menu' : 'original-menu']" style="margin-left:30px"> </Menu>
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
@import '@/assets/styles/iconfont.css' ;

.navbar-header {
    position: relative;
    z-index: 10;
    width: 100%;
    box-shadow: 2px 0px 10px rgba(0,0,0,0.2);
    background-color: #fff;
}
.inline {
  display: flex;
  align-items: center;
}
.navbar-right {
  margin-left: auto;
  float: right; 
  height: 100%; 
  display: flex; 
  align-items: center;
  .icon-close {
    color: #909399;
  }    /* TODO: a:hover样式失效 */
}
.navbar-right-item {
  height: 20px;
  width: 36px;
}

.navbar-right-avatar {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  display: block;
}

/** el-menu 透明背景 */
.transparent-menu {
  display: flex;
  align-items: center;
  --el-menu-item-font-size: 16px;
  --el-menu-bg-color: rgba(0, 0, 0, 0);
  --el-menu-text-color: #ffffff !important;

  .icon-close {
    color:#909399;
  }
  
  .el-menu {
    min-width: 100%; /* 强制占满宽度 */
    flex-wrap: nowrap; /* 禁止换行 */
  }
  
  .el-menu--horizontal .el-menu--collapse {
      display: none !important;
  }
  .el-menu--horizontal > .el-menu-item {
      color: #fff !important;
  }
  .el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
      color: #fff !important;
  }
  .el-sub-menu__title {
      color: #fff;
      font-size: 16px !important;
  }
  .el-menu-item:not(.is-disabled):hover {
    background-color: transparent !important;
  }
  .el-menu-item:hover {
    background-color: transparent !important;
    color: var(--hover-color) !important;
  }
  .el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover {
    background-color: transparent !important;
  }
  .el-sub-menu__title:hover {
    background-color: transparent !important;
  }
}

/* el-menu原版样式 */
.original-menu {
  display: flex;
  align-items: center;
  --el-menu-item-font-size: 16px;

  .el-menu {
    background-color: #FFFFFF;
    min-width: 100%; /* 强制占满宽度 */
    flex-wrap: nowrap; /* 禁止换行 */
  }

  .el-menu--horizontal > .el-menu--collapse {
    display: none !important;
  }
  .el-menu--horizontal > .el-menu-item {
      color: #303133;
  }
  .el-menu--horizontal > .el-submenu .el-sub-menu__title {
      color: #303133;
  }
  .el-sub-menu__title i {
      color: #909399;
  }
  .el-menu-item:not(.is-disabled):hover {
    background-color: #fff;
  }
  .el-menu-item:hover {
    background-color: #e8f4ff;
    color: var(--hover-color) !important;
  }
  .el-menu--horizontal > .el-sub-menu .el-sub-menu__title:hover {
    background-color: #fff;
  }
  .el-sub-menu__title:hover {
    background-color: #e8f4ff;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>