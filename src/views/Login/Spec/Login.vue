<template i>
	<div class="login-page" :class="[curTheme]">
		<div class="login-header">
		</div>
		<div class="login-panel">
			<div class="inner flex">
				<div class=" logo-panel">
					<div class="logo">
						<div class="title">{{systemName}}</div>
						<el-image :src="logoImage" class="logo-img"></el-image>
					</div>
				</div>
				<div class="v-split"></div>
				<div class="flex-item login-form">
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
						<PasswordLogin :lineHeight="lineHeight" v-if="tabCurIndex==1"></PasswordLogin>
						<CodeLogin :lineHeight="lineHeight" v-else-if="tabCurIndex==2"></CodeLogin>
						<QcordLogin :lineHeight="lineHeight" bgColor="#fff" v-else></QcordLogin>
					</div>
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
	let systemName = config.systemName;
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
		width: 800px;
		height: 450px;
		margin: 0 auto;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 0 30px #00000055;
	}

	.theme-default .login-page .logo-panel {
		border-bottom-left-radius: 10px;
		border-top-left-radius: 10px;
		padding-top: 80px;
		width: 45%;
	}

	.theme-default .login-page .logo-panel .title {
		line-height: 120px;
		font-size: 30px;
		letter-spacing: 5px;
		text-align: center;
		background-image: -webkit-linear-gradient(right, red, #ff5722, #ff9800);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.theme-default .login-page .logo-panel .logo {
		text-align: center;
	}

	.theme-default .login-page .logo-panel .logo :deep(.el-image__inner) {
		width: 130px;
		height: 130px;
	}

	.theme-default .login-page .v-split {
		width: 1px;
		height: 450px;
		background: linear-gradient(45deg, #f4433600, #f44336, #f4433600);
	}

	.theme-default .login-page .login-form {
		margin-left: 10px;
		padding: 0 20px;
	}

	.theme-default .login-page .login-panel .tabs {
		margin-top: 20px;
		font-size: 16px;
		letter-spacing: 5px;
		display: flex;
		text-align: center;
		height: v-bind(lineHeight);
		line-height: v-bind(lineHeight);
	}

	.theme-default .login-page .login-panel .tabs .tab-item {
		flex: 1;
		height: v-bind(lineHeight);
		line-height: v-bind(lineHeight);
		cursor: pointer;
		user-select: none;
	}

	.theme-default .login-page .login-panel .tabs .tab-item:hover {
		color: #ff5722;
	}

	.theme-default .login-page .login-panel .tabs .tab-split {
		width: 1px;
		height: v-bind(lineHeight);
		line-height: v-bind(lineHeight);
	}

	.theme-default .login-page .login-panel .tabs .tab-item-active {
		color: #ff5722;
	}

	.theme-default .login-page .login-panel .tabs .tab-item:first-child {
		border-bottom-left-radius: 5px;
		border-top-left-radius: 5px;
	}

	.theme-default .login-page .login-panel .tabs .tab-item:last-child {
		border-bottom-right-radius: 5px;
		border-top-right-radius: 5px;
	}


	.theme-default .login-page .login-panel .form {
		padding: 0 20px;
		margin-top: 20px;
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
