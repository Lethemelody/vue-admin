<template>
	<div class="page">
		<SmartTable 
			ref="table" 
			optionColWidth="150px" 
			entityType="Message" 
			url="/api/data/message" 
			infourl="/api/data/message/info" 
			saveurl="/api/data/message/save" 
			deleteUrl="/api/data/message/delete" 
			deleteBatchAllUrl="/api/data/message/delete/all"
			deleteBatchCheckUrl="/api/data/message/delete/check" >
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
