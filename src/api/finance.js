import request from '@/utils/request'

// 待生成付款单列表
export function getDataList(data) {
  return request({
    url: '/backend/Finance/getDataList',
    method: 'post',
    data
  })
}
// 获取业主待生成付款单详情
export function getDataInfo(data) {
  return request({
    url: '/backend/Finance/getDataInfo',
    method: 'post',
    data
  })
}
// 生成付款单
export function setFactorySettlement(data) {
  return request({
    url: '/backend/Finance/setFactorySettlement',
    method: 'post',
    data
  })
}
// 结算日志
export function getProductionList(data) {
  return request({
    url: '/backend/Finance/getProductionList',
    method: 'post',
    data
  })
}
// 付款单列表
export function getSettlementList(data) {
  return request({
    url: '/backend/Finance/getSettlementList',
    method: 'post',
    data
  })
}
// 充值审核列表
export function getRechargeList(data) {
  return request({
    url: '/backend/recharge/getRechargeList',
    method: 'post',
    data
  })
}
// 审核处理
export function auditRecharge(data) {
  return request({
    url: '/backend/recharge/auditRecharge',
    method: 'post',
    data
  })
}
