<template >
	<div class="login-page" :class="[curTheme]">
		<div class="login-header">
		</div>
		<div class="login-panel">
			<div class="inner">
				<div class="logo">
					<el-image :src="logoImage" class="logo-img"></el-image>
				</div>
				<div class="login-text">
					<!-- <div>用户登录</div> -->
					<div class="tabs">
						<div class="tab-item" @click="checkTab('1')" :class="{'tab-item-active':tabCurIndex==1}">
							密码登录
						</div>
						<div class="tab-split"></div>
						<div class="tab-item" @click="checkTab('2')" :class="{'tab-item-active':tabCurIndex==2}">
							免密登录
						</div>
						<div class="tab-split"></div>
						<div class="tab-item" @click="checkTab('3')" :class="{'tab-item-active':tabCurIndex==3}">
							扫码登录
						</div>
					</div>
				</div>
				<div class="form">
					<PasswordLogin :lineHeight="lineHeight" textColor="#fff" v-if="tabCurIndex==1"></PasswordLogin>
					<CodeLogin :lineHeight="lineHeight" textColor="#fff" v-else-if="tabCurIndex==2"></CodeLogin>
					<QcordLogin :lineHeight="lineHeight" textColor="#fff" v-else></QcordLogin>
				</div>
			</div>
		</div>
		<div class="login-footer">
			版权：{{systemCopyright}}
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from "vue";
	import {
		useDark,
		useToggle
	} from '@vueuse/core'

	import utils from "@/utils/utils.js";
	import config from "@/store/config.js";
	
	let curTheme = config.curTheme;
	let sysName = config.sysName;
	let systemCopyright = config.systemCopyright;


	import PasswordLogin from "../components/PasswordLogin.vue";
	import CodeLogin from "../components/CodeLogin.vue";
	import QcordLogin from "../components/QcordLogin.vue";

	const lineHeight = config.login.lineHeight; //输入行高
	const bgColor = config.login.bgColor; //背景色


	//logo图片路径
	const logoImage = new URL("../../../assets/logo.png",
		import.meta.url).href;


	const tabCurIndex = ref(1);
	const checkTab = (index) => {
		tabCurIndex.value = index;
	}
	
	//将主题色重置为白色主题
	const isDark = useDark()
	const toggleDark = useToggle(isDark)
	onMounted(()=>{
		if(isDark.value){
			toggleDark();
		}
	});
</script>

<style scoped="scoped">
	.theme-default .login-page {
		background: v-bind(bgColor);
		position: fixed;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
	}

	.theme-default .login-page .login-panel {
		justify-content: center;
		justify-items: center;
		vertical-align: middle;
		align-items: center;
		display: flex;
		height: 100vh;
	}

	.theme-default .login-page .login-panel .inner {
		width: 400px;
		height: 515px;
		margin: 0 auto;
	}

	.theme-default .login-page .login-panel .logo {
		text-align: center;
	}

	.theme-default .login-page .login-panel .logo .logo-img:deep(img) {
		width: 80px;
		height: 80px;
		border-radius: 100%;
		box-shadow: 0 0 10px #ffffff55;
	}

	.theme-default .login-page .login-panel .logo .logo-img:deep(img) {
		width: 80px;
		height: 80px;
		border-radius: 100%;
		background: #fff;
	}

	.theme-default .login-page .login-panel .login-text {
		height: v-bind(lineHeight);
		line-height: v-bind(lineHeight);
		text-align: center;
		color: #fff;
		margin: 20px 0;
	}

	.theme-default .login-page .login-panel .tabs {
		font-size: 16px;
		letter-spacing: 5px;
		display: flex;
		height: v-bind(lineHeight);
		border-radius: 6vh;
	}

	.theme-default .login-page .login-panel .tabs .tab-item {
		flex: 1;
		height: v-bind(lineHeight);
		cursor: pointer;
		user-select: none;
		background: rgba(0, 0, 0, 0.5);
	}
	.theme-default .login-page .login-panel .tabs .tab-split{
		width:1px;
		height: v-bind(lineHeight);
		background:rgba(255,255,255,0.5)
	}

	.theme-default .login-page .login-panel .tabs .tab-item-active {
		background: #ff9800;
	}

	.theme-default .login-page .login-panel .tabs .tab-item:first-child {
		border-bottom-left-radius: 5px;
		border-top-left-radius: 5px;
	}

	.theme-default .login-page .login-panel .tabs .tab-item:last-child {
		border-bottom-right-radius: 5px;
		border-top-right-radius: 5px;
	}

	.theme-default .login-page .login-footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 4vh;
		font-size: 14px;
		text-align: center;
		color: #fff
	}
</style>
