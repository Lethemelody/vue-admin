<template>
	<el-dialog v-model="dialogVisible" width="550px" append-to-body center @closed="closed" title="重置密码">
		<el-form ref="formRef" :model="formData" :rules="rules" class="user-form" label-width="100px" status-icon>
			<el-form-item label="新密码:" prop="newpwd">
				<el-input v-model="formData.newpwd" type="password" placeholder="请输入新密码" />
			</el-form-item>
			<el-form-item label="密码确认:" prop="newpwd">
				<el-input v-model="formData.newpwd1" type="password" placeholder="请输入密码确认" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false" icon="Close">关闭</el-button>
				<el-button type="primary" @click="onSubmit" icon="Select">提交</el-button>
			</span>
		</template>
	</el-dialog>
</template>


<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from 'vue'

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";
	
	///外部的参数
	const option = reactive({
		user:{
			type:Object,
			required:true
		}
	})

	//编辑表单的实例
	const formRef = ref(null);
	//编辑表单的实例
	const formData = reactive({
		'newpwd': "",
		'newpwd1': "",
	});
	//密码规则的验证
	const validatePass = (rule, value, callback) => {
		callback()
	}
	//密码规则的验证
	const validatePassConfirm = (rule, value, callback) => {
		if (value != formData.newpwd) {
			callback("两次密码不一致")
		} else {
			callback()
		}
	}
	const rules = reactive({
		'newpwd': [{
			required: true,
			message: '请输入新密码',
			trigger: 'blur'
		}, {
			min: 6,
			max: 12,
			message: '密码需要6-12位',
			trigger: 'blur'
		}],
		'newpwd': [{
				required: true,
				message: '请输入确认密码',
				trigger: 'blur'
			},
			{
				validator: validatePassConfirm,
				trigger: 'blur'
			}
		]
	});

	//是否展示对话框
	const dialogVisible = ref(false);
	
	//自定义事件
	const emits = defineEmits(['sucess']);

	//显示对话框
	const show = () => {
		dialogVisible.value = true;
	}
	//关闭对话框
	const colse = () => {
		dialogVisible.value = false;
	}
	//关闭对话框事件监听
	const closed = () => {
		
	}
	//转到编辑界面
	const onSubmit = () => {
		formRef.value.validate((valid, fields) => {
			if (!valid) {
				if (fields) {
					for (let key in fields) {
						utils.showError(fields[key][0].message);
					}
				}
				return;
			}
			//TODO 调用编辑接口进行用户信息的修改
			utils.showLoadding();
			api.post("/api/user/resetpwd", JSON.stringify({
				id:option.user.id,
				oldpwd: formData.oldpwd,
				newpwd: formData.newpwd
			})).then((res) => {
				debugger
				utils.hideLoadding();
				if (!res || res.status != 200 || !res.data || res.data.code != 888) {
					if (res.data && res.data.message) {
						utils.showError(res.data.message);
					} else {
						utils.showError("重置失败！");
					}
					return;
				}
				dialogVisible.value = false;
				emits('sucess');
			}).catch(function(error) {
				utils.hideLoadding();
				utils.showError("重置失败！");
			});
		});

	}
	defineExpose({
		show,
		close
	})
</script>

<style>
</style>
