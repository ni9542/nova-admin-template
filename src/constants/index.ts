/**
 * Nova Admin - 全局浏览器持久化缓存存储键名 (Storage Keys Constants)
 *  统一风格的下划线大写命名，确保全项目唯一的物理映射关系
 */
export const STORAGE_KEYS = {
    // 1. 系统基础配置与自适应控制 (App Core Context)
    DEVICE: 'device_type',                 // 当前视窗设备：'desktop' | 'mobile'
    SIZE: 'component_size',               // 全局 UI 组件尺寸：'large' | 'default' | 'small'
    LANGUAGE: 'app_language',             // 全局国际化语言包：'zh-cn' | 'en'
    SIDEBAR_STATUS: 'sidebar_status',     // 左侧菜单折叠与展开状态：'opened' | 'closed'
    ACTIVE_TOP_MENU_PATH: 'active_top_path', // 当前激活的顶部主菜单路由路径

    // 2. 安全鉴权与用户上下文 (Auth & User Session)
    TOKEN: 'auth_token',                   // 核心身份认证令牌 (JWT Bearer Token)
    REFRESH_TOKEN: 'refresh_token',       // 无感刷新 Token 令牌
    USER_INFO: 'user_info',               // 基础用户信息对象缓存（头像、邮箱等）
    ROLES: 'user_roles',                   // 用户当前所拥有的角色数组
    PERMISSIONS: 'user_permissions',       // 用户当前绑定的细粒度操作权限标识数组

    // 3. 标签页与历史足迹 (Tabs & History Views)
    VISITED_VIEWS: 'visited_views',       // 已经打开并常驻的动态标签页（TagsBar）列表
    CACHED_VIEWS: 'cached_views'          // 被 Keep-Alive 内存缓存的页面组件 Keep 列表
} as const