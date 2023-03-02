<template>
    <div class="panel-tab__content">
        <div class="element-property list-property">
            <el-table :data="fieldList"
                      size="mini"
                      max-height="240"
                      border
                      fit>
                <el-table-column label="序号"
                                 type="index"
                                 width="50px" />
                <el-table-column label="字段名称"
                                 prop="name"
                                 min-width="80px"
                                 show-overflow-tooltip />
                <el-table-column label="字段类型"
                                 prop="type"
                                 min-width="80px"
                                 :formatter="row => fieldType[row.type] || row.type"
                                 show-overflow-tooltip />
                <el-table-column label="默认值"
                                 prop="default"
                                 min-width="80px"
                                 show-overflow-tooltip />
                <el-table-column label="操作"
                                 width="90px">
                    <template slot-scope="{ row, $index }">
                        <el-button size="mini"
                                   type="text"
                                   @click="openFieldForm(row, $index)">编辑</el-button>
                        <el-divider direction="vertical" />
                        <el-button size="mini"
                                   type="text"
                                   style="color: #ff4d4f"
                                   @click="removeField($index)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="element-drawer__button">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-plus"
                       @click="openFieldForm(null, -1)">添加字段</el-button>
        </div>

        <!--字段配置侧边栏-->
        <el-drawer :visible.sync="fieldModelVisible"
                   title="字段配置"
                   :size="`${width}px`"
                   append-to-body
                   destroy-on-close>
            <el-form :model="formFieldForm"
                     label-width="90px"
                     size="mini"
                     @submit.native.prevent>
                <el-form-item label="显示名称">
                    <el-input v-model="formFieldForm.name"
                              clearable />
                </el-form-item>
                <!-- <el-form-item label="ID">
                    <el-input v-model="formFieldForm.id"
                              clearable />
                </el-form-item> -->
                <el-form-item label="类型">
                    <el-select v-model="formFieldForm.type"
                               placeholder="请选择字段类型"
                               clearable>
                        <el-option v-for="(value, key) of fieldType"
                                   :key="key"
                                   :label="value"
                                   :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否必填">
                    <el-radio-group v-model="formFieldForm.required">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="默认值">
                    <el-input v-model="formFieldForm.default"
                              clearable />
                </el-form-item>
            </el-form>

            <!-- 单选/多选值设置 -->
            <template v-if="['select', 'checkbox', 'radio',].indexOf(formFieldForm.type) != -1">
                <el-divider key="enum-divider" />
                <p key="enum-title"
                   class="listener-filed__title">
                    <span><i class="el-icon-menu" />单选/多选 参数设置：</span>
                    <el-button size="mini"
                               type="primary"
                               @click="openFieldOptionForm(null, -1,)">添加参数</el-button>
                </p>
                <el-table key="enum-table"
                          :data="fieldEnumList"
                          size="mini"
                          max-height="240"
                          border
                          fit>
                    <el-table-column label="序号"
                                     width="50px"
                                     type="index" />
                    <el-table-column label="显示名称"
                                     prop="name"
                                     min-width="100px"
                                     show-overflow-tooltip />
                    <el-table-column label="实际值"
                                     prop="id"
                                     min-width="100px"
                                     show-overflow-tooltip />
                    <el-table-column label="操作"
                                     width="90px">
                        <template slot-scope="{ row, $index }">
                            <el-button size="mini"
                                       type="text"
                                       @click="openFieldOptionForm(row, $index,)">编辑</el-button>
                            <el-divider direction="vertical" />
                            <el-button size="mini"
                                       type="text"
                                       style="color: #ff4d4f"
                                       @click="removeFieldOptionItem($index)">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>

            <!-- 底部按钮 -->
            <div class="element-drawer__button" style="margin-top:60px">
                <el-button size="mini" @click="fieldModelVisible = false">取 消</el-button>
                <el-button size="mini"
                           type="primary"
                           @click="saveField">保 存</el-button>
            </div>
        </el-drawer>

        <el-dialog :visible.sync="fieldOptionModelVisible"
                   title="单选多选参数配置"
                   width="600px"
                   append-to-body
                   destroy-on-close>
            <el-form :model="fieldOptionForm"
                     size="mini"
                     label-width="96px"
                     @submit.native.prevent>
                <el-form-item label="显示名称">
                    <el-input v-model="fieldOptionForm.name"
                              clearable />
                </el-form-item>
                <el-form-item label="实际值">
                    <el-input v-model="fieldOptionForm.id"
                              clearable />
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button size="mini"
                           @click="fieldOptionModelVisible = false">取 消</el-button>
                <el-button size="mini"
                           type="primary"
                           @click="saveFieldOption">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'ElementForm',
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
            formKey: '',
            businessKey: '',
            fieldList: [], // 全部字段
            formFieldForm: {},
            fieldType: {
                string: '字符串',
                number: '数字',
                textarea: '长字符串',
                select: '单选下拉',
                checkbox: '多选',
                radio: '单选',
                date: '日期',
                time: '时间',
                datetime: '日期时间',
                upload: '上传'
            },
            formFieldIndex: -1, // 编辑中的字段， -1 为新增
            formFieldOptionIndex: -1, // 编辑中的字段配置项， -1 为新增
            fieldModelVisible: false,
            fieldOptionModelVisible: false,
            fieldOptionForm: {}, // 当前激活的字段配置项数据
            fieldEnumList: [] // 枚举值列表
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
        // 打开字段详情侧边栏
        openFieldForm(field, index) {
            this.formFieldIndex = index
            if (index !== -1) {
                const FieldObject = this.formData[index]
                this.formFieldForm = JSON.parse(JSON.stringify(field))
                this.fieldEnumList = JSON.parse(JSON.stringify(FieldObject?.values || []))
            } else {
                this.formFieldForm = {}
                this.fieldEnumList = []
            }
            this.fieldModelVisible = true
        },
        // 添加/编辑 多选字段弹窗
        openFieldOptionForm(option, index) {
            this.fieldOptionModelVisible = true
            this.formFieldOptionIndex = index
            if (index == -1) {
                this.fieldOptionForm = {}
            } else {
                this.fieldOptionForm = option
            }
        },
        // 保存多选字段弹窗
        saveFieldOption() {
            if (this.formFieldOptionIndex === -1) {
                this.fieldEnumList.push(this.fieldOptionForm)
            } else {
                this.fieldEnumList.splice(this.formFieldOptionIndex, 1, this.fieldOptionForm)
            }
            this.fieldOptionModelVisible = false
            this.fieldOptionForm = {}
        },
        // 移除多选字段配置项
        async removeFieldOptionItem(index) {
            await this.$confirm('确认移除该字段吗？', '提示')
            this.fieldEnumList.splice(index, 1)
        },

        // 保存字段配置
        saveField() {
            const { type, name, required } = this.formFieldForm
            // 必须设置 id 的值和 name 是相等的,否则提交任务之后,无法获取 name 的值
            const Field = window.bpmnInstances.moddle.create(`${this.prefix}:FormProperty`, { id: name, type, name, default: this.formFieldForm.default, required })
            // 构建枚举值
            if (this.fieldEnumList && this.fieldEnumList.length && ['select', 'checkbox', 'radio'].indexOf(type) != -1) {
                Field.values = this.fieldEnumList.map(fe => {
                    return window.bpmnInstances.moddle.create(`${this.prefix}:Value`, { name: fe.name, id: fe.id })
                })
            }
            // 更新数组 与 表单配置实例
            if (this.formFieldIndex === -1) {
                this.fieldList.push(this.formFieldForm)
                this.formData.push(Field)
            } else {
                this.fieldList.splice(this.formFieldIndex, 1, this.formFieldForm)
                this.formData.splice(this.formFieldIndex, 1, Field)
            }
            this.updateElementExtensions()
            this.fieldModelVisible = false
        },

        // 移除 字段
        removeField(index) {
            this.fieldList.splice(index, 1)
            this.formData.fields.splice(index, 1)
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
