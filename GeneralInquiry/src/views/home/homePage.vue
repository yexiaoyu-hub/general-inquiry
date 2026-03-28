<script setup lang="ts">
import { ref } from 'vue'
import { Promotion, Top } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index.js'

const userStore = useUserStore()
//获取用户信息
userStore.getuser()


// 登录点击跳转
const handleLoginClick = () => {
  router.push('/login')
}
// 轮播图数据
const carouselList = ref([
  { id: 1, content: '/lunbo/lunbo1.png' },
  { id: 2, content: '/lunbo/lunbo2.png' },
  { id: 3, content: '/lunbo/lunbo3.png' },
])
// 点击返回顶部（平滑滚动）
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 平滑滚动
  })
}
// 药品查询点击跳转
const router = useRouter()
const handleDrugClick = () => {
  router.push('/content/query')
}
</script>

<template>
  <div class="home-page">
    <el-menu class="el-menu-demo1">
      <el-menu-item index="0">
        <img class="img" src="@/assets/logo/logo.png" />
        <text class="text">峰思维</text>
      </el-menu-item>
      <div class="user">
        <text v-if="!userStore.token" @click="handleLoginClick"
              style="text-decoration: underline;
              color: #50C3F7;
              cursor: pointer;"
              >
        请登录
        </text>
        <text v-else>{{ 1 }}</text>
        <el-avatar class="photo" :size="40" />
      </div>
    </el-menu>

    <!-- 顶部导航栏 -->
    <el-menu
      class="el-menu-demo2"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#50C3F7"
    >
      <el-menu-item index="1">关于我们</el-menu-item>
      <el-menu-item index="2">活动通知</el-menu-item>
      <el-menu-item index="3">建议反馈</el-menu-item>
      <el-menu-item index="4">加入我们</el-menu-item>
    </el-menu>

    <!-- 简介 -->
    <div class="introduction">
      <img class="image" src="@/assets/简介.png" />
      <h1 class="header-title">通用查询</h1>
      <span class="slogan">——致力于打造更好用的平台</span>      
    </div>

    <!-- 主体 -->
    <div class="content">
      <!-- 轮播图区域 -->
      <div class="lunbo">
        <div class="dontai">动态News</div>
        <div class="block">
          <el-carousel class="blockmax">
            <el-carousel-item v-for="item in carouselList" :key="item.id">
              <img :src="item.content" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <!-- 查询专栏 -->
      <div class="query-column">
        <span class="zhuanlan">查询专栏</span>
        <div class="card-list">
          <div class="drug-card" @click="handleDrugClick">
            <img class="card-img" src="@/assets/xiangmu/药品查询.png" />
            <div class="card-title">药品查询</div>
          </div>
          <div class="drug-card">
            <img class="card-img" src="@/assets/xiangmu/敬请期待.png" />
            <div class="card-title">敬请期待</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 侧边栏 -->
    <div class="cebian">
      <el-popover class="box-item" title="联系电话：" content="18888888888" placement="left">
        <template #reference>
          <div class="lianxi">
            <el-icon class="icon" size="24" color="#fff"> <Promotion /> </el-icon>
            <div class="text">联系我们</div>
          </div>
        </template>
      </el-popover>
      <div class="ding" @click="scrollToTop">
        <el-icon class="icontop" size="24" color="#fff"> <Top /> </el-icon>
        <div class="texttop">返回顶部</div>
      </div>
    </div>

    <!-- 底部版权 -->
    <footer class="footer">
      <p>峰思维 ©2026 如发现不良信息、有害信息请联系我们进行举报</p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
/* 顶部 */
.el-menu-demo1 {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .img {
    width: 36px;
    padding: center;
  }
  .text {
    font-family: 方正舒体;
    font-size: 24px;
    color: #1ccbf7;
  }
  .photo {
    padding: 20px;
  }
  .user {
    display: flex;
    align-items: center;
    text {
      font-size: 14px;
      color: #9d9d9d;
      margin-right: 10px;
    }
  }
}
/* 顶部导航栏 */
.el-menu-demo2 {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 简介 */
.introduction {
  position: relative;
  .image {
    width: 100%;
    height: 350px;
  }
  .header-title {
    font-size: 36px;
    font-weight: 700;
    color: #2C5A84;
    position: absolute;
    top: 20px;
    left: 420px;
  }
  .slogan {
    font-size: 14px;
    font-weight: 700;
    position: absolute;
    top: 100px;
    left: 420px;
    color: #2C5A84;
  }
}
/* 主体 */
.content {
  width: 56%;
  margin: 0 auto;
  /* 轮播图区域 */
  .lunbo {
    margin-top: 20px;
    .dontai {
      font-size: 24px;
      font-weight: 700;
      border-left: 5px solid #000;
      padding-left: 10px;
      margin-bottom: 20px;
    }
    .block {
      width: 80%;
      height: 300px;
      margin: 0 auto;
      .blockmax {
        border-radius: 10px;
        img {
          width: 100%;
          height: 100%;
          object-fit: fill;
        }
      }
    }
  }
  /* 查询专栏 */
  .query-column {
    margin-top: 50px;
    .zhuanlan {
      font-size: 24px;
      font-weight: 700;
      border-left: 5px solid #000;
      padding-left: 10px;
      margin-bottom: 20px;
    }
    .card-list {
      display: flex;
      width: 865px;
      height: 300px;
      gap: 20px;
      margin-top: 20px;
      .drug-card {
        width: 100px;
        height: 100px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .card-img {
          width: 80px;
          height: 80px;
        }
        .card-title {
          margin-top: 10px;
          font-size: 16px;
          font-weight: 500;
          color: #474747;
        }
      }
    }
  }
}

/* 侧边栏 */
.cebian {
  width: 80px;
  height: 124px;
  position: fixed;
  top: 500px;
  right: 0;
  .lianxi { 
    background-color: #4dadf7;
    border-radius: 5px;
    height: 60px;
    .icon {
      padding-left: 26px;
      margin-top: 5px;
    }
    .text {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      text-align: center;
    }
  }
  .ding {
    background-color: #4dadf7;
    border-radius: 5px;
    height: 60px;
    margin-top: 2px;
    .icontop {
      padding-left: 26px;
      margin-top: 5px;
    }
    .texttop {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
      text-align: center;
    }
  }
}
/* 底部版权 */
.footer {
  text-align: center;
  padding: 12px;
  font-size: 12px;
  color: #666;
}
</style>