import request from '@/utils/request'

// 生产数据录入
export function setEquipmentData(data) {
  return request({
    url: '/backend/Equipment/setProductionData',
    method: 'post',
    data
  })
}
// 修改生产数据
export function editProductionData(data) {
  return request({
    url: '/backend/Production/editProductionData',
    method: 'post',
    data
  })
}
// 修改生产数据
export function setEquipmentBuyUser(data) {
  return request({
    url: '/backend/Equipment/setEquipmentBuyUser',
    method: 'post',
    data
  })
}
// 添加设备
export function editEquipment(data) {
  return request({
    url: '/backend/Equipment/editEquipment',
    method: 'post',
    data
  })
}
// 设备详情
export function getEquipmentInfo(data) {
  return request({
    url: '/backend/Equipment/getEquipmentInfo',
    method: 'post',
    data
  })
}
// 购买方列表
export function getEquipmentList(data) {
  return request({
    url: '/backend/Equipment/getEquipmentList',
    method: 'post',
    data
  })
}
// 设备报修列表
export function getRepairList(data) {
  return request({
    url: '/backend/Equipment/getRepairList',
    method: 'post',
    data
  })
}
// 修改设备状态
export function setEquipmentStatus(data) {
  return request({
    url: '/backend/Equipment/setEquipmentStatus',
    method: 'post',
    data
  })
}
// 厂商列表
export function getFactoryEquipmentList(data) {
  return request({
    url: '/backend/Equipment/getFactoryEquipmentList',
    method: 'post',
    data
  })
}
// 厂商详情
export function getFactoryEquipmentInfo(data) {
  return request({
    url: '/backend/Equipment/getFactoryEquipmentInfo',
    method: 'post',
    data
  })
}
// 设备操作员绑定
export function setOperator(data) {
  return request({
    url: '/backend/Equipment/setOperator',
    method: 'post',
    data
  })
}
// 设备日志
export function getEquipmentLog(data) {
  return request({
    url: '/backend/Equipment/getEquipmentLog',
    method: 'post',
    data
  })
}
// 设备列表
export function getEquipmentAllList(data) {
  return request({
    url: '/backend/Equipment/equipmentList',
    method: 'post',
    data
  })
}
// 业主列表
export function getOwnerList(data) {
  return request({
    url: '/backend/Owner/getOwnerList',
    method: 'post',
    data
  })
}
// 设备购买申请
export function applyMessageList(data) {
  return request({
    url: '/backend/ApplyMessage/MessageList',
    method: 'post',
    data
  })
}
// 设备申请状态
export function setMessageStatus(data) {
  return request({
    url: '/backend/ApplyMessage/setMessageStatus',
    method: 'post',
    data
  })
}
// 设备展示列表
export function getExhibitionList(data) {
  return request({
    url: '/backend/EquipmentInfo/getEquipmentList',
    method: 'post',
    data
  })
}
// 编辑设备展示信息
export function eidtExhibitionInfo(data) {
  return request({
    url: '/backend/EquipmentInfo/eidtEquipmentInfo',
    method: 'post',
    data
  })
}
// 设备展示详情
export function getExhibitionInfo(data) {
  return request({
    url: '/backend/EquipmentInfo/getEquipmentInfo',
    method: 'post',
    data
  })
}
// 删除展示设备
export function delExhibitionInfo(data) {
  return request({
    url: '/backend/EquipmentInfo/delEquipmentInfo',
    method: 'post',
    data
  })
}
// 监控列表
export function getVideoList(data) {
  return request({
    url: '/backend/Camera/getVideoList',
    method: 'post',
    data
  })
}
// 修改监控名称
export function changeDevice(data) {
  return request({
    url: '/backend/Camera/changeDevice',
    method: 'post',
    data
  })
}
// 添加监控设备
export function addVideo(data) {
  return request({
    url: '/backend/Camera/addVideo',
    method: 'post',
    data
  })
}
// 删除监控设备
export function delVideo(data) {
  return request({
    url: '/backend/Camera/delVideo',
    method: 'post',
    data
  })
}
// 修改通道信息
export function changeCamera(data) {
  return request({
    url: '/backend/Camera/changeCamera',
    method: 'post',
    data
  })
}

