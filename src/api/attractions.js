import { request } from '@/utils/request'

export function fetchList(info) {
  const { page, size } = info
  return request({
    url: '/vue-element-admin/attractions/list',
    method: 'get',
    params: { page, size }
  })
}

export function fetchTotal(filter) {
  // TODO：添加过滤参数后进行请求
  return request({
    url: '/vue-element-admin/attractions/count',
    method: 'get'
  })
}