import * as types from './mutations-type'

export default {

    // 框架设置
    setFramework(state: Record<string, any>, config: []) {
        for (const key in config) state.framework[key] = config[key];
        window.localStorage.setItem('framework', JSON.stringify(state.framework))
    },

    // 设置登录token
    setLoginToken(state: { loginToken: string; }, token: string) {
        state.loginToken = token;
        if (window.sessionStorage)
            window.sessionStorage.setItem('loginToken', token);
    },

    // 设置登录用户信息
    setLoginUserInfo(state: { loginUserInfo: Record<string, any> }, data: Record<string, string>) {
        state.loginUserInfo = data
    },

    // 设置用户菜单
    setSideMenu(state: { sideMenu: [] }, menu: []) {
        state.sideMenu = menu;
    },

    // 设置侧边栏
    setSideMenuIndex(state: { sideMenuIndex: number }, data: number) {
        state.sideMenuIndex = data
    },


    // // 系统设置
    // [types.CONFIG_SYSTEM](state, config) {
    //     for (const key in config) state.system[key] = config[key];
    //     window.localStorage.setItem('system', JSON.stringify(state.system))
    // },
    //
    //
    // // 设置用户菜单
    // [types.SET_SIDE_MENU](state, menu) {
    //     state.sideMenu = menu;
    // },
    //
    // // 设置权限过滤后路由
    // [types.SET_FILTERED_ROUTES](state, routes) {
    //     state.filteredRoutes = routes;
    // },
} as any