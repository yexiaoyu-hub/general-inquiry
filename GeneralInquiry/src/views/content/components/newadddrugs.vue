// 新增药品组件
<script setup>
import { ref, watch, computed } from 'vue'
import { Plus, CirclePlus, ZoomIn, CircleClose } from '@element-plus/icons-vue'
import { drugAddService, drugUpdateService } from '@/api/drug.js'
import { DRUG_CATEGORY_OPTIONS, DRUG_TYPE_OPTIONS } from '@/constants/drugConstants.js'


// 定义 props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: () => null
  }
})

// 计算是否为编辑模式
const isEditMode = computed(() => !!props.editData?.id)

const formRef = ref(null)  // 表单引用
const drugRef = ref(null)  // 药品信息引用
const drugInfoData = ref([])  // 药品信息数据

// 添加药品信息
const handleAdd = () => {
  drugInfoData.value.push({
    manufacturer: '',
    productionAddress: '',
    approvalNumber: '',
    drugCode: '',
    specification: '',
    validityPeriod: '',
    packagingMaterial: '',
    image: ''
  })
  // 重置药品信息表单
  drugRef.value?.resetFields()
}

// 行图片上传成功
const handleRowImageSuccess = (response, row) => {
  row.image = response.data || response.url
  ElMessage.success('图片上传成功')
}

// 预览图片
const previewImage = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}



// 定义 emits
const emit = defineEmits(['update:visible', 'submit', 'cancel'])

// 表单数据
const formData = ref({
  drugName: '',
  commonName: '',
  usageDosage: '',
  dosageForm: '颗粒剂',
  properties: '',
  composition: '',
  medicationType: '非处方药',
  category: '西药',
  indications: '',
  precautions: '',
  taboo: '',
  adverseReaction: '',
  drugTypes: []
})

// 监听编辑数据变化，回显到表单
watch(() => props.editData, (newVal) => {
  if (newVal && props.visible) {
    formData.value = {
      drugName: newVal.drugName || '',
      commonName: newVal.commonName || '',
      usageDosage: newVal.usageDosage || '',
      dosageForm: newVal.dosageForm || '颗粒剂',
      properties: newVal.properties || '',
      composition: newVal.composition || '',
      medicationType: newVal.medicationType || '非处方药',
      category: newVal.category || '西药',
      indications: newVal.indications || '',
      precautions: newVal.precautions || '',
      taboo: newVal.taboo || '',
      adverseReaction: newVal.adverseReaction || '',
      drugTypes: newVal.drugTypes || []
    }
    drugInfoData.value = newVal.drugInfoList || []
  }
}, { immediate: true })

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

//包装材质选项
const packageMaterialOptions = [
  { label: '塑料', value: '塑料' },
  { label: '玻璃', value: '玻璃' },
  { label: '金属', value: '金属' },
  { label: '纸类/复合膜', value: '纸类/复合膜' },
  { label: '其他', value: '其他' }
]

const drugCategoryOptions = DRUG_CATEGORY_OPTIONS.filter(item => item.value !== '')// 药品类别选项
const categories = DRUG_TYPE_OPTIONS // 分类标签

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  emit('cancel')
  formData.value = {
    drugName: '',
    commonName: '',
    usageDosage: '',
    dosageForm: '颗粒剂',
    properties: '',
    composition: '',
    medicationType: '非处方药',
    category: '西药',
    indications: '',
    precautions: '',
    taboo: '',
    adverseReaction: '',
    drugTypes: [],
    image: ''
  }
  drugInfoData.value = []
}

