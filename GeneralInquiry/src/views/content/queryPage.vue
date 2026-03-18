<script setup>
import { ref } from 'vue'
import { Search, ArrowRight, Star, StarFilled } from '@element-plus/icons-vue'

// 搜索关键词
const searchKeyword = ref('')

// 分类标签
const categories = [
  { label: '全部', value: 'all' },
  { label: '西药', value: 'xiyao' },
  { label: '中成药', value: 'zhongchengyao' },
  { label: '中草药', value: 'zhongcaoyao' },
  { label: '自制剂', value: 'zizhiji' }
]

// 当前选中的分类
const activeCategory = ref('all')

// 表格数据
const tableData = ref([
  {
    id: '86904340000721',
    name: '小柴胡颗粒',
    subName: '（小柴胡）',
    manufacturer: '广西恒拓集团仁盛制药有限公司',
    approvalNumber: '国药准字H20013082',
    specification: '10g * 10袋',
    dosageForm: '颗粒剂',
    category: '中成药',
    image: 'https://via.placeholder.com/60x60/f5f5f5/999?text=药品'
  },
  {
    id: '86904340000722',
    name: '阿莫西林胶囊',
    subName: '',
    manufacturer: '华北制药股份有限公司',
    approvalNumber: '国药准字H13020766',
    specification: '0.25g * 24粒',
    dosageForm: '胶囊剂',
    category: '西药',
    image: 'https://via.placeholder.com/60x60/f5f5f5/999?text=药品'
  },
  {
    id: '86904340000723',
    name: '板蓝根颗粒',
    subName: '',
    manufacturer: '广州白云山制药厂',
    approvalNumber: '国药准字Z44023485',
    specification: '10g * 20袋',
    dosageForm: '颗粒剂',
    category: '中成药',
    image: 'https://via.placeholder.com/60x60/f5f5f5/999?text=药品'
  }
])

// 收藏列表
const favorites = ref([])

// 切换分类
const handleCategoryChange = (value) => {
  activeCategory.value = value
}

// 搜索
const handleSearch = () => {
  console.log('搜索:', searchKeyword.value)
}

// 重置
const handleReset = () => {
  searchKeyword.value = ''
  activeCategory.value = 'all'
}

// 切换收藏
const toggleFavorite = (row) => {
  const index = favorites.value.indexOf(row.id)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(row.id)
  }
}

// 判断是否已收藏
const isFavorite = (id) => {
  return favorites.value.includes(id)
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
        />
      </div>
      <el-form-item style="width: 240px;
                margin-right: 20px;
                margin-left: 20px"
                label="文章分类：">
        <Articlecategories v-model="params.cate_id"></Articlecategories>                    
       </el-form-item> 
      <div class="category-select">
        <span>选择类别</span>
        <el-icon><ArrowRight /></el-icon>
      </div>
      <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
      <el-button class="reset-btn" @click="handleReset">重置</el-button>
    </div>

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
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%" class="drug-table">
        <el-table-column label="药品名称" min-width="200">
          <template #default="{ row }">
            <div class="drug-info">
              <img :src="row.image" alt="药品图片" class="drug-image" />
              <div class="drug-detail">
                <div class="drug-name">{{ row.name }}</div>
                <div v-if="row.subName" class="drug-subname">{{ row.subName }}</div>
                <div class="drug-id">ID: {{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="厂家" min-width="180" prop="manufacturer" />
        <el-table-column label="批准文号" min-width="140" prop="approvalNumber" />
        <el-table-column label="规格" min-width="100" prop="specification" />
        <el-table-column label="剂型" min-width="80" prop="dosageForm" />
        <el-table-column label="分类" min-width="100">
          <template #default="{ row }">
            <div class="category-tags-cell">
              <span class="tag green">{{ row.category }}</span>
              <span class="tag blue">西药医保</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="{ row }">
            <el-icon
              :class="['favorite-icon', { active: isFavorite(row.id) }]"
              @click="toggleFavorite(row)"
            >
              <StarFilled v-if="isFavorite(row.id)" />
              <Star v-else />
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
//   gap: 20px;
  margin-bottom: 20px;
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

  .category-select {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: #666;
    font-size: 14px;

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

    &:hover {
      opacity: 0.9;
    }
  }

  .reset-btn {
    border-radius: 20px;
    padding: 10px 25px;
    font-size: 14px;
  }
}

// 分类标签
.category-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 15px 20px;
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
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 2px;
      }

      .drug-subname {
        font-size: 12px;
        color: #999;
        margin-bottom: 2px;
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
    }
  }

  .favorite-icon {
    font-size: 20px;
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
