<template>
	<div class="page">
		<SmartTable 
			ref="table" 
			:delete_="false"
			optionColWidth="150px" 
			entityType="Menu" 
			url="/api/system/menu" 
			infourl="/api/system/menu/info" 
			saveurl="/api/system/menu/save"  >
			
			<template #row-btns="scope">
				<el-button type="primary" size="small" icon="Plus" @click="addSub(scope.index, scope.row)">
				</el-button>
			</template>
		</SmartTable>
	</div>
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

	//表格实例
	const table = ref(null);

	onMounted(() => {});
	//添加
	const addSub = (index, row)=>{
		table.value.toForm({
			parent:{
				id:row.id
			}
		});
	}
</script>

<style scoped>

</style>
