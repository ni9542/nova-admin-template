// src/settings/index.ts

interface DefaultSettings {
    /** 全局 UI 组件尺寸 */
    size: "large" | "default" | "small"
    /** 全局国际化默认语言包 */
    language: "zh-cn" | "en"
    /** 是否固定 Header 顶部导航 */
    fixedHeader: boolean
    /** 是否显示侧边栏侧边栏 Logo 区域 */
    sidebarLogo: boolean
}

/**
 * Nova Admin - 核心出厂默认配置项
 */
export const defaults: DefaultSettings = {
    size: "default",
    language: "zh-cn",
    fixedHeader: true,
    sidebarLogo: true
}
