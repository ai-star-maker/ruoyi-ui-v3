import request from '@/utils/request'

// 查询文章统计列表
export function listCount(query) {
  return request({
    url: '/cms/count/list',
    method: 'get',
    params: query
  })
}

// 查询文章统计详细
export function getCount(countId) {
  return request({
    url: '/cms/count/' + countId,
    method: 'get'
  })
}

// 新增文章统计
export function addCount(data) {
  return request({
    url: '/cms/count',
    method: 'post',
    data: data
  })
}

// 修改文章统计
export function updateCount(data) {
  return request({
    url: '/cms/count',
    method: 'put',
    data: data
  })
}

// 删除文章统计
export function delCount(countId) {
  return request({
    url: '/cms/count/' + countId,
    method: 'delete'
  })
}
