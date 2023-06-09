import { request, realRequest } from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function register(info) {
  return realRequest({
    url: '/user/register',
    method: 'post',
    data: info
  })
}

export function registerEmail(email) {
  return realRequest({
    url: '/user/code',
    method: 'post',
    params: { email }
  })
}
