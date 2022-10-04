<template>
	<el-scrollbar :height="viewHeight" class="view-body">
		<template v-for="(groupitem, groupindex) in groups" :key="groupitem">
			<el-descriptions class="margin-top" :title="groupitem" :column="2" border>
				<template v-for="(item, index) in entityFileds" :key="item.prop">
					<template v-if="item.viewShow && item.group == groupitem">
						<!-- 类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间 -->
						<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-if="item.type == '1' || item.type == '2'">
							{{entityData[item.prop]}}
						</el-descriptions-item>

						<template v-else-if="item.type == '3'">
							<!-- 主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea -->
							<div class="info-line-item info-textarea-item" label-class-name="info-label" v-if="item.inputType == '2'">
								<div class="label">{{item.label}}：</div>
								<div class="value">{{entityData[item.prop]}}</div>
							</div>
							
							<el-descriptions-item width="100%" :label="item.label+'：'" label-class-name="info-label" v-if="item.inputType == '2'">>
								{{entityData[item.prop]}}
							</el-descriptions-item>
							<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-else-if="item.inputType == '3'">
								{{entityData[item.prop]}}
							</el-descriptions-item>
							<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-else-if="item.inputType == '4'">
								<!-- html的转义 -->
								{{entityData[item.prop]}}
							</el-descriptions-item>
							<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-else>
								<!-- html的转义 -->
								{{entityData[item.prop]}}
							</el-descriptions-item>
						</template>
						
						<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-else-if="item.type == '4'">
							<template v-if="entityData[item.prop]">
								<template v-if="item.format">
									{{new Date(entityData[item.prop]).format(item.format)}}
								</template>
								<template v-else>
									{{new Date(entityData[item.prop]).format('yyyy-MM-DD hh:mm:ss')}}
								</template>
							</template>
						</el-descriptions-item>
						<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-else-if="item.type == '5'">
							<template v-if="item.multiple">
								<template v-if="entityData[item.prop]" v-for="(cellitem,cellindex) in entityData[item.prop]">
									{{cellitem?cellitem[item.showLabelKey]:JSON.stringify(cellitem)}};
								</template>
							</template>
							<template v-else>
								<template v-if="entityData[item.prop]">
									{{entityData[item.prop][item.showLabelKey]}}
								</template>
							</template>
						</el-descriptions-item>
						<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-else-if="item.type == '6'">
							<template v-if="entityData[item.prop]">
								<a href="{{entityData[item.linkurl]}}">{{entityData[item.prop]}}</a>
							</template>
						</el-descriptions-item>
						<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-else-if="item.type == '7'">
							<template v-if="entityData[item.prop]">
								<el-image class="view-image" :src="entityData[item.prop]"
									:preview-src-list="[entityData[item.prop]]" :initial-index="0" fit="cover" />
							</template>
						</el-descriptions-item>
						<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-else-if="item.type == '8'">
							<template v-if="item.multiple">
								<template v-if="entityData[item.prop]" v-for="(cellitem,cellindex) in entityData[item.prop]">
									<template v-for="(dictitem, dictindex) in item.dicts" :key="dictitem.value">
										<template
											v-if="cellitem == dictitem.value">{{dictitem.label}}</template>
									</template>
								</template>
							</template>
							<template v-else>
								<template v-for="(dictitem, dictindex) in item.dicts" :key="dictitem.value">
									<template
										v-if="entityData[item.prop] == dictitem.value">{{dictitem.label}}</template>
								</template>
							</template>
						</el-descriptions-item>
						<el-descriptions-item :label="item.label+'：'" label-class-name="info-label" v-else-if="item.type == '9'">
							<template v-if="entityData[item.prop]">
								<template v-if="item.format">
									{{new Date(entityData[item.prop]).format(item.format)}}
								</template>
								<template v-else>
									{{new Date(entityData[item.prop]).format('hh:mm:ss')}}
								</template>
							</template>
						</el-descriptions-item>
					</template>
				</template>
			</el-descriptions>
		</template>
	</el-scrollbar>
