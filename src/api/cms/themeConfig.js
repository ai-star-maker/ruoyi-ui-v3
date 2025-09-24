import request from '@/utils/request'

// 查询主题配置列表
export function listThemeConfig(query) {
  return request({
    url: '/cms/themeConfig/list',
    method: 'get',
    params: query
  })
}

// 查询主题配置详细
export function getThemeConfig(configId) {
  return request({
    url: '/cms/themeConfig/' + configId,
    method: 'get'
  })
}

// 新增主题配置
export function addThemeConfig(data) {
  return request({
    url: '/cms/themeConfig',
    method: 'post',
    data: data
  })
}

// 修改主题配置
export function updateThemeConfig(data) {
  return request({
    url: '/cms/themeConfig',
    method: 'put',
    data: data
  })
}

// 删除主题配置
export function delThemeConfig(configId) {
  return request({
    url: '/cms/themeConfig/' + configId,
    method: 'delete'
  })
}
