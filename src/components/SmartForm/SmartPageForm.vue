<template>
	<div class="content">
		<el-card class="form-box">
			<template #header>
				<div class="card-header">
					<span>{{ title }}</span>
				</div>
			</template>

			<SmartForm ref="form" :data="data" :url="url" :saveurl="saveurl" :entityType="entityType"
				:formHeight="formHeight">
			</SmartForm>

			<div class="form-btns">
				<el-button-group>
					<el-button type="primary" @click="hideSearchFilterBox" icon="Close">取消
					</el-button>
					<el-button type="primary" @click="onSubmit" icon="Select">确定
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
		onUnmounted,
		nextTick
	} from "vue";
	import {
		useRouter,
		useRoute
	} from 'vue-router'

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";

	import SmartForm from "./SmartForm.vue";

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
		},
	});

	//表单的实例
	const form = ref(null);

	//表单的高度
	const formHeight = ref(null);
	const router = useRouter()
	const route = useRoute()

	//自动计算表单的高度
	const resizeFormHeight = () => {
		let pageRef = document.getElementById("pane-" + router.currentRoute.value.path);
		let pageHeight = pageRef.clientHeight;

		let elCardHeaderEle = pageRef.getElementsByClassName("el-card__header");
		let titleHeight = 0;
		if (elCardHeaderEle && elCardHeaderEle.length > 0) {
			titleHeight = elCardHeaderEle[0].clientHeight;
		}

		let formBtnsEle = pageRef.getElementsByClassName("form-btns");
		let btnHeight = 0;
		if (formBtnsEle && formBtnsEle.length > 0) {
			btnHeight = formBtnsEle[0].clientHeight;
		}

		formHeight.value = (pageHeight - titleHeight - btnHeight - 10 - 20 - 10 - 10) + 'px';
	}

	onMounted(() => {
		resizeFormHeight();
		window.onresize = () => {
			resizeFormHeight();
		}
	});

	//提交表单
	const onSubmit = () => {
		form.value.submit((res) => {});
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

	.form-btns {
		height: 50px;
		padding-top: 15px;
		text-align: center;
		background: var(--el-fill-color-light);
	}

	.group-title {
		margin-top: 15px !important;
		margin-bottom: 20px !important;
	}

	.group-title:deep(.el-divider__text) {
		font-size: 16px;
		font-weight: bold;
	}
</style>
