import request from '@/utils/request'

// 查询站点管理列表
export function listSite(query) {
  return request({
    url: '/cms/site/list',
    method: 'get',
    params: query
  })
}

// 查询站点和栏目列表
export function listSiteAndCategory(query) {
  return request({
    url: '/cms/site/category',
    method: 'get',
    params: query
  })
}

// 查询站点管理详细
export function getSite(siteId) {
  return request({
    url: '/cms/site/' + siteId,
    method: 'get'
  })
}

// 新增站点管理
export function addSite(data) {
  return request({
    url: '/cms/site',
    method: 'post',
    data: data
  })
}

// 修改站点管理
export function updateSite(data) {
  return request({
    url: '/cms/site',
    method: 'put',
    data: data
  })
}

// 删除站点管理
export function delSite(siteId) {
  return request({
    url: '/cms/site/' + siteId,
    method: 'delete'
  })
}
