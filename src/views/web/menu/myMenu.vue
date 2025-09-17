<template>
    <el-menu default-active="0" v-if="menuVisible" :mode="mode" text-color="#000000" class="header-menu" :ellipsis="false">
        <template v-for="(menu, index) in menus" >
            <template v-if="hasChild(menu.categoryCode).length > 0">
                <el-sub-menu v-if="menu.inMenu === 'Y'" index="menu.categoryCode" :key="index">
                    <template #title> {{menu.categoryName}} </template>
                    <el-menu-item v-for="(submenu, subindex) in hasChild(menu.categoryCode)"
                        :index="submenu.categoryCode" :key="subindex+100" @click="goCategory(submenu.categoryCode)">
                        {{submenu.categoryName}}
                    </el-menu-item>
                </el-sub-menu>
            </template>
            <template v-else>
                <el-menu-item :index="menu.categoryCode" :key="index" 
                    v-if="menu.parentCode == '0' && menu.inMenu === 'Y'" @click="goCategory(menu.categoryCode)">
                        {{menu.categoryName}}
                </el-menu-item>
            </template>
        </template>
    </el-menu>
</template>

<script setup name="MyMenu">
import useCmsStore from '@/store/modules/cms'
import { getCurrentInstance, onBeforeMount } from 'vue';

const props = defineProps(['mode']) 
const menus = ref([])
const menuVisible = ref(true)
const cmsStore = useCmsStore()
const { proxy } = getCurrentInstance()
   
function hasChild(categoryCode) {
    let subMenus = menus.value.filter(menu=>menu.parentCode == categoryCode);
    return subMenus;
}

function goCategory(categoryCode) {
    proxy.$emit('menu-click')
    proxy.$router.push({
        path: '/web/article/'+categoryCode+'/more',
        query: {
            t: +new Date() 
        }
    })
}

onBeforeMount(() => {
    menus.value = cmsStore.site.categories;
    //handleTree有时造成children累积
    //menus.value = proxy.handleTree(cats, 'categoryCode',  'parentCode')
    //console.log(menus, cmsStore.site.categories)
})

const { siteCode } = storeToRefs(cmsStore)
watch(siteCode, async (New, Old) => {
    menus.value = cmsStore.site.categories;
    //el-menu可能有bug menus变了视图不变，用menuViaible临时解决
    menuVisible.value = false 
    await nextTick()
    menuVisible.value = true
    //console.log("mymenu:watch.siteCode=" + menus.value.length + ",newVal=" + New + ",old=" + Old);
}, { immediate: true })

</script>

<style scoped>
.header-menu {
    font-size: 16px;
    border-bottom: none;
}
.el-menu-item {
    font-size: 16px;
}
.el-menu-item:hover {
    color: var(--hover-color) !important;    /*e73414 */
    /* transition: all .2s;   */
}

.el-submenu :deep(.el-submenu__title) {
    font-size: 16px !important;
}
</style>