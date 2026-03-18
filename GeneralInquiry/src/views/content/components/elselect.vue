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
        id: '1',
        cate_name: '西药'
    },
    {
        id: '2',
        cate_name: '中成药'
    },
    {
        id: '3',
        cate_name: '中草药'
    },
    {
        id: '4',
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
                    :style="{ width }"
                >
      <el-option v-for="Channel in Channellist" 
                :key="Channel.id" 
                :label="Channel.cate_name" 
                :value="Channel.id">
      </el-option>
    </el-select>
  
  </template>
  
