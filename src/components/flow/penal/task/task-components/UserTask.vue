<template>
    <div style="margin-top: 16px">

        <el-form-item label="处理方式">
            <el-select v-model="choose" @change="chooseChange()">
                <el-option label="指派至处理用户"
                           :value="1" />
                <el-option label="指派至候选用户"
                           :value="2" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="choose == 1"
                      label="处理用户">
            <el-select ref="assignee"
                       v-model="userTaskForm.assignee"
                       @change="updateElementTask('assignee')">
                <el-option v-for="ak in adminUser"
                           :key="'ak' + ak.id"
                           :label="ak.name"
                           :value="ak.id+''" />
            </el-select>
        </el-form-item>
        <el-form-item v-show="choose == 2"
                      label="候选用户">
            <el-select v-model="userTaskForm.candidateUsers"
                       multiple
                       @change="updateElementTask('candidateUsers')">
                <el-option v-for="uk in adminUser"
                           :key="'uk' + uk.id"
                           :label="uk.name"
                           :value="uk.id+''" />
            </el-select>
        </el-form-item>
        <!-- <el-form-item label="候选分组">
            <el-select v-model="userTaskForm.candidateGroups"
                       multiple
                       collapse-tags
                       @change="updateElementTask('candidateGroups')">
                <el-option v-for="gk in mockData"
                           :key="'ass-' + gk"
                           :label="`分组${gk}`"
                           :value="`group${gk}`" />
            </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="到期时间">
            <el-input v-model="userTaskForm.dueDate"
                      clearable
                      @change="updateElementTask('dueDate')" />
        </el-form-item>
        <el-form-item label="跟踪时间">
            <el-input v-model="userTaskForm.followUpDate"
                      clearable
                      @change="updateElementTask('followUpDate')" />
        </el-form-item> -->
        <el-form-item label="优先级">
            <el-input v-model="userTaskForm.priority"
                      clearable
                      @change="updateElementTask('priority')" />
        </el-form-item>
    </div>
</template>

<script>
import { getAdmin } from './api'
export default {
    name: 'UserTask',
    props: {
        id: String,
        type: String
    },
    data() {
        return {
            defaultTaskForm: {
                assignee: '',
                candidateUsers: [],
                candidateGroups: [],
                dueDate: '',
                followUpDate: '',
                priority: ''
            },
            userTaskForm: {
                assignee: '',
                candidateUsers: []
            },
            choose: 1,
            adminUser: []
        }
    },
    watch: {
        id: {
            immediate: true,
            async handler() {
                this.bpmnElement = window.bpmnInstances.bpmnElement
                this.$nextTick(() => this.resetTaskForm())
            }
        }
    },
    beforeDestroy() {
        this.bpmnElement = null
    },
    async created() {
        const { data } = await getAdmin()
        this.adminUser = data.list
    },
    methods: {
        async resetTaskForm() {
            for (const key in this.defaultTaskForm) {
                if (key === 'candidateUsers') {
                    if (this.bpmnElement.businessObject.candidateUsers && this.bpmnElement.businessObject.candidateUsers.length > 0) {
                        this.userTaskForm.candidateUsers = this.bpmnElement.businessObject.candidateUsers.split(',')
                        this.userTaskForm.assignee = ''
                        this.choose = 2
                    } else {
                        this.userTaskForm.candidateUsers = []
                        this.choose = 1
                    }
                    continue
                }
                this.$set(this.userTaskForm, key, this.bpmnElement.businessObject[key])
            }
        },
        updateElementTask(key) {
            const taskAttr = Object.create(null)
            if (key === 'candidateUsers') {
                taskAttr['candidateUsers'] = this.userTaskForm.candidateUsers.join()
                taskAttr['assignee'] = ''
                this.userTaskForm.assignee = ''
            } else if (key === 'assignee') {
                taskAttr['candidateUsers'] = ''
                taskAttr['assignee'] = this.userTaskForm.assignee
                this.userTaskForm.candidateUsers = []
            } else {
                taskAttr[key] = this.userTaskForm[key] || null
            }
            window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr)
        },
        chooseChange() {
            const taskAttr = Object.create(null)
            taskAttr['candidateUsers'] = ''
            taskAttr['assignee'] = ''
            this.userTaskForm.candidateUsers = []
            this.userTaskForm.assignee = ''
            window.bpmnInstances.modeling.updateProperties(this.bpmnElement, taskAttr)
        }
    }
}
</script>
