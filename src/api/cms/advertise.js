import request from '@/utils/request'

// 查询广告管理列表
export function listAdvertise(query) {
  return request({
    url: '/cms/advertise/list',
    method: 'get',
    params: query
  })
}

// 查询广告管理详细
export function getAdvertise(advertiseId) {
  return request({
    url: '/cms/advertise/' + advertiseId,
    method: 'get'
  })
}

// 新增广告管理
export function addAdvertise(data) {
  return request({
    url: '/cms/advertise',
    method: 'post',
    data: data
  })
}

// 修改广告管理
export function updateAdvertise(data) {
  return request({
    url: '/cms/advertise',
    method: 'put',
    data: data
  })
}

// 删除广告管理
export function delAdvertise(advertiseId) {
  return request({
    url: '/cms/advertise/' + advertiseId,
    method: 'delete'
  })
}
