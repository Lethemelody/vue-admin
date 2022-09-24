<template>
	<div class="page">
		<SmartTable ref="table" optionColWidth="200px" entityType="TableDemo" url="/api/demo/tableData" infourl="/api/demo/info" saveurl="/api/demo/save" @add="add">
			<template #tool-btns>
				<el-button size="small" style="margin-left: 10px;">外部的操作按钮</el-button>
			</template>
			<template #btns>
				<el-button style="margin-left: 10px;">外部的操作按钮</el-button>
			</template>
			<template #row-btns="scope">
				<el-button size="small" @click="export_(scope.index, scope.row)">下载
				</el-button>
			</template>
			<template #view-btns="scope">
				<el-button @click="export_(scope.data)">下载</el-button>
			</template>
			<template #cell-reat="scope">
				{{scope.index}}
			</template>
		</SmartTable>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted,
		defineAsyncComponent
	} from 'vue'

	import utils from "@/utils/utils.js";

	import SmartTable from "@/components/SmartTable/SmartTable.vue";

	//表格实例
	const table = ref(null);

	onMounted(() => {});

	const add = () => {
		utils.showMsg("打开添加界面");
	}
	const export_ = (index, row) => {
		debugger
	}
</script>

<style scoped>

</style>
