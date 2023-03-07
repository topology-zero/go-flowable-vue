<template>
    <div class="app-container">
        <p class="page-title">指派给我的任务</p>
        <el-table v-loading="table_loading"
                  element-loading-text="加载中..."
                  border
                  :data="list">
            <el-table-column label="ID"
                             prop="id"
                             align="center" />
            <el-table-column align="center"
                             label="流程名称"
                             prop="processName" />
            <el-table-column align="center"
                             label="任务名称"
                             prop="taskName" />
            <el-table-column align="center"
                             label="任务创建时间"
                             prop="createTime" />
            <el-table-column align="center"
                             width="170px"
                             label="操作">
                <template slot-scope="{row}">
                    <el-dropdown split-button
                                 type="primary"
                                 size="mini"
                                 :hide-on-click="false"
                                 @click="handleDetail(row)">
                        详情
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="handleComplete(row)">完成任务</el-dropdown-item>
                            <el-dropdown-item @click.native="handleDelegate(row)">转让</el-dropdown-item>
                            <el-dropdown-item @click.native="handleAttachment(row)">上传附件</el-dropdown-item>
                            <el-dropdown-item @click.native="handleComment(row)">添加批注</el-dropdown-item>
                            <!-- <el-dropdown-item @click.native="complete5(row)">删除</el-dropdown-item> -->
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <div class="page-container">
            <el-pagination background
                           :current-page.sync="params.page"
                           :page-sizes="page_sizes"
                           :page-size="params.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange" />
        </div>

        <el-dialog :visible.sync="showDialog"
                   title="历史流转">
            <el-timeline>
                <el-timeline-item v-for="v in detail"
                                  :key="v.id"
                                  :timestamp="v.createTime"
                                  placement="top">
                    <el-card>
                        <p>执行步骤: {{ v.actionName }}</p>
                        <p v-if="v.handelUser">操作人: {{ v.handelUser }}</p>
                        <p>开始时间: {{ v.createTime }}</p>
                        <p v-if="v.handleTime">完成时间: {{ v.handleTime }}</p>
                        <p v-if="v.useTime > 0">审批用时: {{ formatUseTime(v.useTime) }}</p>
                        <div v-if="v.formRule ">
                            <el-divider content-position="center">表单/审批</el-divider>
                            <el-descriptions v-if="v.operateUser"
                                             class="margin-top"
                                             title="审批意见"
                                             :column="2"
                                             border>
                                <el-descriptions-item label="审批人">{{ v.operateUser }}</el-descriptions-item>
                                <el-descriptions-item label="审批结果">
                                    <el-tag v-if="v.operateType == '同意'" type="success">{{ v.operateType }}</el-tag>
                                    <el-tag v-else type="danger">{{ v.operateType }}</el-tag>
                                </el-descriptions-item>
                                <el-descriptions-item label="审批意见">{{ v.operateMemo }}</el-descriptions-item>
                            </el-descriptions>
                            <form-create v-else
                                         ref="formCreate"
                                         :option="v.formOption"
                                         :rule="v.formRule"
                                         @submit="completeWithForm" />

                        </div>
                        <div v-if="v.comment && v.comment.length > 0">
                            <el-divider content-position="center">备注</el-divider>
                            <el-table :data="v.comment"
                                      size="mini">
                                <el-table-column prop="author"
                                                 width="80"
                                                 label="姓名" />
                                <el-table-column prop="message"
                                                 label="备注" />
                                <el-table-column prop="time"
                                                 width="150"
                                                 label="日期" />
                            </el-table>
                        </div>
                        <div v-if="v.attachment && v.attachment.length > 0">
                            <el-divider content-position="center">附件</el-divider>
                            <el-table :data="v.attachment"
                                      size="mini">
                                <el-table-column prop="author"
                                                 width="80"
                                                 label="上传人" />
                                <el-table-column prop="name"
                                                 label="名称">
                                    <template slot-scope="{row}">
                                        <el-tooltip effect="dark"
                                                    :content="row.description"
                                                    placement="top-start" />
                                        <div>{{ row.name }}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="time"
                                                 width="150"
                                                 label="上传时间" />
                                <el-table-column width="120"
                                                 label="操作">
                                    <template slot-scope="{row}">
                                        <el-button type="text"
                                                   style="color: #409EFF;"
                                                   size="mini"
                                                   @click="downloadAttachment(row)">下载</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </el-dialog>

        <el-dialog :visible.sync="showDelegateDialog"
                   title="指派任务">
            <el-form ref="elDelegateForm"
                     :model="delegateForm"
                     label-width="100px">
                <el-form-item label="指派至"
                              prop="toUser"
                              :rules="{ required: true, trigger: ['blur', 'change'] }">
                    <el-select v-model="delegateForm.toUser">
                        <el-option v-for="v in users"
                                   :key="v.id"
                                   :label="v.name"
                                   :value="v.id" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="showDelegateDialog = false">取消</el-button>
                <el-button type="primary"
                           @click="delegateSubmit()">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="showUploadDialog"
                   title="上传附件">
            <el-form ref="elUploadForm"
                     :model="uploadForm"
                     label-width="100px">
                <el-form-item label="文件类型">
                    <el-radio-group v-model="uploadForm.fileType">
                        <el-radio :label="1">文件</el-radio>
                        <el-radio :label="2">外链</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="uploadForm.fileType==2"
                              label="文件名"
                              prop="name"
                              :rules="{ required: true, trigger: ['blur', 'change'] }">
                    <el-input v-model="uploadForm.name" />
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="uploadForm.description" />
                </el-form-item>
                <el-form-item v-if="uploadForm.fileType==2"
                              label="外链地址"
                              prop="externalUrl"
                              :rules="{ required: true, trigger: ['blur', 'change'] }">
                    <el-input v-model="uploadForm.externalUrl" />
                </el-form-item>
                <el-form-item v-show="uploadForm.fileType==1"
                              label="文件">
                    <el-upload :limit="1"
                               :auto-upload="false"
                               action=""
                               :on-change="fileChange"
                               :on-remove="fileRemove"
                               :file-list="fileList">
                        <el-button v-show="uploadForm.file == null"
                                   size="small"
                                   type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="showUploadDialog = false">取消</el-button>
                <el-button type="primary"
                           @click="uploadSubmit()">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="showCommentDialog"
                   title="添加批注">
            <el-form ref="elCommentForm"
                     :model="commentForm"
                     label-width="100px">
                <el-form-item label="批注"
                              prop="message">
                    <el-input v-model="commentForm.message"
                              type="textarea"
                              placeholder="请输入内容" />
                </el-form-item>

            </el-form>
            <div slot="footer">
                <el-button @click="showCommentDialog = false">取消</el-button>
                <el-button type="primary"
                           @click="commentSubmit()">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="showOperateDialog"
                   title="审批意见">
            <el-form ref="elOperateForm"
                     :model="operateForm"
                     label-width="100px">
                <el-form-item label="意见"
                              prop="message">
                    <el-input v-model="operateForm.message"
                              type="textarea"
                              placeholder="请输入内容" />
                </el-form-item>

            </el-form>
            <div slot="footer">
                <el-button @click="showOperateDialog = false">取消</el-button>
                <el-button type="primary"
                           @click="operateSubmit()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { pageMixin } from '@/utils/mixin'
