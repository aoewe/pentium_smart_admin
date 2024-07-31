import request from '@/utils/request'
import axios from 'axios'
const key = 'b290d862374f362296669e4ff525065d'
// 获取经纬度
export function getLocation(city, address) {
  return axios.get(`https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${address}&city=${city}`)
}
// 首页数据
export function getDataInfo(data) {
  return request({
    url: '/backend/index/index',
    method: 'post',
    data
  })
}
// 获取省市区
export function getRegion(data) {
  return request({
    url: '/backend/common/getRegion',
    method: 'post',
    data
  })
}
// 根据用户类型获取用户
export function getUserByType(data) {
  return request({
    url: '/backend/common/getUserByType',
    method: 'post',
    data
  })
}
// 获取所有切割厂商
export function getAllFactory(data) {
  return request({
    url: '/backend/common/getAllFactory',
    method: 'post',
    data
  })
}

// 根据加工工厂获取设备
export function getEquipmentByFactory(data) {
  return request({
    url: '/backend/common/getEquipmentByFactory',
    method: 'post',
    data
  })
}
// 获取岗位列表
export function getPostList(data) {
  return request({
    url: '/backend/common/getPostList',
    method: 'post',
    data
  })
}

// 图片上传
export function uploadImg(data) {
  return request({
    url: '/backend/common/uploadImg',
    method: 'post',
    data
  })
}
// 多图片上传
export function uploadImgs(data) {
  return request({
    url: '/backend/upload/uploadImg',
    method: 'post',
    data
  })
}

// 图片识别营业执照编号
export function getLicenseNum(data) {
  return request({
    url: '/backend/Common/getLicenseNum',
    method: 'post',
    data
  })
}

