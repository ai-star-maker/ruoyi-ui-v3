<template>
    <div ref="divWarpper" style="height:70%;">
        <el-carousel indicator-position="outside" :height="height" :interval=5000 >
            <el-carousel-item v-for="ad in adList" :key="ad.advertiseId">
                <image-preview :src="ad.image"  :preview-src-list="[]" class="elImage-no-preview" :height="height" :width="100+'%'" />
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script setup name="WebAdvertise">
import { listAdvertise } from "@/api/cms/advertise";
import useCmsStore from '@/store/modules/cms'
import { getCurrentInstance } from "vue";

const props = defineProps({
    height: {
        type: String,
        default: 550+'px',
    }
})
const cmsStore = useCmsStore()
const adList = ref([])
const {proxy} = getCurrentInstance()
const {siteCode} = storeToRefs(cmsStore)

watch(siteCode, () => {
    getAdList(); 
}, { immediate: true })
       
onMounted(() =>{
    const rect = proxy.$refs.divWarpper.getBoundingClientRect();
    const cHeight = rect.height;
})

function getAdList() {
    let queryParams = {
        'siteCode': siteCode.value,
    }
    listAdvertise(queryParams).then(res => {
        adList.value = res.rows;
    });
}

</script>

<style scoped>
@import '@/assets/styles/cms.css' ;
</style>
