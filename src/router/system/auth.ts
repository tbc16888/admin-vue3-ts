import {RouteRecordRaw} from 'vue-router'

export default function (framework: any, meta: Record<string, unknown>): RouteRecordRaw {
    return {
        name: 'system-auth', path: '/system', component: framework,
        children: (pre => [
            {
                name: `${pre}user-list`, path: 'user/list', meta: {...meta, title: '系统用户'},
                component: () => import('@/views/system/auth/User.vue'),
            },
            {
                name: `${pre}role-list`, path: 'role/list', meta: {...meta, title: '角色列表'},
                component: () => import('@/views/system/auth/Role.vue')
            },
            {
                name: `${pre}menu-list`, path: 'menu/list', meta: {...meta, title: '系统菜单'},
                component: () => import('@/views/system/auth/Menu.vue')
            },
        ])('system-')
    }
}