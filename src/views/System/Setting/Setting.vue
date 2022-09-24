<template>
	<div class="page">
		<SmartTable 
			ref="table" 
			optionColWidth="150px" 
			entityType="Setting" 
			url="/api/system/setting" 
			infourl="/api/system/setting/info" 
			saveurl="/api/system/setting/save" 
			deleteUrl="/api/system/setting/delete" 
			deleteBatchAllUrl="/api/system/setting/delete/all"
			deleteBatchCheckUrl="/api/system/setting/delete/check" >
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
