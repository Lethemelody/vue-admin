import {
	createStore
} from 'vuex'

/**
 * 引入utils方法
 */
import utils from "@/utils/utils.js";

// 创建一个新的 store 实例
const store = createStore({
	state() {
		return {
			//当前登录的用户信息
			userinfo: {},
			//当前登录标识token
			token: null,
			//检测当前是否已经登录
			login: false,
			//数据字典的选项
			dicts: {}
		}
	},
	getters: {
		isLogin(state) { //判断当前是否时登录状态
			return state.login;
		},
		getToken(state) { //判断当前是否时登录状态
			return state.token;
		},
		getUserInfo(state) { //判断当前是否时登录状态
			return state.userinfo;
		},
		listDictByKey(state) { //判断当前是否时登录状态
			return state.dicts;
		}
	},
	mutations: {
		setDict(state, key, dicts) {
			state.dicts[key] = dicts;
		},
		setUserInfo(state, userinfo) {
			state.userinfo = userinfo;
			utils.saveData("userinfo", JSON.stringify(userinfo));
		},
		setToken(state, token) {
			state.token = token;
			state.login = true;
			utils.saveData("token", token);
		},
		logout(state) {
			state.token = null;
			state.login = false;
			state.userinfo = null;
			utils.removeData("userinfo");
			utils.removeData("token");
		}
	}
})

export default store;
