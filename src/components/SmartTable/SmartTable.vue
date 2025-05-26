<template>
	<div class="content">
		<el-card class="search-box">
			<div class="table-btn-box flex">
				<div class="flex-item">
					<el-button icon="Plus" v-if=" edit " @click=" add " type="primary">添加数据</el-button>
					<slot name="btns"></slot>
				</div>
				<div class="flex">
					<div class="search-label">快捷搜索:</div>
					<el-form :inline=" true " :model=" searchForm " class="search-form">
						<el-form-item class="type-select">
							<el-select v-model=" searchForm.type " placeholder="快捷搜索"
								@change=" searchTypeChange ">
								<template v-for="(item, index) in entityFileds" :key="item.prop">
									<el-option v-if=" item.canDefaultSearch " :label=" item.label "
										:value=" item.prop " />
								</template>
							</el-select>
						</el-form-item>
						<el-form-item>
							<!-- 类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间 -->
							<template v-if=" curSearchFiled.type == '1' || curSearchFiled.type == '2' ">
								<el-input v-model=" searchForm.value " type="number"
									:placeholder=" '请输入' + curSearchFiled.label "
									class="value-filed" />
							</template>
							<template
								v-else-if=" curSearchFiled.type == '3' || curSearchFiled.type == 6 ">
								<el-input v-model=" searchForm.value "
									:placeholder=" '请输入' + curSearchFiled.label "
									class="value-filed" />
							</template>
							<template v-else-if=" curSearchFiled.type == '4' ">
								<el-date-picker v-model=" searchForm.value "
									:type=" curSearchFiled.dateType "
									:placeholder=" '请选择' + curSearchFiled.label "
									:format=" curSearchFiled.format " class="value-date-filed" />
							</template>
							<template v-else-if=" curSearchFiled.type == '5' ">
								<!-- <el-select v-model="searchForm.value" :placeholder="'请选择'+curSearchFiled.label"
									filterable remote :remote-method="loadDataByUrl" :loading="serchLoading"
									class="value-filed">
									<template v-for="(item,index) in curObjDatas" :key="item.id">
										<el-option :label="item[curSearchFiled.showLabelKey]" :value="item.id" />
									</template>
								</el-select> -->
								<el-tree-select v-model=" searchForm.value "
									:loading=" curSearchFiled.loading " filterable
									:placeholder=" '请选择' + curSearchFiled.label " lazy node-key="id"
									:load=" loadDataByFiled " show-checkbox
									:props=" { isLeaf: 'isLeaf', label: curSearchFiled.showLabelKey, prop: curSearchFiled.prop } "
									class="value-filed" />
							</template>
							<template v-else-if=" curSearchFiled.type == '8' ">
								<el-select v-model=" searchForm.value "
									:placeholder=" '请选择' + curSearchFiled.label " class="value-filed">
									<template v-for="(item, index) in curSearchFiled.dicts"
										:key="item.value">
										<el-option :label=" item.label " :value=" item.value " />
									</template>
								</el-select>
							</template>
							<template v-else-if=" curSearchFiled.type == '9' ">
								<el-time-picker v-model=" searchForm.value "
									:type=" curSearchFiled.dateType "
									:placeholder=" '请选择' + curSearchFiled.label "
									:format=" curSearchFiled.format " class="value-date-filed" />
							</template>
						</el-form-item>
						<el-form-item>
							<el-button-group>
								<el-button type="primary" @click=" searchData " icon="Search">搜索
								</el-button>
								<el-button type="danger" @click=" refresh " icon="Refresh">刷新
								</el-button>
								<el-button type="primary" @click=" showSearchFilterBox " icon="Filter">
									筛选
								</el-button>
							</el-button-group>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<el-divider />
			<div class="search-tag">
				<span class="search-label">当前筛选：</span>

				<span v-if=" JSON.stringify( cursSearchPama ) == '{}' " class="search-item-empty">无</span>

				<template v-else v-for="(item, index) in cursSearchPama" :key="index">
					<el-tag class="search-item" size="small" closable @close=" removeSearchItem( index ) ">
						{{ getLabelByProp( index ) }}:{{ item }}
					</el-tag>
				</template>

			</div>
			<div class="search-filter-box" v-if=" searchFilterBox ">
				<el-divider />
				<!-- 高级筛选的内容 -->
				<el-form :model=" searchFilterForm " label-width="100px" class="search-filter-form">
					<div class="search-filter-form-flex">
						<template v-if=" searchFilterForm " v-for="(item, index) in entityFileds"
							:key="item.prop">
							<template v-if=" item.canSearch ">{{ searchFilterForm[item.prop].value }}
								<!-- 类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间 -->
								<div class="search-filter-form-item"
									v-if=" item.type == '1' || item.type == '2' ">
									<el-form-item :label=" item.label + '：' " :prop=" item.prop ">
										<el-input v-model=" searchFilterForm[item.prop] "
											type="number" :placeholder=" '请输入' + item.label " />
									</el-form-item>
								</div>
								<div class="search-filter-form-item"
									v-else-if=" item.type == '3' || item.type == '6' ">
									<el-form-item :label=" item.label + '：' " :prop=" item.prop ">
										<el-input v-model=" searchFilterForm[item.prop] "
											:placeholder=" '请输入' + item.label " />
									</el-form-item>
								</div>
								<div class="search-filter-form-item" v-else-if=" item.type == '4' ">
									<el-form-item :label=" item.label + '：' " :prop=" item.prop ">
										<el-date-picker v-model=" searchFilterForm[item.prop] "
											:type=" item.dateType "
											:placeholder=" '请选择' + item.label "
											class="value-date-filed" />
									</el-form-item>
								</div>
								<div class="search-filter-form-item" v-else-if=" item.type == '5' ">
									<el-form-item :label=" item.label + '：' " :prop=" item.prop ">
										<!-- <el-select v-model="searchFilterForm[item.prop]" :placeholder="'请选择'+item.label"
											filterable remote :remote-method="loadDataByFiled(item.prop)"
											:loading="item[loadding]" class="value-filed">
											<template v-for="(dataitem,dataindex) in item.datas" :key="dataitem.id">
												<el-option :label="dataitem[item.showLabelKey]" :value="dataitem.id" />
											</template>
										</el-select> -->
										<el-tree-select v-model=" searchFilterForm[item.prop] "
											:loading=" item.loading " filterable
											:placeholder=" '请选择' + item.label " node-key="id" lazy
											:load=" loadDataByFiled " show-checkbox
											:props=" { isLeaf: 'isLeaf', label: item.showLabelKey, prop: item.prop } " />
									</el-form-item>
								</div>
								<div class="search-filter-form-item" v-else-if=" item.type == '8' ">
									<el-form-item :label=" item.label + '：' " :prop=" item.prop ">
										<el-select v-model=" searchFilterForm[item.prop] "
											:placeholder=" '请选择' + item.label "
											class="value-filed">
											<template v-for="(dictitem, dictindex) in item.dicts"
												:key="dictitem.value">
												<el-option :label=" dictitem.label "
													:value=" dictitem.value " />
											</template>
										</el-select>
									</el-form-item>
								</div>
								<div class="search-filter-form-item" v-else-if=" item.type == '9' ">
									<el-form-item :label=" item.label + '：' " :prop=" item.prop " s>
										<el-time-picker v-model=" searchFilterForm[item.prop] "
											:type=" item.dateType "
											:placeholder=" '请选择' + item.label "
											class="value-date-filed" />
									</el-form-item>
								</div>
							</template>
						</template>
					</div>
					<div class="search-filter-form-btns">
						<el-button-group>
							<el-button type="warning" @click=" hideSearchFilterBox " icon="Close">取消
							</el-button>
							<el-button type="success" @click=" onSearchFilterSubmit " icon="Search">确定
							</el-button>
						</el-button-group>
					</div>
				</el-form>
			</div>
			<el-divider />
			<div class="tools-bar flex">
				<div class="flex-item">
					<el-button-group>
						<el-dropdown @command=" exportData " v-if=" export_ ">
							<el-button size="small" type="danger" icon="Download" trigger="click">
								<span>数据导出</span>
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="check">导出选中
									</el-dropdown-item>
									<el-dropdown-item command="all">导出全部
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<el-dropdown @command=" deleteData " v-if=" delete_ ">
							<el-button size="small" type="danger" icon="Delete" trigger="click">
								<span>批量删除</span>
								<el-icon class="el-icon--right">
									<arrow-down />
								</el-icon>
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="check">删除选中
									</el-dropdown-item>
									<el-dropdown-item command="all">删除全部
									</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</el-button-group>
					<slot name="tool-btns"></slot>
				</div>
				<div class="">
					<el-button-group>
						<el-popover placement="bottom" trigger="click">
							<template #reference>
								<el-button size="small" type="primary" icon="Setting">
								</el-button>
							</template>
							<el-scrollbar max-height="400px">
								<el-checkbox v-model=" tableColCheckAll "
									@change=" tableColCheckAllChange ">全选
								</el-checkbox>
								<template v-for="(item, index) in entityFileds" :key="item.prop">
									<div class="table-col-item" v-if=" item.show ">
										<el-checkbox :disabled=" item.masteShow " :key=" item.prop "
											:label=" item.label " v-model=" item.show_ "
											@change=" tableColCheckChange ">
											{{ item.label }}
										</el-checkbox>
									</div>
								</template>
							</el-scrollbar>
						</el-popover>
					</el-button-group>
				</div>
			</div>
			<div class="table-content">
				<el-table ref="table" v-loading=" tableLoading " :default-sort=" sortInfo " :data=" tableData "
					border stripe :height=" tableHeight " @sort-change=" sortChange " style="width: 100%">
					<el-table-column type="selection" width="55" />
					<!-- 类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间 -->
					<template v-for="(item, index) in entityFileds" :key="item.prop">
						<template v-if=" item.masteShow || item.show_ ">
							<template v-if=" item.customer ">
								<!-- 自定义列 -->
								<el-table-column :prop=" item.prop " :label=" item.label "
									:width=" item.width " :fixed=" item.fixed " resizable
									:sortable=" item.canSort " :align=" item.align ">
									<template #default=" scope ">
										<slot :name=" 'cell-' + item.prop " :item=" item "
											:index=" scope.$index " :row=" scope.row "></slot>
									</template>
								</el-table-column>
							</template>
							<template v-else>
								<template v-if=" item.type == '1' || item.type == '2' ">
									<el-table-column :prop=" item.prop " :label=" item.label "
										:width=" item.width " :fixed=" item.fixed " resizable
										:sortable=" item.canSort " :align=" item.align " />
								</template>
								<template v-else-if=" item.type == '3' ">
									<el-table-column :prop=" item.prop " :label=" item.label "
										:width=" item.width " :fixed=" item.fixed " resizable
										:sortable=" item.canSort " :align=" item.align " />
								</template>
								<template v-else-if=" item.type == '4' || item.type == '9' ">
									<el-table-column :prop=" item.prop " :label=" item.label "
										:width=" item.width " :fixed=" item.fixed " resizable
										:sortable=" item.canSort " :align=" item.align ">
										<template #default=" scope ">
											{{ scope.row[item.prop] ? new
													Date( scope.row[item.prop] ).format( item.format ?
														item.format : "YYYY-MM-DD HH: mm: ss" ) : ''
											}}
										</template>
									</el-table-column>
								</template>
								<template v-else-if=" item.type == '5' ">
									<template v-if=" item.multiple ">
										<el-table-column :prop=" item.prop " :label=" item.label "
											:width=" item.width " :fixed=" item.fixed " resizable
											:sortable=" item.canSort " :align=" item.align ">
											<template #default=" scope ">
												<template v-if=" scope.row[item.prop] "
													v-for="(cellitem, cellindex) in scope.row[item.prop]">
													{{ cellitem ? cellitem[item.showLabelKey]
															: ''
													}};
												</template>
											</template>
										</el-table-column>
									</template>
									<template v-else>
										<el-table-column :prop=" item.prop " :label=" item.label "
											:width=" item.width " :fixed=" item.fixed " resizable
											:sortable=" item.canSort " :align=" item.align ">
											<template #default=" scope ">
												{{ scope.row[item.prop] ?
														scope.row[item.prop][item.showLabelKey] : ''
												}}
											</template>
										</el-table-column>
									</template>
								</template>
								<template v-else-if=" item.type == '6' ">
									<el-table-column :prop=" item.prop " :label=" item.label "
										:width=" item.width " :fixed=" item.fixed " resizable
										:sortable=" item.canSort " :align=" item.align ">
										<template #default=" scope ">
											<a v-if=" scope.row[item.prop] " :href=" item.url ">{{
													scope.row[item[prop]]
											}}</a>
										</template>
									</el-table-column>
								</template>
								<template v-else-if=" item.type == '7' ">
									<el-table-column :prop=" item.prop " :label=" item.label "
										:width=" item.width " :fixed=" item.fixed " resizable
										:sortable=" item.canSort " :align=" item.align ">
										<template #default=" scope ">
											<el-image v-if=" scope.row[item.prop] "
												:src=" scope.row[item.prop] " />
										</template>
									</el-table-column>
								</template>
								<template v-else-if=" item.type == '8' ">
									<el-table-column :prop=" item.prop " :label=" item.label "
										:width=" item.width " :fixed=" item.fixed " resizable
										:sortable=" item.canSort " :align=" item.align ">
										<template #default=" scope ">
											<template v-if=" item.dicts "
												v-for="(dictitem, dictindex) in item.dicts"
												:key="dictitem.value">
												<template
													v-if=" dictitem.value == scope.row[item.prop] ">
													<el-tag size="small">
														{{ dictitem.label }}
													</el-tag>
												</template>
											</template>
										</template>
									</el-table-column>
								</template>
							</template>
						</template>
					</template>
					<el-table-column label="操作" fixed="right" align="center" :width=" optionColWidth ">
						<template #default=" scope ">
							<el-button-group>
								<el-button size="small" type="warning" v-if=" edit "
									@click=" handleEdit( scope.$index, scope.row ) " icon="Edit">
								</el-button>
								<el-button size="small" type="success"
									@click=" handleInfo( scope.$index, scope.row ) " icon="View">
								</el-button>
								<el-button size="small" v-if=" delete_ " type="danger"
									@click=" handleDelete( scope.$index, scope.row ) " icon="Delete">
								</el-button>
								<slot name="row-btns" :index=" scope.$index " :row=" scope.row "></slot>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="table-page">
				<el-pagination v-model:currentPage=" pageInfo.pageNo " v-model:page-size=" pageInfo.pageSize "
					:page-sizes=" [15, 30, 50, 100, 200] " background
					layout="total, sizes, prev, pager, next, jumper" :total=" pageInfo.totalData "
					@size-change=" pageSizeChange " @current-change=" pageNoChange " />
			</div>
		</el-card>
	</div>

	<!-- 编辑表单 -->
	<SmartDialogForm v-if=" showForm " :data=" curEditData " :url=" infourl " :saveurl=" saveurl "
		:entityType=" entityType " title="编辑数据" @closed=" saveEnd ">
	</SmartDialogForm>

	<!--详情界面 -->
	<SmartDialogView v-if=" showView " :data=" curEditData " :url=" infourl " :entityType=" entityType " title="数据详情"
		:edit=" edit " @closed=" showView = false " @toForm=" toForm ">
		<template #btns>
			<slot name="view-btns" :data=" curEditData "></slot>
		</template>
	</SmartDialogView>
