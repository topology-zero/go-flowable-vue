import uniqueId from '@form-create/utils/lib/unique'
import { makeOptionsRule, makeRequiredRule } from './util'

const label = '多选框'
const name = 'checkbox'

export default {
    icon: 'icon-checkbox',
    label,
    name,
    rule() {
        return {
            type: name,
            field: uniqueId(),
            title: label,
            info: '',
            effect: {
                fetch: ''
            },
            props: {},
            options: [
                { value: '1', label: '选项1' },
                { value: '2', label: '选项2' }
            ]
        }
    },
    props() {
        return [
            makeRequiredRule(),
            makeOptionsRule('options'),
            {
                type: 'switch',
                field: 'type',
                title: '按钮类型',
                props: {
                    activeValue: 'button',
                    inactiveValue: 'default'
                }
            }, {
                type: 'switch',
                field: 'disabled',
                title: '是否禁用'
            }, {
                type: 'inputNumber',
                field: 'min',
                title: '可被勾选的 checkbox 的最小数量'
            }, {
                type: 'inputNumber',
                field: 'max',
                title: '可被勾选的 checkbox 的最大数量'
            }
        ]
    }
}
