<template>
	<el-scrollbar :height="formHeight" class="form-body">
		<el-form ref="form" :model="formData" label-width="100px" class="form" :rules="rules" status-icon
			autocomplete="off">
			<template v-for="(groupitem, groupindex) in groups" :key="groupitem">
				<el-divider class="group-title" content-position="left">{{groupitem}}
				</el-divider>
				<div class="form-flex">
					<template v-for="(item, index) in entityFileds" :key="item.prop">
						<template v-if="item.canEdit && item.group == groupitem">
							<!-- 类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间 -->
							<div class="form-item" v-if="item.type == '1' || item.type == '2'">
								<el-form-item :label="item.label + '：'" :prop="item.prop">
									<el-input v-model="formData[item.prop]" type="number"
										:placeholder="'请输入' + item.label" />
								</el-form-item>
							</div>
							<template v-else-if="item.type == '3' || item.type == '6'">
								<!-- 主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea -->
								<div class="form-item form-textarea-item" v-if="item.inputType == '2'">
									<el-form-item :label="item.label + '：'" :prop="item.prop">
										<el-input type="textarea" rows="10" v-model="formData[item.prop]"
											:placeholder="'请输入' + item.label" />
									</el-form-item>
								</div>
								<div class="form-item form-file-item" v-else-if="item.inputType == '3'">
									<el-form-item :label="item.label + '：'" :prop="item.prop">
										<el-upload class="upload-demo" name="file" limit="1" with-credentials
											:accept="item.fileType" drag :action="item.fileUploadUrl"
											@on-error="fileUploadError" @on-success="fileUploadSuccess"
											@on-progress="fileUploadProgress" @on-remove="fileUploadRemove"
											@on-change="fileUploadChange">
											<el-icon class="el-icon--upload">
												<upload-filled />
											</el-icon>
											<div class="el-upload__text">
												拖动文件到此处或点击选择文件
											</div>
											<template #tip>
												<div class="el-upload__tip">
													{{item.fileType}}且尺寸小于{{item.fileSize}}KB
												</div>
											</template>
										</el-upload>
									</el-form-item>
									<el-progress class="file-progresss" :percentage="item.fileUploadProgress" />
								</div>
								<div class="form-item form-rich-item" v-else-if="item.inputType == '4'">
									<el-form-item :label="item.label + '：'" :prop="item.prop">
										<div class="rich-input-box">
											<Toolbar :editor="item.editRef" :defaultConfig="item.toolbarConfig"
												mode="default" modalAppendToBody />
											<Editor class="rich-input" v-model="formData[item.prop]"
												:defaultConfig="item.editorConfig" mode="default"
												@onCreated="richEditCreated" />
										</div>
									</el-form-item>
								</div>
								<div class="form-item" v-else>
									<el-form-item :label="item.label + '：'" :prop="item.prop">
										<el-input v-model="formData[item.prop]" :placeholder="'请输入' + item.label" />
									</el-form-item>
								</div>
							</template>
							<div class="form-item" v-else-if="item.type == '4'">
								<el-form-item :label="item.label + '：'" :prop="item.prop">
									<el-date-picker v-model="formData[item.prop]" :type="item.dateType"
										:placeholder="'请选择' + item.label" class="value-date-filed" />
								</el-form-item>
							</div>
							<div class="form-item" v-else-if="item.type == '5'">
								<el-form-item :label="item.label + '：'" :prop="item.prop">
									<!-- <el-select v-model="formData[item.prop]" :placeholder="'请选择' + item.label"
										filterable remote :remote-method="loadDataByFiled(item.prop)"
										:loading="item[loadding]" class="value-filed">
										<template v-for="(dataitem, dataindex) in item.datas" :key="dataitem.id">
											<el-option :label="dataitem[item.showLabelKey]" :value="dataitem.id" />
										</template>
									</el-select> -->
									<el-tree-select v-model="formData[item.prop]" :multiple="item.multiple"
										:loading="item.loading" filterable :placeholder="'请选择'+item.label" node-key="id"
										lazy :load="loadDataByFiled" show-checkbox
										:props="{isLeaf:'isLeaf',label:item.showLabelKey,prop:item.prop}" />
								</el-form-item>
							</div>
							<div class="form-item" v-else-if="item.type == '8'">
								<el-form-item :label="item.label + '：'" :prop="item.prop">
									<el-select v-model="formData[item.prop]" :multiple="item.multiple"
										:placeholder="'请选择' + item.label" class="value-filed">
										<template v-for="(dictitem, dictindex) in item.dicts" :key="dictitem.value">
											<el-option :label="dictitem.label" :value="dictitem.value" />
										</template>
									</el-select>
								</el-form-item>
							</div>
							<div class="form-item" v-else-if="item.type == '9'">
								<el-form-item :label="item.label + '：'" :prop="item.prop" s>
									<el-time-picker v-model="formData[item.prop]" :type="item.dateType"
										:placeholder="'请选择' + item.label" class="value-date-filed" />
								</el-form-item>
							</div>
						</template>
					</template>
				</div>
			</template>
		</el-form>
	</el-scrollbar>
