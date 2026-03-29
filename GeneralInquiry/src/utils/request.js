import axios from 'axios'
import { useUserStore } from '@/stores/index.js'  
import { ElMessage } from 'element-plus'
import router from '@/router/index.js'

// 1. 创建 axios 实例
const service = axios.create({
  baseURL: 'http://localhost:8080', // 后端基地址
  timeout: 5000
})

// 2. 请求拦截器（统一加 token、请求头）
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    // token添加到请求头
    if (userStore.token) {
      config.headers.token = userStore.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 3. 响应拦截器（统一处理返回结果、错误）
service.interceptors.response.use(
  response => {
    // 处理成功响应
    if (response.data.code === 200) {
      return response.data
    }
    // 处理错误响应
    ElMessage.error(response.data.msg || '请求失败')
    return Promise.reject(response.data)
  },
  error => {
    if(error.response.status === 401){
      ElMessage.error('登录过期，请重新登录')
      router.push('/login')
    }
    console.error('请求错误：', error)
    ElMessage.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)
// 4. 导出
export default service