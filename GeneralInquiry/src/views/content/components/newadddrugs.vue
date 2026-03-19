<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

// 定义 props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
// 表单引用
const formRef = ref(null)



// 定义 emits
const emit = defineEmits(['update:visible', 'submit', 'cancel'])

// 表单数据
const formData = ref({
  drugName: '',
  genericName: '',
  dosage: '',
  dosageForm: '颗粒剂',
  character: '',
  ingredients: '',
  medicationType: '非处方药',
  category: '西药',
  indications: '',
  mainEffects: '',
  contraindications: '',
  adverseReactions: '',
  image: ''
})

// 剂型选项
const dosageFormOptions = [
  { label: '颗粒剂', value: '颗粒剂' },
  { label: '片剂', value: '片剂' },
  { label: '胶囊', value: '胶囊' },
  { label: '口服液', value: '口服液' },
  { label: '注射剂', value: '注射剂' },
  { label: '软膏', value: '软膏' },
  { label: '喷雾剂', value: '喷雾剂' }
]

// 用药类型选项
const medicationTypeOptions = [
  { label: '非处方药', value: '非处方药' },
  { label: '处方药', value: '处方药' }
]

// 分类选项
const categoryOptions = [
  { label: '西药', value: '西药' },
  { label: '中成药', value: '中成药' },
  { label: '中草药', value: '中草药' },
  { label: '自制剂', value: '自制剂' }
]

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  emit('cancel')
}

// 提交表单
const handleSubmit = () => {
  emit('submit', formData.value)
  emit('update:visible', false)
}

// 重置表单
const handleReset = () => {
  formData.value = {
    drugName: '',
    genericName: '',
    dosage: '',
    dosageForm: '颗粒剂',
    character: '',
    ingredients: '',
    medicationType: '非处方药',
    category: '西药',
    indications: '',
    mainEffects: '',
    contraindications: '',
    adverseReactions: '',
    image: ''
  }
  formRef.value?.resetFields()
}

// 图片上传前的处理
const beforeImageUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('上传图片只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 图片上传成功
const handleImageSuccess = (response) => {
  formData.value.image = response.url
  ElMessage.success('图片上传成功')
}

// 表单验证规则
const rules = ref({
  drugName: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
})

</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    title="新增"
    width="70%"
    :close-on-click-modal="false"
    class="drug-dialog"
    @close="handleClose"
  >
    <div class="dialog-content">
      <!-- 基本信息标题 -->
      <div class="section-title">
        <span class="title-icon">|</span>
        <span class="title-text">基本信息</span>
      </div>

      <!-- 表单内容 -->
      <el-form :model="formData" label-width="90px" class="drug-form" :rules="rules" ref="formRef">
        <!-- 第一行 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="药品名称:" prop="drugName">
              <el-input v-model="formData.drugName" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="药品通用名:" prop="genericName">
              <el-input v-model="formData.genericName" placeholder="请输入通用名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用法用量:" prop="dosage">
              <el-input v-model="formData.dosage" placeholder="请输入用法用量" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第二行 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="剂型:" prop="dosageForm">
              <el-select v-model="formData.dosageForm" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in dosageFormOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用药类型:" prop="medicationType">
              <el-select v-model="formData.medicationType" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in medicationTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分类:" prop="category">
              <el-select v-model="formData.category" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第三行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性状:" prop="character">
              <el-input v-model="formData.character" placeholder="请输入性状" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成分:" prop="ingredients">
              <el-input v-model="formData.ingredients" placeholder="请输入成分" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第四行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="适用病症:" prop="indications">
              <el-input v-model="formData.indications" placeholder="请输入适用病症" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要功效:" prop="mainEffects">
              <el-input v-model="formData.mainEffects" placeholder="请输入主要功效" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="禁忌:" prop="contraindications">
              <el-input v-model="formData.contraindications" placeholder="请输入禁忌" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="不良反应:" prop="adverseReactions">
              <el-input v-model="formData.adverseReactions" placeholder="请输入不良反应" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第六行 - 图片上传 -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="图片:" prop="image">
              <el-upload
                class="image-uploader"
                action="/api/upload"
                :show-file-list="false"
                :before-upload="beforeImageUpload"
                :on-success="handleImageSuccess"
              >
                <div v-if="formData.image" class="image-preview">
                  <img :src="formData.image" class="uploaded-image" />
                </div>
                <div v-else class="upload-placeholder">
                  <el-icon class="upload-icon"><Plus /></el-icon>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
// 新增药品弹窗
.drug-dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid #e4e7ed;
    margin-right: 0;
    padding: 20px;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid #e4e7ed;
    padding: 15px 20px;
  }
}

.dialog-content {
  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;

    .title-icon {
      color: #409eff;
      font-weight: bold;
      font-size: 16px;
      margin-right: 8px;
    }

    .title-text {
      font-size: 16px;
      font-weight: 600;
      color: #1E98D7;
    }
  }
}

.drug-form {
  .el-form-item {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    color: #606266;
    font-weight: 500;
  }

  :deep(.el-input__wrapper) {
    border-radius: 4px;
  }

  :deep(.el-select .el-input__wrapper) {
    border-radius: 4px;
  }
}

.image-uploader {
  .upload-placeholder {
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.3s;

    &:hover {
      border-color: #409eff;
    }

    .upload-icon {
      font-size: 28px;
      color: #8c939d;
    }
  }

  .image-preview {
    width: 120px;
    height: 120px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;

    .uploaded-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  .el-button {
    min-width: 80px;
  }
}
</style>
