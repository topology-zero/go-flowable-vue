import uniqueId from '@form-create/utils/lib/unique'
import { makeRequiredRule } from './util'

const label = '开关'
const name = 'switch'

export default {
    icon: 'icon-switch',
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
        return [makeRequiredRule(), { type: 'switch', field: 'disabled', title: '是否禁用' }, {
            type: 'inputNumber',
            field: 'width',
            title: '宽度（px）'
        }, { type: 'input', field: 'activeText', title: 'switch 打开时的文字描述' }, {
            type: 'input',
            field: 'inactiveText',
            title: 'switch 关闭时的文字描述'
        }, { type: 'input', field: 'activeValue', title: 'switch 打开时的值' }, {
            type: 'input',
            field: 'inactiveValue',
            title: 'switch 关闭时的值'
        }, { type: 'input', field: 'activeColor', title: 'switch 打开时的背景色' }, {
            type: 'input',
            field: 'inactiveColor',
            title: 'switch 关闭时的背景色'
        }]
    }
}
