<template>
    <div class="flowable">
        <div class="container">
            <div ref="canvas"
                 class="bpmn-canvas" />
            <el-button-group class="preview-btn">
                <el-button size="mini"
                           type="success"
                           @click="preview()">预览XML</el-button>
            </el-button-group>
            <el-button-group class="save-btn">
                <el-button size="mini"
                           type="success"
                           @click="$router.push('/flow/list')">返回</el-button>
                <el-button size="mini"
                           type="success"
                           @click="save()">保存</el-button>
            </el-button-group>
        </div>
        <my-propertise-panel class="process-panel"
                             :bpmn-modeler="bpmnModeler" />
        <el-dialog :visible.sync="showDialog"
                   title="预览">
            <pre class="codeview">{{ xmlStr }}</pre>
            <div slot="footer">
                <el-button type="primary"
                           @click="showDialog = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

// 右侧编辑区
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'

// 标签解析 Moddle
import flowableModdleDescriptor from '@/components/flow/designer/plugins/descriptor/flowableDescriptor.json'

// 标签解析 Extension
import flowableModdleExtension from '@/components/flow/designer/plugins/extension-moddle/flowable'

import defaultXml from './defaultXml'

// 翻译方法
import customTranslate from './customTranslate'
import translationsCN from './zh'

// 自定义 panel
import MyPropertiesPanel from '@/components/flow/penal/PropertiesPanel'
import '@/components/flow/theme/process-panel.scss'

import { add, detail } from './api'
export default {
    name: 'Flow',
    components: {
        'my-propertise-panel': MyPropertiesPanel
    },
    data() {
        return {
            bpmnModeler: null,
            canvas: null,
            showDialog: false,
            xmlStr: '',
            proccesId: this.$route.query.id,
            name: ''
        }
    },
    // 生命周期钩子，在组件加载完成后调用init函数进行创建初始化Bpmn-js建模器
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            // 获取画布 element
            this.canvas = this.$refs.canvas
            // 创建Bpmn对象
            this.bpmnModeler = new BpmnModeler({
                // 设置bpmn的绘图容器为上门获取的画布 element
                container: this.canvas,
                keyboard: {
                    bindTo: window
                },
                // // 加入工具栏支持
                // propertiesPanel: {
                //     parent: '#js-properties-panel'
                // },
                additionalModules: [
                    // propertiesProviderModule,
                    // propertiesPanelModule,
                    flowableModdleExtension,
                    { translate: ['value', customTranslate(translationsCN)] }
                ],
                moddleExtensions: {
                    // camunda: camundaModdleDescriptor,
                    flowable: flowableModdleDescriptor
                }
            })

            // 初始化建模器内容
            let xml = defaultXml()
            if (this.proccesId) {
                const { data } = await detail(this.proccesId)
                this.name = data.name
                xml = data.xml
            }

            this.initDiagram(xml)
        },
        async initDiagram(bpmn) {
            // 将xml导入Bpmn-js建模器
            await this.bpmnModeler.importXML(bpmn)
        },
        async save() {
            const { xml } = await this.bpmnModeler.saveXML({ format: true })
            let name = ''
            const category = ''
            // this.bpmnModeler.get('elementRegistry').forEach(v => {
            //     if (v.businessObject && v.businessObject.category) {
            //         category = v.businessObject.category
            //     }
            // })
            if (this.proccesId) {
                // 更新
                name = this.name
            } else {
                // 保存
                name = `业务流程_${new Date().getTime()}`
            }

            const { data } = await add({
                fileName: name,
                category: category,
                xml: xml
            })
            if (!this.proccesId) {
                this.$router.push('/flow/flow?id=' + data.id)
            }
            this.$message.success('保存成功')
        },
        async preview() {
            this.showDialog = true
            const { xml } = await this.bpmnModeler.saveXML({ format: true })
            this.xmlStr = xml
        }
    }
}
</script>

<style lang="scss" scoped>
.flowable {
    display: flex;
    width: 100%;
    height: calc(100vh - 84px);
    .container {
        width: 100%;
        flex: 1;
        background: white;
        overflow: auto;
        background-image: linear-gradient(
                90deg,
                rgba(220, 220, 220, 0.5) 6%,
                transparent 0
            ),
            linear-gradient(rgba(192, 192, 192, 0.5) 6%, transparent 0);
        background-size: 12px 12px;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        position: relative;
    }
    .bpmn-canvas {
        height: 100%;
    }

    ::v-deep .djs-palette {
        top: 50%;
        transform: translateY(-50%);
    }

    .action {
        position: fixed;
        bottom: 10px;
        left: 10px;
        display: flex;
    }
    .upload-demo {
        margin-right: 10px;
    }

    .bpmn-js-properties-panel {
        position: absolute;
        top: 0;
        right: 0px;
        width: 300px;
    }

    .save-btn {
        position: absolute;
        right: 20px;
        top: 20px;
    }

    .preview-btn {
        position: absolute;
        left: 20px;
        top: 20px;
    }

    .codeview {
        overflow: scroll;
        background: #000;
        color: #fff;
        padding: 10px;
    }
}
</style>
