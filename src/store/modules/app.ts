import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
import store from "@/store";
import { DeviceEnum, SidebarStatus, type DeviceType } from "@/enums";
import { STORAGE_KEYS } from "@/constants";
import { localStorageUtil } from "@/utils/storage";
import settings from "@/config/settings.yaml";

export const useAppStore = defineStore("app", () => {
    /**
     * 状态定义 (State)
     */
    const device = ref<DeviceType>(localStorageUtil.get(STORAGE_KEYS.DEVICE) || DeviceEnum.DESKTOP);

    // 默认值直接指向 yaml 里的字段
    const size = ref<"large" | "default" | "small">(localStorageUtil.get(STORAGE_KEYS.SIZE) || settings.size);
    const language = ref<"zh-cn" | "en">(localStorageUtil.get(STORAGE_KEYS.LANGUAGE) || settings.language);

    // 从本地读取出初始状态
    const initialSidebarStatus = localStorageUtil.get(STORAGE_KEYS.SIDEBAR_STATUS) || SidebarStatus.CLOSED;

    /**
     * 侧边栏整体核心控制模型
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
    function toggleSidebar() {
        sidebar.opened = !sidebar.opened;
        localStorageUtil.set(STORAGE_KEYS.SIDEBAR_STATUS, sidebar.opened ? SidebarStatus.OPENED : SidebarStatus.CLOSED);
    }

    function closeSidebar() {
        sidebar.opened = false;
        localStorageUtil.set(STORAGE_KEYS.SIDEBAR_STATUS, SidebarStatus.CLOSED);
    }

    function openSidebar() {
        sidebar.opened = true;
        localStorageUtil.set(STORAGE_KEYS.SIDEBAR_STATUS, SidebarStatus.OPENED);
    }

    function toggleDevice(val: DeviceType) {
        device.value = val;
        localStorageUtil.set(STORAGE_KEYS.DEVICE, val);
    }

    function changeSize(val: "large" | "default" | "small") {
        size.value = val;
        localStorageUtil.set(STORAGE_KEYS.SIZE, val);
    }

    function changeLanguage(val: "zh-cn" | "en") {
        language.value = val;
        localStorageUtil.set(STORAGE_KEYS.LANGUAGE, val);
    }

    function setActiveTopMenuPath(path: string) {
        activeTopMenuPath.value = path;
        localStorageUtil.set(STORAGE_KEYS.ACTIVE_TOP_MENU_PATH, path);
    }

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