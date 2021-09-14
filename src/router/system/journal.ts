import {RouteRecordRaw} from 'vue-router'

export default function (framework: any, meta: Record<string, unknown>): RouteRecordRaw {
    return {
        name: 'journal', path: '/journal', component: framework,
        children: ((pre) => [
            {
                name: `${pre}operation`, path: `operation`, meta: {...meta, title: '操作日志'},
                component: () => import('@/views/system/journal/Operation.vue')
            },
        ])('journal-')
    }
}