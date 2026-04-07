// 分类选择组件
<script setup>
import { ref } from 'vue'

defineProps({
  modelValue:{
    type: [ Number,String]
  },
    width: {
    type: String
  }  
})
const emit = defineEmits(['update:modelValue'])
const Channellist = ref([
    {
        id: 'all',
        cate_name: '全部'
    },
    {
        id: 'xiyao',
        cate_name: '西药'
    },
    {
        id: 'zhongchengyao',
        cate_name: '中成药'
    },
    {
        id: 'zhongcaoyao',
        cate_name: '中草药'
    },
    {
        id: 'zizhiji',
        cate_name: '自制剂'
    }
])
// const Getlist = async () =>{
// const res = await artGetmanageService()
// Channellist.value = res.data.data
// }
// Getlist()



</script>
  
  
  
  <template>
    <el-select placeholder="请选择分类" 
                    :modelValue="modelValue"
                    @update:modelValue="emit('update:modelValue', $event)"
                    :style="{ width: width || '100%' }"
                >
      <el-option v-for="Channel in Channellist" 
                :key="Channel.id" 
                :label="Channel.cate_name" 
                :value="Channel.id">
      </el-option>
    </el-select>
  
  </template>
  
