// 创建监听器实例
export function createListenerObject(options, isTask, prefix) {
    const listenerObj = Object.create(null)
    listenerObj.event = options.event
    listenerObj.class = 'com.example.HttpExec'
    listenerObj.listenerType = 'classListener'
    // 注入字段
    listenerObj.fields = [
        window.bpmnInstances.moddle.create(`${prefix}:Field`, { name: 'method', string: options.fields.method }),
        window.bpmnInstances.moddle.create(`${prefix}:Field`, { name: 'url', string: options.fields.url }),
        window.bpmnInstances.moddle.create(`${prefix}:Field`, { name: 'header', string: options.fields.header.length > 0 ? JSON.stringify(options.fields.header) : '' }),
        window.bpmnInstances.moddle.create(`${prefix}:Field`, { name: 'query', string: options.fields.query.length > 0 ? JSON.stringify(options.fields.query) : '' }),
        window.bpmnInstances.moddle.create(`${prefix}:Field`, { name: 'body', string: options.fields.body.length > 0 ? JSON.stringify(options.fields.body) : '' }),
        window.bpmnInstances.moddle.create(`${prefix}:Field`, { name: 'json', string: options.fields.json })
    ]
    return window.bpmnInstances.moddle.create(`${prefix}:${isTask ? 'TaskListener' : 'ExecutionListener'}`, listenerObj)
}

// 创建 监听器的注入字段 实例
export function createFieldObject(option, prefix) {
    const { name, fieldType, string, expression } = option
    const fieldConfig = fieldType === 'string' ? { name, string } : { name, expression }
    return window.bpmnInstances.moddle.create(`${prefix}:Field`, fieldConfig)
}

// 创建脚本实例
export function createScriptObject(options, prefix) {
    const { scriptType, scriptFormat, value, resource } = options
    const scriptConfig = scriptType === 'inlineScript' ? { scriptFormat, value } : { scriptFormat, resource }
    return window.bpmnInstances.moddle.create(`${prefix}:Script`, scriptConfig)
}

// 更新元素扩展属性
export function updateElementExtensions(element, extensionList) {
    const extensions = window.bpmnInstances.moddle.create('bpmn:ExtensionElements', {
        values: extensionList
    })
    window.bpmnInstances.modeling.updateProperties(element, {
        extensionElements: extensions
    })
}

// 创建一个id
export function uuid(length = 8, chars) {
    let result = ''
    const charsString = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = length; i > 0; --i) {
        result += charsString[Math.floor(Math.random() * charsString.length)]
    }
    return result
}
