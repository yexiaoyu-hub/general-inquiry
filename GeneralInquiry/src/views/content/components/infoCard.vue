// 药品详情组件
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
  },
  showFavoriteBtn: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'toggle-favorite'])

const isFavorite = ref(false)

// 监听药品数据变化，更新收藏状态
watch(() => props.drugData, (newVal) => {
  if (newVal) {
    isFavorite.value = newVal.isFavorite || false
  }
}, { immediate: true })

// 切换收藏状态
const handleToggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('toggle-favorite', props.drugData)
}

const handleCopy = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('复制成功')
  })
}

const handleClose = () => {
  emit('update:visible', false)
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
          <img :src="drugData.image" class="drug-image" />
          <div class="drug-title-info">
            <div class="drug-name-row">
              <span class="drug-name">{{ drugData.drugName }}</span>
              <span v-if="drugData.commonName" class="drug-subname">{{ drugData.commonName }}</span>
            </div>
            <div class="drug-enc">
              <span>ENC: {{ drugData.drugCode }}</span>
              <el-icon class="copy-icon" @click="handleCopy(drugData.drugCode)">
                <CopyDocument />
              </el-icon>
            </div>
            <div class="type-tags">
              <span
                v-for="(type, index) in (drugData.drugTypesStr ? drugData.drugTypesStr.split(',') : [])"
                :key="index"
                class="tag green"
              >
                {{ type.trim() }}
              </span>
            </div>
          </div>
        </div>
        <div class="info-list">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">批准文号</span>
              <span class="info-value">{{ drugData.approvalNumber }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">生产厂家</span>
              <span class="info-value">{{ drugData.manufacturer }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">生产地址</span>
              <span class="info-value">{{ drugData.productionAddress }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">药品规格</span>
              <span class="info-value">{{ drugData.specification }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">包装材质</span>
              <span class="info-value">{{ drugData.packagingMaterial }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">有效期</span>
              <span class="info-value">{{ drugData.validityPeriod }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">剂型</span>
              <span class="info-value">{{ drugData.dosageForm }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">药品分类</span>
              <span class="info-value">{{ drugData.category }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">用药类型</span>
              <span class="info-value">{{ drugData.medicationType }}</span> 
            </div>
          </div>
        </div>
        <div class="action-btns" v-if="showFavoriteBtn">
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
            <div class="info-block-title">成分</div>
            <div class="info-block-text">
              {{ drugData.composition || '尚不明确' }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">性状</div>
            <div class="info-block-text">
              {{ drugData.properties || '尚不明确' }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">适应症</div>
            <div class="info-block-text">
              {{ drugData.indications || '尚不明确' }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">用法用量</div>
            <div class="info-block-text">
              {{ drugData.usageDosage || '尚不明确' }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">不良反应</div>
            <div class="info-block-text">
              {{ drugData.adverseReaction || '尚不明确' }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">禁忌</div>
            <div class="info-block-text">
              {{ drugData.taboo || '尚不明确' }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">注意事项</div>
            <div class="info-block-text">
              {{ drugData.precautions || '尚不明确' }}
            </div>
          </div>
          <div class="info-block">
            <div class="info-block-title">贮藏</div>
            <div class="info-block-text">
              {{ drugData.storage || '尚不明确' }}
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

      .type-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .tag {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;

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
    .info-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px dashed #ebeef5;

      &:last-child {
        border-bottom: none;
      }

      .info-item {
        display: flex;
        flex: 1;

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
