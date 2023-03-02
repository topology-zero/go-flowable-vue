<template>
    <div class="app-container">
        <p class="page-title">流程列表</p>
        <div class="filter-container">
            <el-button v-permission="`flow:cate:add`"
                       type="primary"
                       plain
                       class="filter-item"
                       @click="handleAdd()">
                添加流程
            </el-button>
            <div style="float: right; display: flex">
                <el-input v-model="params.name"
                          placeholder="流程名称"
                          style="width: 200px; margin: 0 3px"
                          class="filter-item" />
                <!-- <el-input v-model="params.category"
                          placeholder="流程分类"
                          style="width: 200px; margin: 0 3px"
                          class="filter-item" /> -->
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
                             prop="name" />
            <el-table-column align="center"
                             label="部署ID"
                             prop="deploymentId" />
            <el-table-column align="center"
                             label="流程key"
                             prop="key" />
            <el-table-column align="center"
                             label="流程所属分类"
                             prop="category" />
            <el-table-column align="center"
                             label="流程版本">
                <template slot-scope="{row}">
                    <el-tag type="success">{{ row.version }}</el-tag>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center"
                             label="状态">
                <template slot-scope="{row}">
                    <el-tag v-if="!row.suspended">正常</el-tag>
                    <el-tag v-else type="danger">挂起</el-tag>
                </template>
            </el-table-column> -->
            <el-table-column align="center"
                             width="230px"
                             label="操作">
                <template slot-scope="{row}">
                    <el-button v-permission="`flow:cate:edit`"
                               size="mini"
                               type="warning"
                               @click="handleStart(row)">启动
                    </el-button>
                    <el-button v-permission="`flow:cate:edit`"
                               size="mini"
                               type="primary"
                               @click="handleEdit(row)">编辑
                    </el-button>
                    <el-button v-permission="`flow:cate:del`"
                               size="mini"
                               type="danger"
                               @click="handleDel(row)">
                        删除
                    </el-button>
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
    </div>
</template>

<script>
import { pageMixin } from '@/utils/mixin'
import { getList, del, start } from './api'
export default {
    name: 'FlowList',
    mixins: [pageMixin],
    data() {
        return {
            params: {
                name: ''
            }
        }
    },
    created() {

    },
    methods: {
        async _getData() {
            const res = await getList(this.params)
            this.list = res.data.data
            this.total = res.data.total
            this.pageSize = res.data.per_page
            this.page = res.data.current_page
            this.table_loading = false
        },
        handleAdd() {
            this.$router.push('/flow/flow')
        },
        handleEdit(data) {
            this.$router.push('/flow/flow?id=' + data.deploymentId)
        },
        async handleStart(data) {
            await this.$confirm('启动流程(测试使用)', '警告')
            const { message } = await start(data.id)
            this.$message.success(message)
        },
        async handleDel(data) {
            await this.$confirm('删除分类将不可恢复', '警告')
            const { message } = await del(data.deploymentId)
            this.$message.success(message)
            this._getData()
        }
    }
}
</script>

<style>

</style>
