export default [
    {
        children: [
            {name: 'system-config', title: '系统配置', icon: 'icon-xitongpeizhi'},
            {
                name: 'auth', title: '权限管理', icon: 'icon-quanxianguanli',
                children: (pre => [
                    {name: `${pre}user-list`, title: '系统用户'},
                    {name: `${pre}role-list`, title: '系统角色'},
                    {name: `${pre}menu-list`, title: '系统菜单'}
                ])('system-')
            },
            {
                name: 'journal', title: '日志管理', icon: 'icon-caozuorizhi',
                children: (() => [
                    {name: `journal-operation`, title: '操作日志'},
                ])()
            },
            {name: 'user-list', title: '用户列表', icon: 'icon-yonghu-01'}
        ]
    }
]