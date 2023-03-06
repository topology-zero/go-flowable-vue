export default {
    icon: 'icon-button',
    label: '驳回',
    name: 'reject',
    mask: false,
    rule() {
        return {
            type: 'el-button',
            children: ['驳回'],
            on: {
                click: 'this.formCreateAccpet'
            },
            props: {
                type: 'danger'
            }
        }
    },
    props() {
        return [
            {
                type: 'select',
                field: 'size',
                title: '尺寸',
                options: [{
                    label: 'medium',
                    value: 'medium'
                }, {
                    label: 'small',
                    value: 'small'
                }, {
                    label: 'mini',
                    value: 'mini'
                }]
            }
        ]
    }
}
