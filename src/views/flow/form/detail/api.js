import request from '@/utils/request'

// 获取流程外置表单详情
export function getDetail(key) {
    return request({
        url: `/flow/form/${key}`,
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
