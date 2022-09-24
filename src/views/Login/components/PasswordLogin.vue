<template>
	<el-form ref="loginForm" :model="loginFormData" :label-width="0" :rules="rules" status-icon autocomplete="off"
		class="formPanel" :class="[curTheme]">
		<el-form-item label="" prop="username">
			<el-input prefix-icon="Avatar" :autocomplete="false" v-model="loginFormData.username"
				placeholder="请输入用户名" />
		</el-form-item>
		<el-form-item label="" prop="password">
			<el-input type="password" autocomplete="new-password" prefix-icon="Unlock" v-model="loginFormData.password"
				placeholder="请输入密码" />
		</el-form-item>
		<div class="flex">
			<div class="flex-item">
				<el-form-item label="" prop="code">
					<el-input autocomplete="new-password" prefix-icon="Picture" v-model="loginFormData.code"
						placeholder="请输入验证码" @click="changeCode" />
				</el-form-item>
			</div>
			<div class="code">
				<vcode></vcode>
			</div>
		</div>
		<div class="check-line">
			<div>
				<el-form-item label="">
					<el-checkbox v-model="loginFormData.rememberUserName" label="记住用户名" size="large" />
				</el-form-item>
			</div>
			<div class="line-item"></div>
			<div>
				<el-form-item label="">
					<el-checkbox v-model="loginFormData.rememberPassword" label="记住密码" size="large" />
				</el-form-item>
			</div>
			<div class="line-item"></div>
			<div>
				<router-link to="/ResetPwd" class="resetPassword">找回密码</router-link>
			</div>
		</div>
		<el-form-item>
			<el-button type="danger" @click="onSubmit">登录</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup>
	import {
		ref,
		reactive,
		defineProps,
		onMounted
	} from "vue";

	import {
		useStore
	} from "vuex";

	import {
		useRouter,
		useRoute
	} from 'vue-router'

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";
	import config from "@/store/config.js";
	import vcode from "@/components/vcode.vue";

	let curTheme = config.curTheme;

	//传递的参数
	const option = defineProps({
		lineHeight: {
			type: String,
			required: true
		},
		textColor: {
			type: String,
			default: '#222',
			required: false
		}
	})

	// 登录表单数据
	const loginFormData = reactive({
		username: '',
		password: '',
		code: '',
		rememberUserName: false,
		rememberPassword: false
	});
	const loginForm = ref();
	const rules = reactive({
		username: [{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}],
		code: [{
			required: true,
			message: '请输入验证码',
			trigger: 'blur'
		}],
		password: [{
			required: true,
			message: '请输入密码',
			trigger: 'blur'
		}],
	})

	let store = useStore();
	const router = useRouter()
	const route = useRoute()

	//登录操作
	const onSubmit = () => {
		loginForm.value.validate((valid, fields) => {
			if (!valid) {
				if (fields) {
					for (let key in fields) {
						utils.showError(fields[key][0].message);
					}
				}
				return;
			}
			utils.saveData("rememberUserName", loginFormData.rememberUserName);
			utils.saveData("rememberPassword", loginFormData.rememberPassword);
			utils.saveData("username", loginFormData.username);
			utils.saveData("password", loginFormData.password);
			//TODO 调用登录接口进行登录
			utils.showLoadding();
			api.post("/api/login", JSON.stringify({
				username: loginFormData.username,
				password: loginFormData.password,
				code: loginFormData.code,
			})).then((res) => {
				utils.hideLoadding();
				if (!res || res.status != 200 || !res.data || res.data.code != 888) {
					if (res.data && res.data.message) {
						utils.showError(res.data.message);
					} else {
						utils.showError("登录失败！");
					}
					return;
				}
				//1.将传递过来的token进行本次存储及vuex存储
				let token = res.data.token;
				//使用vuex
				store.commit('setToken', token);

				//2.将当前登录的用户信息进行本地及vuex存储
				let userinfo = res.data.data;
				store.commit('setUserInfo', userinfo);
				
				//转到主页
				router.push({
					path: "/Index/Home"
				});
			}).catch(function(error) {
				utils.hideLoadding();
				utils.showError("登录失败！");
			});
		});
	}

	onMounted(() => {
		loginFormData.rememberUserName = utils.getData("rememberUserName") === 'true' ? true : false;
		loginFormData.rememberPassword = utils.getData("rememberPassword") === 'true' ? true : false;
		if (loginFormData.rememberUserName) {
			loginFormData.username = utils.getData("username");
		} else {
			loginFormData.username = "";
		}
		if (loginFormData.rememberPassword) {
			loginFormData.password = utils.getData("password");
		} else {
			loginFormData.password = "";
		}
	});
</script>

<style scoped="scoped">
	.theme-default .formPanel:deep(.el-input__prefix-inner) {
		color: #000;
		font-size: 20px;
	}

	.theme-default .formPanel:deep(.el-form-item) {
		margin-bottom: 30px;
	}

	.theme-default .formPanel:deep(.el-checkbox__label) {
		color: v-bind(option.textColor);
	}

	.theme-default .formPanel:deep(.el-form-item__error) {
		height: 3vh;
		line-height: 3vh;
	}

	.theme-default .formPanel:deep(.el-form-item__label) {
		line-height: v-bind(option.lineHeight);
		height: v-bind(option.lineHeight);
	}

	.theme-default .formPanel:deep(.el-form-item__content),
	.theme-default .formPanel:deep(.el-input__inner) {
		line-height: v-bind(option.lineHeight);
		height: v-bind(option.lineHeight);
	}

	.theme-default .formPanel>>>input {
		background: #fff !important;
	}

	.theme-default .formPanel .check-line {
		display: flex;
	}

	.theme-default .formPanel .check-line .line-item {
		flex: 1;
	}

	.theme-default .formPanel>>>.el-button {
		width: 100%;
		line-height: v-bind(option.lineHeight);
		height: v-bind(option.lineHeight);
		border-radius: v-bind(option.lineHeight);
	}

	.theme-default .formPanel .code {
		width: 110px;
		height: calc(v-bind(option.lineHeight) + 2px);
		padding-left: 10px;
		cursor: pointer;
	}

	.theme-default .formPanel .resetPassword {
		line-height: v-bind(option.lineHeight);
		height: v-bind(option.lineHeight);
		text-decoration: none;
		color: #f44336;
		font-size: 14px;
	}
</style>
