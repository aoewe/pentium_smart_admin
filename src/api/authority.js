import request from '@/utils/request'

// 菜单栏列表
export function getMenus(data) {
  return request({
    url: '/backend/menu/getMenus',
    method: 'post',
    data
  })
}

// 新增or编辑菜单栏/接口
export function editMenu(data) {
  return request({
    url: 'backend/menu/editMenu',
    method: 'post',
    data
  })
}
// 修改菜单状态
export function editMenuStatus(data) {
  return request({
    url: '/backend/menu/changeMenuStatus',
    method: 'post',
    data
  })
}
// 新增or编辑角色
export function editRole(data) {
  return request({
    url: '/backend/role/editRole',
    method: 'post',
    data
  })
}
// 修改用户状态
export function editRoleStatus(data) {
  return request({
    url: '/backend/role/changeStatus',
    method: 'post',
    data
  })
}
// 角色列表
export function getRoleList(data) {
  return request({
    url: '/backend/role/getRoleList',
    method: 'post',
    data
  })
}
// 获取所有菜单
export const getAllMenus = (data) => {
  return request({
    url: '/backend/menu/getAllMenus',
    method: 'post',
    data
  })
}
// 获取所有api
export const getAllApis = (data) => {
  return request({
    url: '/backend/menu/getApis',
    method: 'post',
    data
  })
}
// 获取权限api
export const getApis = (data) => {
  return request({
    url: '/backend/menu/getAllApis',
    method: 'post',
    data
  })
}

// 新增or编辑api
export const editApi = (data) => {
  return request({
    url: '/backend/menu/editApi',
    method: 'post',
    data
  })
}

// 日志
export const getLogList = (data) => {
  return request({
    url: '/backend/RequestLog/getLogList',
    method: 'post',
    data
  })
}
// 企业端APP版本号配置
export const setVersionConfig = (data) => {
  return request({
    url: '/backend/config/setVersionConfig',
    method: 'post',
    data
  })
}
/*
  弃用
  管理端APP版本号配置
 */
export const setServerVersionConfig = (data) => {
  return request({
    url: '/backend/config/setServerVersionConfig',
    method: 'post',
    data
  })
}
// 设置oss配置
export const setOSSConfig = (data) => {
  return request({
    url: '/backend/config/setOSSConfig',
    method: 'post',
    data
  })
}
// 获取配置信息
export const getConfigByKey = (data) => {
  return request({
    url: '/backend/config/getConfigByKey',
    method: 'post',
    data
  })
}
// 修改公共配置
export const editConfig = (data) => {
  return request({
    url: '/backend/config/setCommonConfig',
    method: 'post',
    data
  })
}
