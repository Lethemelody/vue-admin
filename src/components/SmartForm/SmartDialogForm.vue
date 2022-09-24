<template>
	<el-dialog v-model="visable" title="编辑数据" width="80%" center align-center append-to-body lock-scroll
		@closed="closed">
		<SmartForm ref="from" :data="data" :url="url" :saveurl="saveurl" :entityType="entityType"
			:formHeight="formHeight">
		</SmartForm>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close" icon="CloseBold">取消</el-button>
				<el-button type="primary" @click="onSubmit" icon="Select">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted,
		nextTick
	} from 'vue'

	import SmartForm from "./SmartForm.vue";

	//传递的参数
	const option = defineProps({
		//弹框的标题
		title: {
			type: String,
			required: true
		},
		//实体的类型说明
		entityType: {
			type: String,
			required: true,
		},
		//加载数据的url地址
		url: {
			type: String,
			required: true,
		},
		//加载table数据的url地址
		saveurl: {
			type: String,
			required: true,
		},
		//表单的名称
		title: {
			type: String,
			required: true,
		},
		//表单的名称
		data: {
			type: Object,
			required: true
		}
	});

	//标识是否关闭对话框
	const visable = ref(true);

	//自定义事件
	const emits = defineEmits(['closed']);

	//表单的高度
	const formHeight = ref(window.document.body.clientHeight * 0.6 - 54 - 40);

	//表单的实例
	const from = ref();
	
	const close = ()=>{
		visable.value = false;
		closed();
	}

	//关闭事件
	const closed = () => {
		emits('closed');
	}

	//提交
	const onSubmit = () => {
		from.value.submit((res) => {
			if (res == 'ok') {
				visable.value = false;
				closed();
			}
		});
	}
	onMounted(() => {
		window.onresize = () => {
			formHeight.value = window.document.body.clientHeight * 0.6 - 54 - 40;
		}
	});
</script>

<style scoped>
</style>
