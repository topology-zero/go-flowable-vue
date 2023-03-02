import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/flow/cate',
        params
    })
}

export function add(data) {
    return request({
        url: '/flow/cate',
        method: 'post',
        data
    })
}

export function edit(id, data) {
    return request({
        url: '/flow/cate/' + id,
        method: 'put',
        data
    })
}

export function del(id) {
    return request({
        url: '/flow/cate/' + id,
        method: 'delete'
    })
}
