import request from '@/utils/request'


export function getSetMealList(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/list',
    method: 'post',
    data
  })
}

export function handelEditSetMeal(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/saveflowMeal',
    method: 'post',
    data
  })
}

export function handelDelSetMeal(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/delflowMeal',
    method: 'post',
    data
  })
}

export function getSetMealListAll(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/allList',
    method: 'post',
    data
  })
}

export function handelOperateModel(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/exeFlowCardModel',
    method: 'post',
    data
  })
}

//上传文件列表
export function getFileFlowList(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/flowCard',
    method: 'post',
    data
  })
}

// 导入数据接口
export function handelUploadFlow(formData) {
  const data = { formData, $_isFormData: true }
  return request({
    url: '/fulcrum/flowMeal/importFlowCardExcel',
    method: 'post',
    data
  })
}

//流量卡删除
export function handelDelFileFlow(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/delFlowCard',
    method: 'post',
    data
  })
}

//查看执行结果
export function getFileFlowResult(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/exeResult',
    method: 'post',
    data
  })
}

//下载流量卡执行结果
export function handelDownloadResult(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/exportFlowCardResult',
    method: 'post',
    data
  })
}










