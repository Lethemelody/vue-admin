<template>
	<div class="page">
		<SmartPageView ref="view" entityType="TableDemo" url="/api/demo/info" edit="true" title="详情页示例"
			:data=" data " @toForm=" toForm ">
		</SmartPageView>
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
import {
	useRouter,
	useRoute
} from 'vue-router'

import utils from "@/utils/utils.js";

import SmartPageView from "@/components/SmartView/SmartPageView.vue";


const router = useRouter()
const route = useRoute()

//表格实例
const view = ref( null );
//详情数据
const data = ref( {
	id: 1
} );

onMounted( () => { } );

//转到编辑界面
const toForm = ( data ) => {

}
</script>

<style scoped>

</style>
