<script setup>
import { ref, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { watch } from 'vue'
import { useUserStore } from '@/stores/index.js'

const router = useRouter()
const isRegister = ref(false)  // 是否是注册页面

// 表单数据
const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

// 页面加载时，读取记住的用户名
onMounted(() => {
  const rememberedUsername = localStorage.getItem('rememberedUsername')
  if (rememberedUsername) {
    loginForm.value.username = rememberedUsername
    loginForm.value.remember = true
  }
})

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 15, message: '用户名长度在1-15位之间', trigger: 'blur' },
    { 
    validator: (rule, value, callback) => {
      if (value.includes(' ')) {
        callback(new Error('用户名不能包含空格'));
      }
      callback();
    },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在6-15位之间', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '密码只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== loginForm.value.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
}
// 表单引用
const formRef = ref(null)

// 注册
const handleRegister = async () => {
  await formRef.value.validate()
  // TODO: 调用注册接口
  const res = await userRegisterService(loginForm.value)
  if(res.code === 200){
    ElMessage.success('注册成功')
    isRegister.value = false
  } else {
    ElMessage.error(res.msg)
  }
}

const userStore = useUserStore()
// 登录
const handleLogin = async () => {
  await formRef.value.validate()
  // TODO: 调用登录接口
  const res = await userLoginService(loginForm.value)
  if(res.code === 200){
    //同步到Pinia仓库
    userStore.addToken(res.token)
    // 处理记住我功能
    if (loginForm.value.remember) {
      localStorage.setItem('rememberedUsername', loginForm.value.username)
    } else {
      localStorage.removeItem('rememberedUsername')
    }
    ElMessage.success('登录成功')
    router.push({ name: 'home' })
  } else {
    ElMessage.error(res.msg)
  }
}

//卡片切换重置表单数据
watch(isRegister, () =>{
  loginForm.value = {
    username: '',
    password: '',
    repassword: '',
    remember: false
  }
})
</script>

<template>
  <div class="login-page">
    <!-- 背景图片 -->
    <div class="login-bg">
      <img src="@/assets/login.png" alt="登录背景" class="bg-img" />
    </div>
    <!-- 注册卡片 -->
    <div class="login-card" v-if="isRegister">
      <h2 class="login-title">感谢您的注册</h2>
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
            class="login-input"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            class="login-input"
          />
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repassword">
          <el-input
            v-model="loginForm.repassword"
            type="password"
            placeholder="请确认密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            class="login-input"
          />
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
        <!-- 返回登录链接 -->
        <div class="register-link">
          <el-link type="info" :underline="false" @click="isRegister = false">
            返回登录 →
          </el-link>
        </div>
      </el-form>
    </div>
    <!-- 登录卡片 -->
    <div class="login-card" v-else>
      <h2 class="login-title">欢迎登录</h2>
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
            class="login-input"
          />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            class="login-input"
          />
        </el-form-item>
        <!-- 记住我和忘记密码 -->
        <div class="form-options">
          <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false" class="forget-link">
            忘记密码?
          </el-link>
        </div>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        <!-- 注册链接 -->
        <div class="register-link">
          <el-link type="info" :underline="false" @click="isRegister = true">
            去注册 →
          </el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

// 背景图片
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  .bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// 登录卡片
.login-card {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  width: 400px;
  padding: 50px 40px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 1;

  .login-title {
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin-bottom: 40px;
    text-align: left;
  }

  .login-form {
    .login-input {
      :deep(.el-input__wrapper) {
        border-radius: 8px;
        box-shadow: 0 0 0 1px #dcdfe6 inset;
        padding: 0 15px;

        &.is-focus {
          box-shadow: 0 0 0 1px #409eff inset;
        }
      }

      :deep(.el-input__inner) {
        height: 48px;
        font-size: 14px;
      }

      :deep(.el-input__icon) {
        color: #909399;
        font-size: 16px;
      }
    }
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0 30px;

      :deep(.el-checkbox__label) {
        font-size: 14px;
        color: #666;
      }

      .forget-link {
        font-size: 14px;
      }
    }

    .login-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      border-radius: 8px;
      background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
      border: none;
      font-weight: 500;

      &:hover {
        background: linear-gradient(135deg, #66b1ff 0%, #409eff 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .register-link {
      text-align: left;
      margin-top: 20px;

      :deep(.el-link__inner) {
        font-size: 14px;
        color: #999;

        &:hover {
          color: #409eff;
        }
      }
    }
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .login-card {
    right: 50%;
    transform: translate(50%, -50%);
    width: 90%;
    max-width: 400px;
  }
}
</style>
