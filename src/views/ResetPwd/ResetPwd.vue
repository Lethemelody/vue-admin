<template>
	<div :class="[curTheme]">
		<div class="resetpwd-page">
			<div class="resetpwd-header flex">
				<div class="logo">
					<img :src="logoImage" />
				</div>
				<div class="system-name">{{systemName}}</div>
				<div class="flex-item"></div>
				<div class="btns">
					<router-link class="login-btn" to="/SpecLogin">返回登录</router-link>
				</div>
			</div>
			<div class="resetpwd-content">
				<div>
					<div class="tabs flex">
						<div class="flex-item"></div>
						<div class="flex">
							<div class="tab-item " :class="{'tab-item-selected':curTab == 1}" @click="changeTab(1)">手机找回</div>
							<div class="tab-item-split"></div>
							<div class="tab-item " :class="{'tab-item-selected':curTab == 2}" @click="changeTab(2)">邮箱找回</div>
						</div>
						<div class="flex-item"></div>
					</div>
					<div class="tab-contents">
						<PhoneResetPwd :lineHeight="lineHeight" v-if="curTab == 1"></PhoneResetPwd>
						<EmailResetPwd :lineHeight="lineHeight" v-if="curTab == 2"></EmailResetPwd>
					</div>
				</div>
			</div>
			<div class="resetpwd-footer">
				版权：{{systemCopyright}}
			</div>
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

	import EmailResetPwd from "./components/EmailResetPwd.vue";
	import PhoneResetPwd from "./components/PhoneResetPwd.vue";

	const lineHeight = config.resetPwd.lineHeight; //输入行高
	const bgColor = config.resetPwd.bgColor; //背景色

	//logo图片路径
	const logoImage = new URL("../../assets/logo.png",
		import.meta.url).href;
		
	let curTab = ref(1);
	
	const changeTab = (index)=>{
		curTab.value = index;
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
	.theme-default .resetpwd-page {
		background: v-bind(bgColor);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.theme-default .resetpwd-page .resetpwd-header {
		height: 60px;
		padding: 0 1%;
	}

	.theme-default .resetpwd-page .resetpwd-header .logo {
		height: 100%;
		justify-content: center;
		justify-items: center;
		vertical-align: middle;
		align-items: center;
		display: flex;
	}

	.theme-default .resetpwd-page .resetpwd-header .logo img {
		height: 60%;
	}

	.theme-default .resetpwd-page .resetpwd-header .system-name {
		line-height: 60px;
		margin-left: 10px;
		font-size: 24px;
		letter-spacing: 5px;
		background-image: -webkit-linear-gradient(right, red, #ff5722, #ff9800);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.theme-default .resetpwd-page .resetpwd-header .btns {
		justify-content: center;
		justify-items: center;
		vertical-align: middle;
		align-items: center;
		display: flex;
	}

	.theme-default .resetpwd-page .resetpwd-header .login-btn {
		text-decoration: none;
		color: #fff;
		font-size: 14px;
		line-height: 35px;
		height: 35px;
		width: 100px;
		text-align: center;
		border-radius: 1px;
	}

	.theme-default .resetpwd-page .resetpwd-header .login-btn:hover {
		background: #00000055;
	}

	.theme-default .resetpwd-page .resetpwd-content {
		width: calc(70% - 60px);
		min-width: 800px;
		margin: 0 auto;
		height: calc((100% - 60px - 4vh - 60px) * 0.8);
		background-color: #fff;
		margin-top: calc((100% - 60px - 4vh - 60px) * 0.05);
		border-radius: 5px;
		box-shadow: 0 0 15px #00000055;
		padding: 30px;
	}

	.theme-default .resetpwd-page .resetpwd-content .tabs {
		text-align: center;
		height: v-bind(lineHeight);
		line-height: v-bind(lineHeight);
		border-radius: 5px;
	}

	.theme-default .resetpwd-page .resetpwd-content .tabs .tab-item {
		width: 250px;
		color: #222;
		background: #d7d7d7;
		user-select: none;
		cursor: pointer;
	}
	
	.theme-default .resetpwd-page .resetpwd-content .tabs .tab-item:hover,
	.theme-default .resetpwd-page .resetpwd-content .tabs .tab-item-selected {
		color: #fff;
		background: #2196f3;
	}

	.theme-default .resetpwd-page .resetpwd-content .tabs .tab-item:first-child {
		border-bottom-left-radius: 5px;
		border-top-left-radius: 5px;
	}

	.theme-default .resetpwd-page .resetpwd-content .tabs .tab-item:last-child {
		border-bottom-right-radius: 5px;
		border-top-right-radius: 5px;
	}

	.theme-default .resetpwd-page .resetpwd-content .tabs .tab-item-split {
		width: 1px;
		height: v-bind(lineHeight);
		background: #00000055;
	}
	
	.theme-default .resetpwd-page .resetpwd-content .tab-contents{
		padding:50px 0;
	}

	.theme-default .resetpwd-page .resetpwd-footer {
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
