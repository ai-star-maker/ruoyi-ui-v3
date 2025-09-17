<template>
    <div> 
        <image-preview :src="cmsStore.site.logo" :preview-src-list="[]" 
            class="elImage-no-preview-cursor-pointer logo" @click.native="goHome"/>
    </div>
</template>

<script setup name="Logo">
import { getHomePath } from '@/utils/cms.js';
import useCmsStore from "@/store/modules/cms"

const cmsStore = useCmsStore()
const { proxy } = getCurrentInstance()

function goHome() {
    proxy.$router.push({ path: getHomePath() });
}
</script>

<style scoped>
@import '@/assets/styles/cms.css' ;

.logo {
    height: 40px;
    background-color: transparent !important;
    box-shadow: none !important;
}
</style>

