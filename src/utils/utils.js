import {
	ElMessage,
	ElLoading,
	ElMessageBox
} from 'element-plus'


Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"D+": this.getDate(), //日 
		"H+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(Y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
				.length)));
		}
	}
	return fmt;
}


/**
 * 工具方法
 */
const utils = {
	//当前加载动画的实例
	loading: null,
	saveData(key, value) { //记录数据
		localStorage.setItem(key, value);
	},
	removeData(key) { //移除数据
		localStorage.removeItem(key);
	},
	getData(key) { //获取数据
		return localStorage.getItem(key);
	},
	showLoadding(msg) {
		utils.loading = ElLoading.service({
			lock: true,
			text: msg ? msg : '加载中……'
		})
	},
	hideLoadding() {
		utils.loading && utils.loading.close();
	},
	closeAllMsg() {
		ElMessage.closeAll()
	},
	showError: function(msg) { //显示异常提示
		ElMessage({
			message: msg,
			grouping: true,
			type: 'error'
		})
	},
	showSuccess: function(msg) { //显示成功消息提示
		ElMessage({
			message: msg,
			grouping: true,
			type: 'success'
		})
	},
	showWarning(msg) { //显示警告消息提示
		ElMessage({
			message: msg,
			grouping: true,
			type: 'warning'
		})
	},
	showMsg(msg) { //显示消息提示
		ElMessage({
			message: msg,
			grouping: true
		})
	},
	confirm(msg, callback) { //显示确认对话框
		ElMessageBox.confirm(msg, '警告', {
				type: 'warning',
				center: true,
			})
			.then(() => {
				callback && callback('ok');
			})
			.catch(() => {
				callback && callback('cancel');
			})
	},
	check: { //验证字段函数
		checkPhone(phone) { //验证电话号码是否合法
			let phonereg = /^1[3-9][0-9]{9}$/;
			return phonereg.test(phone);
		}
	}
}

export default utils;
