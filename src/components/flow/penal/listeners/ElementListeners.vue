<template>
    <div class="panel-tab__content">
        <el-table :data="elementListenersList"
                  size="mini"
                  border>
            <el-table-column label="序号"
                             width="50px"
                             type="index" />
            <el-table-column label="事件类型"
                             min-width="100px"
                             prop="event" />
            <el-table-column label="监听器类型"
                             min-width="100px"
                             show-overflow-tooltip
                             :formatter="row => listenerTypeObject[row.listenerType]" />
            <el-table-column label="操作"
                             width="90px">
                <template slot-scope="{ row, $index }">
                    <el-button size="mini"
                               type="text"
                               @click="openListenerForm(row, $index)">编辑</el-button>
                    <el-divider direction="vertical" />
                    <el-button size="mini"
                               type="text"
                               style="color: #ff4d4f"
                               @click="removeListener(row, $index)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="element-drawer__button">
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-plus"
                       @click="openListenerForm(null)">添加监听器</el-button>
        </div>

        <!-- 监听器 编辑/创建 部分 -->
        <el-drawer :visible.sync="listenerFormModelVisible"
                   title="执行监听器"
                   :size="`${width}px`"
                   append-to-body
                   destroy-on-close>
            <el-form ref="listenerFormRef"
                     size="mini"
                     :model="listenerForm"
                     label-width="96px"
                     @submit.native.prevent>
                <el-form-item label="事件类型"
                              prop="event"
                              :rules="{ required: true, trigger: ['blur', 'change'] }">
                    <el-select v-model="listenerForm.event">
                        <el-option label="start"
                                   value="start" />
                        <el-option label="end"
                                   value="end" />
                    </el-select>
                </el-form-item>
                <el-form-item label="请求方法"
                              prop="fields.method"
                              :rules="{ required: true, trigger: ['blur', 'change'] }">
                    <el-select v-model="listenerForm.fields.method">
                        <el-option label="GET"
                                   value="GET" />
                        <el-option label="POST"
                                   value="POST" />
                        <el-option label="PUT"
                                   value="PUT" />
                        <el-option label="DELETE"
                                   value="DELETE" />
                    </el-select>
                </el-form-item>
                <el-form-item label="请求地址"
                              prop="fields.url"
                              :rules="{ required: true, trigger: ['blur', 'change'] }">
                    <el-input v-model="listenerForm.fields.url"
                              prop="url"
                              size="mini" />
                </el-form-item>
                <el-form-item label="请求头">
                    <el-table v-show="listenerForm.fields.header.length > 0"
                              border
                              :data="listenerForm.fields.header"
                              size="mini">
                        <el-table-column label="KEY">
                            <template slot-scope="{ row }">
                                {{ Object.keys(row)[0] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="VALUE">
                            <template slot-scope="{ row }">
                                {{ Object.values(row)[0] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="{ $index }">
                                <el-button size="mini"
                                           type="text"
                                           style="color: #ff4d4f"
                                           @click="deleteAttribute(1, $index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="element-drawer__button">
                        <el-button size="mini"
                                   type="primary"
                                   icon="el-icon-plus"
                                   @click="openAttributesForm(1)">添加请求头</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="请求Query">
                    <el-table v-show="listenerForm.fields.query.length > 0"
                              border
                              :data="listenerForm.fields.query"
                              size="mini">
                        <el-table-column label="KEY">
                            <template slot-scope="{ row }">
                                {{ Object.keys(row)[0] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="VALUE">
                            <template slot-scope="{ row }">
                                {{ Object.values(row)[0] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="{ $index }">
                                <el-button size="mini"
                                           type="text"
                                           style="color: #ff4d4f"
                                           @click="deleteAttribute(2, $index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="element-drawer__button">
                        <el-button size="mini"
                                   type="primary"
                                   icon="el-icon-plus"
                                   @click="openAttributesForm(2)">添加Query</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="请求Body">
                    <el-table v-show="listenerForm.fields.body.length > 0"
                              border
                              :data="listenerForm.fields.body"
                              size="mini">
                        <el-table-column label="KEY">
                            <template slot-scope="{ row }">
                                {{ Object.keys(row)[0] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="VALUE">
                            <template slot-scope="{ row }">
                                {{ Object.values(row)[0] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="{ $index }">
                                <el-button size="mini"
                                           type="text"
                                           style="color: #ff4d4f"
                                           @click="deleteAttribute(3, $index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="element-drawer__button">
                        <el-button size="mini"
                                   type="primary"
                                   icon="el-icon-plus"
                                   @click="openAttributesForm(3)">添加Body</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="请求Json">
                    <el-input v-model="listenerForm.fields.json"
                              type="textarea"
                              :rows="4"
                              size="mini" />
                </el-form-item>
            </el-form>
            <el-divider />

            <div class="element-drawer__button">
                <el-button size="mini"
                           @click="listenerFormModelVisible = false">取 消</el-button>
                <el-button size="mini"
                           type="primary"
                           @click="saveListenerConfig">保 存</el-button>
            </div>
        </el-drawer>

        <el-dialog :visible.sync="propertyFormModelVisible"
                   :title="propertyFormModelTitle"
                   width="600px"
                   append-to-body
                   destroy-on-close>
            <el-form ref="attributeFormRef"
                     :model="propertyForm"
                     label-width="80px"
                     size="mini"
                     @submit.native.prevent>
                <el-form-item label="属性名："
                              prop="name">
                    <el-input v-model="propertyForm.name"
                              clearable />
                </el-form-item>
                <el-form-item label="属性值："
                              prop="value">
                    <el-input v-model="propertyForm.value"
                              clearable />
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button size="mini"
                           @click="propertyFormModelVisible = false">取 消</el-button>
                <el-button size="mini"
                           type="primary"
                           @click="saveAttribute">确 定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script>
import { createListenerObject, updateElementExtensions } from '../../utils'
import { initListenerType, listenerType } from './utilSelf'

export default {
    name: 'ElementListeners',
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
            elementListenersList: [], // 监听器列表
            listenerForm: {
                event: '',
                fields: {
                    method: '',
                    url: '',
                    header: [],
                    query: [],
                    body: [],
                    json: ''
                }
            }, // 监听器详情表单
            listenerFormModelVisible: false, // 监听器 编辑 侧边栏显示状态
            editingListenerIndex: -1, // 监听器所在下标，-1 为新增
            editingListenerFieldIndex: -1, // 字段所在下标，-1 为新增
            listenerTypeObject: listenerType,
            propertyFormModelVisible: false,
            propertyFormModelTitle: '',
            propertyForm: {
                type: 0,
                name: '',
                value: ''
            }
        }
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                val && val.length && this.$nextTick(() => this.resetListenersList())
            }
        }
    },
    methods: {
        resetListenerForm() {
            return {
                event: '',
                fields: {
                    method: '',
                    url: '',
                    header: [],
                    query: [],
                    body: [],
                    json: ''
                }
            }
        },
        resetListenersList() {
            this.bpmnElement = window.bpmnInstances.bpmnElement
            this.otherExtensionList = []
            this.bpmnElementListeners = []
            if (this.bpmnElement.businessObject && this.bpmnElement.businessObject.extensionElements && this.bpmnElement.businessObject.extensionElements.values) {
                this.bpmnElement.businessObject.extensionElements.values.forEach(e => {
                    if (e.$type === `${this.prefix}:ExecutionListener`) {
                        this.bpmnElementListeners.push(e)
                    }
                })
            }
            this.elementListenersList = this.bpmnElementListeners.map(listener => initListenerType(listener))
        },
        // 打开 监听器详情 侧边栏
        openListenerForm(listener, index) {
            if (listener) {
                this.listenerForm = this.resetListenerForm()
                this.listenerForm.event = listener.event
                this.listenerForm.class = listener.class
                this.listenerForm.listenerType = 'classListener'
                if (Array.isArray(listener.fields)) {
                    listener.fields.map(v => {
                        if (v.name == 'header' || v.name == 'query' || v.name == 'body') {
                            this.listenerForm.fields[v.name] = v.string == '' ? [] : JSON.parse(v.string)
                        } else {
                            this.listenerForm.fields[v.name] = v.string
                        }
                    })
                } else {
                    this.listenerForm.fields = listener.fields
                }
                this.editingListenerIndex = index
            } else {
                this.listenerForm = this.resetListenerForm()
                this.editingListenerIndex = -1 // 标记为新增
            }
            // 打开侧边栏并清楚验证状态
            this.listenerFormModelVisible = true
            this.$nextTick(() => {
                if (this.$refs['listenerFormRef']) this.$refs['listenerFormRef'].clearValidate()
            })
        },
        // 移除监听器
        removeListener(listener, index) {
            this.$confirm('确认移除该监听器吗？', '提示', {
                confirmButtonText: '确 认',
                cancelButtonText: '取 消'
            })
                .then(() => {
                    this.bpmnElementListeners.splice(index, 1)
                    this.elementListenersList.splice(index, 1)
                    updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(this.bpmnElementListeners))
                })
                .catch(() => console.info('操作取消'))
        },
        // 保存监听器配置
        async saveListenerConfig() {
            const validateStatus = await this.$refs['listenerFormRef'].validate()
            if (!validateStatus) return // 验证不通过直接返回
            const listenerObject = createListenerObject(this.listenerForm, false, this.prefix)
            if (this.editingListenerIndex === -1) {
                this.bpmnElementListeners.push(listenerObject)
                this.elementListenersList.push(this.listenerForm)
            } else {
                this.bpmnElementListeners.splice(this.editingListenerIndex, 1, listenerObject)
                this.elementListenersList.splice(this.editingListenerIndex, 1, this.listenerForm)
            }
            // 保存其他配置
            this.otherExtensionList = []
            if (this.bpmnElement.businessObject && this.bpmnElement.businessObject.extensionElements && this.bpmnElement.businessObject.extensionElements.values) {
                this.bpmnElement.businessObject.extensionElements.values.forEach(e => {
                    if (e.$type !== `${this.prefix}:ExecutionListener`) {
                        this.otherExtensionList.push(e)
                    }
                })
            }
            updateElementExtensions(this.bpmnElement, this.otherExtensionList.concat(this.bpmnElementListeners))
            // 4. 隐藏侧边栏
            this.listenerFormModelVisible = false
            this.listenerForm = this.resetListenerForm()
        },
        openAttributesForm(type) {
            this.propertyFormModelVisible = true
            this.propertyForm.type = type
            this.propertyForm.name = ''
            this.propertyForm.value = ''
            switch (type) {
                case 1:
                    this.propertyFormModelTitle = '添加请求头'
                    break
                case 2:
                    this.propertyFormModelTitle = '添加Query'
                    break
                case 3:
                    this.propertyFormModelTitle = '添加Body'
                    break
            }
        },
        saveAttribute() {
            switch (this.propertyForm.type) {
                case 1:
                    this.listenerForm.fields.header.push({ [this.propertyForm.name]: this.propertyForm.value })
                    break
                case 2:
                    this.listenerForm.fields.query.push({ [this.propertyForm.name]: this.propertyForm.value })
                    break
                case 3:
                    this.listenerForm.fields.body.push({ [this.propertyForm.name]: this.propertyForm.value })
                    break
            }
            this.propertyFormModelVisible = false
        },
        deleteAttribute(type, index) {
            switch (type) {
                case 1:
                    this.listenerForm.fields.header.splice(index, 1)
                    break
                case 2:
                    this.listenerForm.fields.query.splice(index, 1)
                    break
                case 3:
                    this.listenerForm.fields.body.splice(index, 1)
                    break
            }
        }
    }

}
</script>
