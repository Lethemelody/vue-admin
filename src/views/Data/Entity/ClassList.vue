<template>
	<div class="page">
		<el-card class="form-box">
			<el-scrollbar v-if="!isForm" :height="height">
				<template v-for="(item,index) in entityDatas">
					<el-button @click="toForm(item.simpleClassName)" class="item" plain
						:type="item.status == '1'?'danger':'success'">{{item.simpleClassName}}
					</el-button>
				</template>
			</el-scrollbar>
			<EntityForm v-else :className="curClassName" @backList="backList"></EntityForm>
		</el-card>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from 'vue'
	import {
		useRouter,
		useRoute
	} from 'vue-router'

	import utils from "@/utils/utils.js";
	import api from "@/api/api.js";

	import EntityForm from "./EntityForm.vue";

	const router = useRouter()
	const route = useRoute()

	//当前是否是详情配置界面
	const isForm = ref(false);

	//整体的高度
	const height = ref('100%');

	//所有实体的列表
	const entityDatas = reactive([]);

	//当前编辑的实体
	const curClassName = ref('');

	onMounted(() => {
		loadEntitys();
		resetHeight();
		window.onresize = resetHeight;
	});

	/**
	 * 转到具体的配置界面
	 */
	const toForm = (className) => {
		curClassName.value = className;
		isForm.value = true;
	}
	
	//返回列表
	const backList = ()=>{
		loadEntitys();
		isForm.value = false;
	}

	/**
	 * 重新计算高度
	 */
	const resetHeight = () => {
		let pageRef = document.getElementById("pane-" + router.currentRoute.value.path);
		let pageHeight = pageRef.clientHeight;

		height.value = (pageHeight - 40) + 'px';
	}

	/**
	 * 加载所有的实体数据
	 */
	const loadEntitys = () => {
		utils.showLoadding();
		api.post('/api/entity/list', {}).then((res) => {
			utils.hideLoadding();
			if (!res || res.status != 200 || !res.data || res.data.code != 888) {
				if (res.data.msg) {
					utils.showError(res.data.msg);
				} else {
					utils.showError("加载异常");
				}
				return;
			}
			entityDatas.splice(0, entityDatas.length);
			entityDatas.push(...res.data.data);
		}).catch((error) => {
			utils.hideLoadding();
			utils.showError("加载异常");
		});
	}
</script>

<style scoped>
	.page {
		margin-top: 10px;
	}

	.page:deep(.el-card__body) {
		--el-card-padding: 10px;
	}

	.page:deep(.el-divider--horizontal) {
		margin: 0px 0;
	}

	.item {
		height: 45px;
		padding: 8px 45px;
		--el-border-radius-base: 2px
	}
</style>
