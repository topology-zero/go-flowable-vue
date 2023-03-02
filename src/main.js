import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import permission from '@/directive/permission/index'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'

import formCreate from '@form-create/element-ui'
import FcDesigner from '@form-create/designer'

Vue.use(ElementUI)
Vue.use(permission)
Vue.use(formCreate)
Vue.use(FcDesigner)

Vue.config.productionTip = false
permission.install(Vue)

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