</template>

<script setup>
import {
	ref,
	reactive,
	onMounted,
	onUnmounted,
	nextTick
} from 'vue'

import api from "@/api/api.js";
import utils from "@/utils/utils.js";
import {
	useRouter,
	useRoute
} from 'vue-router'
import {
	useStore
} from "vuex";

//编辑表单
import SmartDialogForm from "../SmartForm/SmartDialogForm.vue";
//详情界面
import SmartDialogView from "../SmartView/SmartDialogView.vue";

const router = useRouter()
const route = useRoute()

let store = useStore();

//表格实例
const table = ref( null );

//传递的参数
const option = defineProps( {
	//实体的类型说明
	entityType: {
		type: String,
		required: true
	},
	//加载table数据的url地址
	url: {
		type: String,
		required: true
	},
	//是否可编辑
	edit: {
		type: Boolean,
		default: true
	},
	//加载数据详情的url地址
	infourl: {
		type: String,
		required: true
	},
	//数据编辑保存的url地址i
	saveurl: {
		type: String,
		required: true
	},
	//是否可删除
	delete_: {
		type: Boolean,
		default: true
	},
	//是否可导出
	export_: {
		type: Boolean,
		default: false
	},
	//删除数据url地址
	deleteUrl: {
		type: String,
		required: false
	},
	//批量删除全部数据url地址
	deleteBatchAllUrl: {
		type: String,
		required: false
	},
	//批量删除选中数据url地址
	deleteBatchCheckUrl: {
		type: String,
		required: false
	},
	//批量导出全部数据url地址
	exportBatchAllUrl: {
		type: String,
		required: false
	},
	//批量导出选中数据url地址
	exportBatchCheckUrl: {
		type: String,
		required: false
	},
	//操作列的宽度
	optionColWidth: {
		type: String,
		default: '120px'
	}
} )

