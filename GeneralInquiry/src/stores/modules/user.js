import { ref } from 'vue'
import { defineStore } from 'pinia'


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
  const user = ref({})
  const getuser = async () => {
    // const res =  await userGetinfoService()
    // user.value = res.data.data
  }  
  const reuser = async () => {
    user.value = ({})
  } 


  return { token, addToken, removeToken,user,reuser }
},
{
  persist:true
}
)