import { getList, detail, complete, getAdminUser, delegate, addAttachment, delAttachment, addComment, delComment, completeWithForm, accept, reject } from './api'
import { formatUseTime } from '@/utils/index'
import { getToken } from '@/utils/auth'
export default {
    name: 'Flowcate',
    mixins: [pageMixin],
    data() {
        return {
            showDialog: false,
            users: [],
            detail: [],
            taskId: '',

            showDelegateDialog: false,
            delegateForm: {
                toUser: ''
            },

            showUploadDialog: false,
            fileList: [],
            uploadForm: {
                fileType: 1,
                name: '',
                description: '',
                externalUrl: '',
                file: null
            },

            showCommentDialog: false,
            commentForm: {
                message: ''
            },

            showOperateDialog: false,
            operateAccept: true,
            operateForm: {
                message: ''
            },

            token: getToken(),
            prefix: process.env.VUE_APP_API
        }
    },
    created() {
        this.getAdminUser()
    },
    methods: {
        // 初始化获取列表
        async _getData() {
            const res = await getList(this.params)
            this.list = res.data.data
            this.total = res.data.total
            this.pageSize = res.data.per_page
            this.page = res.data.current_page
            this.table_loading = false
        },
        // 初始化获取候选人
        async getAdminUser() {
            const { data } = await getAdminUser()
            this.users = data.list
        },
        // 获取任务详情
        async handleDetail(row) {
            this.table_loading = true
            this.taskId = row.id
            try {
                const { data } = await detail(row.processInstanceId)
                data.history.forEach(v => {
                    if (v.formRule && v.formRule.length > 0) {
                        const localRule = v.formRule
                        v.formRule = JSON.parse(v.formRule)
                        v.formOption = JSON.parse(v.formOption)

                        // 回显表单
                        this._setPropertise(v.formRule, v.formProperties, v.taskId)
                        // 添加点击事件
                        this._setClick(v.formRule)
                        // 设置操作
                        this._setOperate(v)

                        // 有审批的表单 不显示提交按钮
                        if (localRule.indexOf('accept') != -1 || localRule.indexOf('reject') != -1) {
                            v.formOption.submitBtn = false
                        }

                        // 有审批的表单 但是不是在当前节点,不显示审批按钮
                        if ((localRule.indexOf('accept') != -1 || localRule.indexOf('reject') != -1) && this.taskId != v.taskId) {
                            v.formOption.formRule = ''
                            v.formOption.formOption = ''
                        }

                        // 提交过的表单 不显示提交按钮
                        if (v.handleTime && v.handleTime.length > 0) {
                            v.formOption.submitBtn = false
                        }
                    }
                })
                this.detail = data.history
                this.showDialog = true
            } finally {
                this.table_loading = false
            }
        },
        // 完成任务
        async handleComplete(row) {
            await this.$confirm('确认完成任务', '警告')
            this.table_loading = true
            try {
                const { message } = await complete(row.id)
                this._getData()
                this.$message.success(message)
            } finally {
                this.table_loading = false
            }
        },
        // 指派任务(前置操作)
        handleDelegate(row) {
            this.delegateForm.toUser = ''
            this.showDelegateDialog = true
            this.taskId = row.id
        },
        // 指派任务(提交操作)
        async delegateSubmit() {
            await this.$refs.elDelegateForm.validate()
            try {
                const { message } = await delegate(this.taskId, this.delegateForm)
                this._getData()
                this.$message.success(message)
            } finally {
                this.showDelegateDialog = false
            }
        },
        // 添加附件(前置操作)
        handleAttachment(row) {
            this.uploadForm.fileType = 1
            this.uploadForm.name = ''
            this.uploadForm.description = ''
            this.uploadForm.externalUrl = ''
            this.uploadForm.file = null
            this.showUploadDialog = true
            this.fileList = []
            this.taskId = row.id
        },
        // 格式化时间
        formatUseTime: (time) => {
            return formatUseTime(time)
        },
        // 添加附件(提交操作)
        async uploadSubmit() {
            await this.$refs.elUploadForm.validate()
            const formData = new FormData()
            if (this.uploadForm.fileType == 1) {
                this.uploadForm.name = this.uploadForm.file.name
                formData.append('file', this.uploadForm.file.raw)
            }
            formData.append('name', this.uploadForm.name)
            formData.append('description', this.uploadForm.description)
            formData.append('externalUrl', this.uploadForm.externalUrl)

            const { message } = await addAttachment(this.taskId, formData)
            this.$message.success(message)
            this.showUploadDialog = false
        },
        // 添加附加,文件上传的操作
        fileChange(file, fileList) {
            this.uploadForm.file = file
        },
        // 添加附加,文件删除时的操作
        fileRemove(file, fileList) {
            this.uploadForm.file = null
        },
        // 添加批注(前置操作)
        handleComment(row) {
            this.taskId = row.id
            this.showCommentDialog = true
            this.commentForm.message = ''
        },
        // 添加批注(提交操作)
        async commentSubmit() {
            await this.$refs.elCommentForm.validate()
            const { message } = await addComment(this.taskId, this.commentForm)
            this.$message.success(message)
            this.showCommentDialog = false
        },
        // 删除批注
        async removeComment(row) {
            await this.$confirm('确认删除备注', '警告')
            const { message } = await delComment(row.taskId, row.id)
            this.$message.success(message)
            this.showDialog = false
        },
        // 删除附件
        async removeAttachment(row) {
            await this.$confirm('确认删除附件', '警告')
            const { message } = await delAttachment(row.taskId, row.id)
            this.$message.success(message)
            this.showDialog = false
        },
        // 下载附件
        downloadAttachment(row) {
            window.open(`${process.env.VUE_APP_API}/flow/attachment/${row.taskId}/${row.id}/:${row.name}?Authorization=${getToken()}`)
        },
        // 提交表单任务
        async completeWithForm(formData, fApi) {
            const properties = []
            for (const i in formData) {
                properties.push({ id: i, value: formData[i] })
            }
            const { message } = await completeWithForm(this.taskId, { properties })
            await this._getData()
            this.showDialog = false
            this.$message.success(message)
        },
        // 同意
        async formCreateAccept() {
            this.showOperateDialog = true
            this.operateForm.message = ''
            this.operateAccept = true
        },
        // 驳回
        async formCreateReject() {
            this.showOperateDialog = true
            this.operateForm.message = ''
            this.operateAccept = false
        },
        // 同意/驳回 提交
        async operateSubmit() {
            await this.$refs.elOperateForm.validate()
            if (this.operateAccept) {
                await accept(this.taskId, this.operateForm)
            } else {
                await reject(this.taskId, this.operateForm)
            }

            this.$message.success('成功')
            this.showOperateDialog = false
            this.showDialog = false
            this._getData()
        },
        // 写入表单变量
        _setPropertise(formRule, formProperties, taskId) {
            formRule.forEach(v => {
                if (v.field) {
                    if (this.taskId != taskId) {
                        v.props = { disabled: true }
                    }
                    for (const i in formProperties) {
                        if (`${taskId}|${v.field}` == formProperties[i].id) {
                            v.value = formProperties[i].value
                        }
                    }
                }
                if (v.children) {
                    this._setPropertise(v.children, formProperties, taskId)
                }
            })
        },
        _setOperate(v) {
            for (const i in v.formProperties) {
                if (`${v.taskId}|operate_user` == v.formProperties[i].id) {
                    v.operateUser = v.formProperties[i].value
                }
                if (`${v.taskId}|operate_type` == v.formProperties[i].id) {
                    v.operateType = v.formProperties[i].value
                }
                if (`${v.taskId}|operate_memo` == v.formProperties[i].id) {
                    v.operateMemo = v.formProperties[i].value
                }
            }
        },
        // 为同意,驳回添加点击事件
        _setClick(formRule) {
            formRule.forEach(v => {
                if (v.on && v.on.click) {
                    if (v.on.click == 'formCreateAccept') {
                        v.on.click = this.formCreateAccept
                    } else if (v.on.click == 'formCreateReject') {
                        v.on.click = this.formCreateReject
                    }
                }
                if (v.children) {
                    this._setClick(v.children)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload {
    display: flex;
}
.el-divider__text {
    color: #ccc;
    font-size: 12px;
}

.task-form {
    padding: 0 20px 0 20px;
}
.task-form + .task-form {
    margin-top: 20px;
}
</style>>
