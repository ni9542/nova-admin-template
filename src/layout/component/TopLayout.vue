<script setup lang="ts">
const isCollapse = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  change: [val: boolean]
}>()

function toggle() {
  isCollapse.value = !isCollapse.value
  emit('change', isCollapse.value)
}
</script>

<template>
  <el-header class="ly-height">
    <el-icon @click="toggle" size="24" class="cursor">
      <i-ep-fold v-if="!isCollapse" />
      <i-ep-expand v-else />
    </el-icon>
    <div class="top-right">
      <el-avatar> user </el-avatar>
      <el-dropdown trigger="click" class="cursor">
        <span class="el-dropdown-link">
          Dropdown List<el-icon class="el-icon--right"><i-ep-arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<style scoped lang="scss">
@use "@/styles/layout/top-header";
</style>