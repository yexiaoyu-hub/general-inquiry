import request from '@/utils/request.js'

// 药品列表接口
export const drugListService = (params) => {
  return request({url: '/drug/list',method: 'get', params})}

// 新增药品接口
export const drugAddService = (data) => {
  return request({url: '/drug/add',method: 'post',data})}

// 更新药品接口
export const drugUpdateService = (data) => {
  return request({url: '/drug/update',method: 'put',data})}

// 删除药品接口
export const drugDeleteService = (id) => {
  return request({url: '/drug/' + id,method: 'delete'})}