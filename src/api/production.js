import request from '@/utils/request'

// 录入生产数据（批量）
export function setProductionData(data) {
  return request({
    url: '/backend/Production/setProductionData',
    method: 'post',
    data
  })
}
// 企业生产数据列表
export function getFactoryData(data) {
  return request({
    url: '/backend/Production/getFactoryData',
    method: 'post',
    data
  })
}
// 企业详情
export function getFactoryInfo(data) {
  return request({
    url: '/backend/Production/getFactoryInfo',
    method: 'post',
    data
  })
}

// 生产数据列表
export function getProductionList(data) {
  return request({
    url: '/backend/Production/productionDataList',
    method: 'post',
    data
  })
}
// 业主数据列表
export function ownerDataList(data) {
  return request({
    url: '/backend/Production/ownerDataList',
    method: 'post',
    data
  })
}
// 铺设方数据列表
export function factoryDataList(data) {
  return request({
    url: '/backend/Production/factoryDataList',
    method: 'post',
    data
  })
}
// 删除生产数据
export function delProduction(data) {
  return request({
    url: '/backend/Production/delProduction',
    method: 'post',
    data
  })
}
