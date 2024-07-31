import request from '@/utils/request'

// 客户分类列表
export const getCustomerCategory = (data) => {
  return request({
    url: '/backend/Customer/getCustomerCategory',
    method: 'post',
    data
  })
}
// 编辑客户类别
export const editCustomerCategory = (data) => {
  return request({
    url: '/backend/Customer/editCustomerCategory',
    method: 'post',
    data
  })
}
// 删除客户类别
export const delCustomerCategory = (data) => {
  return request({
    url: '/backend/Customer/delCustomerCategory',
    method: 'post',
    data
  })
}
// 公海客户列表
export const getCustomerList = (data) => {
  return request({
    url: '/backend/Customer/getCustomerList',
    method: 'post',
    data
  })
}
// 公海客户编辑
export const editCustomer = (data) => {
  return request({
    url: '/backend/Customer/editCustomer',
    method: 'post',
    data
  })
}
// 删除公海客户
export const delCustomer = (data) => {
  return request({
    url: '/backend/Customer/delCustomer',
    method: 'post',
    data
  })
}
// 绑定业务员
export const setBelongCustomer = (data) => {
  return request({
    url: '/backend/Customer/setBelongCustomer',
    method: 'post',
    data
  })
}
// 客户审核
export const editExamine = (data) => {
  return request({
    url: '/backend/Customer/editExamine',
    method: 'post',
    data
  })
}
// 业务员列表
export const getBusinessUser = (data) => {
  return request({
    url: '/backend/Customer/getBusinessUser',
    method: 'post',
    data
  })
}

//获取报备中客户
export const getReportingList = (data) => {
  return request({
    url: '/backend/User/getReportingList',
    method: 'post',
    data
  })
}

//获取归档客户
export const getFinishList = (data) => {
  return request({
    url: '/backend/User/getFinishList',
    method: 'post',
    data
  })
}

//查看业务员团队列表
export const getBusinessFans = (data) => {
  return request({
    url: '/backend/User/getBusinessFans',
    method: 'post',
    data
  })
}

//客户归档审核管理列表
export const Archivalaudit = (data) => {
  return request({
    url: '/backend/Customer/getFinishList',
    method: 'post',
    data
  })
}

//客户归档审核资料补全
export const editFinish = (data) => {
  return request({
    url: '/backend/Customer/editFinish',
    method: 'post',
    data
  })
}


//客户归档验收
export const editStatus = (data) => {
  return request({
    url: '/backend/Customer/editStatus',
    method: 'post',
    data
  })
}

//客户归档打款更新
export const editGetMoney = (data) => {
  return request({
    url: '/backend/Customer/editGetMoney',
    method: 'post',
    data
  })
}

//获取客户拜访记录
export const getVisitingHistory = (data) => {
  return request({
    url: '/backend/Customer/getVisitingHistory',
    method: 'post',
    data
  })
}

