<template>
    <div class="panel-tab__content">

        <div class="element-property list-property">
            <el-table :data="chooseList"
                      size="mini"
                      max-height="240"
                      border
                      fit>
                <el-table-column label="key"
                                 type="key"
                                 width="50px" />
                <el-table-column label="表单用途"
                                 prop="name"
                                 min-width="80px" />
                <el-table-column label="表单描述"
                                 prop="type"
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
                       @click="dialogVisible=true">添加/切换表单</el-button>
        </div>
        <el-dialog
            title="添加/切换表单"
            :visible.sync="dialogVisible"
            width="30%">
            <el-dialog
                width="30%"
                title="内层 Dialog"
                :visible.sync="innerVisible"
                append-to-body />
            <el-table :data="formList"
                      size="mini"
                      max-height="240"
                      border
                      fit>
                <el-table-column label="key"
                                 type="key"
                                 width="50px" />
                <el-table-column label="表单用途"
                                 prop="name"
                                 min-width="80px" />
                <el-table-column label="表单描述"
                                 prop="type"
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
    </div>
</template>

<script>
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
            chooseList: []
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
        viewForm(row) {},
        selectForm() {

        },
        chooseForm(row) {},
        resetFormList() {
            // 获取元素扩展属性 或者 创建扩展属性
            this.bpmnElement = window.bpmnInstances.bpmnElement
            this.elExtensionElements =
                this.bpmnElement.businessObject.get('extensionElements') || window.bpmnInstances.moddle.create('bpmn:ExtensionElements', { values: [] })
            // 获取元素表单配置 或者 创建新的表单配置
            this.formData = []
            this.otherExtensions = []
            if (this.elExtensionElements.values) {
                this.elExtensionElements.values.forEach(e => {
                    if (e.$type === `${this.prefix}:FormProperty`) {
                        this.formData.push(e)
                    } else {
                        this.otherExtensions.push(e)
                    }
                })
            }

            // 复制原始值，填充表格
            this.fieldList = JSON.parse(JSON.stringify(this.formData || []))

            // 更新元素扩展属性，避免后续报错
            this.updateElementExtensions()
        },

        updateElementExtensions() {
            // 更新回扩展元素
            const newElExtensionElements = window.bpmnInstances.moddle.create(`bpmn:ExtensionElements`, {
                values: this.otherExtensions.concat(this.formData)
            })
            // 更新到元素上
            window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
                extensionElements: newElExtensionElements
            })
        }
    }
}
</script>
