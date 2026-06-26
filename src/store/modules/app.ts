// src/store/modules/app.ts
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import store from "@/store";
import { DeviceEnum, SidebarStatus, type DeviceType } from "@/enums";
import { STORAGE_KEYS } from "@/constants";
import { defaults } from "@/settings";
import { localStorageUtil } from "@/utils/storage";

export const useAppStore = defineStore("app", () => {
    /**
     * 状态定义 (State)
     */
    const device = ref<DeviceType>(localStorageUtil.get(STORAGE_KEYS.DEVICE) || DeviceEnum.DESKTOP);
    const size = ref<"large" | "default" | "small">(localStorageUtil.get(STORAGE_KEYS.SIZE) || defaults.size);
    const language = ref<"zh-cn" | "en">(localStorageUtil.get(STORAGE_KEYS.LANGUAGE) || defaults.language);

    // 从本地读取出初始状态
    const initialSidebarStatus = localStorageUtil.get(STORAGE_KEYS.SIDEBAR_STATUS) || SidebarStatus.CLOSED;

    /**
     * 侧边栏整体核心控制模型 (全系统唯一的动画与展开状态数据源)
     */
    const sidebar = reactive({
        opened: initialSidebarStatus === SidebarStatus.OPENED,
        withoutAnimation: false,
    });

    const activeTopMenuPath = ref(localStorageUtil.get(STORAGE_KEYS.ACTIVE_TOP_MENU_PATH) || "");
    const contentFullscreen = ref(false);

    /**
     * 计算属性 (Getters)
     */
    const locale = computed(() => (language.value === "en" ? en : zhCn));


    /**
     * 业务动作 (Actions)
     */

    // 切换侧边栏状态
    function toggleSidebar() {
        sidebar.opened = !sidebar.opened;
        localStorageUtil.set(
            STORAGE_KEYS.SIDEBAR_STATUS,
            sidebar.opened ? SidebarStatus.OPENED : SidebarStatus.CLOSED
        );
    }

    // 关闭侧边栏
    function closeSidebar() {
        sidebar.opened = false;
        localStorageUtil.set(STORAGE_KEYS.SIDEBAR_STATUS, SidebarStatus.CLOSED);
    }

    // 打开侧边栏
    function openSidebar() {
        sidebar.opened = true;
        localStorageUtil.set(STORAGE_KEYS.SIDEBAR_STATUS, SidebarStatus.OPENED);
    }

    // 切换设备类型
    function toggleDevice(val: DeviceType) {
        device.value = val;
        localStorageUtil.set(STORAGE_KEYS.DEVICE, val);
    }

    // 切换组件尺寸
    function changeSize(val: "large" | "default" | "small") {
        size.value = val;
        localStorageUtil.set(STORAGE_KEYS.SIZE, val);
    }

    // 切换系统语言包
    function changeLanguage(val: "zh-cn" | "en") {
        language.value = val;
        localStorageUtil.set(STORAGE_KEYS.LANGUAGE, val);
    }

    // 设置顶部菜单激活路径
    function setActiveTopMenuPath(path: string) {
        activeTopMenuPath.value = path;
        localStorageUtil.set(STORAGE_KEYS.ACTIVE_TOP_MENU_PATH, path);
    }

    // 切换内容区全屏状态
    function toggleContentFullscreen() {
        contentFullscreen.value = !contentFullscreen.value;
    }

    return {
        device,
        sidebar,
        language,
        locale,
        size,
        contentFullscreen,
        activeTopMenuPath,
        toggleDevice,
        changeSize,
        changeLanguage,
        toggleSidebar,
        closeSidebar,
        openSidebar,
        setActiveTopMenuPath,
        toggleContentFullscreen,
    };
});

export function useAppStoreHook() {
    return useAppStore(store);
}
