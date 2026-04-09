// 药品查询页面
<script setup>
import { ref, onMounted } from 'vue'
import { Search, ArrowRight, Star, StarFilled } from '@element-plus/icons-vue'
import infoCard from './components/infoCard.vue'
import { drugInfoPageService } from '@/api/drug.js'
import { DRUG_CATEGORY_OPTIONS, DRUG_TYPE_OPTIONS } from '@/constants/drugConstants.js'

const categories = DRUG_TYPE_OPTIONS // 分类标签
const drugCategoryOptions = DRUG_CATEGORY_OPTIONS // 药品类别选项

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的分类
const activeCategory = ref('')

// 选中的药品类别
const selectedDrugType = ref('')

// 表格数据（扁平化）
const tableData = ref([])
const total = ref(0)

// 分页参数
const params = ref({
  pageNum: 1,
  pageSize: 10
})

// localStorage key
const FAVORITES_KEY = 'drug_favorites'

// 获取药品列表数据（使用厂家分页接口，已展开子表）
const getDrugList = async () => {
  const queryParams = {
    pageNum: params.value.pageNum,
    pageSize: params.value.pageSize,
    keyword: searchKeyword.value || undefined
  }
  
  // 添加药品细分类别筛选参数（下拉框选择）
  if (selectedDrugType.value) {
    queryParams.category = selectedDrugType.value
  }
  
  // 添加药品大类筛选参数
  if (activeCategory.value) {
    queryParams.drugCategory = activeCategory.value
  }
  
  const res = await drugInfoPageService(queryParams)
  tableData.value = res.data?.list || res.data?.data || []
  total.value = res.data?.total || res.data?.totalCount || 0
}

// 分页大小变化
const handleSizeChange = (val) => {
  params.value.pageSize = val
  params.value.pageNum = 1
  getDrugList()
}

// 页码变化
const handleCurrentChange = (val) => {
  params.value.pageNum = val
  getDrugList()
}

// 页面加载时获取数据
onMounted(() => {
  getDrugList()
  // 从localStorage加载收藏列表
  loadFavoritesFromStorage()
})

// 从localStorage加载收藏列表
const loadFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      const favoritesData = JSON.parse(stored)
      favorites.value = favoritesData.map(item => item.id)
    } else {
      favorites.value = []
    }
  } catch (error) {
    console.error('加载收藏数据失败:', error)
    favorites.value = []
  }
}

// 保存收藏列表到localStorage
const saveFavoritesToStorage = (favoritesData) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesData))
  } catch (error) {
    console.error('保存收藏数据失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  getDrugList()
}

// 重置
const handleReset = () => {
  searchKeyword.value = ''
  activeCategory.value = ''
  selectedDrugType.value = ''
  params.value.pageNum = 1
  getDrugList()
}

const drawerVisible = ref(false)
const currentDrug = ref({})

// 收藏列表
const favorites = ref([])

// 分类选择变化
const handleCategoryChange = (value) => {
  activeCategory.value = value
  params.value.pageNum = 1
  getDrugList()
}

// 切换收藏
const toggleFavorite = (row) => {
  const index = favorites.value.indexOf(row.id)
  if (index > -1) {
    // 取消收藏
    favorites.value.splice(index, 1)
  } else {
    // 添加收藏
    favorites.value.push(row.id)
  }
  // 更新localStorage中的完整数据
  updateFavoritesStorage(row)
}

// 更新localStorage中的收藏数据
const updateFavoritesStorage = (row) => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    let favoritesData = stored ? JSON.parse(stored) : []

    const existingIndex = favoritesData.findIndex(item => item.id === row.id)

    if (existingIndex > -1) {
      // 已存在则移除
      favoritesData.splice(existingIndex, 1)
    } else {
      // 不存在则添加完整行数据
      favoritesData.push({
        ...row,
        collectTime: new Date().toLocaleString()
      })
    }

    saveFavoritesToStorage(favoritesData)
  } catch (error) {
    console.error('更新收藏数据失败:', error)
  }
}

// 判断是否已收藏
const isFavorite = (id) => {
  return favorites.value.includes(id)
}

// 点击行显示详情
const handleRowClick = (row) => {
  currentDrug.value = {
    ...row,
    isFavorite: isFavorite(row.id)
  }
  drawerVisible.value = true
}

// 切换收藏状态
const handleToggleFavorite = (drug) => {
  toggleFavorite(drug)
  currentDrug.value.isFavorite = isFavorite(drug.id)
}

// 根据分类获取样式类名
const getCategoryClass = (category) => {
  const categoryMap = {
    '西药': 'blue',
    '中成药': 'green',
    '中草药': 'orange',
    '自制剂': 'purple'
  }
  return categoryMap[category] || 'green'
}
</script>

