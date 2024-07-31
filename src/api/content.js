import request from '@/utils/request'

// 文章列表
export const getArticleList = (data) => {
  return request({
    url: '/backend/Article/getArticleList',
    method: 'post',
    data
  })
}
// 文章状态
export const changeArticleStatus = (data) => {
  return request({
    url: '/backend/Article/changeArticleStatus',
    method: 'post',
    data
  })
}
// 文章分类
export const getArticleType = (data) => {
  return request({
    url: '/backend/Article/getArticleType',
    method: 'post',
    data
  })
}
// 文章添加/修改
export const editArticle = (data) => {
  return request({
    url: '/backend/Article/editArticle',
    method: 'post',
    data
  })
}
// banner列表
export const bannerList = (data) => {
  return request({
    url: '/backend/banner/BannerList',
    method: 'post',
    data
  })
}
// 添加or编辑banner
export const setBanner = (data) => {
  return request({
    url: '/backend/banner/setBanner',
    method: 'post',
    data
  })
}
// 合作企业列表
export function companyLogoList(data) {
  return request({
    url: '/backend/banner/companyLogoList',
    method: 'post',
    data
  })
}
// 删除banner
export function deleteBanner(data) {
  return request({
    url: '/backend/banner/deleteBanner',
    method: 'post',
    data
  })
}
// 删除合作企业
export function deleteLogo(data) {
  return request({
    url: '/backend/banner/deleteLogo',
    method: 'post',
    data
  })
}
// 新增or修改合作企业
export function setCompanyLogo(data) {
  return request({
    url: '/backend/banner/setCompanyLogo',
    method: 'post',
    data
  })
}
// 招聘信息列表
export function getRecruitList(data) {
  return request({
    url: '/backend/Recruit/getRecruitList',
    method: 'post',
    data
  })
}
// 新增/修改聘信息
export function editRecruit(data) {
  return request({
    url: '/backend/Recruit/editRecruit',
    method: 'post',
    data
  })
}
// 修改招聘信息状态
export function changeRecruitStatus(data) {
  return request({
    url: '/backend/Recruit/changeRecruitStatus',
    method: 'post',
    data
  })
}
// 用户反馈列表
export function getOpinionList(data) {
  return request({
    url: '/backend/UserOpinion/getOpinionList',
    method: 'post',
    data
  })
}
// 处理用户反馈
export function setOpinionStatus(data) {
  return request({
    url: '/backend/UserOpinion/setOpinionStatus',
    method: 'post',
    data
  })
}
// 招聘详情
export function getRecruitInfo(data) {
  return request({
    url: '/backend/Recruit/getRecruitInfo',
    method: 'post',
    data
  })
}