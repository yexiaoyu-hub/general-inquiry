import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userGetinfoService } from '@/api/user.js'


export const useUserStore = defineStore('token-user', () => {
  //token
  const token = ref()
  const addToken = (val) => {
    token.value = val
  }
  const removeToken = () => {
    token.value = null
  }
  //用户信息
  const userinfo = ref({})
  const getuser = async () => {
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")
    if(!username || !token){
      return
    }
    const res =  await userGetinfoService(username,token)
    userinfo.value = res.data.data
  }  
  const reuser = async () => {
    userinfo.value = ({})
  } 


  return { token, addToken, removeToken, userinfo, getuser, reuser }
},
{
  persist:true
}
)

