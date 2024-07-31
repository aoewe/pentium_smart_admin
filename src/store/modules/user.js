import { login, getInfo, getUserMenu } from '@/api/user'
import { getToken, setToken, removeToken, setUid, removeUid } from '@/utils/auth'
import { asyncRoutes, resetRouter } from '@/router'
import Layout from '@/layout'
const getDefaultState = () => {
  return {
    token: getToken(),
    menuList: [],
    isAddRoutes: false,
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_MENU_LIST: (state, menuList) => {
    function handelRoutes(router) {
      var item = {}
      item.path = router.path
      item.component = Layout
      if (router.children) {
        item.children = []
        item.meta = { title: router.title, icon: router.icon }
        router.children.forEach(o => {
          var citem = {}
          citem.path = o.path
          citem.name = o.name
          citem.component = (resolve) => require(['@/views/' + o.component], resolve)
          citem.meta = { title: o.title, icon: o.icon }
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
      return item
    }
    const list = []
    menuList.forEach(i => {
      list.push(handelRoutes(i))
    })
    state.menuList = list
    localStorage.setItem('MerMenuList', JSON.stringify(list))
  },
  SET_IS_ADDROUTES: (state, status) => {
    state.isAddRoutes = status
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setUid(data.uid)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          return reject('验证失败，请重新登录。')
        }
        const { username, avatar } = data

        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用户菜单栏
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
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken() // must remove  token  first
      removeUid()
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

