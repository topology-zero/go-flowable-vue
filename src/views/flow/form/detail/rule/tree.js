import uniqueId from '@form-create/utils/lib/unique'
import { makeOptionsRule, makeRequiredRule } from './util'

const label = '树形控件'
const name = 'tree'

export default {
    icon: 'icon-tree',
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
            props: {
                props: {
                    label: 'label'
                },
                showCheckbox: true,
                nodeKey: 'id',
                data: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }]
            }
        }
    },
    props() {
        return [
            makeRequiredRule(),
            makeOptionsRule('props.data', false),
            { type: 'input', field: 'emptyText', title: '内容为空的时候展示的文本' }, {
                type: 'Struct',
                field: 'props',
                title: '配置选项，具体看下表',
                props: { defaultValue: {}}
            }, { type: 'switch', field: 'renderAfterExpand', title: '是否在第一次展开某个树节点后才渲染其子节点', value: true }, {
                type: 'switch',
                field: 'defaultExpandAll',
                title: '是否默认展开所有节点'
            }, {
                type: 'switch',
                field: 'expandOnClickNode',
                title: '是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。',
                value: true
            }, {
                type: 'switch',
                field: 'checkOnClickNode',
                title: '是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。'
            }, { type: 'switch', field: 'autoExpandParent', title: '展开子节点的时候是否自动展开父节点', value: true }, {
                type: 'switch',
                field: 'checkStrictly',
                title: '在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false'
            }, { type: 'switch', field: 'accordion', title: '是否每次只打开一个同级树节点展开' }, {
                type: 'inputNumber',
                field: 'indent',
                title: '相邻级节点间的水平缩进，单位为像素'
            }, { type: 'input', field: 'iconClass', title: '自定义树节点的图标' }, {
                type: 'input',
                field: 'nodeKey',
                title: '每个树节点用来作为唯一标识的属性，整棵树应该是唯一的'
            }]
    }
}
