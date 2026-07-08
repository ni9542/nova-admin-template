<script setup lang="ts">
import {computed, useAttrs} from 'vue'

// 禁止属性自动透传到根节点，改由我们手动 v-bind 显式控制
defineOptions({
  inheritAttrs: false
})

interface Props {
  name: string
  size?: string | number
  color?: string
}

// 修正默认值：size 默认为 undefined 或直接不设，交由 CSS 控制默认大小
const props = withDefaults(defineProps<Props>(), {
  size: undefined,
  color: undefined
})

const attrs = useAttrs()

const symbolId = computed(() => `#icon-${props.name}`)

const iconStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.size !== undefined && props.size !== '') {
    // 确保数字和字符串都能正确转换
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
  <!-- 将 attrs 显式绑定，配合 inheritAttrs: false 更安全 -->
  <i class="el-icon nova-svg-icon-wrapper" :style="iconStyle" v-bind="attrs">
    <svg aria-hidden="true" class="nova-svg-icon">
      <!-- 兼容部分旧版浏览器的 xlink:href -->
      <use :xlink:href="symbolId" :href="symbolId"/>
    </svg>
  </i>
</template>

<style scoped lang="scss">
.nova-svg-icon-wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* 核心：除了 fill，最好加上 stroke，防止部分只有线条的 SVG 无法变色 */
  fill: currentColor;
  stroke: currentColor;
  width: 1em;
  height: 1em;
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
  /* 因为父级已经是 flex 布局，vertical-align 其实可以省略 */
}
</style>
