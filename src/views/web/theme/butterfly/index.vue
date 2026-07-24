<!--
  butterfly 主题首页
  ---------------------------------------------------------------
  定位（见 theme/butterfly/config.json）："全屏广告位 + 透明导航的
  展示型布局，适合形象展示类站点"。这决定了它和 default 主题应该在
  内容密度、节奏上刻意不同，而不是同一套版式换个配色：

    default   —— 编辑室/资讯站节奏：每个栏目一个"标题+列表"密集分区，
                  适合内容更新频繁、需要快速浏览多条目的站点。
    butterfly —— 形象展示节奏：每个栏目一个全宽"图文半版"大板块，
                  一次只讲一件事，适合品牌/产品展示类站点。
-->
<template>
<el-container direction="vertical" class="cms-page">
    <my-header :is-transparent="true" class="butter-style" />

    <WebAdvertise :height="'100vh'" />

    <el-main class="main-body">
    <section
        v-for="(item, index) in showcaseItems"
        :key="item.category.categoryCode"
        class="showcase-row"
        :class="{ 'showcase-row--reverse': index % 2 === 1 }"
    >
        <router-link :to="`/web/article/${item.article.articleId}`" class="showcase-media">
        <image-preview :src="item.article.image" :preview-src-list="[]" class="elImage-no-preview" height="100%" />
        </router-link>

        <div class="showcase-copy">
        <div class="cms-eyebrow showcase-eyebrow">
            <span class="cms-eyebrow-title showcase-eyebrow-title">{{ item.category.categoryName }}</span>
        </div>
        <h2 class="showcase-title">{{ item.article.title }}</h2>
        <p class="showcase-desc">{{ item.article.description }}</p>
        <router-link :to="`/web/article/${item.article.articleId}`" class="cms-action-link">
            了解更多
        </router-link>
        </div>
    </section>
    </el-main>

    <my-footer />
</el-container>
</template>

<script setup name="ThemeButterfly">
import MyHeader from '@/views/web/header/header.vue'
import WebAdvertise from '@/views/web/advertise'
import MyFooter from '@/views/web/footer/index'
import { listArticle } from '@/api/cms/article'
import { useThemeSite } from '@/views/web/composables/useThemeSite'

// siteCode 由 ThemeLoader 传入，仅作展示/埋点用途，实际数据走 useThemeSite()。
defineProps({
siteCode: {
    type: String,
    default: ''
}
})

const { categories } = useThemeSite()

const visibleCategories = computed(() =>
categories.value.filter(category => category.inList === 'Y')
)

const showcaseItems = ref([])

// 每个栏目只取一条头条文章，组成"图文半版"展示板块。这里没有复用
// ArticleIndex/ArticleList（default 主题密集列表用的那一套），因为
// 展示型板块的数据需求很简单（每栏目 1 条），且展示形态和 default
// 完全不同，勉强复用反而需要在共享组件里加分支逻辑，不如themes各自
// 按自己的版式取数据更清楚。
async function loadShowcase() {
const results = await Promise.all(
    visibleCategories.value.map(async (category) => {
    const res = await listArticle({
        categoryCode: category.categoryCode,
        isAudited: '0',
        pageNum: 1,
        pageSize: 1
    })
    return { category, article: res.rows?.[0] }
    })
)
showcaseItems.value = results.filter(item => item.article)
}

watch(visibleCategories, loadShowcase, { immediate: true })
</script>

<style scoped>
@import '@/assets/styles/cms.css';

.main-body {
height: 100%;
width: 80%;
padding: 0px;
}

/* 透明导航悬浮在 Hero 图上——position:absolute 让它脱离文档流，
    不把下面的 WebAdvertise 顶下去；轻微的黑色蒙层只是为了保证文字/
    图标在任意一张轮播图上都还读得清楚，颜色本身由 header.vue 内部的
    --nav-fg-idle / --nav-fg-active 统一处理，这里不用再强行覆盖文字色。 */
.butter-style {
position: absolute;
top: 0;
left: 0;
right: 0;
/* background-color: rgba(0, 0, 0, 0.15); */
}

.showcase-row {
display: flex;
align-items: center;
gap: 48px;
padding: 64px 0;
border-top: 1px solid var(--brand-line);
}

/* 修复记录：原来 Hero 下面接一个"站点简介带"，去掉之后 Hero（100vh
    通栏大图）直接接第一个展示板块，两者中间原本靠简介带撑开的呼吸感
    没了。Hero 本身的强对比已经足够构成一次视觉断点，不需要再加一条
    分隔线（那样反而会显得突兀，像不小心多出来的一道线），只需要把
    第一个板块的顶部留白单独放大，替代原来简介带承担的"缓冲区"作用。 */
.showcase-row:first-of-type {
border-top: none;
padding-top: 96px;
}

.showcase-row--reverse {
flex-direction: row-reverse;
}

/* 修复记录：原来偶数行用 --brand-mist（浅灰）打底做交替节奏，问题是
    如果可见栏目数量是偶数，"最后一行"恰好落在浅灰这一档，而它下面
    紧接着就是页脚（深灰 --brand-charcoal）——两块颜色本身并不相同，
    但在两者之间没有任何间距/分隔线的情况下（见下面新增的 padding +
    border-top），灰接灰会被一眼看成"连成一片"。与其去赌交替次数的
    奇偶性会不会撞上这个情况，不如直接去掉这个交替底色：分区节奏改成
    完全依赖"图文左右交替 + 间距 + 发丝线"，不再依赖背景色变化，这样
    不管有多少个栏目，都不会再出现"和页脚糊在一起"的情况。 */

.showcase-media {
/* 从占据整行 50% 宽度、且拉伸到整行高度，改为固定比例的较小图块：
    宽度收窄到约三分之二（50% -> 33%），并用 aspect-ratio 代替
    "height:100% 撑满行高"，让图片大小不再和行高绑在一起，两者
    现在是各自独立可控的两个变量，而不是改一个就影响另一个。 */
flex: 0 0 33%;
aspect-ratio: 4 / 3;
display: block;
overflow: hidden;
border-radius: 4px;
}

.showcase-media :deep(.el-image) {
width: 100%;
height: 100%;
display: block;
}

.showcase-media :deep(.el-image__inner) {
object-fit: cover;
}

.showcase-copy {
flex: 1;
padding: 0 8px;
}

.showcase-eyebrow-title {
font-size: 15px;
color: var(--brand-steel);
}

.showcase-title {
font-size: 28px;
line-height: 1.3;
margin: 4px 0 16px;
}

.showcase-desc {
margin-bottom: 24px;
max-width: 520px;
}

@media screen and (max-width: 768px) {
.showcase-row,
.showcase-row--reverse {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
    padding: 40px 0;
}

.showcase-row:first-of-type {
    padding-top: 56px;
}

.showcase-media {
    flex: 0 0 auto;
    aspect-ratio: 16 / 9;
    border-radius: 0;
}

.showcase-copy {
    padding: 0 24px;
}
}
</style>