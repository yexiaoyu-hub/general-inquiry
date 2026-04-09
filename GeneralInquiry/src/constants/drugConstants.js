// 药品类别字典
export const DRUG_CATEGORY_OPTIONS = [
  // { label: '全部类别', value: '' },
  { label: '抗感染类', value: '抗感染类' },
  { label: '心血管系统类', value: '心血管系统类' },
  { label: '消化系统类', value: '消化系统类' },
  { label: '呼吸系统类', value: '呼吸系统类' },
  { label: '神经系统类', value: '神经系统类' },
  { label: '内分泌及代谢类', value: '内分泌及代谢类' },
  { label: '泌尿系统类', value: '泌尿系统类' },
  { label: '血液系统类', value: '血液系统类' },
  { label: '抗肿瘤类', value: '抗肿瘤类' },
  { label: '维生素/营养类', value: '维生素/营养类' },
  { label: '外用药', value: '外用药' },
  { label: '麻醉/精神类', value: '麻醉/精神类' }
]

// 药品类别值数组（用于多选场景）
export const DRUG_CATEGORY_VALUES = DRUG_CATEGORY_OPTIONS
  .filter(item => item.value !== '')
  .map(item => item.value)

// 药品类别标签映射
export const DRUG_CATEGORY_LABEL_MAP = DRUG_CATEGORY_OPTIONS.reduce((map, item) => {
  map[item.value] = item.label
  return map
}, {})

// 药品大类字典（西药/中成药/中草药/自制剂）
export const DRUG_TYPE_OPTIONS = [
  { label: '全部', value: '' },
  { label: '西药', value: '西药' },
  { label: '中成药', value: '中成药' },
  { label: '中草药', value: '中草药' },
  { label: '自制剂', value: '自制剂' }
]

// 药品大类值数组
export const DRUG_TYPE_VALUES = DRUG_TYPE_OPTIONS
  .filter(item => item.value !== '')
  .map(item => item.value)

// 药品大类标签映射
export const DRUG_TYPE_LABEL_MAP = DRUG_TYPE_OPTIONS.reduce((map, item) => {
  map[item.value] = item.label
  return map
}, {})
