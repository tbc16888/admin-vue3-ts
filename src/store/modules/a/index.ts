import router from '@/router'
import {Commit} from 'vuex'

// 判定是否需要缓存
const isKeepAlive = (data: { meta?: { cache: boolean } }): boolean => {
    let bool = false
    if (data.meta && data.meta.cache) bool = true
    return bool
}

// 状态
const state: Record<string, [] | string> = {
    pool: [],
    opened: [],
    keepAlive: [],
    current: ''
}

const actions = {

    // 初始化
    init({state, commit}: { state: Record<string, any>, commit: Commit }): void {
        const strOpened: string | null = localStorage.getItem('page.opened')
        const opened: Record<string, any>[] = strOpened ? JSON.parse(strOpened) : []
        state.opened.unshift({
            name: 'dashboard', meta: {title: '控制台'}, fullPath: '/dashboard'
        })
        opened.forEach((item: Record<string, any>) => item.fullPath !== '/dashboard' && state.opened.push(item))
        commit('keepAliveRefresh')
    },


    // 打开路由
    open({state, commit, dispatch}, {to, from}) {
        return new Promise<void>(resolve => {
            // 已经打开的页面
            const opened = state.opened

            // 检测是否已经打开过
            let openedPosition = 0
            const hasOpened = opened.find((routes, index) => {
                const same = routes.fullPath === to.fullPath
                openedPosition = same ? index : openedPosition
                return same
            })

            if (hasOpened) {
                // 页面以前打开过
                Promise.resolve(dispatch('openedUpdate', {index: openedPosition, page: to}))
            } else {
                // 页面以前没有打开过
                Promise.resolve(dispatch('openedInsert', {tag: Object.assign({}, to), page: to}))
            }

            // 当前页面
            state.current = to.fullPath
            if (isKeepAlive(to)) commit('keepAlivePush', to.name)

            if (/(add|info|detail|edit)/.test(from.name)) {
                // dispatch('close', {tagName: from.fullPath})
            }
            resolve()
        })
    },

    // 插入
    openedInsert({state, commit, dispatch}, {tag, page}) {

        return new Promise<void>(resolve => {
            // 设置新的 tag 在新打开一个以前没打开过的页面时使用
            let newTag = tag
            newTag = {...newTag, ...page}
            // 添加进当前显示的页面数组
            state.opened.push({
                meta: newTag.meta,
                name: newTag.name,
                fullPath: newTag.fullPath,
                params: newTag.params,
                query: newTag.query
            })
            // 如果这个页面需要缓存 将其添加到缓存设置
            if (isKeepAlive(newTag)) {
                commit('keepAlivePush', newTag.name)
            }

            dispatch('openedSave')
            // end
            resolve()
        })
    },

    // 更新打开过的页面信息
    openedUpdate({state, dispatch}, {index, page}) {
        return new Promise<void>(resolve => {
            let opened = state.opened[index]
            opened = {
                ...opened, ...{
                    meta: page.meta,
                    name: page.name,
                    fullPath: page.fullPath,
                    params: page.params,
                    query: page.query
                }
            }
            state.opened.splice(index, 1, opened)
            dispatch('openedSave')
            resolve()
        })
    },

    // 保存到存储中
    openedSave({state}) {
        return new Promise<void>(resolve => {
            localStorage.setItem('page.opened', JSON.stringify(state.opened))
            resolve()
        })
    },

    // 关闭
    close({state, dispatch, commit}, data: Record<string, any>) {
        return new Promise<void>(resolve => {

            // 关闭后跳转页面
            let routes = state.opened[0]
            const tagName = data.tagName
            const isCurrent = state.current === tagName
            if (isCurrent) {
                const len = state.opened.length
                for (let i = 1; i < len; i++) {
                    if (state.opened[i].fullPath === tagName) {
                        routes = (i < len - 1) ? state.opened[i + 1] : state.opened[i - 1]
                        break
                    }
                }
            }
            // 关闭页面索引
            const index = state.opened.findIndex(page => page.fullPath === tagName)
            if (index >= 0) {
                commit('keepAliveRemove', state.opened[index].name)
                state.opened.splice(index, 1)
            }

            // 持久化
            Promise.resolve(dispatch('openedSave'))

            if (isCurrent) {
                resolve(routes)
            } else {
                resolve()
            }
        })
    },

    closeLeft({state, commit, dispatch}, {tagName} = {tagName: ''}) {
        return new Promise(resolve => {
            // 找到指定 tagName 和当前页面的索引
            const index = state.opened.findIndex(page => page.fullPath === tagName)
            // 当前页面是否也在关闭其中
            const current = state.opened.findIndex(page => page.fullPath === state.current)
            let route = null
            if (current < index) route = state.opened[index]
            state.opened.splice(1, index - 1)
            Promise.resolve(dispatch('openedSave'))
            commit('keepAliveRefresh')
            resolve(route)
        })
    },

    closeRight({state, commit, dispatch}, {tagName} = {tagName: ''}) {
        return new Promise(resolve => {
            // 找到指定 tagName 和当前页面的索引
            const index = state.opened.findIndex(page => page.fullPath === tagName)
            // 当前页面是否也在关闭其中
            const current = state.opened.findIndex(page => page.fullPath === state.current)
            let route = null
            if (current > index) route = state.opened[index]
            state.opened.splice(index + 1, 999)
            Promise.resolve(dispatch('openedSave'))
            commit('keepAliveRefresh')
            resolve(route)
        })
    },


    closeAll({state, dispatch, commit}) {
        return new Promise(resolve => {
            // 删除打开的页面 并在缓存设置中删除
            const routes = state.opened[0]
            state.opened.splice(1).forEach(({name}) => commit('keepAliveRemove', name))
            Promise.resolve(dispatch('openedSave'))
            commit('keepAliveRefresh')
            resolve(routes)
        })
    },

    closeOther({state, commit, dispatch}, {pageSelect} = {pageSelect: ''}) {
        return new Promise<void>(resolve => {
            const pageAim = pageSelect || state.current
            let currentIndex = 0
            state.opened.forEach((page, index) => {
                if (page.fullPath === pageAim) {
                    currentIndex = index
                }
            })

            // 删除打开的页面数据 并更新缓存设置
            if (currentIndex === 0) {
                state.opened.splice(1).forEach(({name}) => commit('keepAliveRemove', name))
            } else {
                state.opened.splice(currentIndex + 1).forEach(({name}) => commit('keepAliveRemove', name))
                state.opened.splice(1, currentIndex - 1).forEach(({name}) => commit('keepAliveRemove', name))
            }
            // 设置新的页面
            state.current = pageAim
            console.log(router)
            // if (router.app.$route.fullPath !== pageAim) {
            //     router.push(pageAim)
            // }

            // 持久化
            Promise.resolve(dispatch('openedSave'))
            // end
            resolve()
        })
    },
}


const mutations = {

    keepAliveRefresh(state: Record<string, any>) {
        // console.log(state.opened)
        // state.keepAlive = state.opened.filter(item => isKeepAlive(item)).map(e => e.name)
        // console.log(state.keepAlive)
    },

    keepAlivePush(state: Record<string, any>, name: string) {
        const keepAlive = state.keepAlive
        console.log(keepAlive.findIndex((item: string) => item == name))
        if (keepAlive.findIndex((item: string) => item == name) < 0) keepAlive.push(name)
        console.log(state.keepAlive)
        state.keepAlive = keepAlive
    },

    keepAliveRemove(state: Record<string, any>, name: string) {
        const list = [...state.keepAlive]
        const index = list.findIndex(item => item === name)
        if (index !== -1) {
            list.splice(index, 1)
            state.keepAlive = list
        }
    }
}


const getters = {
    opened: state => state.opened,
    keepAlive: state => {
        console.log(state.keepAlive, 'state.keepAlive')
        return state.keepAlive
    }
}


export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}