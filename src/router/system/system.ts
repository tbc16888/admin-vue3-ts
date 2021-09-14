import {RouteRecordRaw} from 'vue-router'

export default function (framework: any, meta: Record<string, unknown>): RouteRecordRaw {
    return {
        name: 'system', path: '/system', component: framework,
        children: (pre => [
            {
                name: `${pre}config`, path: 'config', meta: {...meta, title: '系统配置'},
                component: () => import('@/views/system/config/Config.vue'),
            }
        ])('system-')
    }
}