//自定义事件
const emits = defineEmits( ['add'] );
//添加数据
const add = () => {
	for ( let key in curEditData ) {
		delete curEditData[key];
	}
	showForm.value = true;
	emits( 'add', curEditData );
}
//当前编辑的的数据
let curEditData = reactive( {} );
//是否正在编辑或者添加
const showForm = ref( false );
//是否详情界面
const showView = ref( false );
//快捷搜索框
const searchForm = reactive( {
	type: '',
	value: ''
} );
//当前快捷搜索的字段配置
const curSearchFiled = reactive( {} );
//快捷搜索栏目的开发
const searchTypeChange = ( value ) => {
	for ( let key in curSearchFiled ) {
		delete curSearchFiled[key];
	}
	entityFileds.forEach( ( item, index ) => {
		if ( value == item.prop ) {
			for ( let key in item ) {
				curSearchFiled[key] = item[key];
			}
		}
	} )
	searchForm.value = '';
	if ( cursSearchPama[searchForm.type] ) {
		searchForm.value = cursSearchPama[searchForm.type];
	}
}

//高级筛选
const searchFilterForm = reactive( {} );
//是否展示高级筛选的标识
const searchFilterBox = ref( false );
//展示高级筛选框
const showSearchFilterBox = () => {
	if ( !searchFilterBox.value ) {
		searchFilterForm[searchForm.type] = searchForm.value;
		searchFilterBox.value = true;
	} else {
		searchFilterBox.value = false;
	}
	nextTick( () => {
		resizeTableHeight();
	} );
}
//隐藏高级筛选框
const hideSearchFilterBox = () => {
	searchFilterBox.value = false;
	nextTick( () => {
		resizeTableHeight();
	} );
}
//高级筛选
const onSearchFilterSubmit = () => {
	pageInfo.pageNo = 1;
	pageInfo.totalData = 0;
	nextTick( () => {
		resizeTableHeight();
	} );
	loadData();
}
//根据字段加载对应的关联数据
const loadDataByFiled = ( node, resolve ) => {
	if ( node.isLeaf ) return resolve( [] )
	let curFileItem = null;
	entityFileds.forEach( ( item, index ) => {
		if ( item.prop == node.store.props.prop ) {
			curFileItem = item;
		}
	} );
	if ( !curFileItem ) {
		return resolve( [] );
	}

	let url = curFileItem.url;
	if ( url ) {
		curFileItem.ladding = true;
		//加载实体的配置
		let pama = {
			id: node.data ? node.data.id : null
		};
		// pama[curFileItem.showLabelKey] = value ? value : null;
		api.post( url, JSON.stringify( pama ) ).then( ( res ) => {
			curFileItem.ladding = false;
			if ( !res || res.status != 200 || !res.data || res.data.code != 888 || !res.data.data ) {
				if ( res.data.msg ) {
					utils.showError( res.data.msg );
				} else {
					utils.showError( "加载异常" );
				}
				return;
			}
			curFileItem.datas.splice( 0, curFileItem.datas.length );
			curFileItem.datas.push( ...res.data.data );

			resolve( res.data.data );
		} ).catch( ( error ) => {
			curFileItem.ladding = false;
			utils.showError( "加载异常" );
		} );
	}
}

