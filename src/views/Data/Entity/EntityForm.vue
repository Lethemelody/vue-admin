c<template>
	<div class="btns flex">
		<div class="flex-item">{{className}}</div>
		<div>
			<el-button-group>
				<el-button type="primary" @click="submit" icon="Select">保存</el-button>
				<el-button type="success" @click="addRow" icon="Plus">添加</el-button>
				<el-button type="warning" @click="backList" icon="ArrowLeftBold">返回</el-button>
			</el-button-group>
		</div>
	</div>
	<el-divider />
	<div class="table-content">
		<el-table ref="table" :data="entityDatas" :height="height"  border style="width: 100%; margin-top: 10px">
			<el-table-column prop="prop" label="属性" width="100"  header-align="center" fixed="left">
				<template #default="scope">
					<el-input v-if="entityDatas[scope.$index].customerFiled" v-model="entityDatas[scope.$index].prop" placeholder="属性名" />
					<template v-else><span style="padding-left: 5px;">{{entityDatas[scope.$index].prop}}</span></template>
				</template>
			</el-table-column>
			<el-table-column prop="label" label="显示名" width="120" header-align="center" fixed="left">
				<template #default="scope">
					<el-input v-model="entityDatas[scope.$index].label" placeholder="显示名" />
				</template>
			</el-table-column>

			<el-table-column label="公共配置" header-align="center">
				<el-table-column prop="sort" label="顺序" header-align="center">
					<template #default="scope">
						<el-input v-model="entityDatas[scope.$index].sort" placeholder="顺序" type="number" />
					</template>
				</el-table-column>
				<el-table-column prop="type" label="类型" width="120" header-align="center">
					<template #default="scope">
						<el-select v-model="entityDatas[scope.$index].type" placeholder="类型">
							<template v-for="(dictitem,dictindex) in dictDatas.entityType" :key="dictitem.value">
								<el-option :label="dictitem.label" :value="dictitem.value" />
							</template>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="inputType" label="组件类型" width="150" header-align="center">
					<template #default="scope">
						<el-select v-model="entityDatas[scope.$index].inputType" placeholder="组件类型">
							<template v-for="(dictitem,dictindex) in dictDatas.entityInputType" :key="dictitem.value">
								<el-option :label="dictitem.label" :value="dictitem.value" />
							</template>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="format" label="数据格式" width="100" header-align="center">
					<template #default="scope">
						<el-input v-model="entityDatas[scope.$index].format" placeholder="数据格式" />
					</template>
				</el-table-column>
				<el-table-column prop="dateType" label="时间格式" width="100" header-align="center">
					<template #default="scope">
						<el-input v-model="entityDatas[scope.$index].dateType" placeholder="时间格式"  />
					</template>
				</el-table-column>
				<el-table-column prop="url" label="加载地址" width="150" header-align="center">
					<template #default="scope">
						<el-input v-model="entityDatas[scope.$index].url" placeholder="加载地址"  />
					</template>
				</el-table-column>
				<el-table-column prop="showLabelKey" label="对象显示名" width="100" header-align="center">
					<template #default="scope">
						<el-input v-model="entityDatas[scope.$index].showLabelKey" placeholder="对象显示名"  />
					</template>
				</el-table-column>
				<el-table-column prop="key" label="字典标识" width="100" header-align="center">
					<template #default="scope">
						<el-input v-model="entityDatas[scope.$index].key" placeholder="字典标识" />
					</template>
				</el-table-column>
				<el-table-column prop="multiple" label="可多选" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].multiple" />
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column label="表格配置" header-align="center">
				<el-table-column prop="width" label="宽度" width="80">
					<template #default="scope">
						<el-input v-model="entityDatas[scope.$index].width" placeholder="宽度" type="number" />
					</template>
				</el-table-column>
				<el-table-column prop="show" label="展示" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].show" />
					</template>
				</el-table-column>
				<el-table-column prop="masteShow" label="默认展示" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].masteShow" />
					</template>
				</el-table-column>
				<el-table-column prop="fixed" label="固定" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].fixed" />
					</template>
				</el-table-column>
				<el-table-column prop="customer" label="自定义" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].customer" />
					</template>
				</el-table-column>
				<el-table-column prop="canSort" label="可排序" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].canSort" />
					</template>
				</el-table-column>
				<el-table-column prop="canSearch" label="可搜索" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].canSearch" />
					</template>
				</el-table-column>
				<el-table-column prop="canDefaultSearch" label="快捷搜索" header-align="center">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].canDefaultSearch" />
					</template>
				</el-table-column>
				<el-table-column prop="align" label="对其方式" width="80" header-align="center">
					<template #default="scope">
						<el-select v-model="entityDatas[scope.$index].align" placeholder="对其方式">
							<template v-for="(dictitem,dictindex) in dictDatas.align" :key="dictitem.value">
								<el-option :label="dictitem.label" :value="dictitem.value" />
							</template>
						</el-select>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column label="编辑配置" header-align="center">
				<el-table-column prop="canEdit" label="可编辑" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].canEdit" />
					</template>
				</el-table-column>
				<el-table-column prop="canNone" label="可为空" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].canNone" />
					</template>
				</el-table-column>
				<el-table-column prop="fileUploadUrl" label="上传路径" width="120" header-align="center">
					<template #default="scope">
						<el-input v-model="entityDatas[scope.$index].fileUploadUrl" placeholder="上传路径" />
					</template>
				</el-table-column>
				<el-table-column prop="fileType" label="类型" width="120" header-align="center">
					<template #default="scope">
						<el-select v-model="entityDatas[scope.$index].fileType" placeholder="类型">
							<template v-for="(dictitem,dictindex) in dictDatas.fileType" :key="dictitem.value">
								<el-option :label="dictitem.label" :value="dictitem.value" />
							</template>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="fileSize" label="大小" header-align="center">
					<template #default="scope">
						<el-input v-model="entityDatas[scope.$index].fileSize" :placeholder="大小" type="number" />
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column label="详情配置" header-align="center">
				<el-table-column prop="viewShow" label="展示" align="center" header-align="center" width="50px">
					<template #default="scope">
						<el-switch v-model="entityDatas[scope.$index].viewShow" />
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column label="操作" align="center" header-align="center" width="50px" fixed="right">
				<template #default="scope">
					<el-button v-if="entityDatas[scope.$index].customerFiled" size="small" type="danger" @click="deleteRow(scope.$index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from 'vue'
	import {
		useRouter,
		useRoute
	} from 'vue-router'
	import {
		useStore
	} from "vuex";

	import utils from "@/utils/utils.js";
	import api from "@/api/api.js";

	const router = useRouter()
	const route = useRoute()
	let store = useStore();
	
	//自定义事件
	const emits = defineEmits(['backList']);

	//外部的参数
	const option = defineProps({
		className: {
			type: String,
			required: true
		}
	});
	
	//table实例
	const table = ref();

	//整体的高度
	const height = ref('600px');

	//实体配置数据
	const entityDatas = reactive([]);
	
	//数据字典参数
	const dictDatas = reactive({
		entityType:[],
		entityInputType:[],
		align:[],
		fileType:[]
	});

	onMounted(() => {
		resetHeight();
		
		loadFiledDictByKey('entityType',(res)=>{
			dictDatas.entityType = res;
		});
		loadFiledDictByKey('entityInputType',(res)=>{
			dictDatas.entityInputType = res;
		});
		loadFiledDictByKey('align',(res)=>{
			dictDatas.align = res;
		});
		loadFiledDictByKey('fileType',(res)=>{
			dictDatas.fileType = res;
		});
		
		loadEntitys();
		window.onresize = resetHeight;
	});

	//返回列表
	const backList = () => {
		emits('backList');
	}
	//添加一个自定义的列
	const addRow = ()=>{
		entityDatas.push({
			customer:true,
			customerFiled:true//标识是属性之外的自定义属性
		});
	}
	//删除自定义的列
	const deleteRow = (index)=>{
		entityDatas.splice(index,1);
	}
	//提交数据
	const submit = ()=>{
		utils.showLoadding();
		api.post('/api/entity/saveList', JSON.stringify(entityDatas)).then((res) => {
			utils.hideLoadding();
			if (!res || res.status != 200 || !res.data || res.data.code != 888) {
				if (res.data && res.data.message) {
					utils.showError(res.data.message);
				} else {
					utils.showError("保存失败！");
				}
				return;
			}
			utils.showSuccess("保存成功！");
		}).catch(function(error) {
			utils.hideLoadding();
			utils.showError("保存失败！");
		});
	}
	/**
	 * 重新计算高度
	 */
	const resetHeight = () => {
		let pageRef = document.getElementById("pane-" + router.currentRoute.value.path);
		let pageHeight = pageRef.clientHeight;

		height.value = (pageHeight - 80) + 'px';
		
		table.value.doLayout();
	}

	/**
	 * 加载所有的实体数据
	 */
	const loadEntitys = () => {
		utils.showLoadding();
		api.post('/api/entityType', {
			owonClass: option.className
		}).then((res) => {
			utils.hideLoadding();
			if (!res || res.status != 200 || !res.data || res.data.code != 888) {
				if (res.data.msg) {
					utils.showError(res.data.msg);
				} else {
					utils.showError("加载异常");
				}
				return;
			}
			entityDatas.splice(0, entityDatas.length);
			entityDatas.push(...res.data.data);
		}).catch((error) => {
			utils.hideLoadding();
			utils.showError("加载异常");
		});
	}
	
	//加载数据字典对应的选项
	const loadFiledDictByKey = (key,callback) => {
		let cacheData = store.getters.listDictByKey;
		if (cacheData && cacheData[key]) {
			callback &&callback(store.getters.listDictByKey[key]);
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
				callback &&callback(res.data.data);
				store.commit("setDict", key, res.data.data);
			})
			.catch((error) => {
				utils.showError("加载异常");
			});
	};
</script>

<style scoped>
	.btns {
		height: 40px;
		line-height: 40px;
		padding-bottom: 10px;
	}
	
	.table-content:deep(.el-table .cell){
		padding:0px;
	}
	.table-content:deep(.el-table .el-table__cell){
		padding:0px;
	}
	.table-content:deep(.el-input__wrapper){
		box-shadow:none;
	}
	
</style>
