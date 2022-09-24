<template>
	<el-dialog v-model="dialogVisible" width="60%" append-to-body center @closed="closed" title="编辑信息">
		<el-form ref="formRef" :model="formData" :rules="rules" class="user-form" label-width="80px" status-icon>
			<el-form-item label="账号:" prop="username">
				<el-input v-model="formData.username" placeholder="请输入账号" />
			</el-form-item>
			<el-form-item label="名称:" prop="name">
				<el-input v-model="formData.name" placeholder="请输入名称" />
			</el-form-item>
			<el-form-item label="邮箱:" prop="email">
				<el-input v-model="formData.email" placeholder="请输入邮箱" />
			</el-form-item>
			<el-form-item label="电话:" prop="phone">
				<el-input v-model="formData.phone" placeholder="请输入电话" />
			</el-form-item>
			<el-form-item label="地址:" prop="address">
				<el-input v-model="formData.address" placeholder="请输入地址" />
			</el-form-item>
			<el-form-item label="备注:" prop="remark">
				<el-input type="textarea" v-model="formData.remark" placeholder="请输入备注信息" />
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

	import {
		useStore
	} from "vuex";

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";

	let store = useStore();
	//当前用户信息
	const userinfo = store.getters.getUserInfo;

	//编辑表单的实例
	const formRef = ref(null);
	//编辑表单的实例
	const formData = reactive({
		'username': userinfo.username,
		'name': userinfo.name,
		'email': userinfo.email,
		'phone': userinfo.phone,
		'address': userinfo.address,
		'remark': userinfo.remark
	});
	//编辑表单的实例
	const validatePhone = (rule, value, callback) => {
		if (value && !utils.check.checkPhone(value)) {
			callback("电话号码不合法")
		} else {
			callback()
		}
	}
	const rules = reactive({
		'username': [{
			required: true,
			message: '请输入账号',
			trigger: 'blur'
		}],
		'name': [{
			required: true,
			message: '请输入账号',
			trigger: 'blur'
		}, {
			min: 0,
			max: 10,
			message: '名称不能操作10个字符',
			trigger: 'blur'
		}],
		'email': [{
			type: 'email',
			message: '邮箱格式不合法',
			trigger: ['blur', 'change']
		}],
		'phone': [{
			validator: validatePhone,
			trigger: ['blur', 'change']
		}]
	});

	//自定义事件
	const emits = defineEmits(['reloadUserInfo']);

	//是否展示对话框
	const dialogVisible = ref(false);

	//显示对话框
	const show = () => {
		dialogVisible.value = true;
	}
	//关闭对话框
	const colse = () => {
		dialogVisible.value = false;
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
			api.post("/api/user/changeinfo", JSON.stringify(formData)).then((res) => {
				utils.hideLoadding();
				if (!res || res.status != 200 || !res.data || res.data.code != 888) {
					if (res.data && res.data.message) {
						utils.showError(res.data.message);
					} else {
						utils.showError("修改失败！");
					}
					return;
				}
				dialogVisible.value = false;
				emits('reloadUserInfo');
			}).catch(function(error) {
				utils.hideLoadding();
				utils.showError("修改失败！");
			});
		});

	}
	//关闭对话框事件监听
	const closed = () => {}
	defineExpose({
		show,
		close
	})
</script>

<style>
</style>
