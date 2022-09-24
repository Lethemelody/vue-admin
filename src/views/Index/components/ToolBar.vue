<template>
	<div class="tools flex">
		<div class="flex-item tool-item" @click="handleSearch">
			<el-icon>
				<Search />
			</el-icon>
		</div>
		<div class="flex-item tool-item" @click="handleMsg">
			<el-icon>
				<BellFilled />
			</el-icon>
		</div>
		<div class="flex-item tool-item" @click="handleScreen">
			<el-icon>
				<component :is="screenIcon"></component>
			</el-icon>
		</div>
	<!-- 	<div class="flex-item tool-item" @click="handleRefresh">
			<el-icon>
				<RefreshRight />
			</el-icon>
		</div> -->
		<div class="flex-item tool-item" @click="handleChangeTheme">
			<el-icon>
				<component :is="themeIcon"></component>
			</el-icon>
		</div>
		<div class="flex-item tool-item userinfo-item">
			<el-dropdown @command="handleUserInfoMenu">
				<div class="el-dropdown-link flex">
					<div class="flex-item flex">
						<div>
							<el-icon>
								<User />
							</el-icon>
						</div>
						<div class="flex-item username">{{userinfo.name}}</div>
					</div>
					<div>
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</div>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="info">个人信息</el-dropdown-item>
						<el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
						<el-dropdown-item command="exit">退出系统</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>

	<!-- 搜索对话框 -->
	<SearchDialog ref="searchDialog"></SearchDialog>
	<!-- 搜索对话框 -->
	<ChangePwdDialog ref="changePwdDialog" @logout="logout"></ChangePwdDialog>
	<!-- 搜索对话框 -->
	<UserInfoDialog ref="userInfoDialog" @openEditDialog="openEditDialog"></UserInfoDialog>
	<!-- 搜索对话框 -->
	<UserFormDialog ref="userFormDialog" @reloadUserInfo="reloadUserInfo"></UserFormDialog>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from 'vue'
	import {
		useDark,
		useToggle
	} from '@vueuse/core'

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";
	import config from "@/store/config.js";

	import {
		useStore
	} from "vuex";

	import {
		useRouter,
		useRoute
	} from 'vue-router'

	const router = useRouter()
	const route = useRoute()

	import SearchDialog from "./SearchDialog.vue";
	import ChangePwdDialog from "./ChangePwdDialog.vue";
	import UserInfoDialog from "./UserInfoDialog.vue";
	import UserFormDialog from "./UserFormDialog.vue";
	//外部的参数
	const option = defineProps({
		//顶部栏的高度
		headerHeight: {
			type: String,
			required: true
		}
	})

	//打开消息界面
	const emits = defineEmits(['showMsg', 'screen', 'refresh']);

	let store = useStore();
	//当前用户信息
	const userinfo = store.getters.getUserInfo;

	let curTheme = config.curTheme;
	let systemName = config.systemName;
	let systemCopyright = config.systemCopyright;

	//全局搜索对话框
	const searchDialog = ref(null);
	//全局搜索
	const handleSearch = () => {
		searchDialog.value.show();
	}

	//打开消息通知界面
	const handleMsg = () => {
		emits('showMsg');
	}
	//界面全屏
	const screenIcon = ref('FullScreen');
	const handleScreen = () => {
		if (screenIcon.value == 'FullScreen') {
			let element = document.documentElement;
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			}
			screenIcon.value = 'Aim';

			emits('screen', true);
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
			screenIcon.value = 'FullScreen';

			emits('screen', false);
		}
	}

	//刷新界面
	const handleRefresh = () => {
		emits('refresh');
	};

	//暗黑色的切换
	const isDark = useDark()
	const toggleDark = useToggle(isDark)
	const themeIcon = ref('Sunny');
	const handleChangeTheme = () => {
		if (themeIcon.value == 'Sunny') {
			emits('changeTheme', 'dark');
			themeIcon.value = "Moon";
		} else {
			emits('changeTheme', '');
			themeIcon.value = "Sunny";
		}
		toggleDark();
	};

	//点击用户信息时的菜单事件处理
	const changePwdDialog = ref(null);
	const userInfoDialog = ref(null);
	const handleUserInfoMenu = (command) => {
		if (command == 'info') {
			userInfoDialog.value.show();
		} else if (command == 'changePwd') {
			changePwdDialog.value.show();
		} else {
			utils.confirm('确定要退出系统吗？', (res) => {
				if (res == 'cancel') {
					return;
				}
				//TODO 调用接口退出登录，退出登录后自动更新当前的登录状态并且切换到登录界面
				logout();
			});
		}
	}
	//打开编辑个人信息界面
	const userFormDialog = ref(null);
	const openEditDialog = () => {
		userFormDialog.value.show();
	}
	//重新加载当前登录用户的信息
	const reloadUserInfo = () => {
		api.get("/api/userinfo").then((res) => {
			if (!res || res.status != 200 || !res.data || res.data.code != 888) {
				store.commit("logout");
				router.replace({
					path: '/SpecLogin',
					query: {
						redirect: router.currentRoute.fullPath
					}
				});
				return;
			}
			//使用vuex
			store.commit('setUserInfo', res.data.data);
		}).catch(function(error) {
			store.commit("logout");
			router.replace({
				path: '/SpecLogin',
				query: {
					redirect: router.currentRoute.fullPath
				}
			});
		});
	}
	//退出登录事件处理
	const logout = () => {
		api.get("/api/logout").then((res) => {
			store.commit("logout");
			router.replace({
				path: '/SpecLogin',
				query: {
					redirect: router.currentRoute.fullPath
				}
			});
		}).catch(function(error) {
			store.commit("logout");
			router.replace({
				path: '/SpecLogin',
				query: {
					redirect: router.currentRoute.fullPath
				}
			});
		});
	}
</script>

<style scoped>
	.theme-default .layout-container .el-header .tools {
		text-align: center;
	}

	.theme-default .layout-container .el-header .tools .tool-item {
		font-size: 16px;
		line-height: v-bind(headerHeight);
		height: v-bind(headerHeight);
		cursor: pointer;
		width: 40px
	}

	.theme-default .layout-container .el-header .tools .tool-item:hover {
		color: #ff5722;
	}

	.theme-default .layout-container .el-header .tools .tool-item:hover:deep(.el-dropdown-link) {
		color: #ff5722;
	}

	.theme-default .layout-container .el-header .tools .userinfo-item {
		width: 100px;
		line-height: v-bind(headerHeight);
		padding: 0 5px;
	}

	.theme-default .layout-container .el-header .tools .userinfo-item:deep(.el-dropdown-link) {
		line-height: v-bind(headerHeight);
	}

	.theme-default .layout-container .el-header .tools .userinfo-item:deep(.username) {
		font-size: 14px;
		margin-left: 5px;
	}
</style>
