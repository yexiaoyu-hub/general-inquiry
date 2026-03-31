import request from '@/utils/request.js'

// 药品列表接口
export const drugListService = () => {
  return request({url: '/drug/list',method: 'get'})}

// 新增药品接口
export const drugAddService = (data) => {
  return request({url: '/drug/add',method: 'post',data})}