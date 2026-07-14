<!--
* 默认文章详情组件
* 当主题没有提供自定义的 post.vue 时使用此组件
* 
* Props:
* - article: 文章数据对象
* - siteCode: 站点编码
-->
<template>
  <div class="default-post-container">
    <article class="post-content">
      <div class="post-header">
        <h1 class="post-title">{{ article.title }}</h1>
        <div class="post-meta">
          <span class="meta-item">
            <i class="iconfont icon-time"></i>
            {{ parseTime(article.createTime, '{y}-{m}-{d}') }}
          </span>
          <span class="meta-item" v-if="article.author">
            <i class="iconfont icon-author"></i>
            {{ article.author }}
          </span>
        </div>
      </div>

      <div class="post-image" v-if="article.image">
        <image-preview 
          :src="article.image" 
          :preview-src-list="[article.image]" 
          style="width: 100%; max-height: 400px; object-fit: cover;"
        />
      </div>

      <div class="post-body">
        <div class="post-description" v-if="article.description">
          <p>{{ article.description }}</p>
        </div>
        <div class="post-text" v-html="article.content"></div>
      </div>

      <div class="post-footer">
        <div class="post-tags" v-if="article.tags && article.tags.length > 0">
          <span v-for="tag in article.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup name="DefaultPost">
import { defineProps } from 'vue'
import { parseTime } from '@/utils/ruoyi'

defineProps({
  article: {
    type: Object,
    default: () => ({
      title: '',
      content: '',
      description: '',
      image: '',
      createTime: null,
      author: '',
      tags: []
    })
  },
  siteCode: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.default-post-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.post-content {
  background: #fff;
  padding: 30px;
  border-radius: 4px;
}

.post-header {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.post-title {
  font-size: 28px;
  font-weight: 700;
  color: #212529;
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.post-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #6c757d;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.post-image {
  margin: 20px 0;
  border-radius: 4px;
  overflow: hidden;
}

.post-body {
  margin: 30px 0;
  font-size: 16px;
  line-height: 1.8;
  color: #495057;
}

.post-description {
  background-color: #f8f9fa;
  padding: 15px;
  border-left: 4px solid #e73434;
  margin-bottom: 20px;
  border-radius: 2px;
}

.post-description p {
  margin: 0;
  color: #6c757d;
}

.post-text {
  word-break: break-word;
}

.post-text :deep(p) {
  margin-bottom: 15px;
}

.post-text :deep(h2) {
  font-size: 20px;
  margin: 30px 0 15px 0;
  color: #212529;
}

.post-text :deep(h3) {
  font-size: 18px;
  margin: 25px 0 10px 0;
  color: #212529;
}

.post-text :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 15px 0;
}

.post-text :deep(code) {
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 14px;
  color: #e83e8c;
}

.post-text :deep(pre) {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 15px 0;
}

.post-text :deep(blockquote) {
  border-left: 4px solid #e73434;
  padding-left: 15px;
  margin: 15px 0;
  color: #6c757d;
}

.post-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
  margin-top: 30px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  display: inline-block;
  padding: 5px 10px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  font-size: 12px;
  color: #6c757d;
  transition: all 0.3s;
  cursor: pointer;
}

.tag:hover {
  background-color: #e73434;
  color: #fff;
  border-color: #e73434;
}

@media screen and (max-width: 768px) {
  .default-post-container {
    padding: 10px;
  }

  .post-content {
    padding: 15px;
  }

  .post-title {
    font-size: 20px;
  }

  .post-meta {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
