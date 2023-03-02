import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/flow/process',
        params
    })
}

export function del(id) {
    return request({
        url: '/flow/process/' + id,
        method: 'delete'
    })
}

export function start(id) {
    return request({
        url: '/flow/process/start/' + id,
        method: 'post'
    })
}
