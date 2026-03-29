import request from '@/utils/request.js'

// 用户注册接口
export const userRegisterService = (data) => {
  return request({url: '/user/register',method: 'post',data})}
  
// 用户登录接口
export const userLoginService = (data) => {
  return request({url: '/user/login',method: 'post',data})}

// 获取用户信息接口
export const userGetinfoService = () => {
  return request({url: '/user/info',method: 'get'})}
