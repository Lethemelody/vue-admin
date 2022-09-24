<template>
	<div class="page">
		<SmartPageForm ref="form" entityType="TableDemo" url="/api/demo/info" saveurl="/api/demo/save" title="表单示例"
			:data="{}">
		</SmartPageForm>
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

	import SmartPageForm from "@/components/SmartForm/SmartPageForm.vue";

	//表格实例
	const form = ref(null);
	
	onMounted(() => {});
</script>

<style scoped>

</style>
