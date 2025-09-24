import request from '@/utils/request'

// 查询网站主题列表
export function listTheme(query) {
  return request({
    url: '/cms/theme/list',
    method: 'get',
    params: query
  })
}

// 查询网站主题列表和配置参数
export function listThemeAndConfig(query) {
  return request({
    url: '/cms/theme/config',
    method: 'get',
    params: query
  })
}

// 查询网站主题详细
export function getTheme(themeId) {
  return request({
    url: '/cms/theme/' + themeId,
    method: 'get'
  })
}

// 新增网站主题
export function addTheme(data) {
  return request({
    url: '/cms/theme',
    method: 'post',
    data: data
  })
}

// 修改网站主题
export function updateTheme(data) {
  return request({
    url: '/cms/theme',
    method: 'put',
    data: data
  })
}

// 删除网站主题
export function delTheme(themeId) {
  return request({
    url: '/cms/theme/' + themeId,
    method: 'delete'
  })
}
