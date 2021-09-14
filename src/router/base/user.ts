import {RouteRecordRaw} from 'vue-router'

export default function (framework: any, meta: any): RouteRecordRaw {
    return {
        name: 'user', path: '/user', component: framework,
        children: (pre => [
            {
                name: `${pre}list`, path: `list`, meta: {...meta, title: '用户列表', cache: true},
                component: () => import('@/views/user/User.vue')
            },
            {
                name: `${pre}add`, path: `add`, meta: {...meta, title: '添加用户'},
                component: () => import('@/views/user/UserForm.vue')
            },
            {
                name: `${pre}edit`, path: `edit`, meta: {...meta, title: '编辑用户'},
                component: () => import('@/views/user/UserForm.vue')
            },
        ])('user-')
    }
}