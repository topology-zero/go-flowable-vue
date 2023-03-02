import uniqueId from '@form-create/utils/lib/unique'
import { makeOptionsRule, makeRequiredRule } from './util'

const label = '单选框'
const name = 'radio'

export default {
    icon: 'icon-radio',
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
                field: 'disabled',
                title: '是否禁用'
            }, {
                type: 'switch',
                field: 'type',
                title: '按钮形式',
                props: {
                    activeValue: 'button',
                    inactiveValue: 'default'
                }
            }
        ]
    }
}
