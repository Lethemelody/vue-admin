<template>
	<el-dialog v-model="dialogVisible" width="60%" append-to-body center @closed="closed" title="用户信息">
		<div class="info-line">
			<div class="info-line-item">
				<div class="label">名称：</div>
				<div class="value">{{userinfo.name}}</div>
			</div>
			<div class="info-line-item">
				<div class="label">账号：</div>
				<div class="value">{{userinfo.username}}</div>
			</div>
		</div>
		<div class="info-line">
			<div class="info-line-item">
				<div class="label">电话：</div>
				<div class="value">{{userinfo.phone}}</div>
			</div>
			<div class="info-line-item">
				<div class="label">邮箱：</div>
				<div class="value">{{userinfo.email}}</div>
			</div>
		</div>
		<div class="info-line">
			<div class="info-line-item">
				<div class="label">角色：</div>
				<div class="value">
					<template v-if="userinfo.roles" v-for="(item,index) in userinfo.roles">
						<template v-if="index>0">；</template>
						{{item.name}}
					</template>
				</div>
			</div>
			<div class="info-line-item">
				<div class="label">地址：</div>
				<div class="value">{{userinfo.address}}</div>
			</div>
		</div>
		<div class="info-line">
			<div class="info-line-item">
				<div class="label">备注：</div>
				<div class="value">{{userinfo.remark}}</div>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false" icon="Close">关闭</el-button>
				<el-button type="primary" @click="handleEdit" icon="Edit">编辑</el-button>
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

	let store = useStore();
	//当前用户信息
	const userinfo = store.getters.getUserInfo;

	//自定义事件
	const emits = defineEmits(['openEditDialog']);

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
	const handleEdit = () => {
		dialogVisible.value = false;
		emits('openEditDialog');
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
