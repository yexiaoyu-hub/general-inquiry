<script setup>
import { Search,Coin,StarFilled,User,CaretBottom,Fold,SwitchButton } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index.js'
import { ref } from 'vue'

const userStore = useUserStore() 
//获取用户信息
userStore.getuser()

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
  userStore.removeToken() //清空数据
  userStore.removeUser()   //清空数据
  rou.push('/home') //跳转首页
 }
 else{
   rou.push(`/content/${command}`)}
}
const handleHomeClick = () => {
  rou.push('/home')
}

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
        <el-menu-item index="/content/user">
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
            <el-avatar src="" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 折叠部分 -->
          <template #dropdown>
            <div class="user-dropdown-card">
              <!-- 顶部用户信息 -->
              <div class="user-info-header">
                <el-avatar :size="50" src="" class="user-avatar" />
                <div class="user-details">
                  <div class="user-name-dropdown">{{userStore.userinfo.nickname || userStore.userinfo.username}}</div>
                  <div class="user-phone">{{userStore.userinfo.phone}}</div>
                </div>
              </div>
              <!-- 底部菜单区域 -->
              <div class="user-menu-body">
                <div class="menu-item" @click="handleCommand('collect')">
                  <el-icon class="menu-icon"><StarFilled /></el-icon>
                  <span>我的收藏</span>
                </div>
                <div class="menu-item" @click="handleCommand('user')">
                  <el-icon class="menu-icon"><User /></el-icon>
                  <span>个人中心</span>
                </div>
                <div class="menu-item" @click="handleCommand('logout')">
                  <el-icon class="menu-icon"><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </div>
              </div>
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
    height: 30px;
  }
}
// 用户下拉卡片样式
.user-dropdown-card {
  width: 220px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  .user-info-header {
    background: linear-gradient(135deg, #a8edea 0%, #7ee8fa 100%);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    .user-avatar {
      border: 2px solid #fff;
      flex-shrink: 0;
    }
    .user-details {
      .user-name-dropdown {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }
      .user-phone {
        font-size: 13px;
        color: #666;
      }
    }
  }
  .user-menu-body {
    padding: 10px 0;
    .menu-item {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      cursor: pointer;
      transition: background-color 0.2s;
      &:hover {
        background-color: #f5f7fa;
      }
      .menu-icon {
        font-size: 18px;
        color: #909399;
        margin-right: 12px;
      }
      span {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>