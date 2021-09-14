export default {

  loginToken(state) {
    if (!state.loginToken && window.sessionStorage) state.loginToken = window.sessionStorage.getItem("loginToken");
    return state.loginToken ? state.loginToken : '';
  },

  framework(state) {
    if (!state.framework.isInitialize && window.localStorage) {
      let storage = window.localStorage.getItem('framework')
      if (null === storage) storage = JSON.stringify(state.framework)
      storage = JSON.parse(storage)
      state.framework = storage
      state.framework.isInitialize = true
    }
    return state.framework
  },

  loginUserInfo: state => state.loginUserInfo,

  showNoPermissionMenu: state => state.showNoPermissionMenu,
  userPermissionMenu: state => state.userPermissionMenu,
  viewRenderCount: state => state.viewRenderCount,
  routes: state => state.routes,
  openedRoutes: state => state.openedRoutes,
  sideMenu: state => state.sideMenu,
  sideMenuIndex: state => state.sideMenuIndex,
  filteredRoutes: state => state.filteredRoutes,
  keepAlive: state => state.keepAlive,

}