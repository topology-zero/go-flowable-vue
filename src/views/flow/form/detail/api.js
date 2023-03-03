import request from '@/utils/request'

// 获取流程外置表单详情
export function getDetail(key, version) {
    return request({
        url: `/flow/form/${key}/${version}`,
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
export function edit(key, version, data) {
    return request({
        url: `/flow/form/${key}/${version}`,
        method: 'put',
        data
    })
}
