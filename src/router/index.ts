import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import NProgress from "nprogress";
import Cookies from "js-cookie";
Vue.use(VueRouter);
export const appRouter = {
    name: "main",
    path: "/",
    meta: {
        title: "数据服务"
    },
    redirect: "/data-source",
    component: () => import("@/components/layout/index"),
    children: [
        {
            path: "data-source",
            name: "data-source",
            meta: {
                icon: "data-source",
                title: "数据源",
                hideChildren: true
            },
            component: () => import("@/components/blank/index"),
            redirect: "/data-source/list",
            children: [
                {
                    name: "data-source-list",
                    path: "list",
                    meta: {
                        icon: "data-source",
                        title: "数据源列表"
                    },
                    component: () => import("@/views/data-source/index")
                    // component: DataSource
                },
                {
                    name: "sql-controler",
                    path: "sql/:id",
                    meta: {
                        icon: "data-source",
                        title: "SQL控制台"
                    },
                    component: () => import("@/views/sql-controler/index")
                    // component: SQLControler
                }
            ]
        },
        {
            name: "data-model",
            path: "data-model",
            meta: { title: "数据模型", icon: "data-model", hideChildren: true },
            redirect: "/data-model/list",
            component: () => import("@/components/blank/index"),
            children: [
                {
                    name: "data-model-list",
                    path: "list",
                    meta: {
                        icon: "data-model",
                        title: "数据模型列表"
                    },
                    component: () => import("@/views/data-model/index")
                    // component: DataModel
                },
                {
                    name: "data-model-add",
                    path: "add",
                    meta: {
                        icon: "data-model",
                        title: "新增数据模型"
                    },
                    component: () => import("@/views/data-model/add/index")
                    // component: DataModelAdd
                },
                {
                    name: "data-model-edit",
                    path: "edit/:id",
                    meta: {
                        icon: "data-model",
                        title: "编辑数据模型"
                    },
                    component: () => import("@/views/data-model/edit/index")
                    // component: DataModelEdit
                },
                {
                    name: "data-model-doc",
                    path: "doc/:id",
                    meta: {
                        icon: "data-model",
                        title: "查看接口文档"
                    },
                    component: () => import("@/views/data-model/mavonDoc/index")
                    // component: DataModelDoc
                }
            ]
        }
    ]
};
const routes: Array<RouteConfig> = [
    appRouter,
    {
        name: "login",
        path: "/login",
        meta: { title: "登录" },
        component: () => import("@/views/login/index")
    },
    {
        name: "500",
        path: "/500",
        component: () => import("@/views/errors/500")
    },
    {
        name: "403",
        path: "/403",
        component: () => import("@/views/errors/403")
    },
    {
        name: "404",
        path: "/*",
        component: () => import("@/views/errors/404")
    }
];

const router = new VueRouter({
    routes
});
router.beforeEach((to, from, next) => {
    let title = to.meta.title || "";
    NProgress.start();
    window.document.title = title;
    if (!Cookies.get("access_token") && to.name !== "login") {
        // 判断是否已经登录且前往的页面不是登录页
        next({ name: "login" });
    } else {
        next();
    }
});
router.afterEach(() => {
    NProgress.done();
});
export default router;
