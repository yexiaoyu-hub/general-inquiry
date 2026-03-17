import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

 export const pinia = createPinia()
        pinia.use(piniaPluginPersistedstate)


// 统一导出所有的 store
export * from '@/stores/modules/user'