// 用户信息页面
<script setup>
import { ref } from 'vue'
import { User, Lock, DataLine, Edit, Upload } from '@element-plus/icons-vue'

const activeTab = ref('userInfo')

const userInfo = ref({
  name: '张三',
  phone: '18312345678',
  email: 'zhangsan@example.com',
  avatar: '',
  createTime: '2024-01-15 10:30:00'
})

const accountForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const otherData = ref({
  collectCount: 12,
  queryCount: 56,
  loginCount: 28
})

const isEditing = ref(false)
const editForm = ref({})

const handleEdit = () => {
  isEditing.value = true
  editForm.value = { ...userInfo.value }
}

const handleSave = () => {
  userInfo.value = { ...editForm.value }
  isEditing.value = false
  ElMessage.success('保存成功')
}

const handleCancel = () => {
  isEditing.value = false
}

const handleAvatarUpload = () => {
  ElMessage.info('头像上传功能待实现')
}

const handleChangePassword = () => {
  if (!accountForm.value.oldPassword || !accountForm.value.newPassword) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (accountForm.value.newPassword !== accountForm.value.confirmPassword) {
    ElMessage.error('两次密码输入不一致')
    return
  }
  ElMessage.success('密码修改成功')
  accountForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}
</script>

<template>
  <div class="user-info">
    <div class="user-info-header">
      <div class="user-info-header-left">
        <div class="user-info-header-left-title">个人中心</div>
      </div>
    </div>
    <div class="user-info-content">
      <el-tabs v-model="activeTab" tab-position="left" class="user-tabs">
        <el-tab-pane label="用户信息" name="userInfo">
          <template #label>
            <span class="tab-label">
              <el-icon><User /></el-icon>
              <span>用户信息</span>
            </span>
          </template>
          <div class="tab-content">
            <div class="info-card">
              <div class="card-header">
                <span class="card-title">基本信息</span>
                <el-button v-if="!isEditing" type="primary" text @click="handleEdit" style="font-size: 16px;">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
              </div>
              <div class="avatar-section">
                <el-avatar :size="100" :src="userInfo.avatar" class="user-avatar">
                  <el-icon :size="40"><User /></el-icon>
                </el-avatar>
                <el-button type="primary" plain size="small" class="upload-btn" @click="handleAvatarUpload">
                  <el-icon><Upload /></el-icon>
                  更换头像
                </el-button>
              </div>
              <el-form label-width="80px" class="info-form">
                <el-form-item label="用户名">
                  <el-input v-if="isEditing" v-model="editForm.name" placeholder="请输入用户名" />
                  <span v-else class="info-value">{{ userInfo.name }}</span>
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-if="isEditing" v-model="editForm.phone" placeholder="请输入手机号" />
                  <span v-else class="info-value">{{ userInfo.phone }}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-if="isEditing" v-model="editForm.email" placeholder="请输入邮箱" />
                  <span v-else class="info-value">{{ userInfo.email }}</span>
                </el-form-item>
                <el-form-item label="注册时间">
                  <span class="info-value">{{ userInfo.createTime }}</span>
                </el-form-item>
                <el-form-item v-if="isEditing">
                  <el-button type="primary" @click="handleSave">保存</el-button>
                  <el-button @click="handleCancel">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="账号管理" name="accountManage">
          <template #label>
            <span class="tab-label">
              <el-icon><Lock /></el-icon>
              <span>账号管理</span>
            </span>
          </template>
          <div class="tab-content">
            <div class="info-card">
              <div class="card-header">
                <span class="card-title">修改密码</span>
              </div>
              <el-form :model="accountForm" label-width="100px" class="account-form">
                <el-form-item label="当前密码">
                  <el-input v-model="accountForm.oldPassword" type="password" disabled />
                </el-form-item>
                <el-form-item label="新密码">
                  <el-input v-model="accountForm.newPassword" type="password" placeholder="请输入新密码" show-password />
                </el-form-item>
                <el-form-item label="确认密码">
                  <el-input v-model="accountForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleChangePassword">确认修改</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="info-card">
              <div class="card-header">
                <span class="card-title">账号绑定</span>
              </div>
              <div class="bind-list">
                <div class="bind-item">
                  <div class="bind-left">
                    <span class="bind-label">手机绑定</span>
                    <span class="bind-value">{{ userInfo.phone }}</span>
                  </div>
                  <el-button type="primary" text>更换</el-button>
                </div>
                <div class="bind-item">
                  <div class="bind-left">
                    <span class="bind-label">邮箱绑定</span>
                    <span class="bind-value">{{ userInfo.email || '未绑定' }}</span>
                  </div>
                  <el-button type="primary" text>{{ userInfo.email ? '更换' : '绑定' }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="其它数据" name="otherData">
          <template #label>
            <span class="tab-label">
              <el-icon><DataLine /></el-icon>
              <span>其它数据</span>
            </span>
          </template>
          <div class="tab-content">
            <div class="data-cards">
              <div class="data-card">
                <div class="data-icon collect">
                  <el-icon :size="30"><DataLine /></el-icon>
                </div>
                <div class="data-info">
                  <div class="data-value">{{ otherData.collectCount }}</div>
                  <div class="data-label">收藏数量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="data-icon query">
                  <el-icon :size="30"><DataLine /></el-icon>
                </div>
                <div class="data-info">
                  <div class="data-value">{{ otherData.queryCount }}</div>
                  <div class="data-label">查询次数</div>
                </div>
              </div>
              <div class="data-card">
                <div class="data-icon login">
                  <el-icon :size="30"><DataLine /></el-icon>
                </div>
                <div class="data-info">
                  <div class="data-value">{{ otherData.loginCount }}</div>
                  <div class="data-label">登录次数</div>
                </div>
              </div>
            </div>
            <div class="info-card">
              <div class="card-header">
                <span class="card-title">最近活动</span>
              </div>
              <el-timeline>
                <el-timeline-item timestamp="2024-03-20 14:30" placement="top">
                  <div class="timeline-content">查询了药品"阿莫西林胶囊"</div>
                </el-timeline-item>
                <el-timeline-item timestamp="2024-03-19 10:15" placement="top">
                  <div class="timeline-content">收藏了药品"布洛芬片"</div>
                </el-timeline-item>
                <el-timeline-item timestamp="2024-03-18 09:00" placement="top">
                  <div class="timeline-content">登录系统</div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-info {
  background-color: #f5f5f5;
  min-height: 100%;

  .user-info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .user-info-header-left-title {
      font-size: 22px;
      font-weight: 600;
      color: #333;
    }
  }

  .user-info-content {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    min-height: calc(100vh - 220px);

    .user-tabs {
      height: 100%;

      :deep(.el-tabs__header) {
        margin-right: 30px;
      }

      :deep(.el-tabs__nav-wrap) {
        border-radius: 8px;
        padding: 10px 0;
      }

      :deep(.el-tabs__item) {
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        margin: 5px 10px;
        border-radius: 6px;
        transition: all 0.3s;

        &:hover {
          background-color: #e8f4f8;
        }

        &.is-active {
          background: linear-gradient(135deg, #56c8ec, #48d1cc);
          color: #fff;
        }
      }

      .tab-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
      }
    }
  }
}

