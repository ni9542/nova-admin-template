import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Vue、Vue Router、Pinia 的相关 API
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/autoTypes/auto-imports.d.ts', // 自动生成包含类型声明的文件
    }),
    // 自动导入 Element Plus 等组件
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/autoTypes/components.d.ts', // 自动生成包含组件类型声明的文件
    }),
  ],
  resolve: {
    alias: {
      // 配置 @ 路径别名指向 src 目录
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000, // 设定后台默认本地端口为 3000
    open: true  // 启动项目时自动在浏览器中打开页面
  }
})