//表格的高度
const tableHeight = ref( null );
const resizeTableHeight = () => {
	let pageRef = document.getElementById( "pane-" + router.currentRoute.value.path );
	let pageHeight = pageRef.clientHeight;

	let tableBtnBoxEle = pageRef.getElementsByClassName( "table-btn-box" );
	let tabBtnHeight = 0;
	if ( tableBtnBoxEle && tableBtnBoxEle.length > 0 ) {
		tabBtnHeight = tableBtnBoxEle[0].clientHeight;
	}

	let searchTagEle = pageRef.getElementsByClassName( "search-tag" )
	let searchTagHeight = 0;
	if ( searchTagEle && searchTagEle.length > 0 ) {
		searchTagHeight = searchTagEle[0].clientHeight;
	}

	let toolsBarEle = pageRef.getElementsByClassName( "tools-bar" );
	let toolsHeight = 0;
	if ( toolsBarEle && toolsBarEle.length > 0 ) {
		toolsHeight = toolsBarEle[0].clientHeight;
	}

	let tablePageEle = pageRef.getElementsByClassName( "table-page" );
	let tablePageHeight = 0;
	if ( tablePageEle && tablePageEle.length > 0 ) {
		tablePageHeight = tablePageEle[0].clientHeight;
	}

	let filterHeight = 0;
	if ( searchFilterBox.value ) {
		let searchFilterBoxEle = pageRef.getElementsByClassName( "search-filter-box" );
		if ( searchFilterBoxEle && searchFilterBoxEle.length > 0 ) {
			filterHeight = searchFilterBoxEle[0].clientHeight + 4;
		}
	}

	tableHeight.value = ( pageHeight - tabBtnHeight - searchTagHeight - toolsHeight - tablePageHeight -
		filterHeight - 4 - 40 ) +
		"px";

	table.value.doLayout();
}

