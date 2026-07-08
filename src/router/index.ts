// src/router/index.ts
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

// 1. 公共常驻路由（所有人都可以直接访问）
export const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {title: '登录', hidden: true}
    },
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/layout/index.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {title: '首页', fixed: true}
            }
        ]
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404.vue'),
        meta: {hidden: true}
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: '/404',
        meta: {hidden: true}
    }
]

// 2. 创建路由实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constantRoutes,
    // 切换页面时，滚动条自动回到顶部
    scrollBehavior: () => ({left: 0, top: 0})
})

export default router
