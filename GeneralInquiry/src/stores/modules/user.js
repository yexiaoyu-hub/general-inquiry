import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useUserStore = defineStore('token-user', () => {
  //token
  const token = ref()
  const addtoken = (val) => {
    token.value = val
  }
  const removetoken = () => {
    token.value = null
  }
  //用户
  const user = ref({})
  const getuser = async () => {
    // const res =  await userGetinfoService()
    // user.value = res.data.data
  }  
  const reuser = async () => {
    user.value = ({})
  } 


  return { token, addtoken, removetoken,user,reuser }
},
{
  persist:true
}
)

