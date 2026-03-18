<script setup>
import { Search,Coin,StarFilled,User,CaretBottom,Fold,SwitchButton } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
import { ref } from 'vue'

const useruse = useUserStore()
// useruse.getuser()

//右上角退出登录
const rou = useRouter()
const handleCommand = async (command) =>{
 if( command === 'logout' ){
  await ElMessageBox.confirm(    //退出提示消息
    '您确定要退出登录吗?',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })  
  useruse.removetoken() //清空数据
  useruse.reuser()   //清空数据
  rou.push('/home') //跳转首页
 }
 else{
   rou.push(`/content/${command}`)}
}
const handleHomeClick = () => {
  rou.push('/home')
}

//用户数据显示
const userinfo = ref({
  name: "张三",
})

</script>

<template>
  <el-container class="layout-container">
    <el-aside class="aside-container" width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/content/query">
          <el-icon><Search /></el-icon>
          <span>药品查询</span>
        </el-menu-item>
        <el-menu-item index="/content/collect">
          <el-icon><StarFilled /></el-icon>
          <span>我的收藏</span>
        </el-menu-item>
        <el-menu-item index="/Acticle/Channel">
          <el-icon><User /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
        <el-menu-item index="/content/manage">
          <el-icon><Coin /></el-icon>
          <span>药品管理</span>
        </el-menu-item>
      </el-menu>
      <el-button class="el-aside-footer" @click="handleHomeClick">
        <el-icon><Fold /></el-icon>
        返回首页
      </el-button>
    </el-aside>

    <el-container>
      <el-header>
        <el-dropdown placement="bottom-end" @command="handleCommand">
        <!-- 默认部分 -->         
          <span class="el-dropdown__box">
            <span class="user-name">{{userinfo.name}}</span>
            <el-avatar src="" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 折叠部分 -->
          <template #dropdown>
            <!-- <el-dropdown-menu >
              <el-dropdown-item command="collect" :icon="StarFilled"
                >我的收藏</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="User"
                >个人中心</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu> -->
            <div style="width:100px;height:150px;background-color: #000;">
            </div>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>©2026 本平台查询信息仅供参考，如有侵权请联系我们</el-footer> 
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background: linear-gradient(to bottom, #56C8EC, #40E0D0);
    background: linear-gradient(180deg, #56C8EC 0%, #48D1CC 100%);
    border-radius: 10px;
    position: relative;
    &__logo {
      height: 100px;
      background: url('@/assets/logo/yao-logo.png') no-repeat center / 240px auto;
    }
    .el-menu {  
      margin-top: 50px;
      border-right: none;
      background-color: transparent !important;
      span{
        font-size: 18px;
      }
    }
    .el-aside-footer {
      position: absolute;
      bottom: 20px;
      font-size: 20px;
      font-weight: 600;
      color: #fff;
      background-color: transparent !important;
      border: 0 ;
      margin-left: 20px;
      .el-icon {
        color: #fff;
        margin-right: 10px;
      }
    }
  }
  //激活态样式
  :deep(.el-menu-item.is-active) {
    color: #0075E1; /* 激活态文字色 */
    background-color: rgba(255, 255, 255, 0.1); /* 轻微背景遮罩 */
    font-weight: 600;
    border-left: 5px solid #0075E1;
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: right;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .user-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-right: 10px;
      }
      .el-icon {
        color: #999;
        margin-left: 10px;
      }
      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>