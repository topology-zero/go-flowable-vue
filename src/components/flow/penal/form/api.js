import request from '@/utils/request'

export function getFormList() {
    return request({
        url: '/base/flowform'
    })
}

export function getDetail(id) {
    return request({
        url: `/base/flowformveiw/${id}`
    })
}
