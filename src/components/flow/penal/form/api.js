import request from '@/utils/request'

export function getFormList() {
    return request({
        url: '/base/flowform'
    })
}

export function getDetail(key, version) {
    return request({
        url: `/base/flowformveiw/${key}/${version}`
    })
}