</template>
<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted,
		onBeforeUnmount,
		shallowRef,
		nextTick
	} from "vue";
	import {
		useStore
	} from "vuex";

	import '@wangeditor/editor/dist/css/style.css' // 引入 css
	import {
		Editor,
		Toolbar
	} from '@wangeditor/editor-for-vue'
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
		//加载table数据的url地址
		saveurl: {
			type: String,
			required: true,
		},
		//表单的名称
		data: {
			type: Object,
			required: true
		},
		//表单的高度
		formHeight: {
			type: Object,
			required: true
		}
	});

	//表单的实例
	const form = ref(null);

	//实体配置信息
	const entityFileds = reactive([]);
	//高级筛选
	const formData = reactive({});
	//当前编辑实体的数据
	const entityData = reactive({});
	//表单的验证规则
	const rules = reactive({});
	//分组
	const groups = reactive([]);
	//富文本编辑器实例
	// const richEditRef = {};

	onMounted(() => {
		loadEntityConfigData();
	});
	// 组件销毁时，也及时销毁编辑器
	onBeforeUnmount(() => {
		for (let i = 0; i < entityFileds.length; i++) {
			if (entityFileds[i].canEdit && entityFileds[i].type == "3" && entityFileds[i].inputType == "4") {
				const editor = entityFileds[i].editRef.value
				if (editor == null) return
				editor.destroy();
			}
		}
	})

	//富文本创建完成
	const richEditCreated = function(editor) {
		let itemIndex = null;
		for (let i = 0; i < entityFileds.length; i++) {
			if (entityFileds[i].prop == editor.getConfig().prop) {
				itemIndex = i;
				break;
			}
		}
		if (itemIndex) {
			let temp = shallowRef();
			temp.value = editor; // 记录 editor 实例，重要！
			entityFileds[itemIndex].editRef = temp;
			// richEditRef[editor.getConfig().prop] = editor;
		}
	}

	//文件上传异常
	const fileUploadError = function(error, uploadFile, uploadFiles) {
		utils.showError("上传失败！");
	}
	//文件上传成功
	const fileUploadSuccess = function(response, uploadFile, uploadFiles) {
		utils.showSuccess("上传成功");
		//TODO 将上传成功的文件访问地址存储到实体信息里
		// response.body
	}
	//文件上传进度条
	const fileUploadProgress = function(evt, uploadFile, uploadFiles) {
		//TODO 更新进度条的值
	}
	//移除文件
	const fileUploadRemove = function(uploadFile, uploadFiles) {
		//TODO 将实体信息中的对应数据移除
		//TODO 将实体信息中的进度条数据设置为0
		//TODO 调用删除文件接口删除刚才已经上传的文件
	}
	//文件变动
	const fileUploadChange = function(uploadFile, uploadFiles) {
		//TODO 将实体信息中的对应数据移除
		//TODO 将实体信息中的进度条数据设置为0
	}

	//提交表单
	const submit = (callback) => {
		form.value.validate((valid, fields) => {
			if (!valid) {
				if (fields) {
					for (let key in fields) {
						utils.showError(fields[key][0].message);
					}
				}
				callback && callback('error');
				return;
			}

			//提交数据
			console.log(JSON.stringify(formData));

			let pama = {};
			//可编辑的参数
			for (const key in formData) {
				pama[key] = formData[key];
				for (var i = 0; i < entityFileds.length; i++) {
					if (entityFileds[i].prop == key && entityFileds[i].type == '5') {
						if (entityFileds[i].multiple) {
							pama[key] = [];
							if (formData[key]) {
								formData[key].forEach((item, index) => {
									pama[key].push({
										id: item
									});
								});
							}
						} else {
							pama[key] = {
								id: formData[key]
							};
						}
						break;
					}
				}
			}
			//不用编辑但是需要附带的参数
			entityFileds.forEach((item, index) => {
				if (!pama[item.prop] && !item.canEdit) { //不可编辑其它字段，自动附带到参数上
					pama[item.prop] = entityData[item.prop];
				}
			});

			utils.showLoadding();
			api.post(option.saveurl, JSON.stringify(pama)).then((res) => {
				utils.hideLoadding();
				if (!res || res.status != 200 || !res.data || res.data.code != 888) {
					if (res.data && res.data.message) {
						utils.showError(res.data.message);
					} else {
						utils.showError("保存失败！");
					}
					callback && callback('error');
					return;
				}
				utils.showSuccess("保存成功！");
				callback && callback('ok');
			}).catch(function(error) {
				callback && callback('error');
				utils.hideLoadding();
				utils.showError("保存失败！");
			});
		});
	}
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
			for (let ley in formData) {
				delete formData[key];
			}
			entityFileds.forEach((item, index) => {
				if (item.canEdit) {
					let has = false;
					for (let index = 0; index < groups.length; index++) {
						if (groups[index] == item.group) {
							has = true;
						}
					}
					if (!has) {
						groups.push(item.group);
					}
					formData[item.prop] = "";
					if (!item.canNone) {
						rules[item.prop] = [{
							required: true,
							message: '请输入' + item.label,
							trigger: 'blur'
						}];
					}
				}
				//类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				if (item.canEdit && item.type == "3" && item.inputType == "3") {
					entityFileds[index].fileUploadProgress = 0;
				}
				if (item.canEdit && item.type == "3" && item.inputType == "4") {
					entityFileds[index].editRef = null;
					entityFileds[index].toolbarConfig = {};
					entityFileds[index].editorConfig = {
						prop: item.prop,
						placeholder: '请输入' + item.label + '...',
						MENU_CONF: {
							insertVideo: {
								server: item.fileUploadUrl,
								fieldName: option.entityType,

								timeout: 5 * 1000, // 5s
								meta: {
									token: 'xxx'
								},
								metaWithUrl: true, // join params to url
								headers: {
									Accept: 'text/x-json'
								},

								maxFileSize: 10 * 1024 * 1024, // 10M

								onBeforeUpload(file) {
									console.log('onBeforeUpload', file)

									return file // will upload this file
									// return false // prevent upload
								},
								onProgress(progress) {
									console.log('onProgress', progress)
								},
								onSuccess(file, res) {
									console.log('onSuccess', file, res)
								},
								onFailed(file, res) {
									console.log('onFailed', file, res)
								},
								onError(file, err, res) {
									console.error('onError', file, err, res)
								},
								onInsertedVideo(videoNode) {
									console.log('inserted video', videoNode)
								},
							},
							uploadImage: {
								server: item.fileUploadUrl,
								fieldName: option.entityType,
								meta: {
									token: 'xxx'
								},

								timeout: 5 * 1000, // 5s

								metaWithUrl: true, // join params to url
								headers: {
									Accept: 'text/x-json'
								},

								maxFileSize: 10 * 1024 * 1024, // 10M

								base64LimitSize: 5 *
									1024, // insert base64 format, if file's size less than 5kb

								onBeforeUpload(file) {
									console.log('onBeforeUpload', file)

									return file // will upload this file
									// return false // prevent upload
								},
								onProgress(progress) {
									console.log('onProgress', progress)
								},
								onSuccess(file, res) {
									console.log('onSuccess', file, res)
								},
								onFailed(file, res) {
									console.log('onFailed', file, res)
								},
								onError(file, err, res) {
									console.error('onError', file, err, res)
								},
							}
						}
					};
				}
				if (item.canEdit && item.type == "5") {
					entityFileds[index].datas = [];
					entityFileds[index].loadding = false;
				}
				if (item.canEdit && item.type == "8") {
					entityFileds[index].dicts = [];
					loadFiledDictByKey(item.prop, item.key);
				}
			});
			if (option.data && option.data.id) {
				loadEntityData();
			} else if (option.data) {
				for (const key in option.data) {
					entityData[key] = option.data[key];
				}
				//将数据设置到表单的数据
				for (const key in formData) {
					formData[key] = entityData[key];
				}
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
			//将数据设置到表单的数据
			for (const key in formData) {
				formData[key] = entityData[key];
				
				let curFileConfig = null;
				for (var i = 0; i < entityFileds.length; i++) {
					if(entityFileds[i].prop == key){
						curFileConfig = entityFileds[i];
						break;
					}
				}
				if(curFileConfig){
					if ( curFileConfig.type == '5') {
						if (curFileConfig.multiple) {
							formData[key] =[];
							if(entityData[key]){
								entityData[key].forEach((dataitem,dateindex)=>{
									formData[key].push(dataitem.id);
								});
							}
						} else {
							if(entityData[key]){
								formData[key] = entityData[key].id;
							}
						}
					}
				}
			}
		}).catch((error) => {
			utils.showError("加载异常");
		});
	}
	//根据字段加载对应的关联数据
	const loadDataByFiled = (node, resolve) => {
		if (node.isLeaf) return resolve([])
		let curFileItem = null;
		entityFileds.forEach((item, index) => {
			if (item.prop == node.store.props.prop) {
				curFileItem = item;
			}
		});
		if (!curFileItem) {
			return resolve([]);
		}

		let url = curFileItem.url;
		if (url) {
			curFileItem.ladding = true;
			//加载实体的配置
			let pama = {
				id: node.data ? node.data.id : null
			};
			// pama[curFileItem.showLabelKey] = value ? value : null;
			api.post(url, JSON.stringify(pama)).then((res) => {
				curFileItem.ladding = false;
				if (!res || res.status != 200 || !res.data || res.data.code != 888 || !res.data.data) {
					if (res.data.msg) {
						utils.showError(res.data.msg);
					} else {
						utils.showError("加载异常");
					}
					return;
				}
				curFileItem.datas.splice(0, curFileItem.datas.length);
				curFileItem.datas.push(...res.data.data);

				resolve(res.data.data);
			}).catch((error) => {
				curFileItem.ladding = false;
				utils.showError("加载异常");
			});
		}
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

	defineExpose({
		submit
	});
</script>
<style scoped>
	.form {
		margin-top: 10px;
	}

	.form:deep(.el-divider--horizontal) {
		margin: 0px 0;
	}

	.form-flex {
		display: flex;
		flex-wrap: wrap;
	}

	.form-flex .form-item {
		width: 50%;
		margin-bottom: 10px;
	}

	.form-flex .form-textarea-item {
		width: 100%;
		margin-bottom: 10px;
	}

	.form-flex .form-file-item {
		width: 50%;
		margin-bottom: 10px;
	}

	.form-flex .form-file-item:deep(.el-form-item) {
		margin-bottom: 0px;
	}

	.form-flex .form-rich-item {
		width: 100%;
		margin-bottom: 10px;
	}

	.form-flex .form-rich-item:deep(.rich-input-box) {
		border: var(--el-border)
	}

	.form-flex .form-item:deep(.el-input),
	.form-flex .form-item:deep(.el-date-editor) {
		width: 350px;
	}

	.group-title {
		margin-top: 15px !important;
		margin-bottom: 20px !important;
	}

	.group-title:deep(.el-divider__text) {
		font-size: 16px;
		font-weight: bold;
	}

	.file-progresss {
		margin-left: 100px;
		width: 60%;
		margin-bottom: 10px;
	}

	.rich-input {
		width: 100%;
		height: 350px !important;
		border-top: var(--el-border);
	}

	.rich-input:deep(.w-e-text-placeholder) {
		top: 10px;
	}
</style>
