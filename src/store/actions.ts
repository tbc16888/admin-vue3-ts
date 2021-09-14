import http from '../plugin/http';

export default {

    loadLoginUserMenu() {
        return new Promise((resolve) => {
            http.get('/personal/menu').then((res) => {
                if (res.data.code === 0)
                resolve(res)
            })
        });
    },

    // ========================================================
    //  基础接口
    // ========================================================
    // init({}) {
    //
    // },

    // 登录系统
    // login({commit}, form) {
    //     return new Promise((resolve) => {
    //         http.post('/login', form).then((res) => {
    //             if (res.data.code === 0) commit('setLoginToken', res.data.data.token);
    //             resolve(res)
    //         })
    //     });
    // },

    // 退出系统
    // logout({commit}) {
    //     return new Promise((resolve) => {
    //         commit('setLoginToken', '')
    //         // @ts-ignore
    //         http.post('/logout').then((res) => {
    //             resolve(res)
    //         })
    //     });
    // },

    // 个人信息
    // [types.PERSONAL_INFO]({commit, dispatch}, form) {
    //     return new Promise((resolve) => {
    //         const method = form ? 'POST' : 'GET'
    //         http.get('/personal/information', form).then((res) => {
    //             if (res.data.code === 0) {
    //                 (method === 'POST') ? dispatch(types.PERSONAL_INFO) : commit(types.PERSONAL_INFO, res.data.data);
    //             }
    //             return resolve(res);
    //         });
    //     });
    // },

    // 个人菜单
    // [types.PERSONAL_MENU]() {
    //     return new Promise((resolve) => {
    //         http.get('/personal/menu').then((res) => {
    //             resolve(res)
    //         })
    //     });
    // },
};




