<!-- eslint-disable vue/require-default-prop -->
<template>
    <div class="panel-tab__content">
        <el-form size="mini"
                 label-width="90px"
                 @submit.native.prevent>
            <el-form-item label="ID">
                <el-input v-model="elementBaseInfo.id"
                          :disabled="idEditDisabled"
                          clearable
                          @change="updateBaseInfo('id')" />
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="elementBaseInfo.name"
                          clearable
                          @change="updateBaseInfo('name')" />
            </el-form-item>
            <!--流程的基础属性-->
            <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
                <el-form-item label="版本标签">
                    <el-input v-model="elementBaseInfo.versionTag"
                              clearable
                              @change="updateBaseInfo('versionTag')" />
                </el-form-item>
                <el-form-item label="流程分类">
                    <el-select v-model="elementBaseInfo.category" @change="updateBaseInfo('category')">
                        <el-option key="x" value="" label="无" />
                        <el-option v-for="v in allCate" :key="v.id" :value="v.name" :label="v.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="可执行">
                    <el-switch v-model="elementBaseInfo.isExecutable"
                               active-text="是"
                               inactive-text="否"
                               @change="updateBaseInfo('isExecutable')" />
                </el-form-item>
            </template>
            <el-form-item v-if="elementBaseInfo.$type === 'bpmn:SubProcess'"
                          label="状态">
                <el-switch v-model="elementBaseInfo.isExpanded"
                           active-text="展开"
                           inactive-text="折叠"
                           @change="updateBaseInfo('isExpanded')" />
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getAllCate } from './api'
export default {
    name: 'ElementBaseInfo',
    props: {
        // eslint-disable-next-line vue/require-default-prop
        businessObject: Object,
        // eslint-disable-next-line vue/require-default-prop
        type: String,
        idEditDisabled: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            elementBaseInfo: { },
            allCate: [],
            category: ''
        }
    },
    watch: {
        businessObject: {
            immediate: false,
            handler: function(val) {
                if (val) {
                    this.$nextTick(() => this.resetBaseInfo())
                }
            }
        }
    },
    beforeDestroy() {
        this.bpmnElement = null
    },
    async created() {
        const { data } = await getAllCate()
        this.allCate = data.list
    },
    methods: {
        resetBaseInfo() {
            this.bpmnElement = window.bpmnInstances.bpmnElement
            this.elementBaseInfo = JSON.parse(JSON.stringify(this.bpmnElement.businessObject))
            if (this.elementBaseInfo && this.elementBaseInfo.$type === 'bpmn:SubProcess') {
                this.$set(this.elementBaseInfo, 'isExpanded', this.elementBaseInfo.di.isExpanded)
            }
            const category = this.elementBaseInfo.category ? this.elementBaseInfo.category : ''
            window.bpmnInstances.modeler.getDefinitions().set('targetNamespace', category)
        },
        updateBaseInfo(key) {
            if (key === 'id') {
                window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
                    id: this.elementBaseInfo[key],
                    di: { id: `${this.elementBaseInfo[key]}_di` }
                })
                return
            }
            if (key === 'isExpanded') {
                window.bpmnInstances.modeling.toggleCollapse(this.bpmnElement)
                return
            }
            const attrObj = Object.create(null)
            attrObj[key] = this.elementBaseInfo[key]
            window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj)
        }
    }
}
</script>
