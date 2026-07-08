<script setup lang="ts">
import TopLayout from "@/layout/component/TopLayout.vue";
import MainLayout from "@/layout/component/MainLayout.vue";
import LeftLayout from "@/layout/component/LeftLayout.vue";
</script>

<template>
  <div class="common-layout">
    <el-container>
      <left-layout/>
      <el-container direction="vertical">
        <top-layout />
        <main-layout/>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/layout/index";
.ly-height {
  justify-content: space-between;
}
</style>