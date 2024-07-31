import { getUserMenu } from '@/api/user'
import router, { asyncRoutes } from '@/router'
import Layout from '@/layout'
const getDefaultState = () => {
  return {
    menuList: [],
    authorityRouterName: [],
    routerFrom: { path: '', title: '' },
    isAddRoutes: false
  }
}

const state = getDefaultState()

const mutations = {
  SET_MENU_LIST: (state, menuList) => {
    const { res, arouter } = handelRoutes(menuList)
    state.menuList = res
    state.authorityRouterName = arouter
  },
  SET_IS_ADDROUTES: (state, status) => {
    state.isAddRoutes = status
  },
  SET_ROUTER_FROM: (state, from) => {
    state.routerFrom = { ...from }
  }
}

const actions = {
  getUserMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserMenu().then(response => {
        const { data } = response

        if (!data) {
          return reject('验证失败，请重新登录。')
        }
        commit('SET_MENU_LIST', data)
        commit('SET_IS_ADDROUTES', true)
        resolve(asyncRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  },
  routerPath({ commit, state }) {
    commit('SET_ROUTER_FROM', { path: router.app._route.path, title: router.app._route.meta.title })
  }
}
const handelRoutes = (routes) => {
  const res = []
  const arouter = []
  routes.forEach(router => {
    var item = {}
    arouter.push(router.name)
    item.path = router.path
    item.component = Layout
    if (router.children) {
      item.children = []
      item.meta = { title: router.title, icon: router.icon }
      router.children.forEach(o => {
        arouter.push(o.name)
        var citem = {}
        citem.path = o.path
        citem.name = o.name
        citem.component = (resolve) => require(['@/views/' + o.component], resolve)
        citem.meta = { title: o.title, icon: o.icon }
        if(o.children){
          citem.alwaysShow=true
          citem.children=[]
          o.children.forEach(i=>{
            var cc = {}
            cc.path = i.path
            cc.name = i.name
            cc.component = (resolve) => require(['@/views/' + i.component], resolve)
            cc.meta = { title: i.title, icon: i.icon }
            citem.children.push(cc)
          })
        }
        item.children.push(citem)
      })
      item.name = router.name
    } else {
      item.children = [{
        path: router.path,
        name: router.name,
        component: (resolve) => require(['@/views/' + router.component], resolve),
        meta: { title: router.title, icon: router.icon }
      }]
    }
    console.log()
    res.push(item)
  })
  return { res, arouter }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

