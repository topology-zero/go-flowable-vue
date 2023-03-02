<template>
    <div class="app-container">
        <p class="page-title">流程外置表单列表</p>
        <div class="filter-container">
            <el-button v-permission="`flow_form:add`"
                       type="primary"
                       plain
                       class="filter-item"
                       @click="$router.push('/flow/formdetail')">
                添加流程外置表单
            </el-button>
            <div style="float: right; display: flex; margin-bottom: 10px;">
                <el-input v-model="params.name"
                          placeholder="表单用途"
                          clearable
                          style="width: 200px; margin: 0 3px"
                          class="filter-item" />
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
                             align="center"
                             width="60px" />
            <el-table-column align="center"
                             label="表单用途"
                             prop="name" />
            <el-table-column align="center"
                             width="170px"
                             label="操作">
                <template slot-scope="{row}">
                    <el-button v-permission="`flow_form:edit`"
                               size="mini"
                               type="primary"
                               @click="$router.push('/flow/formdetail?id=' + row.id)">编辑
                    </el-button>
                    <el-button v-permission="`flow_form:del`"
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
import { getList, del } from './api'
import { pageMixin } from '@/utils/mixin'
export default {
    name: 'FlowForm',
    mixins: [pageMixin],
    data() {
        return {
            params: {
                name: ''
            }
        }
    },
    methods: {
        // 删除流程外置表单
        async handleDel(info) {
            await this.$confirm('删除流程外置表单不可恢复', '警告')
            const { message } = await del(info.id)
            this.$message.success(message)
            this._getData(this.params)
        },
        // 获取数据
        async _getData() {
            const res = await getList(this.params)
            this.list = res.data.data
            this.total = res.data.total
            this.pageSize = res.data.per_page
            this.page = res.data.current_page
            this.table_loading = false
        }
    }
}
</script>
