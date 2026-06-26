<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const locale = zhCn
const size = 'default' // 可选: 'large' | 'default' | 'small'
</script>

<template>
  <el-config-provider :locale="locale" :size="size">
    <router-view />
  </el-config-provider>
</template>
