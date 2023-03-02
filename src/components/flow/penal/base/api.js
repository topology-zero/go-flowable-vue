import request from '@/utils/request'

export function getAllCate() {
    return request({
        url: '/base/flowcate'
    })
}
