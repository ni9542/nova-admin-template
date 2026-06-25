import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, type ConfigEnv, loadEnv } from 'vite'
import { name, version } from "./package.json"

// 平台名称、版本信息
const __APP_INFO__ = {
  pkg: { name, version },
  buildTimestamp: Date.now(),
}

// https://vite.dev
export default defineConfig(({ mode }: ConfigEnv) => {
  const isProduction = mode === 'production';
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      vue(),
      // 自动导入 Vue、Vue Router、Pinia 的相关 API
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        resolvers: [ElementPlusResolver({ importStyle: "sass" })],
        dts: 'types/auto-imports.d.ts',
        vueTemplate: true,
      }),
      // 自动导入 Element Plus 等组件
      Components({
        resolvers: [
          // 开启 directives: true，防止首屏加载动态 ElLoading/ElMessage 指令时样式闪烁或丢失
          ElementPlusResolver({
            importStyle: "sass",
            directives: true
          })
        ],
        dirs: ["src/components", "src/**/components"],
        dts: 'types/components.d.ts',
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`,
          api: 'javascript',
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT) || 3000,
      open: true,
      proxy: {
        [env.VITE_APP_BASE_API] : {
          changeOrigin: true,
          target: env.VITE_APP_API_URL,
          secure: false,
          rewrite: (path: string) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ""),
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, _req, _res) => {
              console.log("【Vite代理拦截成功】正在转发请求到:", options.target + proxyReq.path);
            });
          },
        }
      }
    },
    build: {
      // 目标对齐现代浏览器，裁剪低版本降级胶水代码，让 Oxc 打包产物体积更小
      target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15'],
      outDir: 'dist',
      minify: 'oxc', // 🚀 使用 Vite 8 官方推荐的 Rust 级极速压缩器
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,

      // 完美兼容无报错的混淆控制（生产环境自动移除 console / debugger）
      minifyOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        }
      },

      // 极致的分包和文件分类输出（全面启用最新的 Rolldown 引擎）
      rolldownOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              if (id.includes('element-plus')) {
                return 'element-plus';
              }
              if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                return 'vue-core';
              }
              return 'vendor';
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  }
})
