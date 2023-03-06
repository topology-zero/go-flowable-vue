<template>
    <div class="panel-tab__content">

        <div class="element-property list-property">
            <el-table :data="chooseList"
                      size="mini"
                      max-height="240"
                      border
                      fit>
                <el-table-column label="key"
                                 prop="key"
                                 width="50px" />
                <el-table-column label="表单用途"
                                 prop="name"
                                 min-width="80px" />
                <el-table-column label="表单描述"
                                 prop="description"
                                 min-width="80px" />
                <el-table-column label="操作"
                                 width="90px">
                    <template slot-scope="{ row }">
                        <el-button size="mini"
                                   type="text"
                                   @click="viewForm(row)">预览</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="element-drawer__button">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="selectForm()">添加/切换表单</el-button>
        </div>
        <el-dialog
            title="添加/切换表单"
            :visible.sync="dialogVisible"
            width="60%">
            <el-table :data="formList"
                      size="mini"
                      max-height="240"
                      border
                      fit>
                <el-table-column label="key"
                                 prop="key"
                                 width="50px" />
                <el-table-column label="表单用途"
                                 prop="name"
                                 min-width="80px" />
                <el-table-column label="表单描述"
                                 prop="description"
                                 min-width="80px" />
                <el-table-column label="操作"
                                 width="90px">
                    <template slot-scope="{ row }">
                        <el-button size="mini"
                                   type="text"
                                   @click="viewForm(row)">预览</el-button>
                        <el-divider direction="vertical" />
                        <el-button size="mini"
                                   type="text"
                                   style="color: #ff4d4f"
                                   @click="chooseForm(row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog
            width="60%"
            title="表单预览"
            :visible.sync="innerVisible"
            append-to-body>
            <form-create :option="formOption" :rule="formRule" />
        </el-dialog>
    </div>
</template>

<script>
import { getFormList, getDetail } from './api'
export default {
    name: 'ElementFormExternal',
    props: {
        id: String,
        type: String
    },
    inject: {
        prefix: 'prefix',
        width: 'width'
    },
    data() {
        return {
            dialogVisible: false,
            innerVisible: false,
            formList: [],
            chooseList: [],
            formOption: {},
            formRule: []
        }
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                val && val.length && this.$nextTick(() => this.resetFormList())
            }
        }
    },
    methods: {
        // 预览表单
        async viewForm(row) {
            this.innerVisible = true
            const { data } = await getDetail(row.key)
            this.formOption = JSON.parse(data.option)
            this.formOption.submitBtn = false
            this.formRule = JSON.parse(data.rule)
        },
        // 选择表单
        selectForm() {
            this.dialogVisible = true
            this._getFormList()
        },
        // 选择表单
        chooseForm(row) {
            this.updateElementExtensions(row.key, row.id, row.name, row.description)
            this.dialogVisible = false
            this.chooseList = [row]
        },
        // 获取表单内容
        async _getFormList() {
            if (this.formList.length > 0) {
                return
            }
            const { data } = await getFormList()
            this.formList = data.list
        },
        // 重置
        resetFormList() {
            this.bpmnElement = window.bpmnInstances.bpmnElement

            const key = this.bpmnElement.businessObject.get('flowable:formKey')
            const id = this.bpmnElement.businessObject.get('flowable:formId')
            const name = this.bpmnElement.businessObject.get('flowable:formName')
            const desc = this.bpmnElement.businessObject.get('flowable:formDesc')
            if (key) {
                this.chooseList = [{ key, id, name, description: desc }]
            }
            this.updateElementExtensions(key, id, name, desc)
        },
        // 更新 XML 文件
        updateElementExtensions(key, id, name, desc) {
            let attrObj = {}
            if (key) {
                attrObj = {
                    'flowable:formKey': key,
                    'flowable:formId': id,
                    'flowable:formName': name,
                    'flowable:formDesc': desc
                }
            }
            window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj)
        }
    }
}
</script>
