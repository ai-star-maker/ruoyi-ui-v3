import request from '@/utils/request'

// 查询主题配置列表
export function listConfig(query) {
  return request({
    url: '/cms/config/list',
    method: 'get',
    params: query
  })
}

// 查询主题配置详细
export function getConfig(configId) {
  return request({
    url: '/cms/config/' + configId,
    method: 'get'
  })
}

// 新增主题配置
export function addConfig(data) {
  return request({
    url: '/cms/config',
    method: 'post',
    data: data
  })
}

// 修改主题配置
export function updateConfig(data) {
  return request({
    url: '/cms/config',
    method: 'put',
    data: data
  })
}

// 删除主题配置
export function delConfig(configId) {
  return request({
    url: '/cms/config/' + configId,
    method: 'delete'
  })
}
