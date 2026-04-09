// 收藏药品页面
<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, View, Delete } from '@element-plus/icons-vue'
import infoCard from './components/infoCard.vue'
import { DRUG_TYPE_OPTIONS, DRUG_CATEGORY_OPTIONS } from '@/constants/drugConstants.js'
import dayjs from 'dayjs'

// localStorage key
const FAVORITES_KEY = 'drug_favorites'

// 搜索关键词
const searchKeyword = ref('')

// 分类数据
const categories = DRUG_TYPE_OPTIONS
// 类别数据
const indications = DRUG_CATEGORY_OPTIONS

// 当前选中的分类（单选）
const activeCategory = ref('')
// 当前选中的适应症（多选）
const activeIndications = ref([])

// 原始收藏数据
const favoritesData = ref([])
// 搜索关键词（实际用于筛选的值）
const searchKeywordFilter = ref('')

// 从localStorage加载收藏数据
const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      favoritesData.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('加载收藏数据失败:', error)
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadFavorites()
})

// 过滤后的表格数据
const tableData = computed(() => {
  let data = favoritesData.value

  // 根据搜索关键词过滤
  if (searchKeywordFilter.value) {
    const keyword = searchKeywordFilter.value.toLowerCase()
    data = data.filter(item =>
      item.drugName?.toLowerCase().includes(keyword) ||
      item.manufacturer?.toLowerCase().includes(keyword) ||
      item.approvalNumber?.toLowerCase().includes(keyword)
    )
  }

  // 根据分类过滤（单选）
  if (activeCategory.value) {
    data = data.filter(item => item.category === activeCategory.value)
  }

  // 根据类别过滤（多选）- 排除空字符串（全部类别）
  const selectedIndications = activeIndications.value.filter(v => v !== '')
  if (selectedIndications.length > 0) {
    data = data.filter(item => {
      const itemTypes = item.drugTypesStr ? item.drugTypesStr.split(',').map(t => t.trim()) : []
      // 检查是否有交集
      return selectedIndications.some(selected => itemTypes.includes(selected))
    })
  }

  return data
})

const total = ref(0)  //总条数数据
// 分页数据
const params = ref({
 pagenum:1,
 pagesize:5,
 cate_id:'',
 state:''
})
// 切换分类（单选）
const handleCategoryChange = (value) => {
  activeCategory.value = value
}

// 切换适应症（多选）
const handleIndicationChange = (value) => {
  const index = activeIndications.value.indexOf(value)
  if (index > -1) {
    activeIndications.value.splice(index, 1)
  } else {
    activeIndications.value.push(value)
  }
}

// 搜索
const handleSearch = () => {
  searchKeywordFilter.value = searchKeyword.value
}

// 重置
const handleReset = () => {
  searchKeyword.value = ''
  searchKeywordFilter.value = ''
  activeCategory.value = ''
  activeIndications.value = []
}

// 抽屉显示状态
const drawerVisible = ref(false)
const currentDrug = ref({})

// 查看
const handleView = (row) => {
  currentDrug.value = {
    ...row,
    isFavorite: true
  }
  drawerVisible.value = true
}

// 切换收藏（在详情卡片中取消收藏）
const handleToggleFavorite = (drug) => {
  // 从数据中移除
  const index = favoritesData.value.findIndex(item => item.id === drug.id)
  if (index > -1) {
    favoritesData.value.splice(index, 1)
    // 更新localStorage
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesData.value))
  }
  // 关闭抽屉
  drawerVisible.value = false
}

// 删除
const handleDelete = async (row) => {
  const confirm = await ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  if (!confirm) {
    return
  }
  // 从数据中移除
  const index = favoritesData.value.findIndex(item => item.id === row.id)
  if (index > -1) {
    favoritesData.value.splice(index, 1)
    // 更新localStorage
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesData.value))
  }
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSizeChange = (size) => {
  pageSize.value = size
}
</script>

