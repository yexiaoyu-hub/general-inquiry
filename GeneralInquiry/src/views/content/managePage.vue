<script setup>
import { ref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import NewAddDrugs from './components/newadddrugs.vue'

// 表格数据
const tableData = ref([
  {
    drugName:'测试数据'
  }
])

// 新增药品弹窗
const newAddDrugsVisible = ref(false)
// 编辑数据
const editRowData = ref(null)



// 搜索关键字
const searchKeyword = ref('')
const total = ref(0)         //总条数数据
// 分页数据
const params = ref({
 pagenum:1,
 pagesize:5,
 cate_id:'',
 state:''
})
// 搜索
const handleSearch = () => {
  console.log('搜索:', searchKeyword.value)
}
// 重置
const handleReset = () => {
  searchKeyword.value = ''
}
// 新增药品
const handleAdd = () => {
  newAddDrugsVisible.value = true
}
//编辑药品
const handleEdit = (row) => {
  editRowData.value = { ...row }
  newAddDrugsVisible.value = true
}


</script>

<template>
  <div class="manage-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <el-icon class="search-icon"><Search /></el-icon>
        <el-input
          v-model="searchKeyword"
          placeholder="搜索关键字"
          class="search-input"
          clearable
        />
      </div>
      <el-button type="primary" class="search-btn" @click="handleSearch">搜索</el-button>
      <el-button class="reset-btn" @click="handleReset">重置</el-button>
      <el-button type="primary" class="add-btn" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
    </div>  
    <!-- 内容 -->
    <div class="content">
      <!-- 数据表格 -->  
      <div class="table-container">
        <el-table :data="tableData" style="width: 100%" class="collect-table">
          <el-table-column label="药品名称" min-width="120" prop="drugName" />
          <el-table-column label="厂家" min-width="180" prop="manufacturer" />
          <el-table-column label="批准文号" min-width="140" prop="approvalNumber" />
          <el-table-column label="药品编码" min-width="140" prop="specification" />
          <el-table-column label="创建时间" min-width="140" prop="collectTime" />
          <el-table-column label="更新时间" min-width="140" prop="updateTime" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <div class="operation-btns">
                <span class="view-btn" @click="handleEdit(row)">编辑</span>
                <span class="delete-btn" @click="handleDelete(row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
    <!-- 新增药品弹窗 -->
    <NewAddDrugs
      v-model:visible="newAddDrugsVisible"
      :edit-data="editRowData"
      @submit="handleSubmitAdd"
    />
  </div>
</template>

<style scoped lang="scss">
.manage-page {
  background-color: #f5f5f5;
  min-height: 100%;
  gap: 20px;
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
  .add-btn {
    border-radius: 10px;
    padding: 10px 25px;
    font-size: 16px;
    height: 40px;
    background-color: #18b4e3;
    border: none;
    margin-left: auto;
    margin-right: 20px;
    .el-icon {
      margin-right: 5px;
    }
  }
}
// 内容
.content {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
// 表格容器
.table-container {
  background-color: #fff;
  border-radius: 8px;
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
        color: #409EFF;
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

</style>