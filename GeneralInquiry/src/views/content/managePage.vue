// 药品管理页面
<script setup>
import { ref, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import NewAddDrugs from './components/newadddrugs.vue'
import { drugPageService, drugDeleteService } from '@/api/drug.js'
import dayjs from 'dayjs'

// 表格数据
const tableData = ref([])
const total = ref(0)

// 分页数据
const params = ref({
  pagenum: 1,
  pagesize: 10,
  cate_id: '',
  state: ''
})

// 搜索关键字
const searchKeyword = ref('')

// 新增药品弹窗
const newAddDrugsVisible = ref(false)
// 编辑数据
const editRowData = ref(null)

// 获取药品列表数据（分页）
const getDrugList = async () => {
  const res = await drugPageService({
    pageNum: params.value.pagenum,
    pageSize: params.value.pagesize,
    keyword: searchKeyword.value
  })
  tableData.value = res.data?.list || res.data?.data || []
  total.value = res.data?.total || res.data?.totalCount || 0
}

// 页面加载时获取数据
onMounted(() => {
  getDrugList()
})

// 分页大小变化
const handleSizeChange = (val) => {
  params.value.pagesize = val
  params.value.pagenum = 1
  getDrugList()
}

// 页码变化
const handleCurrentChange = (val) => {
  params.value.pagenum = val
  getDrugList()
}

// 搜索
const handleSearch = () => {
  params.value.pagenum = 1
  getDrugList()
}

// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
  params.value.pagenum = 1
  getDrugList()
}

// 新增药品
const handleAdd = () => {
  editRowData.value = null
  newAddDrugsVisible.value = true
}

// 编辑药品
const handleEdit = (row) => {
  editRowData.value = { ...row }
  newAddDrugsVisible.value = true
}

// 删除药品
const handleDelete = async (row) => {
  const confirm = await ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  if (!confirm) return

  const res = await drugDeleteService(row.id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getDrugList()
  } else {
    ElMessage.error(res.msg || '删除失败')
  }
}

// 新增/编辑成功后刷新列表
const handleSubmitAdd = () => {
  getDrugList()
  editRowData.value = null
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
          @keyup.enter="handleSearch"
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
          <el-table-column label="通用名" min-width="180" prop="commonName" />
          <el-table-column label="分类" min-width="140" prop="category" />
          <el-table-column label="适用症" min-width="140" prop="indications" />
          <el-table-column label="创建时间" min-width="140">
            <template #default="{ row }">
              {{ row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
            </template>
          </el-table-column>
          <el-table-column label="更新时间" min-width="140">
            <template #default="{ row }">
              {{ row.updateTime ? dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '' }}
            </template>
          </el-table-column>
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
        :current-page="params.pagenum"
        :page-size="params.pagesize"
        :page-sizes="[10, 20, 50, 100]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @update:current-page="handleCurrentChange"
        @update:page-size="handleSizeChange"
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
}
// 操作按钮
.operation-btns {
  display: flex;
  gap: 15px;
  .view-btn {
    color: #4facfe;
    cursor: pointer;
    &:hover {
      color: #5ee7df;
    }
  }
  .delete-btn {
    color: #ff6b6b;
    cursor: pointer;
    &:hover {
      color: #ff4757;
    }
  }
}
</style>
