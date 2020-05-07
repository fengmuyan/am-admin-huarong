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
export function handelUploadFlow(data = {}) {
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

//套餐组列表
export function getCardGroupList(data = {}) {
  return request({
    url: '/fulcrum/flowMealGroup/list',
    method: 'post',
    data
  })
}

//接口套餐组保存初始化
export function getFlowCardList(data = {}) {
  return request({
    url: '/fulcrum/flowMealGroup/saveFlowMealGroupInit',
    method: 'post',
    data
  })
}

//新增套餐组
export function handelAddCardGroup(data = {}) {
  return request({
    url: '/fulcrum/flowMealGroup/saveFlowMealGroup',
    method: 'post',
    data
  })
}

//删除套餐组
export function handelDelCardGroup(data = {}) {
  return request({
    url: '/fulcrum/flowMealGroup/delFlowMealGroup',
    method: 'post',
    data
  })
}

//套餐组明细
export function getCardGroupDetail(data = {}) {
  return request({
    url: '/fulcrum/flowMealGroup/detailsList',
    method: 'post',
    data
  })
}

//套餐组
export function getCardGroupAllList(data = {}) {
  return request({
    url: '/fulcrum/flowMealGroup/allList',
    method: 'post',
    data
  })
}

//获取执行进度
export function getCardOperateLine(data = {}) {
  return request({
    url: '/fulcrum/flowMeal/exeRate',
    method: 'post',
    data
  })
}

//文件校验
export function fileUploadCheck(data = {}) {
  return request({
    url: '/fulcrum/uplaodFile/checkChunk',
    method: 'post',
    data
  })
}

//文件合并
export function fileUploadMerge(data = {}) {
  return request({
    url: '/fulcrum/uplaodFile/mergeChunks',
    method: 'post',
    data
  })
}








