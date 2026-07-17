<!--
  统一主题加载失败兜底组件
  所有主题共用同一个失败态展示，避免每个主题各自处理错误 UI。
-->

<template>
  <div class="theme-error">
    <svg-icon icon-class="question" class="theme-error-icon" />
    <p class="theme-error-text">页面主题加载失败，请稍后重试或联系管理员</p>
  </div>
</template>

<script setup name="ThemeError">
</script>

<style scoped>
.theme-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #909399;
}
.theme-error-icon {
  font-size: 32px;
  margin-bottom: 12px;
}
.theme-error-text {
  font-size: 14px;
}
</style>
