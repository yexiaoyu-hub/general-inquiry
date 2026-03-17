<template>
      <div>
        助手布局
        <el-menu :default-active="activeIndex" class="el-menu-demo" @select="handleSelect">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">咨询</el-menu-item>
          <el-menu-item index="3">订单</el-menu-item>
          <el-menu-item index="4">我的</el-menu-item>
        </el-menu>
        <router-view></router-view>
      </div>
        
</template>