<template>
    <div style="display: flex"> 
        <div style="margin-left:auto; cursor: pointer" @click="showMobileMenu=true">
            <Hamburger v-if="!menuShow"> </Hamburger>
        </div>
        <el-drawer v-model="showMobileMenu" :append-to-body="true" 
            :modal-append-to-body="false" :size="drawWith" > 
            <myMenu :mode="vertical" @menu-click="showMobileMenu=false"> </myMenu>    
        </el-drawer>
        <myMenu :mode="horizontal" v-if="menuShow"> </myMenu>
    </div>
</template>

<script setup name="Menu">
import Hamburger from '@/components/Hamburger'
import MyMenu from './myMenu'

const mode = ref("horizontal")
const horizontal = ref("horizontal") 
const vertical = ref("vertical")
const menuShow = ref(true)
const showMobileMenu = ref(false)
const drawWith = ref("50%") 

onBeforeMount(() => {
    changeMode();
    window.addEventListener("resize", changeMode);
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", changeMode);
})

function changeMode() {
    if (isMobile()) {
        if (mode !== "vertical") {
            mode.value = "vertical";
            menuShow.value = false;
        }
    }
    else if (mode !== "horizontal") {
        mode.value = "horizontal";
        menuShow.value = true;
    }
}

function isMobile() {
    const width = document.documentElement.clientWidth;
    if (width <= 768) return true;
    return false;
}
    
</script>

