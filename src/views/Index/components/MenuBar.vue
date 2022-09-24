<template>
	<el-menu :default-active="curMenu" router :collapse="isCollapse" :collapse-transition="false" @select="selectMenu">
		<template v-for="(item,index) in menuData" :key="item.id">
			<el-menu-item v-if="!item.children || item.children.length<=0" :index="item.url">
				<el-icon>
					<component :is="item.icon"></component>
				</el-icon>
				<template #title>{{item.name}}</template>
			</el-menu-item>
			<el-sub-menu v-else :index="item.url">
				<template #title>
					<el-icon>
						<component :is="item.icon"></component>
					</el-icon>
					<span>{{item.name}}</span>
				</template>

				<template v-for="(subitem,subindex) in item.children" :key="subitem.id">
					<el-menu-item :index="subitem.url">
						<el-icon>
							<component :is="subitem.icon"></component>
						</el-icon>
						<template #title>{{subitem.name}}</template>
					</el-menu-item>
				</template>
			</el-sub-menu>
		</template>
	</el-menu>
</template>

<script setup>
	import {
		ref,
		nextTick,
		reactive,
		onMounted,
		onUnmounted,
		defineAsyncComponent
	} from 'vue'

	import {
		useRouter,
		useRoute
	} from 'vue-router'

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";


	import Index from "@/views/Index/Index.vue";
	import Home from "@/views/HomePage/HomePage.vue";

	//传递的参数
	const option = defineProps({
		isCollapse: {
			type: Boolean,
			required: true
		}
	})

	//自定义事件
	const emits = defineEmits(['openPage']);

	//菜单数据
	const menuData = reactive([]);

	//路由数据
	const router = useRouter()
	const route = useRoute()

	//当前打开的menu
	const curMenu = ref(0);

	onMounted(() => {
		loadMenu();
	});

	//加载菜单数据
	const loadMenu = () => {
		utils.showLoadding();
		api.get("/api/menu").then((res) => {
			utils.hideLoadding();
			if (!res || res.status != 200 || !res.data || res.data.code != 888) {
				if (res.data && res.data.message) {
					utils.showError(res.data.message);
				} else {
					utils.showError("加载失败！");
				}
				return;
			}
			menuData.splice(0, menuData.length - 1);
			menuData.push(...res.data.data);

			//将菜单数据动态添加到路由中进行注册
			let indexChildrens = [];
			menuData.forEach((item, index) => {
				let routerItem = {
					name: item.url,
					path: item.url,
					meta: {
						requireAuth: item.requireAuth, // 该路由项需要权限校验
					},
					children: []
				};
				if (item.children && item.children.length > 0) {
					item.children.forEach((subitem, subindex) => {
						routerItem.children.push({
							name: subitem.url,
							path: subitem.url,
							meta: {
								requireAuth: subitem.requireAuth, // 该路由项需要权限校验
							}
						});
					});
				}
				indexChildrens.push(routerItem);
			})
			router.addRoute({
				name: "系统主页",
				path: '/Index',
				meta: {
					requireAuth: true, // 该路由项需要权限校验
				},
				component: Index,
				children: indexChildrens
			});

			nextTick(() => {
				//TODO 判断当前的路由路径是否有值，有值则取当前的路由，没有的时候自动选中第一个
				if (menuData.length > 0) {
					selectMenu(menuData[0].url);
				}

				curMenu.value = router.currentRoute.value.path;
				selectMenu(curMenu.value);
			})
		}).catch(function(error) {
			debugger
			utils.hideLoadding();
			utils.showError("加载失败！");
		});
	}

	//选中菜单事件
	const selectMenu = (key, keyPath) => {
		emits('openPage', selectMenu_(key, keyPath));
	}

	const selectMenu_ = (key, keyPath) => {
		let curMenuData = null;
		menuData.forEach((item, index) => {
			if (item.children && item.children.length > 0) {
				item.children.forEach((subitem, subndex) => {
					if (subitem.url == key) {
						curMenuData = subitem;
					}
				});
			} else {
				if (item.url == key) {
					curMenuData = item;
				}
			}
		});
		if (curMenuData) {
			curMenu.value = curMenuData.url;
			router.push({
				path: curMenu.value
			});
		}
		return curMenuData;
	}

	defineExpose({
		selectMenu,
		selectMenu_
	})
</script>

<style scoped>

</style>