<template>
  <div class="collect-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <el-icon class="search-icon"><Search /></el-icon>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索关键字"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        />
      </div>
      <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
      <el-button class="reset-btn" @click="handleReset">重置</el-button>
    </div>  
    <!-- 内容 -->
    <div class="filter-container">
      <!-- 左侧筛选栏 -->
      <div class="filter-sidebar">
        <!-- 分类筛选（单选） -->
        <div class="filter-section">
          <div class="filter-title">分类</div>
          <el-radio-group v-model="activeCategory" class="category-radio-group">
            <el-radio
              v-for="cat in categories"
              :key="cat.value"
              :label="cat.value"
              class="category-radio"
            >
              {{ cat.label }}
            </el-radio>
          </el-radio-group>
        </div>
        <!-- 类别筛选（多选） -->
        <div class="filter-section">
          <div class="filter-title">类别</div>
          <el-checkbox-group v-model="activeIndications" class="indication-checkbox-group">
            <el-checkbox
              v-for="ind in indications"
              :key="ind.value"
              :label="ind.value"
              class="indication-checkbox"
            >
              {{ ind.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

    <!-- 右侧内容区 -->
    <div class="content-area">
      <!-- 数据表格 -->
      <div class="table-container">
        <el-table :data="tableData" style="width: 100%" class="collect-table">
          <el-table-column label="名称" min-width="120">
            <template #default="{ row }">
              <div>
                <div>{{ row.drugName }}</div>
                <div v-if="row.commonName" class="common-name">({{ row.commonName }})</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="厂家" min-width="180" prop="manufacturer" />
          <el-table-column label="批准文号" min-width="140" prop="approvalNumber" />
          <el-table-column label="规格" min-width="100" prop="specification" />
          <el-table-column label="收藏时间" min-width="150">
            <template #default="{ row }">
              {{ row.collectTime ? dayjs(row.collectTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <div class="operation-btns">
                <span class="view-btn" @click="handleView(row)">查看</span>
                <span class="delete-btn" @click="handleDelete(row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          v-model:current-page="params.pagenum"
          v-model:page-size="params.pagesize"
          :page-sizes="[10, 20, 50, 100]"
          :size="small"
          :background="true"
          small
          layout="total, jumper,sizes, prev, pager, next"
          :total="total"
          style="justify-content: flex-end;margin-top: 20px"
        />
      </div>
    </div>
  </div>
  </div>

  <!-- 药品详情卡片 -->
  <infoCard
    v-model:visible="drawerVisible"
    :drug-data="currentDrug"
    :show-favorite-btn="false"
    @toggle-favorite="handleToggleFavorite"
  />
</template>

<style scoped lang="scss">
.collect-page {
  gap: 20px;
  min-height: 100%;
  background-color: #f5f5f5;
  
}
// 搜索栏
.search-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  .search-input-wrapper {
    position: relative;
    flex: 1;
    max-width: 300px;
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #5ee7df;
      font-size: 18px;
      z-index: 1;
    }
    .search-input {
      :deep(.el-input__wrapper) {
        padding-left: 35px;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      :deep(.el-input__inner) {
        height: 40px;
      }
    }
  }
  .search-btn {
    background: linear-gradient(135deg, #5ee7df 0%, #4facfe 100%);
    border: none;
    border-radius: 20px;
    padding: 10px 30px;
    font-size: 14px;
    height: 40px;
    margin-left: 50px;
    &:hover {
    opacity: 0.9;
    }
  }
  .reset-btn {
    border-radius: 20px;
    padding: 10px 25px;
    font-size: 14px;
    height: 40px;
    margin-left: 0;
  }
}
// 内容
.filter-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
// 左侧筛选栏
.filter-sidebar {
  width: 140px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px 0;
  flex-shrink: 0;

}
.filter-section {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.filter-title {
  font-size: 14px;
  color: #39b9b1;
  font-weight: 500;
  padding: 0 15px 10px;
  margin-bottom: 5px;
}

// 分类单选样式
.category-radio-group {
  display: flex;
  .category-radio {
    margin-right: 0;
    min-width: 100%;
    padding: 10px 0;
    height: auto;
    display: flex;
    justify-content: center;
    :deep(.el-radio__input) {
      display: none;
    }
    :deep(.el-radio__label) {
      padding-left: 0;
      font-size: 14px;
      color: #666;
    }
    &:hover {
      background-color: #f5f7fa;
      :deep(.el-radio__label) {
        color: #4facfe;
      }
    }
    &.is-checked {
      background: linear-gradient(135deg, #5ee7df 0%, #4facfe 100%);
      :deep(.el-radio__label) {
        color: #fff;
      }
    }
  }
}

// 适应症多选样式
.indication-checkbox-group {
  display: flex;
  flex-direction: column;
  .indication-checkbox {
    margin-right: 0;
    padding: 10px 0;
    height: auto;
    padding-left: 10px;
    :deep(.el-checkbox__input) {
      display: none;
    }
    :deep(.el-checkbox__label) {
      padding-left: 0;
      font-size: 16px;
      color: #666;
    }
    &:hover {
      background-color: #f5f7fa;
      :deep(.el-checkbox__label) {
        color: #4facfe;
      }
    }
    &.is-checked {
      background: linear-gradient(135deg, #5ee7df 0%, #4facfe 100%);
      :deep(.el-checkbox__label) {
        color: #fff;
      }
    }
  }
}

// 右侧内容区
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  
}
// 表格容器
.table-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  flex: 1;
  margin-bottom: 20px;

  .collect-table {
    :deep(.el-table__header) {
      th {
        background-color: #f8f9fa;
        color: #666;
        font-weight: 500;
        font-size: 14px;
      }
    }

    :deep(.el-table__row) {
      td {
        padding: 15px 0;
        font-size: 14px;
        color: #333;
      }
    }

    .operation-btns {
      display: flex;
      gap: 15px;

      .view-btn {
        color: #5ee7df;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          color: #4facfe;
        }
      }

      .delete-btn {
        color: #f56c6c;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          color: #f78989;
        }
      }
    }
  }
}

// 分页
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 8px;

  .total-text {
    font-size: 14px;
    color: #666;
  }

  .page-size-select {
    width: 90px;

    :deep(.el-input__wrapper) {
      border-radius: 4px;
    }
  }

  :deep(.el-pagination) {
    .btn-prev,
    .btn-next {
      background-color: #f5f7fa;
      border-radius: 4px;
    }

    .el-pager li {
      background-color: #f5f7fa;
      border-radius: 4px;
      margin: 0 5px;

      &.active {
        background: linear-gradient(135deg, #5ee7df 0%, #4facfe 100%);
        color: #fff;
      }

      &:hover {
        color: #4facfe;
      }
    }
  }

  .page-jump {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;

    .page-input {
      width: 40px;

      :deep(.el-input__wrapper) {
        padding: 0 5px;
      }

      :deep(.el-input__inner) {
        text-align: center;
      }
    }
  }
}
</style>
