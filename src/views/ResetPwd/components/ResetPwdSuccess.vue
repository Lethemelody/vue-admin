<template>
	<div class="successPanel" :class="[curTheme]">
		<div class="icon">
			<el-icon><Select /></el-icon>
		</div>
		<div class="desc">
			密码重置成功后，请重新登录。
		</div>
		<div class="btns">
			<el-button type="primary" @click="onSubmit">返回登录</el-button>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted,
	} from "vue";
	
	import { useRoute, useRouter } from 'vue-router'

	import utils from "@/utils/utils.js";
	import config from "@/store/config.js";
	let curTheme = config.curTheme;

	// 获取当前路由
	const route = useRoute()
	// 获取路由实例
	const router = useRouter()

	//传递的参数
	const option = defineProps({
		lineHeight: {
			type: String,
			required: true
		},
		textColor: {
			type: String,
			default: '#222',
			required: false
		}
	})

	const onSubmit = () => {
		router.push({
			path: '/SpecLogin'
		})
	}
</script>

<style scoped="scoped">
	.theme-default .successPanel {
		width: 45%;
		min-width: 400px;
		margin: 0 auto;
		margin-top: 50px;
	}

	.theme-default .successPanel .icon {
		font-size: 60px;
		text-align: center;
		line-height: 100px;
		color: #409EFF;
	}

	.theme-default .successPanel .desc {
		line-height: v-bind(option.lineHeight);
		font-size: 16px;
		color: #409EFF;
		text-align: center;
	}

	.theme-default .successPanel .btns {
		text-align: center;
		margin-top: 50px;
	}

	.theme-default .successPanel .btns:deep(.el-button) {
		width: 100%;
		line-height: v-bind(option.lineHeight);
		height: v-bind(option.lineHeight);
	}
</style>
