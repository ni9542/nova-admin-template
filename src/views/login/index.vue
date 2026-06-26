<script setup lang="ts">
import { Sunny, Moon, Platform, User, Lock } from '@element-plus/icons-vue'

const appTitle = import.meta.env.VITE_APP_TITLE || 'Nova Admin'

const isDark = ref(false)

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

const toggleTheme = (event: MouseEvent) => {
  if (!document.startViewTransition) {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  const transition = document.startViewTransition(() => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ]
    document.documentElement.animate(
        {
          clipPath: isDark.value ? [...clipPath].reverse() : clipPath
        },
        {
          duration: 400,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)'
        }
    )
  })
}

const loginForm = reactive({
  username: 'admin',
  password: '',
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' }
  ],
}

const loginFormRef = ref()
const loading = ref(false)

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        loading.value = true
        await new Promise((resolve) => setTimeout(resolve, 800))
        ElMessage.success('登录成功，欢迎回来！')
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login-wrapper">
    <!-- 背景多重丝滑流光 -->
    <div class="glow-bg">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
      <div class="glow-orb orb-3"></div>
    </div>

    <!-- 悬浮主题切换 -->
    <div class="theme-switch" @click="toggleTheme">
      <el-icon :size="18">
        <Sunny v-if="!isDark" />
        <Moon v-else />
      </el-icon>
    </div>

    <div class="login-container">
      <!-- 左侧：品牌展示（移动端已配置为完全隐藏） -->
      <div class="brand-section">
        <div class="brand-top">
          <div class="brand-logo">
            <div class="logo-icon-wrapper">
              <el-icon :size="24"><Platform /></el-icon>
            </div>
            <span class="logo-text">{{ appTitle }}</span>
          </div>
        </div>
        <div class="brand-center">
          <div class="title-badge">NEXT-GEN PLATFORM</div>
          <h1 class="main-title">
            探索数据<br />
            <span class="gradient-text">核心的新星边界</span>
          </h1>
          <p class="subtitle">
            基于 Vue 3.5 + Vite 8 + Rolldown 构建的现代化、极致性能中后台管理生态系统。
          </p>
          <div class="tech-metrics">
            <div class="metric-item">
              <span class="num">0.1s</span>
              <span class="lab">Vite 8 热重载</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="num">Rust</span>
              <span class="lab">Oxc & Rolldown</span>
            </div>
          </div>
        </div>
        <div class="brand-footer">
          &copy; 2026 {{ appTitle }}. Engineered for professional developers.
        </div>
      </div>

      <!-- 右侧 / 移动端居中：浮空高端毛玻璃登录卡片 -->
      <div class="form-section">
        <div class="login-box">
          <div class="login-header">
            <h2>欢迎回来 🚀</h2>
            <p>请输入凭证以授权进入 Nova 系统</p>
          </div>

          <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              label-position="top"
              size="large"
              @keyup.enter="handleLogin"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入管理员账号" clearable>
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  clearable
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <div class="login-utils">
              <el-checkbox label="记住登录" name="type" />
              <el-link type="primary" underline="never">忘记密码？</el-link>
            </div>

            <el-form-item class="submit-item">
              <el-button
                  type="primary"
                  class="submit-btn"
                  :loading="loading"
                  @click="handleLogin"
              >
                登 录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "index";
</style>
