<template>
    <div class="app-container">
        <p class="page-title">流程分类列表</p>
        <div class="filter-container">
            <el-button v-permission="`flow:cate:add`"
                       type="primary"
                       plain
                       class="filter-item"
                       @click="handleAdd()">
                添加分类
            </el-button>
            <!-- <div style="float: right; display: flex">
                <el-input v-model="params.name" placeholder="姓名|手机号" style="width: 200px; margin: 0 3px"
                    class="filter-item" />
                <el-button type="primary" class="filter-item" @click="search()">搜索
                </el-button>
            </div> -->
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
                             label="分类名"
                             prop="name" />
            <el-table-column align="center"
                             label="添加时间"
                             prop="createTime" />
            <el-table-column align="center"
                             width="170px"
                             label="操作">
                <template slot-scope="scope">
                    <el-button v-permission="`flow:cate:edit`"
                               size="mini"
                               type="primary"
                               @click="handleEdit(scope.row)">编辑
                    </el-button>
                    <el-button v-permission="`flow:cate:del`"
                               size="mini"
                               type="danger"
                               @click="handleDel(scope.row)">
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

        <el-dialog :visible.sync="showDialog"
                   :title="dialogTitle">
            <el-form ref="elForm"
                     :model="formData"
                     label-width="100px">
                <el-form-item label="分类名"
                              :rules="{ required: true, trigger: 'blur', message: '请输入分类' }"
                              prop="name">
                    <el-input v-model="formData.name" />
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="showDialog = false">取消</el-button>
                <el-button type="primary"
                           @click="submitForm()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { pageMixin } from '@/utils/mixin'
import { getList, add, edit, del } from './api'
export default {
    name: 'Flowcate',
    mixins: [pageMixin],
    data() {
        return {
            showDialog: false,
            dialogTitle: '',
            formData: {
                id: '',
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
            this.showDialog = true
            this.dialogTitle = '添加分类'
            this.formData.id = ''
            this.formData.name = ''
        },
        handleEdit(data) {
            this.showDialog = true
            this.dialogTitle = '编辑分类'
            this.formData.id = data.id
            this.formData.name = data.name
        },
        async handleDel(data) {
            await this.$confirm('删除分类将不可恢复', '警告')
            const { message } = await del(data.id)
            this.$message.success(message)
            this._getData()
        },
        async submitForm() {
            try {
                if (this.dialogTitle == '添加分类') {
                    await add({ name: this.formData.name })
                } else {
                    await edit(this.formData.id, { name: this.formData.name })
                }
                this.$message.success('成功')
                this._getData()
            } finally {
                this.showDialog = false
            }
        }
    }
}
</script>

<style>

</style>
