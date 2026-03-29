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
    if(!token.value){
      return
    }
    const res = await userGetinfoService()
    userinfo.value = res.data
  }  
  const removeUser = async () => {
    userinfo.value = ({})
  } 


  return { token, addToken, removeToken, userinfo, getuser, removeUser }
},
{
  persist:true
}
)