<template>
  <div class="query-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <el-icon class="search-icon"><Search /></el-icon>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索药品"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        />
      </div>
      <el-form-item class="category-select" label="选择类别">
        <el-select
          v-model="selectedDrugType"
          placeholder="请选择类别"
          style="width: 150px;"
          clearable
        >
          <el-option
            v-for="item in drugCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
      <el-button class="reset-btn" @click="handleReset">重置</el-button>
    </div>

    <!-- 内容 -->
    <div class="table-container">
      <!-- 分类标签 -->
      <div class="category-tags">
        <el-button
          v-for="cat in categories"
          :key="cat.value"
          :class="['category-btn', { active: activeCategory === cat.value }]"
          @click="handleCategoryChange(cat.value)"
        >
          {{ cat.label }}
        </el-button>
      </div> 
      <!-- 数据表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        class="drug-table"
        @row-click="handleRowClick"
      >
        <el-table-column label="药品名称" min-width="200">
          <template #default="{ row }">
            <div class="drug-info">
              <img :src="row.image" alt="药品图片" class="drug-image" />
              <div class="drug-detail">
                <div class="drug-name">{{ row.drugName }}</div>
                <div v-if="row.commonName" class="drug-type">（{{ row.commonName }}）</div>
                <div class="drug-id">ENC: {{ row.drugCode }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" min-width="80">
          <template #default="{ row }">
            <div class="category-tags-cell">
              <span :class="['tag', getCategoryClass(row.category)]">{{ row.category }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="厂家" min-width="180" prop="manufacturer" />
        <el-table-column label="批准文号" min-width="140" prop="approvalNumber" />
        <el-table-column label="规格" min-width="100" prop="specification" />
        <el-table-column label="剂型" min-width="80" prop="dosageForm" />
        <el-table-column label="收藏" width="80" fixed="right">
          <template #default="{ row }">
            <el-icon
              :class="['favorite-icon', { active: isFavorite(row.id) }]"
              @click.stop="toggleFavorite(row)"
            >
              <StarFilled v-if="isFavorite(row.id)" />
              <Star v-else />
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @update:current-page="handleCurrentChange"
        @update:page-size="handleSizeChange"
        style="justify-content: flex-end; margin-top: 20px"
      />
    </div>

    <infoCard
      v-model:visible="drawerVisible"
      :drug-data="currentDrug"
      @toggle-favorite="handleToggleFavorite"
    />
  </div>
</template>

<style scoped lang="scss">
.query-page {
  background-color: #f5f5f5;
  min-height: 100%;
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
        height: 50px;
      }
    }
  }
  .category-select {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 0;

    &:hover {
      color: #5ee7df;
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

// 分类标签
.category-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
  .category-btn {
    border-radius: 20px;
    border: none;
    background-color: #f5f5f5;
    color: #666;
    padding: 8px 20px;
    font-size: 14px;
    transition: all 0.3s;
    &:hover {
      background-color: #e8f4ff;
      color: #4facfe;
    }
    &.active {
      background: linear-gradient(135deg, #5ee7df 0%, #4facfe 100%);
      color: #fff;
    }
  }
}

// 表格容器
.table-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  .drug-table {
    :deep(.el-table__header) {
      th {
        background-color: #f8f9fa;
        color: #666;
        font-weight: 500;
        font-size: 14px;
      }
    }

    :deep(.el-table__body-wrapper) {
      .el-table__row {
        cursor: pointer;
        &:hover > td {
          background-color: #f0f9ff !important;
        }
      }
    }

    :deep(.el-table__row) {
      td {
        padding: 15px 0;
      }
    }
  }

  .drug-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .drug-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      object-fit: cover;
      border: 1px solid #eee;
    }

    .drug-detail {
      .drug-name {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 2px;
      }

      .drug-subname {
        font-size: 12px;
        color: #999;
        margin-bottom: 2px;
      }

      .drug-type {
        font-size: 14px;
        color: #999;
      }

      .drug-id {
        font-size: 11px;
        color: #bbb;
      }
    }
  }

  .category-tags-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      text-align: center;
      width: fit-content;

      &.green {
        background-color: #e8f5e9;
        color: #4caf50;
      }

      &.blue {
        background-color: #e3f2fd;
        color: #2196f3;
      }

      &.orange {
        background-color: #fff3e0;
        color: #ff9800;
      }

      &.purple {
        background-color: #f3e5f5;
        color: #9c27b0;
      }
    }
  }

  .favorite-icon {
    font-size: 30px;
    color: #ddd;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: #ffc107;
    }

    &.active {
      color: #ffc107;
    }
  }
}
</style>
