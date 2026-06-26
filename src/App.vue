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
/* 页面一键淡入淡出、轻微位移的高级转场动画样式 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-15px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(15px);
}
</style>
