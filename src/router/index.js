import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: '首页', icon: 'dashboard' }
        }]
    },

    {
        path: '/admin',
        component: Layout,
        redirect: '/admin/user',
        name: 'admin',
        permission: 'admin',
        meta: { title: '后台管理', icon: 'el-icon-s-help' },
        children: [

            // 用户相关
            {
                path: 'user',
                name: 'user',
                permission: 'admin:user',
                component: () => import('@/views/admin/user/index'),
                meta: { title: '用户管理', icon: 'table' }

            },

            // 角色相关
            {
                path: 'role',
                name: 'role',
                permission: 'admin:role',
                component: () => import('@/views/admin/role/index'),
                meta: { title: '角色管理', icon: 'tree' }
            },

            // 权限相关
            {
                path: 'auth',
                name: 'auth',
                permission: 'admin:auth',
                component: () => import('@/views/admin/auth/index'),
                meta: { title: '权限管理', icon: 'tree' }
            }
        ]
    },

    {
        path: '/generate',
        hidden: process.env.ENV == 'prod',
        component: Layout,
        redirect: '/generate/generate',
        name: 'generate',
        meta: { title: '代码生成', icon: 'el-icon-s-help' },
        children: [
            {
                path: 'generate',
                name: 'generate:generate',
                component: () => import('@/views/generate/index'),
                meta: { title: '代码生成', icon: 'el-icon-s-help' }

            }
        ]
    },

    {
        path: '/flow',
        component: Layout,
        redirect: '/flow/cate',
        name: 'flow',
        meta: { title: '工作流', icon: 'el-icon-s-help' },
        children: [
            {
                path: 'cate',
                name: 'flowcate',
                component: () => import('@/views/flow/cate/index'),
                meta: { title: '流程分类', icon: 'table' }
            },
            {
                path: 'list',
                name: 'flowlist',
                component: () => import('@/views/flow/index/index'),
                meta: { title: '流程列表', icon: 'table' }
            },
            {
                path: 'flow',
                name: 'flowflow',
                hidden: true,
                component: () => import('@/views/flow/flow/flow'),
                meta: { title: '流程设计', icon: 'table' }
            },
            {
                path: 'form',
                name: 'flowform',
                component: () => import('@/views/flow/form/index'),
                meta: { title: '外置表单', icon: 'table' }
            },
            {
                path: 'formdetail',
                name: 'formdetail',
                hidden: true,
                component: () => import('@/views/flow/form/detail/index'),
                meta: { title: '表单设计', icon: 'table' }
            }
        ]
    },
    {
        path: '/task',
        component: Layout,
        redirect: '/task/cate',
        name: 'task',
        meta: { title: '任务管理', icon: 'el-icon-s-help' },
        children: [
            {
                path: 'alltask',
                name: 'alltask',
                component: () => import('@/views/proc_inst/index'),
                meta: { title: '全部流程', icon: 'table' }
            },
            {
                path: 'mytask',
                name: 'mytask',
                component: () => import('@/views/task/my/index'),
                meta: { title: '我的任务', icon: 'table' }
            },
            {
                path: 'candidatetask',
                name: 'candidatetask',
                component: () => import('@/views/task/candidate/index'),
                meta: { title: '候选任务', icon: 'table' }
            }
        ]
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
