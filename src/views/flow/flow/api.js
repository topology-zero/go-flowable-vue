import request from '@/utils/request'

export function detail(id) {
    return request({
        url: '/flow/process/' + id,
        method: 'get'
    })
}

export function add(data) {
    return request({
        url: '/flow/process',
        method: 'post',
        data
    })
}
