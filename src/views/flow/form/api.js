import request from '@/utils/request'

// 获取流程外置表单列表
export function getList(params) {
    return request({
        url: '/flow/form',
        params
    })
}

// 删除流程外置表单
export function del(id) {
    return request({
        url: '/flow/form/' + id,
        method: 'delete'
    })
}
