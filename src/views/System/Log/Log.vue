<template>
	<div class="page">
		<SmartTable 
			ref="table" 
			optionColWidth="80px" 
			entityType="Log" 
			url="/api/system/log" 
			infourl="/api/system/log/info" 
			:edit="false"
			:delete_="false"
			:export_="true">
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