//实体配置
const entityFileds = reactive( [] );
//表格数据
const tableData = reactive( [] );
//标识当前表格是否正在加载数据
const tableLoading = ref( false );
//当前搜索的对象
const cursSearchPama = reactive( {} );
//移除筛选项
const removeSearchItem = ( prop ) => {
	delete cursSearchPama[prop];
	if ( searchForm.type == prop ) {
		searchForm.value = "";
	}
	searchFilterForm[prop] = "";
	onSearchFilterSubmit();
}
//根据字段名获取对应的显示名
const getLabelByProp = ( prop ) => {
	for ( let i = 0; i < entityFileds.length; i++ ) {
		if ( entityFileds[i].prop == prop ) {
			return entityFileds[i].label;
		}
	}
	return "";
}
//列选择是否多选
const tableColCheckAll = ref( false );
//表格列选择多选
const tableColCheckAllChange = () => {
	for ( let i = 0; i < entityFileds.length; i++ ) {
		if ( tableColCheckAll.value ) {
			entityFileds[i].show_ = true;
		} else {
			entityFileds[i].show_ = entityFileds[i].masteShow;
		}
	}
}
//列选择改变
const tableColCheckChange = () => {
	let isAll = true;
	for ( let i = 0; i < entityFileds.length; i++ ) {
		if ( entityFileds[i].show && !entityFileds[i].show_ ) {
			isAll = false;
			break;
		}
	}
	tableColCheckAll.value = isAll;
}
//分页信息
const pageInfo = reactive( {
	pageSize: 15,
	pageNo: 1,
	totalData: 0
} );
//当前的排序字段
const sortInfo = reactive( {} );
//分页每页总条数发生变化
const pageSizeChange = ( pageSize ) => {
	pageInfo.pageSize = pageSize;
	loadData();
}
//分页页码发生变化
const pageNoChange = ( pageNo ) => {
	pageInfo.pageNo = pageNo;
	loadData();
}
//加载当前页数据
const refresh = () => {
	loadData();
}
//从第一页开始加载
const searchData = () => {
	pageInfo.pageNo = 1;
	pageInfo.totalData = 0;
	loadData();
}
//排序有变动
const sortChange = ( sort ) => {
	for ( let key in sortInfo ) {
		delete sortInfo[key];
	}
	sortInfo[sort.prop] = sort.order;
	searchData();
}
//导出数据
const exportData = ( commond ) => {
	if ( commond == 'all' ) {
		//TODO 将cursSearchPama参数传递到后台进行操作
	} else {
		let rows = table.value.getSelectionRows();
		if ( !rows || rows.length <= 0 ) {
			utils.showError( "请至少选择一条数据" );
			return;
		}
		//TODO 调用后台导出数据

	}
}
//删除数据
const deleteData = ( commond ) => {
	if ( commond == 'all' ) {
		//TODO 将cursSearchPama参数传递到后台进行操作
		utils.confirm( "确定要删除这些数据吗？", ( res ) => {
			if ( res == 'ok' ) {
				utils.showLoadding();
				api.post( option.deleteBatchAllUrl, JSON.stringify( {
					entity: cursSearchPama
				} ) ).then( ( res ) => {
					utils.hideLoadding();
					if ( !res || res.status != 200 || !res.data || res.data.code != 888 ) {
						if ( res.data.msg ) {
							utils.showError( res.data.msg );
						} else {
							utils.showError( "删除异常" );
						}
						return;
					}

					loadData();
				} ).catch( ( error ) => {
					utils.hideLoadding();
					utils.showError( "删除异常" );
				} );
			}
		} );
	} else {
		let rows = table.value.getSelectionRows();
		if ( !rows || rows.length <= 0 ) {
			utils.showError( "请至少选择一条数据" );
			return;
		}
		let ids = [];
		for ( let i = 0; i < rows.length; i++ ) {
			ids.push( rows[i].id );
		}
		//TODO 调用后台导出数据
		utils.confirm( "确定要删除这些数据吗？", ( res ) => {
			if ( res == 'ok' ) {
				utils.showLoadding();
				api.post( option.deleteBatchCheckUrl, JSON.stringify( {
					ids: rows
				} ) ).then( ( res ) => {
					utils.hideLoadding();
					if ( !res || res.status != 200 || !res.data || res.data.code != 888 ) {
						if ( res.data.msg ) {
							utils.showError( res.data.msg );
						} else {
							utils.showError( "删除异常" );
						}
						return;
					}

					loadData();
				} ).catch( ( error ) => {
					utils.hideLoadding();
					utils.showError( "删除异常" );
				} );
			}
		} );
	}
}
//编辑
const handleEdit = ( index, row ) => {
	for ( let key in row ) {
		curEditData[key] = row[key];
	}
	showForm.value = true;
	// utils.showMsg("编辑" + JSON.stringify(row));
}
//详情
const handleInfo = ( index, row ) => {
	for ( let key in row ) {
		curEditData[key] = row[key];
	}
	showView.value = true;
	// utils.showMsg("详情" + JSON.stringify(row));
}
//转到编辑界面
const toForm = ( data ) => {
	showForm.value = true;
	// utils.showMsg("编辑" + JSON.stringify(row));
}
//转到编辑界面
const saveEnd = () => {
	showForm.value = false;
	refresh();
}
//删除
const handleDelete = ( index, row ) => {
	utils.confirm( "确定要删除此数据吗？", ( res ) => {
		if ( res == 'ok' ) {
			utils.showLoadding();
			api.post( option.deleteUrl, JSON.stringify( {
				id: row.id
			} ) ).then( ( res ) => {
				utils.hideLoadding();
				if ( !res || res.status != 200 || !res.data || res.data.code != 888 ) {
					if ( res.data.msg ) {
						utils.showError( res.data.msg );
					} else {
						utils.showError( "删除异常" );
					}
					return;
				}
				loadData();
			} ).catch( ( error ) => {
				utils.hideLoadding();
				utils.showError( "删除异常" );
			} );
		}
	} );
}
//加载分页数据
const loadData = () => {
	tableLoading.value = true;

	//获取当前搜索参数
	if ( searchFilterBox.value ) { //2.高级筛选弹出的时候取高级筛选的参数
		for ( let key in cursSearchPama ) {
			delete cursSearchPama[key];
		}
		for ( let key in searchFilterForm ) {
			if ( searchFilterForm[key] ) {
				cursSearchPama[key] = searchFilterForm[key];
			}
		}

		if ( cursSearchPama[searchForm.type] ) {
			searchForm.value = cursSearchPama[searchForm.type];
		}
	} else { //1.高级筛选没有的弹出的时候取快捷筛选
		if ( searchForm.value ) {
			cursSearchPama[searchForm.type] = searchForm.value;
		} else {
			delete cursSearchPama[searchForm.type];
		}
	}

	api.post( option.url, JSON.stringify( {
		entity: cursSearchPama,
		page: {
			sort: sortInfo,
			pageNo: pageInfo.pageNo,
			pageSize: pageInfo.pageSize
		}
	} ) ).then( ( res ) => {
		tableLoading.value = false;
		if ( !res || res.status != 200 || !res.data || res.data.code != 888 || !res.data.data ) {
			if ( res.data.msg ) {
				utils.showError( res.data.msg );
			} else {
				utils.showError( "加载异常" );
			}
			return;
		}
		tableData.splice( 0, tableData.length );
		if ( res.data.data.lists ) {
			tableData.push( ...res.data.data.lists );
		}
		//设置页码数据
		pageInfo.pageNo = res.data.data.pageNo;
		pageInfo.totalData = res.data.data.total;
	} ).catch( ( error ) => {
		tableLoading.value = false;
		utils.showError( "加载异常" );
	} );
}

