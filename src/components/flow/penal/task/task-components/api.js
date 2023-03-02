import request from '@/utils/request'

export function getAdmin(params) {
    return request({
        url: '/base/adminUsers',
        params
    })
}
