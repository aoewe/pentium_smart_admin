import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/backend/user/login',
    method: 'post',
    data
  })
}

// 用户信息
export function getInfo() {
  return request({
    url: '/backend/user/getUserInfo',
    method: 'post'
  })
}
// 用户充值
export function rechargeApply(data) {
  return request({
    url: '/backend/recharge/rechargeApply',
    method: 'post',
    data
  })
}

// 用户菜单栏（权限）
export function getUserMenu() {
  return request({
    url: '/backend/user/getUserMenu',
    method: 'post'
  })
}
// 用户列表
export function getUserList(data) {
  return request({
    url: '/backend/user/getUserList',
    method: 'post',
    data
  })
}
// 新增or编辑用户
export function editUser(data) {
  return request({
    url: '/backend/user/editUser',
    method: 'post',
    data
  })
}
// 修改用户状态
export function changeUserStatus(data) {
  return request({
    url: '/backend/user/changeUserStatus',
    method: 'post',
    data
  })
}
// 重置密码
export function resetPassword(data) {
  return request({
    url: '/backend/user/resetPassword',
    method: 'post',
    data
  })
}

// 岗位列表
export function getMemberList(data) {
  return request({
    url: '/backend/user/MemberList',
    method: 'post',
    data
  })
}
// 新增or编辑岗位
export function editMember(data) {
  return request({
    url: '/backend/user/editMember',
    method: 'post',
    data
  })
}
// 根据号码查找用户
export function findUser(data) {
  return request({
    url: '/backend/user/findUser',
    method: 'post',
    data
  })
}
// 用户流水
export function getStreamList(data) {
  return request({
    url: '/backend/user/getStreamList',
    method: 'post',
    data
  })
}
// 部门列表
export function getDepartmentList(data) {
  return request({
    url: '/backend/department/getDepartmentList',
    method: 'post',
    data
  })
}
// 编辑部门
export function editDepartmentList(data) {
  return request({
    url: '/backend/department/editDepartmentList',
    method: 'post',
    data
  })
}
// 岗位审核列表
export function getExamineList(data) {
  return request({
    url: '/backend/department/getExamineList',
    method: 'post',
    data
  })
}
// 岗位审核
export function editExamineStatus(data) {
  return request({
    url: '/backend/department/editExamineStatus',
    method: 'post',
    data
  })
}
// 业务员列表
export function businessList(data) {
  return request({
    url: '/backend/User/businessList',
    method: 'post',
    data
  })
}
// 编辑业务员
export function editBusinessLev(data) {
  return request({
    url: '/backend/User/editBusinessLev',
    method: 'post',
    data
  })
}
// 删除业务员
export function delBusinessLev(data) {
  return request({
    url: '/backend/User/delBusinessLev',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

//根据业务等级获取上级业务员
export function getUpBusiness(data) {
  return request({
    url: '/backend/User/getUpBusiness',
    method: 'post',
    data
  })
}
