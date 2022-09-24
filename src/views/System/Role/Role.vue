<template>
	<div class="page">
		<SmartTable 
			ref="table" 
			optionColWidth="150px" 
			entityType="Role" 
			url="/api/system/role" 
			infourl="/api/system/role/info" 
			saveurl="/api/system/role/save" 
			deleteUrl="/api/system/role/delete" 
			deleteBatchAllUrl="/api/system/role/delete/all"
			deleteBatchCheckUrl="/api/system/role/delete/check" >
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
</script>

<style scoped>

</style>
