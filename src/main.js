import {
	createApp
} from 'vue'
import App from './App.vue'

// 引入echarts
import * as echarts from 'echarts'

//引入路由
import router from "./router/index.js";
//引入数据状态管理
import store from "./store/index.js";

//引入数据模拟mock相关代码
import './mock/index';

//引入elementplus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//默认主题
import "./styles/default.css";

const app = createApp(App);

app.use(ElementPlus, {
	locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}
app.use(router);
app.use(store);

app.mount('#app')
