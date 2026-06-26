<!-- src/views/error/404.vue -->
<script setup lang="ts">
import { ArrowLeft, HomeFilled } from '@element-plus/icons-vue'

defineOptions({ name: 'NotFound' })
const router = useRouter()
</script>

<template>
  <div class="error-wrapper">
    <div class="space-scene">
      <div class="matrix-grid"></div>
      <div class="nebula-glow primary-glow"></div>
      <div class="nebula-glow secondary-glow"></div>
    </div>

    <div class="error-container">
      <div class="visual-panel">
        <div class="code-branding">404</div>
        <div class="cosmic-compass">
          <div class="track-line track-1"></div>
          <div class="track-line track-2"></div>
          <div class="energy-pulse"></div>
        </div>
      </div>

      <div class="typography-block">
        <div class="location-hash">PAGE_NOT_FOUND</div>
        <h1 class="main-title">噢，星轨偏离了方向</h1>
        <p class="sub-desc">
          我们未能在这片矩阵中寻找到你期望的页面模块。或许链接输入有误，或者该区域正处于升级扩建中，请让我们指引你重回安全航线。
        </p>
      </div>

      <div class="action-dock">
        <el-button class="btn-action btn-outline" :icon="ArrowLeft" @click="router.back()">
          返回上一页
        </el-button>
        <el-button type="primary" class="btn-action btn-solid" :icon="HomeFilled" @click="router.push('/')">
          回到主控台
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "index";
</style>
