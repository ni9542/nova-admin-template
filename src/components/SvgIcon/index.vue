<script setup lang="ts">
import { computed, useAttrs } from 'vue'

interface Props {
  name: string            // SVG 图标的文件名 (不带后缀，如 user-avatar)
  size?: string | number  // 图标大小 (支持数字 18 或 字符串 '1.2rem')
  color?: string          // 填充颜色 (支持 var() 变量、#fff 或十六进制等)
}

const props = withDefaults(defineProps<Props>(), {
  size: '',
  color: ''
})

const attrs = useAttrs()

const symbolId = computed(() => `#icon-${props.name}`)
const iconStyle = computed(() => {
  if (!props.size && !props.color) return {}

  const style: Record<string, string> = {}
  if (props.size) {
    style['font-size'] = typeof props.size === 'number' ? `${props.size}px` : props.size
    style['width'] = '1em'
    style['height'] = '1em'
  }
  if (props.color) {
    style['color'] = props.color
  }
  return style
})
</script>

<template>
  <i class="el-icon nova-svg-icon-wrapper" :style="iconStyle" v-bind="attrs">
    <svg aria-hidden="true" class="nova-svg-icon">
      <use :href="symbolId" />
    </svg>
  </i>
</template>

<style scoped lang="scss">
.nova-svg-icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor; /* 允许图标颜色跟随父级的 color 变量流式变色 */
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
  color 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    transform: scale(1.05);
  }
}

.nova-svg-icon {
  width: 100%;
  height: 100%;
  overflow: hidden;
  vertical-align: middle;
}
</style>
