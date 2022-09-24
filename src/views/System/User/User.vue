<template>
	<div class="page">
		<SmartTable ref="table" optionColWidth="220px" entityType="User" url="/api/system/user"
			infourl="/api/system/user/info" saveurl="/api/system/user/save" deleteUrl="/api/system/user/delete"
			deleteBatchAllUrl="/api/system/user/delete/all" deleteBatchCheckUrl="/api/system/user/delete/check">
			<template #row-btns="scope">
				<el-button type="primary" size="small" icon="Lock" @click="resetPwd(scope.index, scope.row)">
				</el-button>
				<el-button type="success" v-if="scope.row.status == '1'"  icon="VideoPlay" size="small"
					@click="start(scope.index, scope.row)">
				</el-button>
				<el-button type="danger" v-if="scope.row.status != '1'"  icon="VideoPause" size="small"
					@click="stop(scope.index, scope.row)">
				</el-button>
			</template>
		</SmartTable>
	</div>
	<ResetPwd ref="resetPwdDialog" :user="curUser" @sucess="resetPwdSuccess"></ResetPwd>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from 'vue'

	import utils from "@/utils/utils.js";

	import SmartTable from "@/components/SmartTable/SmartTable.vue";
	import ResetPwd from "./components/ResetPwd.vue";

	//表格实例
	const table = ref(null);

	//重置密码框
	const resetPwdDialog = ref(null);
	const curUser = reactive({});

	onMounted(() => {});

	//重置密码
	const resetPwd = (index, row) => {
		curUser.value = row;
		resetPwdDialog.value.show();
	}
	const resetPwdSuccess = () => {
		table.value.refresh();
	}
	const start = (index, row) => {
		//TODO 调用后台刷新列表
		table.value.refresh();
	}
	const stop = (index, row) => {
		//TODO 调用后台刷新列表
		table.value.refresh();
	}
</script>

<style scoped>

</style>
