// 1. 定义路由组件.
import {
	createRouter,
	createWebHashHistory
} from "vue-router";

// 登录界面
import NomalLogin from "../views/Login/Nomal/Login.vue";
import SpecLogin from "../views/Login/Spec/Login.vue";

//重置密码界面
import ResetPwd from "../views/ResetPwd/ResetPwd.vue";


//系统主页界面
import Index from "../views/Index/Index.vue";

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [{
	path: '/',
	redirect: '/Index/Home'
}, {
	name: "常用用户登录界面",
	path: '/nomalLogin',
	meta: {
		requireAuth: false, // 该路由项需要权限校验
	},
	component: NomalLogin
}, {
	name: "定制用户登录界面",
	path: '/SpecLogin',
	meta: {
		requireAuth: false, // 该路由项需要权限校验
	},
	component: SpecLogin
}, {
	name: "找回密码界面",
	path: '/ResetPwd',
	meta: {
		requireAuth: false, // 该路由项需要权限校验
	},
	component: ResetPwd
}, {
	name: "系统主页",
	path: '/Index/:path+',
	meta: {
		requireAuth: true, // 该路由项需要权限校验
	},
	component: Index
}]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
	// 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
	history: createWebHashHistory(),
	routes, // `routes: routes` 的缩写
})

export default router;
