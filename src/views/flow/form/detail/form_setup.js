export default function formSetup() {
    return [
        {
            type: 'input',
            field: 'formKey',
            value: '',
            title: '表单key',
            effect: {
                required: true
            }
        },
        {
            type: 'input',
            field: 'formName',
            value: '',
            title: '表单名',
            effect: {
                required: true
            }
        },
        {
            type: 'input',
            field: 'formDesc',
            value: '',
            title: '表单描述',
            effect: {
                required: true
            }
        },
        {
            type: 'radio',
            field: 'labelPosition',
            value: 'left',
            title: '标签位置',
            options: [
                { value: 'right', label: '右对齐' },
                { value: 'left', label: '左对齐' },
                { value: 'top', label: '顶部' }
            ]
        }, {
            type: 'radio',
            field: 'size',
            value: 'medium',
            title: '表单尺寸',
            options: [
                { value: 'medium', label: '正常' },
                { value: 'small', label: '中等' },
                { value: 'mini', label: '小' }
            ]
        }, {
            type: 'input',
            field: 'labelWidth',
            value: '125px',
            title: '标签宽度'
        }
    ]
}
