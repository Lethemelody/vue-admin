<template>
	<div class="qcode" :class="[curTheme]">
		<img :src="qcodeSrc" @click="getQcode" :class="{'end':curTime<=0}" />
		<div class="info">请使用微信或者客户端APP扫描登录系统</div>
		<div class="endInfo" @click="getQcode" v-if="curTime<=0">二维码已失效，点击重新加载</div>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from "vue";

	import {
		useStore
	} from "vuex";

	import {
		useRouter,
		useRoute
	} from 'vue-router'

	import api from "@/api/api.js";
	import utils from "@/utils/utils.js";
	import config from "@/store/config.js";

	let curTheme = config.curTheme;

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
		},
		bgColor: {
			type: String,
			default: '#00000055',
			required: false
		}
	})

	//定时器
	let timer = null;
	//定时器的时间
	let curTime = ref(60);

	let store = useStore();
	const router = useRouter()
	const route = useRoute()

	//二维码路径
	const qcodeSrc = ref("");
	//二维码返回的标识，用于判断当前的二维码是否已经扫码并且登陆完成。
	let codetoken = "233213";

	//从后台获取二维码图片
	const getQcode = () => {
		qcodeSrc.value = new URL("../../../assets/qcode.png",
			import.meta.url).href;

		curTime.value = 60;
		timer && clearInterval(timer);
		timer = setInterval(() => {
			curTime.value--;

			//加载接口判断当前是否已经登录成功
			checkLogin();

			if (curTime.value <= 0) {
				timer && clearInterval(timer);
			}
		}, 3000);
	}

	//通过接口判断当前的二维码是否已经扫码并完成了登录
	const checkLogin = () => {
		api.post("/api/login/checkqcode", JSON.stringify({
			codetoken: codetoken
		})).then((res) => {
			if (!res || res.status != 200 || !res.data || res.data.code != 888) {
				return;
			}
			//1.将传递过来的token进行本次存储及vuex存储
			let token = res.data.token;
			//使用vuex
			store.commit('setToken', token);

			//2.将当前登录的用户信息进行本地及vuex存储
			let userinfo = res.data.data;
			store.commit('setUserInfo', userinfo);

			//转到主页
			router.push({
				path: "/Index/Home"
			});
		}).catch(function(error) {});
	}

	onMounted(() => {
		getQcode();
	});
	onUnmounted(() => {
		timer && clearInterval(timer);
	});
</script>

<style scoped="scoped">
	.theme-default .qcode {
		padding: 20px;
		background: v-bind(option.bgColor);
		box-shadow: 0 0 20px v-bind(option.bgColor);
		border-radius: 5px;
		height: 305px;
		text-align: center;
		cursor: pointer;
		position: relative;
	}

	.theme-default .qcode img {
		height: calc(100% - 30px)
	}

	.theme-default .qcode .info {
		font-size: 14px;
		line-height: 30px;
		text-align: center;
		color: v-bind(option.textColor);
	}

	.theme-default .qcode .endInfo {
		position: absolute;
		left: 0;
		top: 0;
		color: red;
		font-size: 14px;
		width: 100%;
		height: calc(100% - 30px);
		text-align: center;
		justify-content: center;
		justify-items: center;
		vertical-align: middle;
		align-items: center;
		display: flex;
	}

	.theme-default .qcode .end {
		-webkit-filter: brightness(0.1);
	}
</style>
