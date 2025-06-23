<template>
	<div class="layout-container">
		<el-container direction="horizontal">
			<el-aside :width=" slideWidth ">
				<el-header class="logo-box flex">
					<div class="flex-item logo" v-if=" !isCollapse ">{{ systemName }}</div>
					<div class="menu-expand-btn" :class=" { 'menu-close-btn': isCollapse } ">
						<el-icon @click=" colseMenu " v-if=" isCollapse ">
							<Expand />
						</el-icon>
						<el-icon @click=" expandMenu " v-else>
							<Fold />
						</el-icon>
					</div>
				</el-header>
				<MenuBar ref="menuBar" class="el-menu-vertical" :isCollapse=" isCollapse "
					@openPage=" openPage ">
				</MenuBar>
			</el-aside>
			<el-container direction="vertical">
				<el-main>
					<el-tabs v-model=" cutTab " class="tabs"  @tab-change=" tabChange " 
						@tab-remove=" removeTab ">
						<el-tab-pane v-for="item in tabDatas" :key=" item.url " :label=" item.name " 
							:name=" item.url " :closable="item.id > 1" >
							<template #label>
								<span class="custom-tabs-label">
									<el-icon>
										<component :is=" item.icon "></component>
									</el-icon>
									<span>{{ item.name }}</span>
								</span>
							</template>
							<component v-if=" cutTab == item.url "
								:is=" item.compomemt ? components[item.compomemt] : null " />
						</el-tab-pane>
						<!-- <router-view class="page" v-slot="{ Component, route }">
							<keep-alive>
								<component :is="Component" />
							</keep-alive>
						</router-view> -->
					</el-tabs>
				</el-main>

				<el-header class="main-header">
					<div class="flex">
						<div class="flex-item"></div>
						<ToolBar :headerHeight=" headerHeight " @showMsg=" showMsg "
							@screen=" handleScreen " @refresh=" handleRefresh ">
						</ToolBar>
					</div>
				</el-header>
			</el-container>
		</el-container>
	</div>
</template>

<script setup>
import {
	ref,
	reactive,
	onMounted,
	onUnmounted,
	defineAsyncComponent
} from 'vue'

import utils from "@/utils/utils.js";
import config from "@/store/config.js";

//动态菜单组件
import MenuBar from "./components/MenuBar.vue";
//工具栏组件
import ToolBar from "./components/ToolBar.vue";

import {
	useStore
} from "vuex";

let store = useStore();
//当前用户信息
const userinfo = store.getters.getUserInfo;

let curTheme = config.curTheme;
let systemName = config.systemName;
let systemCopyright = config.systemCopyright;

//标识右侧菜单的展开与收取状态
let isCollapse = ref( false );
let slideWidth = ref( "250px" );
let headerHeight = ref( "60px" );

//展开菜单
const expandMenu = () => {
	isCollapse.value = true;

	slideWidth.value = "65px";
}
//收起菜单
const colseMenu = () => {
	isCollapse.value = false;
	slideWidth.value = "250px";
}

//当前打开的tab页
const tabDatas = reactive( [] );
const cutTab = ref( 0 );
//打开界面
const openPage = ( pama ) => {
	let has = false;
	tabDatas.forEach( ( item, index ) => {
		if ( pama.url == item.url ) {
			has = true;
		}
	} );
	if ( !has ) {
		tabDatas.push( pama );
	}
	cutTab.value = pama.url;
}
const removeTab = ( pama ) => {
	let curTab = null;
	let cutTabIndx = 0;
	tabDatas.forEach( ( item, index ) => {
		if ( pama == item.url ) {
			curTab = item;
			cutTabIndx = index;
		}
	} );
	if ( !curTab ) {
		return;
	}
	tabDatas.splice( cutTabIndx, 1 );
	if ( pama == cutTab.value ) {
		if ( tabDatas.length > cutTabIndx - 1 ) {
			cutTab.value = tabDatas[cutTabIndx - 1].url;
		} else {
			if ( tabDatas.length > 0 ) {
				cutTab.value = tabDatas[0].url;
			}
		}
	}
}

//菜单组件的实例
const menuBar = ref( null );

//展示消息界面
const showMsg = () => {
	menuBar.value.selectMenu( "/Index/data/msg" );
}

//全屏切换的事件
const handleScreen = () => {
	//TODO 
}
//刷新当前tab
const handleRefresh = () => {
	//TODO 
}
const tabChange = ( value ) => {
	menuBar.value.selectMenu_( value );
}

//界面组件集合
const components = reactive( {} );
const registerGlobalAsyncComponents = () => {
	const modules =
		import.meta.glob( '../**/*.vue' );
	for ( const path in modules ) {
		const result = path.match( /.*\/(.+).vue$/ );
		if ( result ) {
			const name = result[1];
			const component = modules[path];
			components[name] = defineAsyncComponent( component );
		}
	}
};
registerGlobalAsyncComponents();

