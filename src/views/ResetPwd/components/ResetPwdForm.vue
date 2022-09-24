<template>
	<el-form ref="loginForm" :model="formData" :label-width="0" :rules="rules" status-icon autocomplete="off"
		class="formPanel" :class="[curTheme]">
		<el-form-item label="" prop="password">
			<el-input type="password" prefix-icon="Unlock" autocomplete="new-password" v-model="formData.password"
				placeholder="请输入新密码" />
		</el-form-item>
		<el-form-item label="" prop="passwordConfirm">
			<el-input type="password" autocomplete="new-password" prefix-icon="Unlock"
				v-model="formData.passwordConfirm" placeholder="请输入确认密码" />
		</el-form-item>
		<el-form-item>
			<el-button type="danger" @click="onSubmit">下一步</el-button>
		</el-form-item>
		<el-form-item>
			<el-button @click="onPre">上一步</el-button>
		</el-form-item>
	</el-form>
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
	let curTheme = config.curTheme;

	//传递的参数
	const option = defineProps({
		sysmtetoken: {
			type: String,
			required: true
		},
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

	//自定义事件
	const emit = defineEmits(['toNext', 'toPre'])

	// 登录表单数据
	const formData = reactive({
		password: '',
		passwordConfirm: ''
	});
	const loginForm = ref();

	//密码规则的验证
	const validatePass = (rule, value, callback) => {
		callback()
	}
	//密码规则的验证
	const validatePassConfirm = (rule, value, callback) => {
		if (value != formData.password) {
			callback("两次密码不一致")
		} else {
			callback()
		}
	}

	const rules = reactive({
		password: [{
				required: true,
				message: '请输入新密码',
				trigger: 'blur'
			},
			{
				validator: validatePass,
				trigger: 'blur'
			}, {
				min: 6,
				max: 12,
				message: '密码需要6-12位',
				trigger: 'blur'
			}
		],
		passwordConfirm: [{
				required: true,
				message: '请输入确认密码',
				trigger: 'blur'
			},
			{
				validator: validatePassConfirm,
				trigger: 'blur'
			}
		]
	})

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

			utils.showLoadding();
			api.post("/api/resetpwd/save", JSON.stringify({
				password: formData.password,
				token: option.sysmtetoken
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
				//TODO 提交到后台修改密码
				emit('toNext', {});
			}).catch(function(error) {
				utils.hideLoadding();
				utils.showError("登录失败！");
			});
		});
	}

	const onPre = () => {
		emit('toPre', {});
	}
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
