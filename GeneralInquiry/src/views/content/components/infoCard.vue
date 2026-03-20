<script setup>
import { ref, watch } from 'vue'
import { Star, StarFilled, CopyDocument } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  drugData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'toggle-favorite'])

const isFavorite = ref(false)

watch(() => props.drugData, (newVal) => {
  if (newVal) {
    isFavorite.value = newVal.isFavorite || false
  }
}, { immediate: true })

const handleClose = () => {
  emit('update:visible', false)
}

const handleToggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('toggle-favorite', props.drugData)
}

const handleCopy = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('复制成功')
  })
}
</script>

<template>
  <el-drawer
    :model-value="visible"
    title="药品详情"
    direction="rtl"
    size="700px"
    @close="handleClose"
  >
    <div class="drug-card">
      <div class="basic-info-section">
        <div class="section-header">
          <span class="section-title">基本信息</span>
        </div>
        <div class="drug-header">
          <img :src="drugData.image" alt="药品图片" class="drug-image" />
          <div class="drug-title-info">
            <div class="drug-name-row">
              <span class="drug-name">{{ drugData.name }}</span>
              <span v-if="drugData.subName" class="drug-subname">{{ drugData.subName }}</span>
            </div>
            <div class="drug-enc">
              <span>ENC: {{ drugData.ENC }}</span>
              <el-icon class="copy-icon" @click="handleCopy(drugData.ENC)">
                <CopyDocument />
              </el-icon>
            </div>
            <div class="category-tags">
              <span class="tag green">{{ drugData.category }}</span>
              <span class="tag blue">西药医保</span>
            </div>
          </div>
        </div>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">批准文号</span>
            <span class="info-value">{{ drugData.approvalNumber }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">生产厂家</span>
            <span class="info-value">{{ drugData.manufacturer }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">药品规格</span>
            <span class="info-value">{{ drugData.specification }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">剂型</span>
            <span class="info-value">{{ drugData.dosageForm }}</span>
          </div>
        </div>
        <div class="action-btns">
          <el-button :type="isFavorite ? 'warning' : 'default'" @click="handleToggleFavorite">
            <el-icon>
              <StarFilled v-if="isFavorite" />
              <Star v-else />
            </el-icon>
            {{ isFavorite ? '已收藏' : '收藏' }}
          </el-button>
        </div>
      </div>

      <div class="drug-info-section">
        <div class="section-header">
          <span class="section-title">药品信息</span>
        </div>
        <div class="drug-info-content">
          <div class="info-block">
            <div class="info-block-title">适应症</div>
            <div class="info-block-text">
              用于外感病，邪犯少阳证，症见寒热往来、胸胁苦满、食欲不振、心烦喜呕、口苦咽干。
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">用法用量</div>
            <div class="info-block-text">
              开水冲服。一次1袋，一日3次。
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">不良反应</div>
            <div class="info-block-text">
              尚不明确。
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">禁忌</div>
            <div class="info-block-text">
              尚不明确。
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">注意事项</div>
            <div class="info-block-text">
              1. 忌烟、酒及辛辣、生冷、油腻食物。<br />
              2. 不宜在服药期间同时服用滋补性中药。<br />
              3. 风寒感冒者不适用。<br />
              4. 糖尿病患者及有高血压、心脏病、肝病、肾病等慢性病严重者应在医师指导下服用。
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">贮藏</div>
            <div class="info-block-text">
              密封，置阴凉干燥处。
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.drug-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  padding-bottom: 12px;
  margin-bottom: 16px;
  border-bottom: 2px solid #56c8ec;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}

.basic-info-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;

  .drug-header {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;

    .drug-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #ebeef5;
    }

    .drug-title-info {
      flex: 1;

      .drug-name-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 8px;

        .drug-name {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
        }

        .drug-subname {
          font-size: 14px;
          color: #909399;
        }
      }

      .drug-enc {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #909399;
        margin-bottom: 8px;

        .copy-icon {
          cursor: pointer;
          color: #56c8ec;

          &:hover {
            color: #409eff;
          }
        }
      }

      .category-tags {
        display: flex;
        gap: 8px;

        .tag {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;

          &.green {
            background-color: #e8f9f0;
            color: #67c23a;
          }

          &.blue {
            background-color: #e8f4fc;
            color: #409eff;
          }
        }
      }
    }
  }

  .info-list {
    .info-item {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px dashed #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        width: 80px;
        flex-shrink: 0;
        font-size: 14px;
        color: #909399;
      }

      .info-value {
        flex: 1;
        font-size: 14px;
        color: #303133;
      }
    }
  }

  .action-btns {
    margin-top: 16px;
    display: flex;
    justify-content: center;
  }
}

.drug-info-section {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;

  .drug-info-content {
    .info-block {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .info-block-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 8px;
        padding-left: 10px;
        border-left: 3px solid #56c8ec;
      }

      .info-block-text {
        font-size: 13px;
        color: #606266;
        line-height: 1.8;
        padding-left: 13px;
      }
    }
  }
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;

  .el-drawer__title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}

:deep(.el-drawer__body) {
  padding: 20px;
  overflow-y: auto;
}
</style>
