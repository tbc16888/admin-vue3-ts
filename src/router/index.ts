import {
    createRouter,
    createWebHashHistory,
    RouteLocationNormalized,
    NavigationGuardNext,
    RouterOptions
} from 'vue-router';
import routes from './routes'
import store from '../store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routesMenu from './routes.menu'

const router = createRouter(<RouterOptions>{
    routes: routes,
    history: createWebHashHistory()
})

store.commit('setSideMenu', routesMenu);
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    NProgress.start()
    // 登录验证
    if (to.name !== 'login' && !store.getters.loginToken) {
        next({name: 'login'})
        NProgress.done()
        return
    }
    if (!store.getters.filteredRoutes.length) {
        // 加载用户菜单
        store.dispatch('loadLoginUserMenu').then((res) => {
            console.log(res)
        })
    }
    next()
})

router.afterEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    NProgress.done()
    if (to.name !== 'login') {
        store.dispatch('tbc/open', {to, from})
    }
})
export default router