onMounted( () => {
	resizeTableHeight();
	window.onresize = () => {
		resizeTableHeight();
	}

	//加载实体的配置
	api.post( "/api/entityType", JSON.stringify( {
		owonClass: option.entityType
	} ) ).then( ( res ) => {
		if ( !res || res.status != 200 || !res.data || res.data.code != 888 || !res.data.data ) {
			if ( res.data.msg ) {
				utils.showError( res.data.msg );
			} else {
				utils.showError( "加载异常" );
			}
			return;
		}
		entityFileds.splice( 0, entityFileds.length );
		entityFileds.push( ...res.data.data );

		//默认选中第一个可搜索的字段作为搜索类型
		let fristSearchItem = null;
		for ( let ley in searchFilterForm ) {
			delete searchFilterForm[key];
		}
		entityFileds.forEach( ( item, index ) => {
			if ( item.canSearch ) {
				searchFilterForm[item.prop] = "";
			}
			item.show_ = item.masteShow;

			//类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
			if ( item.canSearch && item.type == '5' ) {
				entityFileds[index].datas = [];
				entityFileds[index].loadding = false;
			}
			if ( ( item.canDefaultSearch || item.canSearch || item.show || item.masteShow ) &&
				item.type == '8' ) {
				entityFileds[index].dicts = [];
				loadFiledDictByKey( item.prop, item.key );
			}
			if ( !fristSearchItem && item.canDefaultSearch ) {
				fristSearchItem = item;
			}
		} )
		if ( fristSearchItem ) {
			searchTypeChange( fristSearchItem.prop );
			searchForm.type = fristSearchItem.prop;
		}
		//初始化加载数据
		loadData();
	} ).catch( ( error ) => {
		utils.showError( "加载异常" );
	} );
} );

