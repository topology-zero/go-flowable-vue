import uniqueId from '@form-create/utils/lib/unique'
import { makeOptionsRule, makeRequiredRule } from './util'

const label = '选择器'
const name = 'select'

export default {
    icon: 'icon-select',
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
                field: 'multiple',
                title: '是否多选'
            }, {
                type: 'switch',
                field: 'disabled',
                title: '是否禁用'
            }
        ]
    }
}