// 提交新增药品表单
const handleSubmit = async () => {
  // 校验基本信息
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  // 校验药品信息
  if (!validateDrugInfo()) return
  // 提交表单数据
  const res = await drugAddService({ ...formData.value, drugInfoList: drugInfoData.value })
  if(res.code === 200){
    ElMessage.success('新增药品成功')
  }else{
    ElMessage.error(res.msg || '新增药品失败')
  }
  emit('submit', { ...formData.value, drugInfoList: drugInfoData.value })
  emit('update:visible', false)
}
// 提交编辑药品表单
const handleSubmitEdit = async () => {
  // 校验基本信息
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  // 校验药品信息
  if (!validateDrugInfo()) return
  // 提交表单数据，带上 id
  const res = await drugUpdateService({ ...formData.value, id: props.editData.id, drugInfoList: drugInfoData.value })
  if(res.code === 200){
    ElMessage.success('更新药品成功')
  }else{
    ElMessage.error(res.msg || '更新药品失败')
  }
  emit('submit', { ...formData.value, drugInfoList: drugInfoData.value })
  emit('update:visible', false)
}

// 重置表单
const handleResetinfo = () => {
  formData.value = {
    drugName: '',
    commonName: '',
    usageDosage: '',
    dosageForm: '颗粒剂',
    properties: '',
    composition: '',
    medicationType: '非处方药',
    category: '西药',
    indications: '',
    precautions: '',
    taboo: '',
    adverseReaction: '',
    drugTypes: []
  }
  formRef.value?.resetFields()
  drugRef.value?.resetFields()
  drugInfoData.value = []
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

// 表单验证规则
const rules = ref({
  drugName: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
})

// 药品信息校验函数
const validateDrugInfo = () => {
  if (drugInfoData.value.length === 0) {
    ElMessage.warning('请至少添加一条药品信息')
    return false
  }
  for (let i = 0; i < drugInfoData.value.length; i++) {
    const item = drugInfoData.value[i]
    if (!item.manufacturer || !item.manufacturer.trim()) {
      ElMessage.error(`第 ${i + 1} 行的厂家不能为空`)
      return false
    }
    if (!item.approvalNumber || !item.approvalNumber.trim()) {
      ElMessage.error(`第 ${i + 1} 行的批准文号不能为空`)
      return false
    }
  }
  return true
}



// 删除药品信息
const handleDelete = (row, index) => {
  drugInfoData.value.splice(index, 1)
}
  
</script>

<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="emit('update:visible', $event)"
    :title="isEditMode ? '编辑药品' : '新增药品'"  
    width="80%"
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
            <el-form-item label="药品通用名:" prop="commonName">
              <el-input v-model="formData.commonName" placeholder="请输入通用名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用法用量:" prop="usageDosage">
              <el-input v-model="formData.usageDosage" placeholder="请输入用法用量" />
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
                  v-for="item in categories"
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
            <el-form-item label="性状:" prop="properties">
              <el-input v-model="formData.properties" placeholder="请输入性状" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成分:" prop="composition">
              <el-input v-model="formData.composition" placeholder="请输入成分" />
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
            <el-form-item label="不良反应:" prop="adverseReaction">
              <el-input v-model="formData.adverseReaction" placeholder="请输入不良反应" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第五行 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="禁忌:" prop="taboo">
              <el-input v-model="formData.taboo" placeholder="请输入禁忌" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注意事项:" prop="precautions">
              <el-input v-model="formData.precautions" placeholder="请输入注意事项" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 第六行  -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="药品类别:" prop="drugTypes">
              <el-checkbox-group v-model="formData.drugTypes" v-for="value in drugCategoryOptions" :key="value.value">
                <el-checkbox :value="value.value" name="value.label">
                  {{ value.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="贮藏:" prop="storage">
              <el-input v-model="formData.storage" placeholder="请输入贮藏方式" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 药品信息标题 -->
      <div class="section-title">
        <span class="title-icon">|</span>
        <span class="title-text">药品信息</span>
      </div>
      <el-button type="success" class="add-btn" @click="handleAdd" plain>
        <el-icon><CirclePlus /></el-icon>
        添加药品信息
      </el-button>
      <!-- 药品信息列表 -->
      <div class="drug-info-container">
        <el-table :data="drugInfoData" class="collect-table">
          <el-table-column label="厂家" align="left" prop="manufacturer">
              <template #header>
                <span>厂家 <span style="color: red; margin-left: 2px;">*</span></span>
              </template>
              <template #default="{ row }">
                <el-input v-model="row.manufacturer" />
              </template>
            </el-table-column>
            <el-table-column label="生产地址" align="center" prop="productionAddress">
              <template #default="{ row }">
                <el-input v-model="row.productionAddress" />
              </template>
            </el-table-column>
            <el-table-column label="批准文号" align="center" prop="approvalNumber">
              <template #header>
                <span>批准文号 <span style="color: red; margin-left: 2px;">*</span></span>
              </template>
              <template #default="{ row }">
                <el-input v-model="row.approvalNumber" />  
              </template>
            </el-table-column>
            <el-table-column label="药品编码" align="center" prop="drugCode">
              <template #default="{ row }">
                <el-input v-model="row.drugCode" type="number" />  
              </template>
            </el-table-column>
            <el-table-column label="规格" align="center" prop="specification">
              <template #default="{ row }">
                <el-input v-model="row.specification" />  
              </template>
            </el-table-column>
            <el-table-column label="有效期" align="center" prop="validityPeriod">
              <template #default="{ row }">
                <el-input v-model="row.validityPeriod" />  
              </template>
            </el-table-column>
            <el-table-column label="包装材质" align="center" prop="packagingMaterial">
              <template #default="{ row }">
                <el-select v-model="row.packagingMaterial" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in packageMaterialOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select> 
              </template>
            </el-table-column>
            <el-table-column label="图片" align="center" prop="image" width="80">
              <template #default="{ row }">
                <div class="image-cell">
                  <el-upload
                    class="row-image-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :before-upload="beforeImageUpload"
                    :on-success="(res) => handleRowImageSuccess(res, row)"
                  >
                    <div v-if="row.image" class="image-preview" @click.stop="previewImage(row.image)">
                      <img :src="row.image" class="uploaded-image" />
                      <div class="image-overlay">
                        <el-icon><ZoomIn /></el-icon>
                      </div>
                    </div>
                    <div v-else class="upload-placeholder">
                      <el-icon class="upload-icon"><Plus /></el-icon>
                    </div>
                  </el-upload>
                  <el-icon v-if="row.image" class="delete-image-icon" @click="row.image = ''"><CircleClose /></el-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="60">
              <template #default="{ row, $index }">
                <el-button type="danger" link @click="handleDelete(row, $index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </div>
    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="handleResetinfo">重置</el-button>
        <el-button type="primary" @click="handleSubmit" v-if="!isEditMode">确定</el-button>
        <el-button type="success" @click="handleSubmitEdit" v-else>保存</el-button>
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
  .add-btn {
    border: none;
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
:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  padding-right: 10px;
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

// 表格内图片上传样式
.image-cell {
  position: relative;
  display: inline-block;

  .row-image-uploader {
    display: inline-block;

    .upload-placeholder {
      width: 50px;
      height: 50px;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      background-color: #fafafa;

      &:hover {
        border-color: #409eff;
        background-color: #f0f9ff;
      }

      .upload-icon {
        font-size: 16px;
        color: #8c939d;
      }
    }

    .image-preview {
      width: 50px;
      height: 50px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;

        .image-overlay {
          opacity: 1;
        }
      }

      .uploaded-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;

        .el-icon {
          color: #fff;
          font-size: 18px;
        }
      }
    }
  }

  .delete-image-icon {
    position: absolute;
    top: -6px;
    right: -6px;
    font-size: 14px;
    color: #f56c6c;
    cursor: pointer;
    background-color: #fff;
    border-radius: 50%;
    transition: all 0.3s;

    &:hover {
      color: #ff4d4f;
      transform: scale(1.1);
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
