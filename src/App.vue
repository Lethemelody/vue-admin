<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import utils from "@/utils/utils.js";
import api from "@/api/api.js";
import config from "../src/store/config.js";

let curTheme = config.curTheme;

const router = useRouter();
const route = useRoute();

let store = useStore();

//路由守卫
router.beforeEach((to, from) => {
	if (store.getters.isLogin) {
		if (!to.meta.requireAuth) {
			//当前已经登录，但是转到了无需登录的界面，1.不让跳转，2自动登出
			return false;
		}
	} else {
		if (to.meta.requireAuth) {
			router.push({
				path: "/SpecLogin",
				query: {
					redirect: to.fullPath,
				},
			});
			return false;
		}
	}
	return true;
});
onMounted(function () {
	//从本地读取token和userinfo判断是否已经登录
	let token = utils.getData("token");
	let userinfo = utils.getData("userinfo");
	if (token && userinfo) {
		//使用vuex
		store.commit("setToken", token);
		store.commit("setUserInfo", JSON.parse(userinfo));
		api
			.get("/api/userinfo")
			.then((res) => {
				if (!res || res.status != 200 || !res.data || res.data.code != 888) {
					store.commit("logout");
					router.replace({
						path: "/SpecLogin",
						query: {
							redirect: router.currentRoute.fullPath,
						},
					});
					return;
				}
			})
			.catch(function (error) {
				store.commit("logout");
				router.replace({
					path: "/SpecLogin",
					query: {
						redirect: router.currentRoute.fullPath,
					},
				});
			});
	}
});
</script>

<template>
	<div :class="[curTheme]">
		<router-view></router-view>
	</div>
</template>

<style>
@import url(styles/default.css);
@import url(styles/theme/default.css);

html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0 !important;
}
</style>
