export default {
    icon: 'icon-button',
    label: '同意',
    name: 'accpet',
    mask: false,
    rule() {
        return {
            type: 'el-button',
            children: ['同意'],
            on: {
                click: 'this.formCreateAccpet'
            },
            props: {
                type: 'primary'
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