.tab-content {
  padding: 10px 20px;
}

.info-card {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  padding: 20px;
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebeef5;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
  }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 0;

  .user-avatar {
    background: linear-gradient(135deg, #56c8ec, #48d1cc);
    margin-bottom: 15px;
  }

  .upload-btn {
    margin-top: 10px;
  }
}

.info-form {
  max-width: 500px;

  .info-value {
    color: #606266;
    font-size: 14px;
  }
}

.account-form {
  max-width: 400px;
}

.bind-list {
  .bind-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .bind-left {
      display: flex;
      flex-direction: column;
      gap: 5px;

      .bind-label {
        font-size: 14px;
        color: #909399;
      }

      .bind-value {
        font-size: 15px;
        color: #303133;
      }
    }
  }
}

.data-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  .data-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .data-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;

      &.collect {
        background: linear-gradient(135deg, #f093fb, #f5576c);
      }

      &.query {
        background: linear-gradient(135deg, #4facfe, #00f2fe);
      }

      &.login {
        background: linear-gradient(135deg, #43e97b, #38f9d7);
      }
    }

    .data-info {
      .data-value {
        font-size: 28px;
        font-weight: 600;
        color: #303133;
      }

      .data-label {
        font-size: 14px;
        color: #909399;
        margin-top: 5px;
      }
    }
  }
}

.timeline-content {
  font-size: 14px;
  color: #606266;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
  font-size: 12px;
}
</style>
