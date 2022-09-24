<template>
	<div :class="[curTheme]">
		<el-steps :active="stepIndex" align-center>
			<el-step title="身份验证" description="验证用户名密码信息" />
			<el-step title="重置密码" description="重新设置密码" />
			<el-step title="找回成功" description="设置成功" />
		</el-steps>
		<el-form ref="loginForm" :model="loginFormData" :label-width="0" :rules="rules" status-icon autocomplete="off"
			class="formPanel" v-if="stepIndex == 1">
			<el-form-item label="" prop="phone">
				<el-input prefix-icon="Avatar" :autocomplete="false" v-model="loginFormData.phone"
					placeholder="请输入电话号码" />
			</el-form-item>
			<div class="flex">
				<div class="flex-item">
					<el-form-item label="" prop="smscode">
						<el-input autocomplete="new-password" prefix-icon="Unlock" v-model="loginFormData.smscode"
							placeholder="请输入短信验证码" />
					</el-form-item>
				</div>
				<div class="code">
					<el-button type="primary" @click="getSmsCode" class="smscode-btn" :disabled="isCodeIng">
						{{smsCodeBtnText}}
					</el-button>
				</div>
			</div>
			<div class="flex">
				<div class="flex-item">
					<el-form-item label="" prop="code">
						<el-input autocomplete="new-password" prefix-icon="Picture" v-model="loginFormData.code"
							placeholder="请输入验证码" @click="changeCode" />
					</el-form-item>
				</div>
				<div class="code">
					<vcode ref="vcodeRef"></vcode>
				</div>
			</div>
			<el-form-item>
				<el-button type="danger" @click="onSubmit">下一步</el-button>
			</el-form-item>
		</el-form>

		<ResetPwdForm v-else-if="stepIndex == 2" :sysmtetoken="sysmtetoken" @toNext="toSuccess" @toPre="toCodeForm">
		</ResetPwdForm>
		<ResetPwdSuccess v-else-if="stepIndex == 3"></ResetPwdSuccess>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from "vue";

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";
	import config from "@/store/config.js";
	import vcode from "@/components/vcode.vue";

	import ResetPwdForm from "./ResetPwdForm.vue";
	import ResetPwdSuccess from "./ResetPwdSuccess.vue";

	let curTheme = config.curTheme;

	const vcodeRef = ref();

	//当前到了第几步
	let stepIndex = ref(1);
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

	//标识是否正在获取短信验证码
	let isCodeIng = ref(false);
	//定时器
	let timer = null;
	//定时器的时间
	let curTime = ref(60);
	//获取验证码按钮的提示文字
	let smsCodeBtnText = ref("获取验证码");

	// 登录表单数据
	const loginFormData = reactive({
		phone: '',
		smscode: '',
		code: ''
	});
	const loginForm = ref();

	//账号验证完成后后台返回的标识
	let sysmtetoken = ref("");

	//密码规则的验证
	const validatePhone = (rule, value, callback) => {
		if (!utils.check.checkPhone(value)) {
			callback("电话号码不合法")
		} else {
			callback()
		}
	}

	const rules = reactive({
		phone: [{
				required: true,
				message: '请输入电话号码',
				trigger: 'blur'
			},
			{
				validator: validatePhone,
				trigger: 'blur'
			}
		],
		smscode: [{
			required: true,
			message: '请输入短信验证码',
			trigger: 'blur'
		}],
		code: [{
			required: true,
			message: '请输入验证码',
			trigger: 'blur'
		}],
	})

	//获取验证码
	const getSmsCode = () => {
		if (!loginFormData.phone) {
			utils.showError("电话号码不能为空！");
			return;
		}
		if (!loginFormData.code) {
			utils.showError("请先输入验证码");
			return;
		}
		isCodeIng.value = true;
		timer && clearInterval(timer);
		curTime.value = 60;
		timer = setInterval(() => {
			curTime.value--;
			smsCodeBtnText.value = curTime.value + "秒后重新获取";
			if (curTime <= 0) {
				isCodeIng.value = false;
				timer && clearInterval(timer);
				smsCodeBtnText.value = "获取验证码";
			}
		}, 1000);
		//TODO 请求后台获取短信验证码

	}

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
			utils.closeAllMsg();
			//TODO 调用接口验证电话号码和验证码是否匹配
			utils.showLoadding();
			api.post("/api/resetpwd/phone", JSON.stringify({
				phone: loginFormData.phone,
				smscode: loginFormData.smscode,
			})).then((res) => {
				utils.hideLoadding();
				if (!res || res.status != 200 || !res.data || res.data.code != 888) {
					if (res.data && res.data.message) {
						utils.showError(res.data.message);
					} else {
						utils.showError("验证失败！");
					}
					return;
				}
				sysmtetoken.value = res.data.token;

				stepIndex.value = 2;
			}).catch(function(error) {
				utils.hideLoadding();
				utils.showError("登录失败！");
			});
		});
	}

	//转到成功界面
	const toSuccess = () => {
		stepIndex.value = 3;
	}

	//转到成功界面
	const toCodeForm = function() {
		stepIndex.value = 1;
		this.nextTick(() => {
			vcodeRef.value.refresh();
		});
	}

	onMounted(() => {

	});

	onUnmounted(() => {
		timer && clearInterval(timer);
	});
</script>

<style scoped="scoped">
	.theme-default .formPanel {
		width: 45%;
		min-width: 400px;
		margin: 0 auto;
		margin-top: 50px;
	}

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

	.theme-default .formPanel:deep(input) {
		background: #fff !important;
	}

	.theme-default .formPanel .check-line {
		display: flex;
	}

	.theme-default .formPanel .check-line .line-item {
		flex: 1;
	}

	.theme-default .formPanel:deep(.el-button) {
		width: 100%;
		line-height: v-bind(option.lineHeight);
		height: v-bind(option.lineHeight);
		/* border-radius: v-bind(option.lineHeight); */
	}

	.theme-default .formPanel :deep(.smscode-btn) {
		width: calc(100% - 0px);
		line-height: v-bind(option.lineHeight);
		height: v-bind(option.lineHeight);
		margin-left: 0px;
		border-radius: 0;
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
