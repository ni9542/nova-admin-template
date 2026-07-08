<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'

const appStore = useAppStore()
// 组件缓存
const cachedViews = ref<string[]>([])
</script>

<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </router-view>
  </el-config-provider>
</template>

<style lang="scss" scoped>
/* 页面一键淡入淡出高级转场 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 进场时：透明度 0 并且向左侧偏移 10 像素，然后平滑归位 */
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

/* 离场时：直接原地淡出即可，视觉观感最干净，不会产生重叠和拉扯感 */
.fade-transform-leave-to {
  opacity: 0;
}
</style>
