import request from '@/utils/request'

// 获取流程外置表单详情
export function getDetail(id) {
    return request({
        url: '/flow/form/' + id,
        method: 'get'
    })
}

// 添加流程外置表单
export function add(data) {
    return request({
        url: '/flow/form',
        method: 'post',
        data
    })
}

// 编辑流程外置表单
export function edit(id, data) {
    return request({
        url: '/flow/form/' + id,
        method: 'put',
        data
    })
}
