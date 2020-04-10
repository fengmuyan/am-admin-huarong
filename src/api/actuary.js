import request from '@/utils/request'


export function examin(data = {}) {
  return request({
    url: '/fulcrum/lingo/exeLingoTest',
    method: 'post',
    data
  })
}

export function examin2(data = {}) {
  return request({
    url: '/fulcrum/lingo/exeOperatePlan',
    method: 'post',
    data
  })
}

//运营模型
export function getOperationInfos(data = {}) {
  return request({
    url: '/fulcrum/lingo/operationInfos',
    method: 'post',
    data
  })
}



