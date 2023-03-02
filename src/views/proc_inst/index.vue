<template>
    <div class="app-container">
        <p class="page-title">全部流程实例</p>
        <div class="filter-container">
            <div style="float: right; display: flex; margin-bottom: 10px;">
                <el-input v-model="params.processName"
                          placeholder="流程名称"
                          clearable
                          style="width: 200px; margin: 0 3px"
                          class="filter-item" />
                <el-date-picker
                    v-model="rangeTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 350px; margin-right: 3px;"
                    type="datetimerange"
                    range-separator="至"
                    clearable
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :change="setParamsTime()"
                    :default-time="['00:00:00','23:59:59']" />
                <el-button type="primary" class="filter-item" @click="search()">搜索
                </el-button>

            </div>
        </div>
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
                             label="当前节点"
                             prop="currentTask" />
            <el-table-column align="center"
                             label="当前节点执行人"
                             prop="currentUser" />
            <el-table-column align="center"
                             label="流程开始时间"
                             prop="startTime" />
            <el-table-column align="center"
                             label="流程结束时间"
                             prop="endTime" />
            <el-table-column align="center"
                             label="流程使用时间">
                <template slot-scope="{row}">
                    {{ formatUseTime(row.duration) }}
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="流程状态">
                <template slot-scope="{row}">
                    <el-tag v-if="row.endTime.length > 0"
                            type="danger">已结束</el-tag>
                    <el-tag v-else
                            type="success">进行中</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             width="170px"
                             label="操作">
                <template slot-scope="{row}">
                    <el-button size="mini"
                               type="primary"
                               @click="handleDetail(row)">详情</el-button>
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
                   title="任务详情">
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
                        <p v-if="v.useTime.length > 0">审批用时: {{ formatUseTime(v.useTime) }}</p>
                        <div v-if="v.form && v.form.length > 0">
                            <el-divider content-position="center">填写表单</el-divider>
                            <el-form label-width="120px" size="mini">
                                <el-form-item v-for="vv in v.form"
                                              :key="vv.id"
                                              :label="vv.name">
                                    <el-input v-model="vv.value" disabled />
                                </el-form-item>
                            </el-form>
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
    </div>
</template>

<script>
import { pageMixin } from '@/utils/mixin'
import { getList, detail, getAdminUser } from './api'
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
            token: getToken(),
            prefix: process.env.VUE_APP_API,
            rangeTime: []
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
            await this.$nextTick()
            try {
                const { data } = await detail(row.id)
                this.detail = data.history
                this.showDialog = true
            } finally {
                this.table_loading = false
            }
        },
        // 格式化时间
        formatUseTime: (time) => {
            return formatUseTime(time)
        },
        // 下载附件
        downloadAttachment(row) {
            window.open(`${process.env.VUE_APP_API}/flow/attachment/${row.taskId}/${row.id}/:${row.name}?Authorization=${getToken()}`)
        },
        setParamsTime() {
            if (!this.rangeTime || this.rangeTime.lenght == 0) {
                [this.params.startTime, this.params.endTime] = ['', '']
            } else {
                [this.params.startTime, this.params.endTime] = [this.rangeTime[0], this.rangeTime[1]]
            }
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
