<template>
	<div class="page">
		<div class="data-chart flex">
			<div class="flex-item data-chart-item">
				<div class="title">数据统计一</div>
				<div class="flex">
					<div class="icon" style="color: #3f51b5;">
						<el-icon>
							<CirclePlus />
						</el-icon>
					</div>
					<div class="flex-item value">543543</div>
					<div class="tongbi">12.2%</div>
				</div>
			</div>
			<div class="data-chart-item-split"></div>
			<div class="flex-item data-chart-item">
				<div class="title">数据统计一</div>
				<div class="flex">
					<div class="icon" style="color: #2196f3;">
						<el-icon>
							<House />
						</el-icon>
					</div>
					<div class="flex-item value">543543</div>
					<div class="tongbi">12.2%</div>
				</div>
			</div>
			<div class="data-chart-item-split"></div>
			<div class="flex-item data-chart-item">
				<div class="title">数据统计一</div>
				<div class="flex">
					<div class="icon" style="color: #ff9800;">
						<el-icon>
							<Hide />
						</el-icon>
					</div>
					<div class="flex-item value">543543</div>
					<div class="tongbi">12.2%</div>
				</div>
			</div>
			<div class="data-chart-item-split"></div>
			<div class="flex-item data-chart-item">
				<div class="title">数据统计一</div>
				<div class="flex">
					<div class="icon" style="color: #ff5722;">
						<el-icon>
							<Compass />
						</el-icon>
					</div>
					<div class="flex-item value">543543</div>
					<div class="tongbi">12.2%</div>
				</div>
			</div>
		</div>
		<div class="chart-demo">
			<div class="flex">
				<div class="flex-item">
					<el-card class="box-card">
						<template #header>
							<div class="card-header">
								<span>折线图实例</span>
							</div>
						</template>
						<v-chart ref="lineChart" class="line-chart" :option="lineChartOption"></v-chart>
					</el-card>
				</div>
				<div class="data-chart-item-split"></div>
				<div class="flex-item">
					<el-card class="box-card">
						<template #header>
							<div class="card-header">
								<span>柱状图实例</span>
							</div>
						</template>
						<v-chart ref="barChart" class="bar-chart" :option="barChartOption"></v-chart>
					</el-card>
				</div>
			</div>
		</div>
		<div class="table-demo">
			<el-card class="box-card">
				<template #header>
					<div class="card-header">
						<span>表格实例</span>
					</div>
				</template>
				<el-table :data="tableData" stripe border style="width: 100%;" :row-class-name="table-demo">
					<el-table-column prop="name" label="标题" width="180" />
					<el-table-column prop="date" label="日期" width="180" />
					<el-table-column prop="address" label="地址" width="250" />
					<el-table-column prop="description" label="备注" />
				</el-table>
				<el-pagination style="margin-top: 10px;" :page-sizes="[100, 200, 300, 400]" :small="small"
					:disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
					:total="10" />
			</el-card>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from 'vue'

	import VChart, {
		THEME_KEY
	} from "vue-echarts";
	import * as echarts from 'echarts';

	import {
		useDark,
		useToggle
	} from '@vueuse/core'

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";
	import config from "@/store/config.js";

	import {
		useStore
	} from "vuex";

	import {
		useRouter,
		useRoute
	} from 'vue-router'

	const router = useRouter()
	const route = useRoute()

	let store = useStore();
	//当前用户信息
	const userinfo = store.getters.getUserInfo;

	//echarts
	const $echarts = echarts;
	//折线图的参数
	const lineChart = ref(null);
	const lineChartOption = reactive({
		grid: {
			left: '6%',
			top: '2%',
			right: '3%',
			bottom: '8%'
		},
		xAxis: {
			boundaryGap: false,
			type: 'category',
			data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			data: [820, 932, 901, 934, 1290, 1330, 1320],
			type: 'line',
			smooth: true,
			itemStyle: {
				color: '#409EFF'
			}
		}]
	});
	//柱状图的参数
	const barChart = ref(null);
	const barChartOption = reactive({
		grid: {
			left: '6%',
			top: '2%',
			right: '3%',
			bottom: '8%'
		},
		xAxis: {
			type: 'category',
			data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			data: [820, 932, 901, 934, 1290, 1330, 1320],
			type: 'bar',
			smooth: true,
			itemStyle: {
				borderRadius: [20],
				color: '#F56C6C'
			},
			barWidth: '20%'
		}]
	});

	//表格数据
	const tableData = reactive([{
		name: 'xxxx',
		date: '2022-08-30 11:32:21',
		address: '西安市雁塔区XXXX',
		descrition: ''
	}, {
		name: 'xxxx',
		date: '2022-08-30 11:32:21',
		address: '西安市雁塔区XXXX',
		descrition: ''
	}, {
		name: 'xxxx',
		date: '2022-08-30 11:32:21',
		address: '西安市雁塔区XXXX',
		descrition: ''
	}, {
		name: 'xxxx',
		date: '2022-08-30 11:32:21',
		address: '西安市雁塔区XXXX',
		descrition: ''
	}, {
		name: 'xxxx',
		date: '2022-08-30 11:32:21',
		address: '西安市雁塔区XXXX',
		descrition: ''
	}, {
		name: 'xxxx',
		date: '2022-08-30 11:32:21',
		address: '西安市雁塔区XXXX',
		descrition: ''
	}, {
		name: 'xxxx',
		date: '2022-08-30 11:32:21',
		address: '西安市雁塔区XXXX',
		descrition: ''
	}, {
		name: 'xxxx',
		date: '2022-08-30 11:32:21',
		address: '西安市雁塔区XXXX',
		descrition: ''
	}]);

	onMounted(() => {
		window.onresize = () => {
			lineChart && lineChart.value.resize();
			barChart && barChart.value.resize();
		};
	});
</script>

<style scoped>
	.data-chart {
		margin: 10px 0;
	}

	.data-chart-item-split {
		width: 10px;
		height: 10px;
	}

	.data-chart .data-chart-item {
		background: var(--el-bg-color-overlay);
		border-radius: 4px;
		height: 80px;
		padding: 10px 15px;
		cursor: pointer;
		box-shadow: var(--el-box-shadow-light);
	}

	.data-chart .data-chart-item:hover {
		background: var(--el-fill-color-dark);
	}

	.data-chart .data-chart-item .title {
		font-size: 18px;
		line-height: 45px;
		letter-spacing: 2px;
		font-weight: 400;
		color: var(--el-color-info-light-3);
	}

	.data-chart .data-chart-item .icon {
		font-size: 20px;
		line-height: 40px;
		margin-right: 10px;
	}

	.data-chart .data-chart-item .value {
		font-size: 18px;
		line-height: 36px;
	}

	.data-chart .data-chart-item .tongbi {
		font-size: 16px;
		line-height: 36px;
	}

	.chart-demo {}

	.line-chart,
	.bar-chart {
		height: 300px;
		width: calc(100% - 30px);
	}

	.table-demo {
		margin: 10px 0;
	}
</style>