//加载数据字典对应的选项
const loadFiledDictByKey = ( prop, key ) => {
	let cacheData = store.getters.listDictByKey;
	if ( cacheData && cacheData[key] ) {
		entityFileds.forEach( ( item, index ) => {
			if ( item.prop == prop ) {
				entityFileds[index].dicts = store.getters.listDictByKey[key];
			}
		} )
		return;
	}
	//加载实体的配置
	api.post( "/api/dict/listDictByKey", JSON.stringify( {
		key: key
	} ) ).then( ( res ) => {
		if ( !res || res.status != 200 || !res.data || res.data.code != 888 || !res.data.data ) {
			if ( res.data.msg ) {
				utils.showError( res.data.msg );
			} else {
				utils.showError( "加载异常" );
			}
			return;
		}
		entityFileds.forEach( ( item, index ) => {
			if ( item.prop == prop ) {
				entityFileds[index].dicts = res.data.data;
			}
		} )
		store.commit( 'setDict', key, res.data.data );
	} ).catch( ( error ) => {
		utils.showError( "加载异常" );
	} );
}

defineExpose( {
	toForm,
	refresh,
	searchData,
	table
} );
</script>

<style scoped>
.content {
	margin-top: 10px;
}

.content:deep(.el-card__body) {
	--el-card-padding: 10px
}

