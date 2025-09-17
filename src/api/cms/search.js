import request from '@/utils/request'

// 查询网站搜索列表
export function listSearch(query) {
  return request({
    url: '/cms/search/list',
    method: 'get',
    params: query
  })
}

// 查询网站搜索关键字Top5
export function listTopKeywords(query) {
  return request({
    url: '/cms/search/listTopKeywords',
    method: 'get',
    params: query
  })
}

// 根据keyword查询网站文章
export function listArticleByKeywords(query) {
  return request({
    url: '/cms/search/search',
    method: 'get',
    params: query
  })
}

// 查询网站搜索详细
export function getSearch(searchId) {
  return request({
    url: '/cms/search/' + searchId,
    method: 'get'
  })
}

// 新增网站搜索
export function addSearch(data) {
  return request({
    url: '/cms/search',
    method: 'post',
    data: data
  })
}

// 修改网站搜索
export function updateSearch(data) {
  return request({
    url: '/cms/search',
    method: 'put',
    data: data
  })
}

// 删除网站搜索
export function delSearch(searchId) {
  return request({
    url: '/cms/search/' + searchId,
    method: 'delete'
  })
}
