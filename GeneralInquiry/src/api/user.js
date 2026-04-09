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

// 更新用户信息接口
export const userUpdateService = (data) => {
  return request({url: '/user/update',method: 'put',data})}

// 修改密码接口
export const userUpdatePasswordService = (data) => {
  return request({url: '/user/password',method: 'put',data})}
