/**
 * 设备类型常量字典 (出厂冻结只读)
 */
export const DeviceEnum = {
    DESKTOP: "desktop",
    MOBILE: "mobile"
} as const

export type DeviceType = typeof DeviceEnum[keyof typeof DeviceEnum]


/**
 * 侧边栏持久化状态常量字典
 */
export const SidebarStatus = {
    OPENED: "opened",
    CLOSED: "closed"
} as const

export type SidebarStatusType = typeof SidebarStatus[keyof typeof SidebarStatus]
