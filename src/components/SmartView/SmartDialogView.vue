<template>
	<el-dialog v-model="visable" title="数据详情" width="80%" center align-center append-to-body lock-scroll
		@closed="closed">
		<SmartView ref="view" :data="data" :url="url" :entityType="entityType"
			:viewHeight="viewHeight" :edit="edit">
		</SmartView>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close" icon="Close">取消</el-button>
				<el-button v-if="edit" type="primary" icon="Edit" @click="onForm">编辑</el-button>
				<slot name="btns" :data="data"></slot>
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

	import SmartView from "./SmartView.vue";

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
		//表单的名称
		title: {
			type: String,
			required: true,
		},
		//表单的名称
		data: {
			type: Object,
			required: true
		},
		edit: {
			type: Boolean,
			required: false,
			default:false
		},
	});

	//标识是否关闭对话框
	const visable = ref(true);

	//自定义事件
	const emits = defineEmits(['toForm']);

	//表单的高度
	const viewHeight = ref(window.document.body.clientHeight * 0.6 - 54 - 40);

	//表单的实例
	const view = ref();
	
	const close = ()=>{
		visable.value = false;
		closed();
	}

	//关闭事件
	const closed = () => {
		emits('closed');
	}

	//提交
	const onForm = () => {
		emits('toForm',option.data);
		visable.value = false;
		closed();
	}
	onMounted(() => {
		window.onresize = () => {
			viewHeight.value = window.document.body.clientHeight * 0.6 - 54 - 40;
		}
	});
</script>

<style scoped>
</style>
