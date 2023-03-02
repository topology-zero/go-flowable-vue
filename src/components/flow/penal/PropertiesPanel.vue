<template>
    <div class="process-panel__container"
         :style="{ width: `${width}px` }">
        <el-collapse v-model="activeTab">
            <el-collapse-item name="base">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-info" />常规</div>
                <element-base-info :id-edit-disabled="idEditDisabled"
                                   :business-object="elementBusinessObject"
                                   :type="elementType" />
            </el-collapse-item>
            <el-collapse-item v-if="elementType === 'Process'"
                              key="message"
                              name="condition">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-s-comment" />消息与信号</div>
                <signal-and-massage />
            </el-collapse-item>
            <el-collapse-item v-if="conditionFormVisible"
                              key="condition"
                              name="condition">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-s-promotion" />流转条件</div>
                <flow-condition :business-object="elementBusinessObject"
                                :type="elementType" />
            </el-collapse-item>
            <el-collapse-item v-if="formVisible"
                              key="form"
                              name="condition">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-s-order" />表单</div>
                <element-form :id="elementId"
                              :type="elementType" />
            </el-collapse-item>
            <el-collapse-item v-if="elementType.indexOf('Task') !== -1"
                              key="task"
                              name="task">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-s-claim" />任务</div>
                <element-task :id="elementId"
                              :type="elementType" />
            </el-collapse-item>
            <el-collapse-item v-if="elementType.indexOf('Task') !== -1"
                              key="multiInstance"
                              name="multiInstance">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-s-help" />多实例</div>
                <element-multi-instance :business-object="elementBusinessObject"
                                        :type="elementType" />
            </el-collapse-item>
            <el-collapse-item key="listeners"
                              name="listeners">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-message-solid" />执行监听器</div>
                <element-listeners :id="elementId"
                                   :type="elementType" />
            </el-collapse-item>
            <el-collapse-item v-if="elementType === 'UserTask'"
                              key="taskListeners"
                              name="taskListeners">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-message-solid" />任务监听器</div>
                <user-task-listeners :id="elementId"
                                     :type="elementType" />
            </el-collapse-item>
            <el-collapse-item key="extensions"
                              name="extensions">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-circle-plus" />扩展属性</div>
                <element-properties :id="elementId"
                                    :type="elementType" />
            </el-collapse-item>
            <el-collapse-item key="other"
                              name="other">
                <div slot="title"
                     class="panel-tab__title"><i class="el-icon-s-promotion" />其他</div>
                <element-other-config :id="elementId" />
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
import ElementBaseInfo from './base/ElementBaseInfo'
import ElementOtherConfig from './other/ElementOtherConfig'
import ElementTask from './task/ElementTask'
import ElementMultiInstance from './multi-instance/ElementMultiInstance'
import FlowCondition from './flow-condition/FlowCondition'
import SignalAndMassage from './signal-message/SignalAndMessage'
import ElementListeners from './listeners/ElementListeners'
import ElementProperties from './properties/ElementProperties'
import ElementForm from './form/ElementForm'
import UserTaskListeners from './listeners/UserTaskListeners'
/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
export default {
    name: 'MyPropertiesPanel',
    components: {
        UserTaskListeners,
        ElementForm,
        ElementProperties,
        ElementListeners,
        SignalAndMassage,
        FlowCondition,
        ElementMultiInstance,
        ElementTask,
        ElementOtherConfig,
        ElementBaseInfo
    },
    componentName: 'MyPropertiesPanel',
    props: {
        bpmnModeler: Object,
        prefix: {
            type: String,
            default: 'flowable'
        },
        width: {
            type: Number,
            default: 480
        },
        idEditDisabled: {
            type: Boolean,
            default: false
        }
    },
    provide() {
        return {
            prefix: this.prefix,
            width: this.width
        }
    },
    data() {
        return {
            activeTab: 'base',
            elementId: '',
            elementType: '',
            elementBusinessObject: {}, // 元素 businessObject 镜像，提供给需要做判断的组件使用
            conditionFormVisible: false, // 流转条件设置
            formVisible: false // 表单配置
        }
    },
    watch: {
        elementId: {
            handler() {
                this.activeTab = 'base'
            }
        }
    },
    created() {
        this.initModels()
    },
    methods: {
        initModels() {
            // 初始化 modeler 以及其他 moddle
            if (!this.bpmnModeler) {
                // 避免加载时 流程图 并未加载完成
                this.timer = setTimeout(() => this.initModels(), 10)
                return
            }
            if (this.timer) clearTimeout(this.timer)
            window.bpmnInstances = {
                modeler: this.bpmnModeler,
                modeling: this.bpmnModeler.get('modeling'),
                moddle: this.bpmnModeler.get('moddle'),
                eventBus: this.bpmnModeler.get('eventBus'),
                bpmnFactory: this.bpmnModeler.get('bpmnFactory'),
                elementFactory: this.bpmnModeler.get('elementFactory'),
                elementRegistry: this.bpmnModeler.get('elementRegistry'),
                replace: this.bpmnModeler.get('replace'),
                selection: this.bpmnModeler.get('selection')
            }
            this.getActiveElement()
        },
        getActiveElement() {
            // 初始第一个选中元素 bpmn:Process
            this.initFormOnChanged(null)
            this.bpmnModeler.on('import.done', e => {
                this.initFormOnChanged(null)
            })
            // 监听选择事件，修改当前激活的元素以及表单
            this.bpmnModeler.on('selection.changed', ({ newSelection }) => {
                this.initFormOnChanged(newSelection[0] || null)
            })
            this.bpmnModeler.on('element.changed', ({ element }) => {
                // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
                if (element && element.id === this.elementId) {
                    this.initFormOnChanged(element)
                }
            })
        },
        // 初始化数据
        initFormOnChanged(element) {
            let activatedElement = element
            if (!activatedElement) {
                activatedElement =
                    window.bpmnInstances.elementRegistry.find(el => el.type === 'bpmn:Process') ??
                    window.bpmnInstances.elementRegistry.find(el => el.type === 'bpmn:Collaboration')
            }
            if (!activatedElement) return
            window.bpmnInstances.bpmnElement = activatedElement
            this.bpmnElement = activatedElement
            this.elementId = activatedElement.id
            this.elementType = activatedElement.type.split(':')[1] || ''
            this.elementBusinessObject = JSON.parse(JSON.stringify(activatedElement.businessObject))
            this.conditionFormVisible = !!(
                this.elementType === 'SequenceFlow' &&
                activatedElement.source &&
                activatedElement.source.type.indexOf('StartEvent') === -1
            )
            this.formVisible = this.elementType === 'UserTask' || this.elementType === 'StartEvent'
        },
        beforeDestroy() {
            window.bpmnInstances = null
        }
    }
}
</script>
