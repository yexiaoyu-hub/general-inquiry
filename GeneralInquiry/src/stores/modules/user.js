import { ref } from 'vue'
import { defineStore } from 'pinia'


export const useUserStore = defineStore('user', () => {
  const token = ref()
  const addtoken = (val) => {
    token.value = val
  }
  const removetoken = () => {
    token.value = null
  }

  return { token, addtoken, removetoken }
},
{
  persist:true
}
)

