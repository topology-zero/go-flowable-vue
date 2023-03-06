<template>
    <div class="app-container joy-form-build">
        <p class="page-title"><template v-if="!$route.query.id">添加</template><template v-else>编辑</template>表单</p>
        <div class="form-build-designer">
            <fc-designer ref="designer" />
        </div>
    </div>
</template>

<script>
import formSetup from './form_setup'
import fieldBaseSetup from './field_base_setup'
import fieldValidateSetup from './filed_validate_setup'
import { add, getDetail } from './api'
import uniqueId from '@form-create/utils/lib/unique'

import rules from './rule'

export default {
    name: 'FlowForm',
    mounted() {
        this.$refs.designer.removeMenuItem('colorPicker')
        this.$refs.designer.removeMenuItem('switch')
        this.$refs.designer.removeMenuItem('slider')
        this.$refs.designer.removeMenuItem('rate')
        this.$refs.designer.removeMenuItem('upload')
        this.$refs.designer.removeMenuItem('tree')
        this.$refs.designer.removeMenuItem('cascader')
        this.$refs.designer.removeMenuItem('fc-editor')
        this.$refs.designer.removeMenuItem('el-transfer')

        this.$refs.designer.form.rule = formSetup()
        if (this.$route.query.id) {
            this.$refs.designer.form.rule[0].props = {
                disabled: true
            }
        } else {
            this.$refs.designer.form.rule[0].value = uniqueId()
        }
        this.$refs.designer.form.option.submitBtn = {
            innerText: '保存',
            size: 'small'
        }
        this.$refs.designer.form.option.onSubmit = (f) => {
            this.save(f)
        }

        this.$refs.designer.form.option.resetBtn = {
            show: true,
            innerText: '返回',
            type: 'warning',
            icon: '',
            size: 'small',
            click: () => {
                this.$router.back()
            }
        }

        this.$refs.designer.baseForm.rule = fieldBaseSetup()
        this.$refs.designer.validateForm.rule = fieldValidateSetup()

        this.$refs.designer.addComponent(rules.input)
        this.$refs.designer.addComponent(rules.inputNumber)
        this.$refs.designer.addComponent(rules.radio)
        this.$refs.designer.addComponent(rules.checkbox)
        this.$refs.designer.addComponent(rules.select)
        this.$refs.designer.addComponent(rules.timePicker)
        this.$refs.designer.addComponent(rules.datePicker)
        this.$refs.designer.addComponent(rules['el-button'])

        this._getData()
    },
    methods: {
        async _getData() {
            if (!this.$route.query.id) {
                return
            }
            const { data } = await getDetail(this.$route.query.id)
            this.$refs.designer.setRule(JSON.parse(data.rule))
            this.$refs.designer.setOption(JSON.parse(data.option))
        },
        async save(f) {
            if (this.$refs.designer.getRule().length == 0) {
                this.$message.error('请添加表单组件')
                return
            }
            const data = {
                key: f.formKey,
                name: f.formName,
                desc: f.formDesc,
                rule: JSON.stringify(this.$refs.designer.getRule()),
                option: JSON.stringify(this.$refs.designer.getOption())
            }
            await add(data)
            this.$message.success('成功')
            this.$router.back()
        }
    }
}
</script>

<style lang="scss" scoped>
.joy-form-build {
    height: calc(100vh - 84px);
    .form-build-designer {
        height: calc(100% - 104px);
    }
}
</style>

