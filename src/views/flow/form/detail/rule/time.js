import uniqueId from '@form-create/utils/lib/unique'
import { makeRequiredRule } from './util'

const label = '时间选择器'
const name = 'timePicker'

export default {
    icon: 'icon-time',
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
            makeRequiredRule(),
            {
                type: 'switch',
                field: 'disabled',
                title: '禁用'
            }, {
                type: 'switch',
                field: 'isRange',
                title: '是否为时间范围选择'
            }]
    }
}