.content:deep(.el-divider--horizontal) {
	margin: 0px 0;
}

.table-btn-box {
	padding: 10px 0;
}


.search-tag {
	padding: 5px 0;
}

.search-label {
	font-size: 14px;
	line-height: 32px;
	margin-right: 5px;
}

.search-box:deep(.el-form-item) {
	margin-bottom: 0;
	margin-right: 10px;
}

.search-box:deep(.type-select) {
	width: 150px;
}

.search-box:deep(.value-filed) {
	width: 220px;
}

.search-box:deep(.value-date-filed) {
	width: 200px;
}

.table-box {
	margin-top: 10px;
}

.tools-bar {
	padding: 5px 0;
}

.table-content {}

.table-page {
	padding-top: 10px;
}

.search-filter-box {
	margin-bottom: 10px;
}

.search-filter-form {
	margin-top: 10px;
}

.search-filter-form-flex {
	display: flex;
	flex-wrap: wrap;
}

.search-filter-form-flex .search-filter-form-item {
	width: 45%;
	max-width: 350px;
	margin-bottom: 10px;
}

.search-filter-form-flex .search-filter-form-item:deep(.el-input),
.search-filter-form-flex .search-filter-form-item:deep(.el-select),
.search-filter-form-flex .search-filter-form-item:deep(.el-date-editor) {
	width: 220px
}

.search-filter-form-btns {
	text-align: center;
}

.search-item {
	margin-right: 10px;
}

.search-item-empty {
	font-size: 12px;
}
</style>
