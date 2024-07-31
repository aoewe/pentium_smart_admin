import request from '@/utils/request'

// 添加/编辑商品
export function editProduct(data) {
  return request({
    url: '/backend/Product/editProduct',
    method: 'post',
    data
  })
}
// 商品列表
export function getProductList(data) {
  return request({
    url: '/backend/Product/getProductList',
    method: 'post',
    data
  })
}
// 上下架
export function changeProStatus(data) {
  return request({
    url: '/backend/Product/changeProStatus',
    method: 'post',
    data
  })
}
// 商品详情
export function getProductdetail(data) {
  return request({
    url: '/backend/Product/getProductdetail',
    method: 'post',
    data
  })
}
// 添加/编辑商品分类
export function editCategory(data) {
  return request({
    url: '/backend/Category/editCategory',
    method: 'post',
    data
  })
}
//商品分类列表
export function getCategotyList(data) {
  return request({
    url: '/backend/Category/getCategotyList',
    method: 'post',
    data
  })
}
//商品分类列表下拉
export function getCategory(data) {
  return request({
    url: '/backend/Category/getCategory',
    method: 'post',
    data
  })
}
// 修改商品分类状态
export function changeStatus(data) {
  return request({
    url: '/backend/Category/changeStatus',
    method: 'post',
    data
  })
}
// 订单列表
export function getOrderList(data) {
  return request({
    url: '/backend/ProOrder/getOrderList',
    method: 'post',
    data
  })
}
// 订单详情
export function getOrderDetail(data) {
  return request({
    url: '/backstage/proOrder/getOrderDetail',
    method: 'post',
    data
  })
}
// 订单发货
export function editKuaidi(data) {
  return request({
    url: '/backend/ProOrder/editKuaidi',
    method: 'post',
    data
  })
}
// 编辑视图模板
export function editProductPattern(data) {
  return request({
    url: '/backend/Product/editProductPattern',
    method: 'post',
    data
  })
}
// 获取视图模板
export function getProductPattern(data) {
  return request({
    url: '/backend/Product/getProductPattern',
    method: 'post',
    data
  })
}
