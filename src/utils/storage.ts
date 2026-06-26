// src/utils/storage.ts
import { STORAGE_KEYS } from "@/constants"

// 1. 建立全局缓存前缀，防止在同一域名/IP下部署多个项目时导致 LocalStorage 互相污染撞车
const CACHE_PREFIX = "nova_admin_"

// 2. 核心的高阶类型安全映射字典
interface StorageTypeMapping {
    // 1. 系统核心配置
    [STORAGE_KEYS.DEVICE]: "desktop" | "mobile"
    [STORAGE_KEYS.SIZE]: "large" | "default" | "small"
    [STORAGE_KEYS.LANGUAGE]: "zh-cn" | "en"
    [STORAGE_KEYS.SIDEBAR_STATUS]: "opened" | "closed"
    [STORAGE_KEYS.ACTIVE_TOP_MENU_PATH]: string

    // 2. 安全鉴权核心数据
    [STORAGE_KEYS.TOKEN]: string
    [STORAGE_KEYS.REFRESH_TOKEN]: string
    [STORAGE_KEYS.USER_INFO]: { id: number; username: string; avatar: string; email: string }
    [STORAGE_KEYS.ROLES]: string[]
    [STORAGE_KEYS.PERMISSIONS]: string[]

    // 3. 历史标签页列表
    [STORAGE_KEYS.VISITED_VIEWS]: any[]
    [STORAGE_KEYS.CACHED_VIEWS]: string[]
}

type StorageKey = keyof StorageTypeMapping

const createStorage = (storage: Storage) => {
    return {
        /**
         * 写入数据 (全自动高精序列化)
         */
        set<K extends StorageKey>(key: K, value: StorageTypeMapping[K]): void {
            const fullKey = CACHE_PREFIX + key

            if (value === null || value === undefined) {
                storage.removeItem(fullKey)
                return
            }

            const isComplexObject = typeof value === 'object'
            storage.setItem(
                fullKey,
                isComplexObject ? JSON.stringify({ __isObj: true, data: value }) : String(value)
            )
        },

        /**
         * 读取数据 (零 Catch 消耗、全自动智能类型推导)
         */
        get<K extends StorageKey>(key: K): StorageTypeMapping[K] | null {
            const value = storage.getItem(CACHE_PREFIX + key)
            if (value === null) return null

            if (value.charCodeAt(0) === 123 && value.includes("__isObj")) { // 123 代表 '{'
                try {
                    return JSON.parse(value).data as StorageTypeMapping[K]
                } catch {
                    return null
                }
            }

            return value as unknown as StorageTypeMapping[K]
        },

        remove(key: StorageKey): void {
            storage.removeItem(CACHE_PREFIX + key)
        },

        clear(): void {
            const keysToRemove: string[] = []
            for (let i = 0; i < storage.length; i++) {
                const k = storage.key(i)
                if (k && k.startsWith(CACHE_PREFIX)) {
                    keysToRemove.push(k)
                }
            }
            for (const k of keysToRemove) {
                storage.removeItem(k)
            }
        }
    }
}

export const localStorageUtil = createStorage(window.localStorage)
export const sessionStorageUtil = createStorage(window.sessionStorage)
