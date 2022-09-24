<template>
	<el-dialog v-model="dialogTableVisible" title="全局搜索" width="60%" append-to-body center @closed="closed">
		<div class="search-panel">
			<div class="search-form">
				<el-input autocomplete="new" size="large" prefix-icon="Search" v-model="searchKeywords"
					placeholder="搜索界面" @keyup="handleSearch" />
			</div>
			<div class="search-result">
				<el-empty v-if="!searchResult || searchResult.length<=0" description="暂无数据" />
				<div class="inner" v-else>
					<template v-for="(item,index) in searchResult">
						<div class="item flex">
							<div class="icon">
								<component style="width:30px;margin-top:15px" :is="item.icon"></component>
							</div>
							<div class="flex-item">
								<div class="name">{{item.name}}</div>
								<div class="path">{{item.url}}</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from 'vue'
	
	
	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";
	import config from "@/store/config.js";

	//是否展示对话框
	const dialogTableVisible = ref(false);

	//当前搜索关键字
	const searchKeywords = ref("");
	//搜索结果
	const searchResult = reactive([]);
	//是否正在加载中
	const isSearching = ref(false);
	//搜索
	const handleSearch = () => {
		if (isSearching) {
			setTimeout(loadSearchData, 1000);
		}else{
			setTimeout(loadSearchData, 300);
		}
	}
	//从后台加载搜索数据
	const loadSearchData = () => {
		isSearching.value = true;
		api.post("/api/search", JSON.stringify({
			keywords: searchKeywords.value
		})).then((res) => {
			isSearching.value = false;
			utils.hideLoadding();
			if (!res || res.status != 200 || !res.data || res.data.code != 888) {
				if (res.data && res.data.message) {
					utils.showError(res.data.message);
				} else {
					utils.showError("搜索失败！");
				}
				return;
			}
			searchResult.splice(0, searchResult.length);
			searchResult.push(...res.data.data);
		}).catch(function(error) {
			utils.hideLoadding();
			utils.showError("搜索失败！");
			isSearching.value = false;
		});;
	}

	//显示对话框
	const show = () => {
		dialogTableVisible.value = true;
	}
	//关闭对话框
	const colse = () => {
		dialogTableVisible.value = false;
	}
	//关闭对话框事件监听
	const closed = () => {

	}
	defineExpose({
		show,
		close
	})
</script>

<style scoped>
	.search-panel {}

	.search-panel .search-form {}
	.search-panel .search-result {
		
	}
	.search-panel .search-result .inner {
		max-height:80vh;
		overflow-y:auto;
		padding-top:10px;
	}
	.search-panel .search-result .inner .item{
		cursor: pointer;
		border-radius:5px;
	}
	.search-panel .search-result .inner .item:last-child{
	}
	.search-panel .search-result .inner .item:hover{
		background:var(--el-bg-color-page);
	}
	.search-panel .search-result .inner .item .icon{
		width:80px;
		text-align:center;
		border-right:var(--el-border);
		margin-right:10px;
	}
	
	.search-panel .search-result .inner .item .name{
		font-size:16px;
		font-weight:bold;
		line-height:35px;
	}
	.search-panel .search-result .inner .item .path{
		font-size:14px;
		line-height:25px;
	}
</style>
