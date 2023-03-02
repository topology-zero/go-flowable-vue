const label = '标签页'
const name = 'tab-pane'

export default {
    label,
    name,
    inside: true,
    drag: true,
    dragBtn: false,
    mask: false,
    rule() {
        return {
            type: 'el-tab-pane',
            props: { label: '新标签页' },
            children: []
        }
    },
    props() {
        return [{ type: 'input', field: 'label', title: '选项卡标题' }, {
            type: 'switch',
            field: 'disabled',
            title: '是否禁用'
        }, { type: 'input', field: 'name', title: '与选项卡绑定值 value 对应的标识符，表示选项卡别名' }, {
            type: 'switch',
            field: 'lazy',
            title: '标签是否延迟渲染'
        }]
    }
}
