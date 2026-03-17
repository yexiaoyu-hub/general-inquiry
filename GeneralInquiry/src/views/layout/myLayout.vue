<template>
  <el-container class="layout-container">
    <el-aside class="aside-container" width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/Acticle/Manage">
          <el-icon><Management /></el-icon>
          <span>药品查询</span>
        </el-menu-item>
        <el-menu-item index="/Acticle/Channel">
          <el-icon><Promotion /></el-icon>
          <span>我的收藏</span>
        </el-menu-item>
        <el-menu-item index="/Acticle/Channel">
          <el-icon><Promotion /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
        <el-menu-item index="/Acticle/Channel">
          <el-icon><Promotion /></el-icon>
          <span>药品管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div>程序小白：<strong></strong></div>
        <el-dropdown placement="bottom-end">
        <!-- 默认部分 -->         
          <span class="el-dropdown__box">
            <el-avatar src="" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 折叠部分 -->
          <template #dropdown>
            <el-dropdown-menu >
              <el-dropdown-item command="profile"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>大事件 ©2023 Created by 黑马程序员</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url('@/assets/logo/yao-logo.png') no-repeat center / 240px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
  }
}
</style>