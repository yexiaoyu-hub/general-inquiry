import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index.js'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/home', name: 'home', component: () => import('@/views/home/homePage.vue')},
    {path: '/login', name: 'login', component: () => import('@/views/login/loginPage.vue')},
    {path: '/', name: 'layout', component: () => import('@/views/layout/myLayout.vue'),
      redirect: '/content/query',
      children: [
        {path: 'content/query', name: 'query', component: () => import('@/views/content/queryPage.vue')},
        {path: 'content/collect', name: 'collect', component: () => import('@/views/content/collectPage.vue')},
        {path: 'content/user', name: 'userInfo', component: () => import('@/views/content/userInfo.vue')},
        {path: 'content/manage', name: 'manage', component: () => import('@/views/content/managePage.vue')},
      ]
    },
  ],
})
//路由守卫
router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.token && to.name !== 'login' && to.name !== 'home') {
    // 没token → 跳登录
    return '/login'
  }
})

//导出路由
export default router