//根据路径引入对应的组件
const getCompomemtByPath = ( path ) => {
	// return defineAsyncComponent( () =>
	// 	import( new URL(
	// 		"/src/views" + path,
	// 		import.meta.url ).href ) )
}
</script>

<style scoped="scoped">
.theme-default .layout-container:deep(.el-aside) {
  z-index: 1;
  height: 100vh;
  background: var(--el-bg-color);
  box-shadow: var(--el-box-shadow);
}


.theme-default .layout-container .logo {
  overflow: hidden;
  width: calc(v-bind(slideWidth) - var(--el-border-width));
  height: v-bind(headerHeight);
  padding: 0;
  font-size: 20px;
  line-height: v-bind(headerHeight);
  letter-spacing: 1px;
  text-align: center;
  background-image: -webkit-linear-gradient(right, red, #ff5722, #ff9800);

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.theme-default .layout-container .menu-expand-btn {
  font-size: 20px;
  line-height: v-bind(headerHeight);
  cursor: pointer;
}

.theme-default .layout-container .menu-close-btn {
  width: calc(v-bind(slideWidth) - var(--el-border-width));
  text-align: center;
}

.theme-default .layout-container .menu-expand-btn .el-icon {
  position: relative;
  top: 3px;
  color: var(--el-text-color-primary);
}

.theme-default .layout-container .menu-expand-btn:hover {
  color: #ff5722;
}

.theme-default .layout-container:deep(.el-menu) {
  border-right: none;
}

.theme-default .layout-container .el-menu-vertical {
  overflow-y: auto;
  height: calc(100vh - v-bind(headerHeight));
}

/*里面的代码可以根据自己需求去进行更改*/
/* 设置滚动条的样式 */
.theme-default .layout-container .el-menu-vertical::-webkit-scrollbar {
  width: 10px;
}

/* 滚动槽 */
.theme-default .layout-container .el-menu-vertical::-webkit-scrollbar-track {
  border-radius: 8px;

  -webkit-box-shadow: inset 0 0 6px var(--el-border-color-dark);
}

/* 滚动条滑块 */
.theme-default .layout-container .el-menu-vertical::-webkit-scrollbar-thumb {
  background: var(--el-border-color-darker);
  border-radius: 8px;

  -webkit-box-shadow: inset 0 0 6px var(--el-border-color-dark);
}

.theme-default .layout-container .el-menu-vertical::-webkit-scrollbar-thumb:window-inactive {
  background: var(--el-border-color-darker);
}


.theme-default .layout-container .main-header {
  position: fixed;
  top: 0;
  left: v-bind(slideWidth);
  width: calc(100% - v-bind(slideWidth));
  padding-right: 10px;
  padding-left: 10px;
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
}

.theme-default .layout-container :deep(.el-main) {
  height: calc(100vh - v-bind(headerHeight));
  padding: 0;
  background: var(--el-bg-color-page);
}

.theme-default .layout-container :deep(.el-tabs__header) {
  height: v-bind(headerHeight);
  margin-right: 280px;
  margin-bottom: 0;
  margin-left: 10px;
  line-height: v-bind(headerHeight);
  
}

.theme-default .layout-container :deep(.el-tabs__header) {
  height: v-bind(headerHeight);
  margin-right: 280px;
  margin-bottom: 0;
  margin-left: 10px;
  line-height: v-bind(headerHeight);
  
}


.theme-default .layout-container :deep(.custom-tabs-label .el-icon) {
  position: relative;
  top: 1px;
  margin-right: 5px;
}

.theme-default .layout-container :deep(.el-tabs__item) {
  height: v-bind(headerHeight);
  line-height: v-bind(headerHeight);
}

.theme-default .layout-container :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.theme-default .layout-container :deep(.is-icon-close) {
  position: relative;
  top: 3px;
}

.theme-default .layout-container :deep(#tab-1 .is-icon-close) {
  display: none;
}

/* .theme-default .layout-container :deep(.el-tab-pane) {
		display: none;
	} */

.theme-default .layout-container :deep(.el-tabs__nav-prev){
	margin-top: 12px;
	font-size: 20px;
	margin-left: -5px;
	z-index: 9999;
	margin-right: 20px;
}

.theme-default .layout-container :deep(.el-tabs__nav-next){
	margin-top: 12px;
	font-size: 20px;
	margin-right: -5px;
	z-index: 9999;
}

.theme-default .layout-container :deep(.el-tabs__content),
.theme-default .layout-container :deep(.el-tab-pane),
.theme-default .layout-container :deep(.page) {
  height: calc(100vh - v-bind(headerHeight));
}




</style>
