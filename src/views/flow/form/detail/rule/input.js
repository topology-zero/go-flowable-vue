import uniqueId from '@form-create/utils/lib/unique'

const label = '输入框'
const name = 'input'

export default {
    icon: 'icon-input',
    label,
    name,
    rule() {
        return {
            type: name,
            field: uniqueId(),
            title: label,
            info: '',
            props: {}
        }
    },
    props() {
        return [
            {
                type: 'Required',
                field: 'formCreate$required',
                title: '是否必填'
            },
            {
                type: 'input',
                field: 'placeholder',
                title: '输入框占位文本'
            },
            {
                type: 'select',
                field: 'type',
                title: '类型',
                options: [{
                    label: 'text',
                    value: 'text'
                }, {
                    label: 'textarea',
                    value: 'textarea'
                }, {
                    label: 'number',
                    value: 'number'
                }, {
                    label: 'password',
                    value: 'password'
                }]
            },
            {
                type: 'inputNumber',
                field: 'maxlength',
                title: '最大输入长度'
            },
            {
                type: 'inputNumber',
                field: 'minlength',
                title: '最小输入长度'
            },
            {
                type: 'switch',
                field: 'disabled',
                title: '禁用'
            },
            {
                type: 'inputNumber',
                field: 'rows',
                info: '只对 type="textarea" 有效',
                title: '输入框行数'
            }
        ]
    }
}
