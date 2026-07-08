<script setup lang="ts">
import config from '@/config/settings.yaml'
</script>

<template>
  <div class="ly-logo">
    <svg-icon name="nova-icon" size="32" color="#212121" />
    <h3>{{config.title}}</h3>
  </div>
</template>

<style scoped lang="scss">
.ly-logo {
  width: 100%;
  height: 55px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: white;
  gap: 10px;
  .logo {
    width: 55px;
    height: 55px;
  }
  h3 {
    font-size: 20px;
  }
}
</style>