import {RouteRecordRaw} from 'vue-router'
import framework from '../layout/index.vue'
import systemAuth from './system/auth'
import journal from './system/journal'
import system from './system/system'
import user from './base/user'

const meta = {requireAuth: true, cache: true}

const frameIn: Array<RouteRecordRaw> = [
    user(framework, meta),
    system(framework, meta),
    systemAuth(framework, meta),
    journal(framework, meta),
    {
        name: 'main', path: '/main', component: framework,
        meta: {title: '首页'}, redirect: {name: 'dashboard'},
        children: [
            {
                name: 'dashboard', path: '/dashboard', meta: {title: '主控台'},
                component: () => import('@/pages/Dashboard.vue')
            },
            {
                name: 'workplace', path: '/workplace', meta: {title: '工作台'},
                component: () => import('@/pages/Workplace.vue')
            }
        ]
    }
]

const frameOut: Array<RouteRecordRaw> = [
    {
        name: 'login', path: '/login',
        meta: {title: '登录'},
        component: () => import('@/pages/Login.vue')
    },
    {
        path: '/', redirect: {name: 'dashboard'},
    },
    {
        name: '404',
        path: '/404',
        component: () => import('@/pages/404.vue'),
    },
    {
        name: '403',
        path: '/403',
        component: () => import('@/pages/403.vue'),
    },
    {
        name: '500',
        path: '/500',
        component: () => import('@/pages/500.vue'),
    },
    {
        name: '40444',
        path: '/:catchAll(.*)',
        component: () => import('@/pages/404.vue'),
    }
]

export default [
    ...frameIn,
    ...frameOut
]