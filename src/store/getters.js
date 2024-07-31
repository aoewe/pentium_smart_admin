const getters = {
  router: state => state.app.router,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  uid: state => state.user.uid,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  menuList: state => state.permission.menuList,
  isAddRoutes: state => state.permission.isAddRoutes,
  authorityRouterName: state => state.permission.authorityRouterName,
  routerFrom: state => state.permission.routerFrom,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
