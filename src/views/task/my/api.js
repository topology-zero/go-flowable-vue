import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/flow/task_assignee',
        params
    })
}

export function detail(id) {
    return request({
        url: '/flow/task/' + id
    })
}

export function complete(id) {
    return request({
        url: '/flow/task_complete/' + id,
        method: 'put'
    })
}

export function completeWithForm(id, data) {
    return request({
        url: '/flow/task_complete_with_form/' + id,
        method: 'put',
        data
    })
}

export function getAdminUser() {
    return request({
        url: '/base/adminUsers'
    })
}

export function delegate(id, data) {
    return request({
        url: '/flow/task_delegate/' + id,
        method: 'put',
        data
    })
}

export function addAttachment(id, data) {
    return request({
        url: '/flow/attachment/' + id,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}

export function delAttachment(taskId, fileId) {
    return request({
        url: '/flow/attachment/' + taskId + '/' + fileId,
        method: 'delete'
    })
}

export function addComment(taskId, data) {
    return request({
        url: '/flow/comment/' + taskId,
        method: 'post',
        data
    })
}

export function delComment(taskId, commentId) {
    return request({
        url: '/flow/comment/' + taskId + '/' + commentId,
        method: 'delete'
    })
}
