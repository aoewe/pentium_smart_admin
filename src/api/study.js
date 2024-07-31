import request from '@/utils/request'

// 添加or修改课程分类
export function editCategory(data) {
  return request({
    url: '/backend/lesson/editCategory',
    method: 'post',
    data
  })
}
// 添加课程
export function editLesson(data) {
  return request({
    url: '/backend/lesson/editLesson',
    method: 'post',
    data
  })
}
// 课程列表
export function getLessonList(data) {
  return request({
    url: '/backend/lesson/getLessonList',
    method: 'post',
    data
  })
}
// 课程分类列表
export function getCategotyList(data) {
  return request({
    url: '/backend/lesson/getCategotyList',
    method: 'post',
    data
  })
}
// 删除课程分类
export function delCategory(data) {
  return request({
    url: '/backend/lesson/delCategory',
    method: 'post',
    data
  })
}
// 获取课程分类下拉
export function getCategory(data) {
  return request({
    url: '/backend/lesson/getCategory',
    method: 'post',
    data
  })
}
// 课程详情
export function getLessonInfo(data) {
  return request({
    url: '/backend/lesson/getLessonInfo',
    method: 'post',
    data
  })
}
// 删除课程
export function delLesson(data) {
  return request({
    url: '/backend/lesson/delLesson',
    method: 'post',
    data
  })
}
// 试题列表
export function getExamination(data) {
  return request({
    url: '/backend/examination/getExamination',
    method: 'post',
    data
  })
}
// 添加or编辑试题
export function editExamination(data) {
  return request({
    url: '/backend/examination/editExamination',
    method: 'post',
    data
  })
}
// 删除试题
export function delExamination(data) {
  return request({
    url: '/backend/examination/delExamination',
    method: 'post',
    data
  })
}
// 获取章节ID
export function getLessonSelect(data) {
  return request({
    url: '/backend/Common/getLessonSelect',
    method: 'post',
    data
  })
}