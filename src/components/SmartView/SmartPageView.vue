<template>
	<div class="content">
		<el-card class="view-box">
			<template #header>
				<div class="card-header">
					<span>{{ title }}</span>
				</div>
			</template>
	
			<SmartView ref="view" :data="data" :url="url" :entityType="entityType"
				:viewHeight="viewHeight">
			</SmartView>
	
			<div class="view-btns">
				<el-button-group>
					<el-button type="primary" @click="hideSearchFilterBox" icon="Close">取消
					</el-button>
					<el-button v-if="edit" type="primary" @click="onEdit" icon="Select">编辑
					</el-button>
				</el-button-group>
			</div>
		</el-card>
	</div>
</template>
<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from "vue";
	import {
		useRouter,
		useRoute
	} from 'vue-router'
	
	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";

	import SmartView from "./SmartView.vue";
	
	const emits = defineEmits(['toForm']);

	//传递的参数
	const option = defineProps({
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
		//表单的名称
		edit: {
			type: Boolean,
			required: false,
			default:false
		},
	});

	//表单的实例
	const view = ref(null);

	//表单的高度
	const viewHeight = ref(null);
	const router = useRouter()
	const route = useRoute()

	//自动计算表单的高度
	const resizeViewHeight = () => {
		let pageRef = document.getElementById("pane-" + router.currentRoute.value.path);
		let pageHeight = pageRef.clientHeight;

		let elCardHeaderEle = pageRef.getElementsByClassName("el-card__header");
		let titleHeight = 0;
		if (elCardHeaderEle && elCardHeaderEle.length > 0) {
			titleHeight = elCardHeaderEle[0].clientHeight;
		}

		let viewBtnsEle = pageRef.getElementsByClassName("view-btns");
		let btnHeight = 0;
		if (viewBtnsEle && viewBtnsEle.length > 0) {
			btnHeight = viewBtnsEle[0].clientHeight;
		}

		viewHeight.value = (pageHeight - titleHeight - btnHeight - 10 - 20 - 10 - 10) + 'px';
	}

	onMounted(() => {
		resizeViewHeight();
		window.onresize = () => {
			resizeViewHeight();
		}
	});

	//提交表单
	const onEdit = () => {
		emits('toForm',option.id);
	}
</script>
<style scoped>
	.content {
		margin-top: 10px;
	}

	.content:deep(.el-card__body) {
		--el-card-padding: 0px;
	}

	.content:deep(.el-divider--horizontal) {
		margin: 0px 0;
	}

	.card-header {
		text-align: center;
		font-weight: bold;
		font-size: 16px;
	}

	.view {
		margin-top: 10px;
	}

	.view-body {
		padding: 10px;
	}

	.view-btns {
		height: 50px;
		padding-top: 15px;
		text-align: center;
		background: var(--el-fill-color-light);
	}
</style>
