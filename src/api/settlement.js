import request from '@/utils/request'

// 企业待结算列表
export function getSettlementList(data) {
  return request({
    url: '/backend/settlement/getSettlementList',
    method: 'post',
    data
  })
}
// 企业结算详情
export function getSettlementInfo(data) {
  return request({
    url: '/backend/settlement/getSettlementInfo',
    method: 'post',
    data
  })
}
// 企业根据月份获取产量
export function getDataBymonth(data) {
  return request({
    url: '/backend/settlement/getDataBymonth',
    method: 'post',
    data
  })
}
// 企业结算
export function setSettlement(data) {
  return request({
    url: '/backend/settlement/setSettlement',
    method: 'post',
    data
  })
}
// 厂商结算列表
export function factorySettlementList(data) {
  return request({
    url: '/backend/settlement/factorySettlementList',
    method: 'post',
    data
  })
}
// 厂商结算详情------(弃用)
export function factorySetInfo(data) {
  return request({
    url: '/backend/settlement/factorySetInfo',
    method: 'post',
    data
  })
}
// 厂商结算月份数据------(弃用)
export function getFactoryDataBymonth(data) {
  return request({
    url: '/backend/settlement/getFactoryDataBymonth',
    method: 'post',
    data
  })
}
// 厂商结算提交------(弃用)
export function setFactory(data) {
  return request({
    url: '/backend/settlement/setFactory',
    method: 'post',
    data
  })
}
// 业主结算月份数据
export function getOwnerDataBydate(data) {
  return request({
    url: '/backend/Settlement/getOwnerDataBydate',
    method: 'post',
    data
  })
}
// 业主结算提交
export function ownerSettlement(data) {
  return request({
    url: '/backend/Settlement/ownerSettlement',
    method: 'post',
    data
  })
}

// 企业已结算列表
export function getSetList(data) {
  return request({
    url: '/backend/settlement/getSetList',
    method: 'post',
    data
  })
}
// 企业已结算状态
export function paySettlement(data) {
  return request({
    url: '/backend/settlement/paySettlement',
    method: 'post',
    data
  })
}

// 厂商已结算列表
export function getFactorySetList(data) {
  return request({
    url: '/backend/settlement/getFactorySetList',
    method: 'post',
    data
  })
}
// 厂商已结算状态
export function payFactorySettlement(data) {
  return request({
    url: '/backend/settlement/payFactorySettlement',
    method: 'post',
    data
  })
}