</template>
<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted,
		onBeforeUnmount,
		nextTick
	} from "vue";
	import {
		useStore
	} from "vuex";

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";
	let store = useStore();

	//传递的参数
	const option = defineProps({
		//实体的类型说明
		entityType: {
			type: String,
			required: true,
		},
		//加载数据的url地址
		url: {
			type: String,
			required: true,
		},
		//表单的名称
		data: {
			type: Object,
			required: true
		},
		//表单的高度
		viewHeight: {
			type: Object,
			required: true
		}
	});

	//实体配置信息
	const entityFileds = reactive([]);
	//当前编辑实体的数据
	const entityData = reactive({});
	//分组
	const groups = reactive([]);
	//富文本编辑器实例
	// const richEditRef = {};

	onMounted(() => {
		loadEntityConfigData();
	});
	// 组件销毁时，也及时销毁编辑器
	onBeforeUnmount(() => {})

	/**
	 * 加载实体配置信息
	 */
	const loadEntityConfigData = () => {
		//加载实体的配置
		api.post("/api/entityType", JSON.stringify({
			owonClass: option.entityType,
		})).then((res) => {
			if (
				!res ||
				res.status != 200 ||
				!res.data ||
				res.data.code != 888 ||
				!res.data.data
			) {
				if (res.data.msg) {
					utils.showError(res.data.msg);
				} else {
					utils.showError("加载异常");
				}
				return;
			}
			entityFileds.splice(0, entityFileds.length);
			entityFileds.push(...res.data.data);

			//默认选中第一个可搜索的字段作为搜索类型
			entityFileds.forEach((item, index) => {
				if (item.viewShow) {
					let has = false;
					for (let index = 0; index < groups.length; index++) {
						if (groups[index] == item.group) {
							has = true;
						}
					}
					if (!has) {
						groups.push(item.group);
					}
				}
				if (item.viewShow && item.type == "8") {
					entityFileds[index].dicts = [];
					loadFiledDictByKey(item.prop, item.key);
				}
			});
			if (option.data && option.data.id) {
				loadEntityData();
			}
		}).catch((error) => {
			utils.showError("加载异常");
		});
	};
	//加载实体数据
	const loadEntityData = () => {
		api.post(option.url, JSON.stringify({
			id: option.data.id
		})).then((res) => {
			if (
				!res ||
				res.status != 200 ||
				!res.data ||
				res.data.code != 888 ||
				!res.data.data
			) {
				if (res.data.msg) {
					utils.showError(res.data.msg);
				} else {
					utils.showError("加载异常");
				}
				return;
			}
			for (const key in res.data.data) {
				entityData[key] = res.data.data[key];
			}
		}).catch((error) => {
			utils.showError("加载异常");
		});
	}
	//加载数据字典对应的选项
	const loadFiledDictByKey = (prop, key) => {
		let cacheData = store.getters.listDictByKey;
		if (cacheData && cacheData[key]) {
			entityFileds.forEach((item, index) => {
				if (item.prop == prop) {
					entityFileds[index].dicts = store.getters.listDictByKey[key];
				}
			});
			return;
		}
		//加载实体的配置
		api.post(
				"/api/dict/listDictByKey",
				JSON.stringify({
					key: key,
				})
			)
			.then((res) => {
				if (
					!res ||
					res.status != 200 ||
					!res.data ||
					res.data.code != 888 ||
					!res.data.data
				) {
					if (res.data.msg) {
						utils.showError(res.data.msg);
					} else {
						utils.showError("加载异常");
					}
					return;
				}
				entityFileds.forEach((item, index) => {
					if (item.prop == prop) {
						entityFileds[index].dicts = res.data.data;
					}
				});
				store.commit("setDict", key, res.data.data);
			})
			.catch((error) => {
				utils.showError("加载异常");
			});
	};
</script>
<style scoped>
	.view-body:deep(.info-label) {
		width:100px !important;
	}

	.view-body:deep(.view-image) {
		width: 100px;
		height: 100px;
	}
	.view-body:deep(.margin-top) {
		margin-top:16px;
	}
	.view-body:deep(.el-descriptions__body .el-descriptions__table) {
		table-layout: fixed
	}
	
</style>
