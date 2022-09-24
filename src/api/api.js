import axios from 'axios';
import utils from "@/utils/utils.js";
import store from '@/store'

import {
	useRouter,
	useRoute
} from 'vue-router'

/**
 * 数据加载api
 */
const api = axios.create({
	timeout: 30 * 1000, //请求超时时间
	baseURL: process.env.BASE_API,
	withCredentials: true, //是否允许跨域
	headers: {
		'Content-Type': 'application/json;charset=UTF-8'
	}
});
// 请求拦截器
api.interceptors.request.use(function(config) {
		let token = store.getters.getToken;
		//localStorage.getItem('token');
		if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
			config.headers.token = token;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	});

// 响应拦截器
api.interceptors.response.use(response => {
		return response;
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				/*
				  返回 401 表示前端的token已失效
				  当然，你也可以和后端也定其他的方式来表示token失效
				  需要前端清除Vuex中的token，页面跳转到登陆页
				*/
				case 401:
					store.commit("logout");
					router.replace({
						path: '/SpecLogin',
						query: {
							redirect: router.currentRoute.fullPath
						}
					})
			}
		}
		return Promise.reject(error);
	})

export default api;
