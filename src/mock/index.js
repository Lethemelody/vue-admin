import Mock from 'mockjs'
const Random = Mock.Random;
//登录用户的信息
const userinfo = Mock.mock( {
	'id': 1,
	'username': 'admin',
	'name': Random.string( 6 ),
	'email': Random.email(),
	'phone': "18788888888",
	'address': Random.city(),
	'remark': Random.string( 100 ),
	'roles': [{
		"name": Random.string( 6 )
	}, {
		"name": Random.string( 6 )
	}]
} )
//菜单数据
const menudata = [{
	id: 1,
	name: '工作台',
	icon: 'HomeFilled',
	url: '/Index/Home',
	requireAuth: true,
	compomemt: 'HomePage',
	children: []
}, {
	id: 2,
	name: '业务菜单',
	icon: 'FolderRemove',
	url: '/Index/Customer',
	requireAuth: true,
	children: [{
		id: 21,
		name: '列表展示',
		icon: 'FolderRemove',
		url: '/Index/Customer/list',
		compomemt: 'TableDemo',
		requireAuth: true,
	}, {
		id: 22,
		name: '表单展示',
		icon: 'FolderRemove',
		url: '/Index/Customer/form',
		compomemt: 'FormDemo',
		requireAuth: true,
	}, {
		id: 23,
		name: '详情展示',
		icon: 'FolderRemove',
		url: '/Index/Customer/info',
		compomemt: 'ViewDemo',
		requireAuth: true,
	}, {
		id: 24,
		name: '富文本界面',
		icon: 'FolderRemove',
		url: '/Index/Customer/rich',
		compomemt: '/FormDemo/FormDemo.vue',
		requireAuth: true,
	}, {
		id: 25,
		name: '文件上传界面',
		icon: 'FolderRemove',
		url: '/Index/Customer/file',
		compomemt: '/FormDemo/FormDemo.vue',
		requireAuth: true,
	}, {
		id: 26,
		name: '统计图表示例',
		icon: 'FolderRemove',
		url: '/Index/Customer/chart',
		compomemt: '/TableDemo/TableDemo.vue',
		requireAuth: true,
	}]
}, {
	id: 3,
	name: '基础数据',
	icon: 'DataLine',
	url: '/Index/data',
	requireAuth: true,
	children: [{
		id: 31,
		name: '消息管理',
		icon: 'FolderRemove',
		url: '/Index/data/msg',
		compomemt: '/Data/Message/Message.vue',
		requireAuth: true,
	}, {
		id: 32,
		name: '实体配置',
		icon: 'FolderRemove',
		url: '/Index/data/entity',
		compomemt: '/Data/Entity/ClassList.vue',
		requireAuth: true,
	}, {
		id: 33,
		name: '验证码管理',
		icon: 'FolderRemove',
		url: '/Index/data/code',
		compomemt: '/Data/Code/Code.vue',
		requireAuth: true,
	}]
}, {
	id: 4,
	name: '系统配置',
	icon: 'Setting',
	url: '/Index/setting',
	compomemt: '/TableDemo/TableDemo.vue',
	requireAuth: true,
	children: [{
		id: 41,
		name: '用户管理',
		icon: 'FolderRemove',
		url: '/Index/setting/user',
		compomemt: '/System/User/User.vue',
		requireAuth: true,
	}, {
		id: 42,
		name: '角色管理',
		icon: 'FolderRemove',
		url: '/Index/setting/role',
		compomemt: '/System/Role/Role.vue',
		requireAuth: true,
	}, {
		id: 43,
		name: '菜单管理',
		icon: 'FolderRemove',
		url: '/Index/setting/menu',
		compomemt: '/System/Menu/Menu.vue',
		requireAuth: true,
	}, {
		id: 44,
		name: '日志管理',
		icon: 'FolderRemove',
		url: '/Index/setting/log',
		compomemt: '/System/Log/Log.vue',
		requireAuth: true,
	}, {
		id: 45,
		name: '系统配置',
		icon: 'FolderRemove',
		url: '/Index/setting/setting',
		compomemt: '/System/Setting/Setting.vue',
		requireAuth: true,
	}]
}];

// 拦截获取用户信息，用于判断当前等token是否失效
Mock.mock( '/api/userinfo', 'get', ( options ) => {
	return {
		code: 888, //状态码
		msg: 'success',
		data: userinfo
	}
} )
// 拦截用户名密码登录界面
Mock.mock( '/api/login', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.code || !pama.username || !pama.password ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	if ( pama.username == 'admin' && pama.password == "123456" ) {
		return {
			code: 888, //状态码
			msg: 'success',
			token: Random.string( 32 ),
			data: userinfo
		}
	}
	return {
		code: 100, //状态码
		msg: '登录失败，用户名或密码错误',
	}
} )
// 拦截短信验证码登录界面
Mock.mock( '/api/login/code', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.username || !pama.smscode ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	if ( pama.username == '15823532523' && pama.smscode == "2525" ) {
		return {
			code: 888, //状态码
			msg: 'success',
			token: Random.string( 32 ),
			data: userinfo
		}
	}
	return {
		code: 100, //状态码
		msg: '登录失败，验证码错误',
	}
} )

// 拦截二维码扫码登录结果
Mock.mock( '/api/login/checkqcode', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.codetoken ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	if ( pama.codetoken == "233213" ) {
		return {
			code: 888, //状态码
			msg: 'success',
			token: Random.string( 32 ),
			data: userinfo
		}
	}
	return {
		code: 100, //状态码
		msg: '登录失败，验证码错误',
	}
} )

//拦截找回密码短信验证码验证接口
Mock.mock( '/api/resetpwd/phone', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.phone || !pama.smscode ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	if ( pama.phone == '15823532523' && pama.smscode == "2525" ) {
		return {
			code: 888, //状态码
			msg: 'success',
			token: Random.string( 32 )
		}
	}
	return {
		code: 100, //状态码
		msg: '登录失败，验证码错误',
	}
} )

//拦截找回密码邮箱验证码验证接口
Mock.mock( '/api/resetpwd/email', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.username || !pama.smscode ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	if ( pama.username == '15823532523' && pama.smscode == "2525" ) {
		return {
			code: 888, //状态码
			msg: 'success',
			token: Random.string( 32 )
		}
	}
	return {
		code: 100, //状态码
		msg: '登录失败，验证码错误',
	}
} )

//拦截找回密码的重置密码的接口
Mock.mock( '/api/resetpwd/save', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.password || !pama.token ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	// if (pama.token == "2525") {
	return {
		code: 888, //状态码
		msg: 'success'
	}
	// }
	// return {
	// 	code: 100, //状态码
	// 	msg: '登录失败，验证码错误',
	// }
} )


//拦截加载菜单的接口
Mock.mock( '/api/menu', 'get', ( options ) => {
	return {
		code: 888, //状态码
		msg: 'success',
		data: menudata
	}
} )
//拦截全局搜索的接口
Mock.mock( '/api/search', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.keywords ) {
		return {
			code: 888, //状态码
			msg: 'success',
			data: menudata
		}
	}
	let menus = [];
	menudata.forEach( ( item, index ) => {
		if ( item.name.indexOf( pama.keywords ) != -1 ) {
			menus.push( item );
		}
		if ( item.children ) {
			item.children.forEach( ( subitem, subindex ) => {
				if ( subitem.name.indexOf( pama.keywords ) != -1 ) {
					menus.push( subitem );
				}
			} );
		}
	} );
	return {
		code: 888, //状态码
		msg: 'success',
		data: menus
	}
} )


//拦截修改当前用户信息的接口
Mock.mock( '/api/user/changeinfo', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.username ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	// if (pama.token == "2525") {
	return {
		code: 888, //状态码
		msg: 'success'
	}
	// }
	// return {
	// 	code: 100, //状态码
	// 	msg: '登录失败，验证码错误',
	// }
} )

//拦截修改当前用户信息的接口
Mock.mock( '/api/user/changepwd', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.oldpwd || !pama.newpwd ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	return {
		code: 888, //状态码
		msg: 'success'
	}
} )


//拦截修改当前用户信息的接口
Mock.mock( '/api/logout', 'post', ( options ) => {
	return {
		code: 888, //状态码
		msg: 'success'
	}
} )
Mock.mock( '/api/entity/list', 'post', ( options ) => {
	return {
		code: 888, //状态码
		msg: 'success',
		data: [{
			simpleClassName: 'User',
			className: 'com.xxx.xxx.entity.User',
			status: '1'//标识，1未初始化，2已初始化
		}, {
			simpleClassName: 'Role',
			className: 'com.xxx.xxx.entity.Role',
			status: '1'
		}, {
			simpleClassName: 'Menu',
			className: 'com.xxx.xxx.entity.Menu',
			status: '1'
		}, {
			simpleClassName: 'Setting',
			className: 'com.xxx.xxx.entity.Setting',
			status: '1'
		}, {
			simpleClassName: 'Dict',
			className: 'com.xxx.xxx.entity.Dict',
			status: '1'
		}, {
			simpleClassName: 'Log',
			className: 'com.xxx.xxx.entity.Log',
			status: '1'
		}, {
			simpleClassName: 'Code',
			className: 'com.xxx.xxx.entity.Code',
			status: '1'
		}, {
			simpleClassName: 'Message',
			className: 'com.xxx.xxx.entity.Message',
			status: '1'
		}, {
			simpleClassName: 'TableDemo',
			className: 'com.xxx.xxx.entity.TableDemo',
			status: '1'
		}]
	}
} )

//拦截修改当前用户信息的接口
Mock.mock( '/api/entityType', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.owonClass ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	if ( pama.owonClass == 'TableDemo' ) {
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				prop: 'id', //标识
				label: 'ID', //显示名
				sort: 1, //顺序
				width: 80,
				type: '1', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: false, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'center' //left / center / right
			}, {
				prop: 'icon', //标识
				label: '图标', //显示名
				sort: 2, //顺序
				width: 100,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '3', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				fileUploadUrl: '/api/demo/fileupload', //文件上传的路径
				fileType: 'jpg/png',
				fileSize: 1024,
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'name', //标识
				label: '名称', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'createDate', //标识
				label: '创建时间', //显示名
				sort: 3, //顺序
				width: 180,
				type: '4', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				group: '基本信息', //编辑时的分组
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				fixed: false, //是否固定
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				format: 'YYYY-MM-DD HH:mm:ss', //数据的格式，小数时表示保留位数，日期时表示日期格式
				dateType: 'daterange', //时间的格式year/month/date/dates/datetime/ week/datetimerange/daterange/ monthrange
				align: 'left' //left / center / right
			}, {
				prop: 'user', //标识
				label: '创建人', //显示名
				sort: 4, //顺序
				width: 180,
				type: '5', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: false, //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				url: '/api/user/search', //关联对象的加载地址
				showLabelKey: 'name',
				align: 'left' //left / center / right
			}, {
				prop: 'status', //标识
				label: '状态', //显示名
				sort: 5, //顺序
				width: 100,
				type: '8', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: false, //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				key: 'data_status', //数据字典的标识key
				align: 'center' //left / center / right
			}, {
				prop: 'type', //标识
				label: '类型', //显示名
				sort: 5, //顺序
				width: 80,
				type: '8', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: false, //是否必须展示
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				key: 'data_type', //数据字典的标识key
				align: 'left' //left / center / right
			},
			{
				prop: 'content', //标识
				label: '内容', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '内容数据', //编辑时的分组
				inputType: '4', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				fileUploadUrl: '/api/demo/fileupload', //文件上传的路径
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			},
			{
				prop: 'reat', //标识
				label: '环比', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '内容数据', //编辑时的分组
				inputType: '4', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				fileUploadUrl: '/api/demo/fileupload', //文件上传的路径
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				fixed: false, //是否固定
				customer: true,//是否自定义展示方式
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			},
			{
				prop: 'description', //标识
				label: '备注', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '备注信息', //编辑时的分组
				inputType: '2', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			}
			]
		}
	} else if ( pama.owonClass == 'Message' ) {
		return {
			code: 888, //状态码
			msg: 'success',
			data: [{
				prop: 'id', //标识
				label: 'ID', //显示名
				sort: 1, //顺序
				width: 80,
				type: '1', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: false, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'center' //left / center / right
			}, {
				prop: 'name', //标识
				label: '名称', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'createDate', //标识
				label: '创建时间', //显示名
				sort: 3, //顺序
				width: 180,
				type: '4', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				group: '基本信息', //编辑时的分组
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				fixed: false, //是否固定
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				format: 'YYYY-MM-DD HH:mm:ss', //数据的格式，小数时表示保留位数，日期时表示日期格式
				dateType: 'daterange', //时间的格式year/month/date/dates/datetime/ week/datetimerange/daterange/ monthrange
				align: 'left' //left / center / right
			}, {
				prop: 'user', //标识
				label: '创建人', //显示名
				sort: 4, //顺序
				width: 180,
				type: '5', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: false, //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				url: '/api/user/search', //关联对象的加载地址
				showLabelKey: 'name',
				align: 'left' //left / center / right
			}, {
				prop: 'status', //标识
				label: '状态', //显示名
				sort: 5, //顺序
				width: 100,
				type: '8', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: false, //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				key: 'data_status', //数据字典的标识key
				align: 'center' //left / center / right
			},
			{
				prop: 'content', //标识
				label: '内容', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '内容数据', //编辑时的分组
				inputType: '4', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				fileUploadUrl: '/api/demo/fileupload', //文件上传的路径
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			},
			{
				prop: 'description', //标识
				label: '备注', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '备注信息', //编辑时的分组
				inputType: '2', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			}
			]
		}
	} else if ( pama.owonClass == 'Code' ) {
		return {
			code: 888, //状态码
			msg: 'success',
			data: [{
				prop: 'id', //标识
				label: 'ID', //显示名
				sort: 1, //顺序
				width: 80,
				type: '1', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: false, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'center' //left / center / right
			}, {
				prop: 'code', //标识
				label: '验证码', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'createDate', //标识
				label: '创建时间', //显示名
				sort: 3, //顺序
				width: 180,
				type: '4', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				group: '基本信息', //编辑时的分组
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				fixed: false, //是否固定
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				format: 'YYYY-MM-DD HH:mm:ss', //数据的格式，小数时表示保留位数，日期时表示日期格式
				dateType: 'daterange', //时间的格式year/month/date/dates/datetime/ week/datetimerange/daterange/ monthrange
				align: 'left' //left / center / right
			}, {
				prop: 'to', //标识
				label: '接收人', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'status', //标识
				label: '状态', //显示名
				sort: 5, //顺序
				width: 100,
				type: '8', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: false, //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				key: 'code_status', //数据字典的标识key
				align: 'center' //left / center / right
			}, {
				prop: 'type', //标识
				label: '类型', //显示名
				sort: 5, //顺序
				width: 100,
				type: '8', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: false, //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				key: 'code_type', //数据字典的标识key
				align: 'center' //left / center / right
			},
			{
				prop: 'description', //标识
				label: '备注', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '备注信息', //编辑时的分组
				inputType: '2', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			}
			]
		}
	} else if ( pama.owonClass == 'Log' ) {
		return {
			code: 888, //状态码
			msg: 'success',
			data: [{
				prop: 'id', //标识
				label: 'ID', //显示名
				sort: 1, //顺序
				width: 80,
				type: '1', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: false, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'center' //left / center / right
			}, {
				prop: 'ip', //标识
				label: 'IP地址', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'createDate', //标识
				label: '操作时间', //显示名
				sort: 3, //顺序
				width: 180,
				type: '4', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				group: '基本信息', //编辑时的分组
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				fixed: false, //是否固定
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				format: 'YYYY-MM-DD HH:mm:ss', //数据的格式，小数时表示保留位数，日期时表示日期格式
				dateType: 'daterange', //时间的格式year/month/date/dates/datetime/ week/datetimerange/daterange/ monthrange
				align: 'left' //left / center / right
			}, {
				prop: 'type', //标识
				label: '类型', //显示名
				sort: 5, //顺序
				width: 100,
				type: '8', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: false, //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				key: 'log_type', //数据字典的标识key
				align: 'center' //left / center / right
			}, {
				prop: 'msg', //标识
				label: '操作明细', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'user', //标识
				label: '操作人', //显示名
				sort: 4, //顺序
				width: 180,
				type: '5', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: false, //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				url: '/api/user/search', //关联对象的加载地址
				showLabelKey: 'id',
				align: 'left' //left / center / right
			},
			{
				prop: 'description', //标识
				label: '备注', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '备注信息', //编辑时的分组
				inputType: '2', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			}
			]
		}
	} else if ( pama.owonClass == 'Setting' ) {
		return {
			code: 888, //状态码
			msg: 'success',
			data: [{
				prop: 'id', //标识
				label: 'ID', //显示名
				sort: 1, //顺序
				width: 80,
				type: '1', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: false, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'center' //left / center / right
			}, {
				prop: 'name', //标识
				label: '名称', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'createDate', //标识
				label: '操作时间', //显示名
				sort: 3, //顺序
				width: 180,
				type: '4', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				group: '基本信息', //编辑时的分组
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				fixed: false, //是否固定
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				format: 'YYYY-MM-DD HH:mm:ss', //数据的格式，小数时表示保留位数，日期时表示日期格式
				dateType: 'daterange', //时间的格式year/month/date/dates/datetime/ week/datetimerange/daterange/ monthrange
				align: 'left' //left / center / right
			}, {
				prop: 'key', //标识
				label: '标识', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'value', //标识
				label: '配置内容', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			},
			{
				prop: 'description', //标识
				label: '备注', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '备注信息', //编辑时的分组
				inputType: '2', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			}
			]
		}
	} else if ( pama.owonClass == 'Menu' ) {
		return {
			code: 888, //状态码
			msg: 'success',
			data: [{
				prop: 'id', //标识
				label: 'ID', //显示名
				sort: 1, //顺序
				width: 80,
				type: '1', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: false, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'center' //left / center / right
			}, {
				prop: 'parent', //标识
				label: '上级', //显示名
				sort: 1, //顺序
				width: 150,
				type: '5', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'center', //left / center / right
				url: '/api/system/menu/treeData', //关联对象的加载地址
				showLabelKey: 'name',
			}, {
				prop: 'icon', //标识
				label: '图标', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '5', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea，5图标选择器
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'name', //标识
				label: '名称', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'url', //标识
				label: '地址', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'sort', //标识
				label: '顺序', //显示名
				sort: 2, //顺序
				width: null,
				type: '1', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'compomemt', //标识
				label: '组件', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			},
			{
				prop: 'description', //标识
				label: '备注', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '备注信息', //编辑时的分组
				inputType: '2', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			}
			]
		}
	} else if ( pama.owonClass == 'Role' ) {
		return {
			code: 888, //状态码
			msg: 'success',
			data: [{
				prop: 'id', //标识
				label: 'ID', //显示名
				sort: 1, //顺序
				width: 80,
				type: '1', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: false, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'center' //left / center / right
			}, {
				prop: 'name', //标识
				label: '名称', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'menus', //标识
				label: '菜单', //显示名
				sort: 2, //顺序
				width: null,
				type: '5', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				multiple: true,//标识该属性是否可多选，
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: false, //是否可排序
				canSearch: false, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				url: '/api/system/menu/treeData', //关联对象的加载地址
				showLabelKey: 'name',
				align: 'left' //left / center / right
			},
			{
				prop: 'description', //标识
				label: '备注', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '备注信息', //编辑时的分组
				inputType: '2', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			}
			]
		}
	} else if ( pama.owonClass == 'User' ) {
		return {
			code: 888, //状态码
			msg: 'success',
			data: [{
				prop: 'id', //标识
				label: 'ID', //显示名
				sort: 1, //顺序
				width: 80,
				type: '1', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: false, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				canEdit: false, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'center' //left / center / right
			}, {
				prop: 'name', //标识
				label: '名称', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'account', //标识
				label: '账号', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'phone', //标识
				label: '电话', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'email', //标识
				label: '邮箱', //显示名
				sort: 2, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: true, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: true, //是否快捷搜索
				align: 'left' //left / center / right
			}, {
				prop: 'roles', //标识
				label: '角色', //显示名
				sort: 2, //顺序
				width: null,
				type: '5', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				fixed: 'left', //是否固定
				group: '基本信息', //编辑时的分组
				inputType: '1', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				multiple: true,//标识该属性是否可多选，
				canEdit: true, //是否可编辑
				canNone: false, //是否可为空
				canSort: false, //是否可排序
				canSearch: false, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				url: '/api/system/role/treeData', //关联对象的加载地址
				showLabelKey: 'name',
				align: 'left' //left / center / right
			},
			{
				prop: 'description', //标识
				label: '备注', //显示名
				sort: 5, //顺序
				width: null,
				type: '3', //类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典
				show: true, //是否可展示
				viewShow: true, //详情的时候是否展示
				masteShow: true, //是否必须展示
				group: '备注信息', //编辑时的分组
				inputType: '2', //输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
				canEdit: true, //是否可编辑
				canNone: true, //是否可为空
				fixed: false, //是否固定
				canSort: false, //是否可排序
				canSearch: true, //是否可搜索
				canDefaultSearch: false, //是否快捷搜索
				align: 'left', //left / center / right
			}
			]
		}
	}
	return {
		code: 888, //状态码
		msg: 'success'
	}
} )


//拦截修改当前用户信息的接口
Mock.mock( '/api/dict/listDictByKey', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama || !pama.key ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	if ( pama.key == 'log_type' ) {
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				value: '1',
				label: '删除数据'
			}, {
				value: '2',
				label: '登录系统'
			}, {
				value: '3',
				label: '编辑数据'
			}, {
				value: '4',
				label: '添加数据'
			}, {
				value: '5',
				label: '导出数据'
			}, {
				value: '6',
				label: '登出系统'
			}, {
				value: '7',
				label: '修改密码'
			}, {
				value: '8',
				label: '找回密码'
			}]
		}
	}
	if ( pama.key == 'code_status' ) {
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				value: '1',
				label: '发送成功'
			}, {
				value: '2',
				label: '发送失败'
			}]
		}
	}
	if ( pama.key == 'code_type' ) {
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				value: '1',
				label: '登录验证'
			}, {
				value: '2',
				label: '找回密码'
			}]
		}
	}
	if ( pama.key == 'data_status' ) {
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				value: '1',
				label: '正常'
			}, {
				value: '2',
				label: '审核'
			}, {
				value: '3',
				label: '删除'
			}]
		}
	}
	if ( pama.key == 'data_type' ) {
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				value: '1',
				label: '外部来源'
			}, {
				value: '2',
				label: '内部推荐'
			}, {
				value: '3',
				label: '自动生成'
			}]
		}
	}
	if ( pama.key == 'entityType' ) {//类型:1整数，2小数，3字符串，4日期，5关联对象，6超链接，7图片，8数据字典，9时间
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				value: '1',
				label: '整数'
			}, {
				value: '2',
				label: '小数'
			}, {
				value: '3',
				label: '字符串'
			}, {
				value: '4',
				label: '日期'
			}, {
				value: '5',
				label: '关联对象'
			}, {
				value: '6',
				label: '超链接'
			}, {
				value: '7',
				label: '图片'
			}, {
				value: '8',
				label: '数据字典'
			}, {
				value: '9',
				label: '时间'
			}]
		}
	}
	if ( pama.key == 'entityInputType' ) {//输入框的类型：主要是type为3的时候的输入框的类型，1input，2teaxtarea，3file，4richtextarea
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				value: '1',
				label: '输入框'
			}, {
				value: '2',
				label: '文本域'
			}, {
				value: '3',
				label: '文件'
			}, {
				value: '4',
				label: '富文本'
			}]
		}
	}
	if ( pama.key == 'align' ) {//left / center / right
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				value: 'left',
				label: '左'
			}, {
				value: 'center',
				label: '中'
			}, {
				value: 'right',
				label: '右'
			}]
		}
	}
	if ( pama.key == 'fileType' ) {//文件类型
		return {
			code: 888, //状态码
			msg: '',
			data: [{
				value: 'jpe/png',
				label: '图片'
			}]
		}
	}

	return {
		code: 888, //状态码
		msg: 'success'
	}
} )

//拦截用户筛选数据的接口
Mock.mock( '/api/user/search', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	if ( !pama ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	// pama.keyword
	return {
		code: 888, //状态码
		msg: '',
		data: [{
			id: 1,
			isLeaf: true,
			name: '管理员'
		}, {
			id: 2,
			isLeaf: true,
			name: '管理员1'
		}, {
			id: 3,
			isLeaf: true,
			name: '管理员2'
		}]
	}
	return {
		code: 888, //状态码
		msg: 'success'
	}
} )


//拦截表格实例表格ss数据的接口
Mock.mock( '/api/demo/tableData', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.page ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}

	let pageSize = pama.page.pageSize ? pama.page.pageSize : 15;
	let total = 100;

	//自动生成数据
	let pageData = [];
	let search = "";
	if ( pama.entity ) {
		for ( let key in pama.entity ) {
			search += "--" + key + "=" + pama.entity[key];
		}
	}
	for ( let i = 0; i < pama.page.pageSize; i++ ) {
		pageData.push( {
			id: i + 1,
			name: search + '管理员' + i,
			createDate: new Date().getTime(),
			user: {
				id: 1,
				name: Random.string( 10 )
			},
			status: '1',
			type: '1',
			content: Random.string( 50 ),
			description: Random.string( 20 )
		} )
	}
	return {
		code: 888, //状态码
		msg: '',
		data: {
			total: total,
			pageNo: !pama.page.pageNo ? 1 : pama.page.pageNo,
			lists: pageData
		}
	}
} )

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/demo/info', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}

	return {
		code: 888, //状态码
		msg: '',
		data: {
			id: pama.id,
			name: '管理员' + pama.id,
			createDate: new Date().getTime(),
			user: {
				id: 1,
				name: Random.string( 10 )
			},
			status: '1',
			type: '1',
			content: Random.string( 50 ),
			description: Random.string( 20 )
		}
	}
} )

//拦截表格实例表格数据的接口
Mock.mock( '/api/demo/save', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}

	return {
		code: 888, //状态码
		msg: ''
	}
} )

//消息数据
const messageData = [];

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/data/message', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.page ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}

	let pageSize = pama.page.pageSize ? pama.page.pageSize : 15;
	let total = messageData.length;

	//自动生成数据
	return {
		code: 888, //状态码
		msg: '',
		data: {
			total: total,
			pageNo: !pama.page.pageNo ? 1 : pama.page.pageNo,
			lists: messageData
		}
	}
} )

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/data/message/info', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = null;
	messageData.forEach( ( item, index ) => {
		if ( item.id == pama.id ) {
			data = item;
		}
	} )
	return {
		code: 888, //状态码
		msg: '',
		data: data
	}
} )

//拦截表格实例表格数据的接口
Mock.mock( '/api/data/message/save', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );

	if ( data.id ) {
		messageData.forEach( ( item, index ) => {
			if ( item.id == data.id ) {
				messageData[index].name = data.name;
				messageData[index].content = data.content;
				messageData[index].status = data.status;
				messageData[index].description = data.description;
			}
		} )
	} else {
		data.id = new Date().getTime();
		data.user = userinfo;
		data.createDate = new Date();
		messageData.push( data );
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/data/message/delete', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );
	if ( !data.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	for ( let i = 0; i < messageData.length; i++ ) {
		if ( messageData[i].id == data.id ) {
			messageData.splice( i, 1 );
			break;
		}
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/data/message/delete/check', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );
	if ( !data.ids ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	for ( let j = 0; j < data.ids.length; j++ ) {
		for ( let i = 0; i < messageData.length; i++ ) {
			if ( messageData[i].id == data.ids[j].id ) {
				messageData.splice( i, 1 );
				break;
			}
		}
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )

//拦截表格实例表格数据的接口
Mock.mock( '/api/data/message/delete/all', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	messageData.splice( 0, messageData.length );
	return {
		code: 888, //状态码
		msg: ''
	}
} )

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/data/code', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.page ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//自动生成数据
	let pageData = [];
	let search = "";
	if ( pama.entity ) {
		for ( let key in pama.entity ) {
			search += "--" + key + "=" + pama.entity[key];
		}
	}
	for ( let i = 0; i < pama.page.pageSize; i++ ) {
		pageData.push( {
			id: i + 1,
			code: Random.string( 4 ),
			createDate: new Date().getTime(),
			to: '1871000101',
			status: '1',
			type: '1',
			description: Random.string( 20 )
		} )
	}
	return {
		code: 888, //状态码
		msg: '',
		data: {
			total: 100,
			pageNo: !pama.page.pageNo ? 1 : pama.page.pageNo,
			lists: pageData
		}
	}
} )

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/data/code/info', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	return {
		code: 888, //状态码
		msg: '',
		data: {
			id: pama.id,
			code: Random.string( 4 ),
			createDate: new Date().getTime(),
			to: '1871000101',
			status: '1',
			type: '1',
			description: Random.string( 20 )
		}
	}
} )


//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/log', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.page ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//自动生成数据
	let pageData = [];
	for ( let i = 0; i < pama.page.pageSize; i++ ) {
		pageData.push( {
			id: i + 1,
			ip: Random.string( 12 ),
			createDate: new Date().getTime(),
			user: userinfo,
			type: '1',
			msg: Random.string( 50 ),
			description: Random.string( 20 )
		} )
	}
	return {
		code: 888, //状态码
		msg: '',
		data: {
			total: 100,
			pageNo: !pama.page.pageNo ? 1 : pama.page.pageNo,
			lists: pageData
		}
	}
} )

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/log/info', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	return {
		code: 888, //状态码
		msg: '',
		data: {
			id: pama.id,
			ip: Random.string( 12 ),
			createDate: new Date().getTime(),
			user: userinfo,
			type: '1',
			msg: Random.string( 50 ),
			description: Random.string( 20 )
		}
	}
} )

//系统配置数据
const settingData = [];

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/setting', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.page ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}

	let pageSize = pama.page.pageSize ? pama.page.pageSize : 15;
	let total = settingData.length;

	//自动生成数据
	return {
		code: 888, //状态码
		msg: '',
		data: {
			total: total,
			pageNo: !pama.page.pageNo ? 1 : pama.page.pageNo,
			lists: settingData
		}
	}
} )

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/setting/info', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = null;
	settingData.forEach( ( item, index ) => {
		if ( item.id == pama.id ) {
			data = item;
		}
	} )
	return {
		code: 888, //状态码
		msg: '',
		data: data
	}
} )

//拦截表格实例表格数据的接口
Mock.mock( '/api/system/setting/save', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );

	if ( data.id ) {
		settingData.forEach( ( item, index ) => {
			if ( item.id == data.id ) {
				settingData[index].name = data.name;
				settingData[index].key = data.key;
				settingData[index].value = data.value;
				settingData[index].description = data.description;
			}
		} )
	} else {
		data.id = new Date().getTime();
		data.createDate = new Date();
		settingData.push( data );
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/system/setting/delete', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );
	if ( !data.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	for ( let i = 0; i < settingData.length; i++ ) {
		if ( settingData[i].id == data.id ) {
			settingData.splice( i, 1 );
			break;
		}
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/system/setting/delete/check', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );
	if ( !data.ids ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	for ( let j = 0; j < data.ids.length; j++ ) {
		for ( let i = 0; i < settingData.length; i++ ) {
			if ( settingData[i].id == data.ids[j].id ) {
				settingData.splice( i, 1 );
				break;
			}
		}
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )

//拦截表格实例表格数据的接口
Mock.mock( '/api/system/setting/delete/all', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	settingData.splice( 0, settingData.length );
	return {
		code: 888, //状态码
		msg: ''
	}
} )

//----------

//系统配置数据
const menuData = [{
	id: 1,
	name: '菜单1',
	url: '',
	sort: 1,
	icon: '',
	parent: null,
	compomemt: '',
	description: ''
}, {
	id: 2,
	name: '菜单2',
	url: '',
	sort: 1,
	icon: '',
	parent: null,
	compomemt: '',
	description: ''
}, {
	id: 3,
	name: '菜单3',
	url: '',
	sort: 1,
	icon: '',
	parent: {
		id: 1
	},
	compomemt: '',
	description: ''
}];
//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/menu', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.page ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}

	let pageSize = pama.page.pageSize ? pama.page.pageSize : 15;
	let total = menuData.length;

	//自动生成数据
	return {
		code: 888, //状态码
		msg: '',
		data: {
			total: total,
			pageNo: !pama.page.pageNo ? 1 : pama.page.pageNo,
			lists: menuData
		}
	}
} )

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/menu/treeData', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );

	if ( pama.id == null ) {
		let roots = [];
		menuData.forEach( ( item, index ) => {
			if ( !item.parent || !item.parent.id ) {
				roots.push( item );
			}
		} )
		roots.forEach( ( item, index ) => {
			listChildrenData( item, menuData );
		} )
		//自动生成数据
		return {
			code: 888, //状态码
			msg: '',
			data: roots
		}
	} else {
		let roots = [];
		menuData.forEach( ( item, index ) => {
			if ( item.parent && item.parent.id == pama.id ) {
				roots.push( item );
			}
		} )
		roots.forEach( ( item, index ) => {
			listChildrenData( item, menuData );
		} )
		//自动生成数据
		return {
			code: 888, //状态码
			msg: '',
			data: roots
		}
	}
} )

const listChildrenData = ( root, allDatas ) => {
	root.children = [];
	allDatas.forEach( ( item, index ) => {
		if ( item.parent && item.parent.id == root.id ) {
			root.children.push( item );
		}
	} )
	root.isLeaf = root.children.length <= 0;
	root.children.forEach( ( item, index ) => {
		listChildrenData( item, allDatas );
	} )
}

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/menu/info', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = null;
	menuData.forEach( ( item, index ) => {
		if ( item.id == pama.id ) {
			data = item;
		}
	} )
	return {
		code: 888, //状态码
		msg: '',
		data: data
	}
} )

//拦截表格实例表格数据的接口
Mock.mock( '/api/system/menu/save', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );

	if ( data.id ) {
		menuData.forEach( ( item, index ) => {
			if ( item.id == data.id ) {
				menuData[index].name = data.name;
				menuData[index].url = data.url;
				menuData[index].sort = data.sort;
				menuData[index].icon = data.icon;
				menuData[index].parent = data.parent;
				menuData[index].compomemt = data.compomemt;
				menuData[index].description = data.description;

				// if(data.parent && data.parent.id){
				// 	menuData.forEach((item_,index_)=>{
				// 		if(item_.id == menuData[index].parent.id){
				// 			menuData[index].parent = item_;
				// 		}
				// 	})
				// }else{
				// 	menuData[index].parent = null;
				// }
			}
		} )
	} else {
		data.id = new Date().getTime();
		data.createDate = new Date();
		// if(data.parent && data.parent.id){
		// 	menuData.forEach((item,index)=>{
		// 		if(item.id == data.parent.id){
		// 			data.parent = item;
		// 		}
		// 	})
		// }
		menuData.push( data );
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )



//系统配置数据
const roleData = [{
	id: 1,
	name: '系统管理员',
	menus: [{
		id: 1,
		name: '222'
	}],
	isLeaf: true,
	children: []
}, {
	id: 2,
	name: '系统管理员1',
	menus: [{
		id: 1,
		name: '222'
	}],
	isLeaf: true,
	children: []
}, {
	id: 3,
	name: '系统管理员3',
	menus: [{
		id: 1,
		name: '222'
	}],
	isLeaf: true,
	children: []
}];

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/role', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.page ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}

	let pageSize = pama.page.pageSize ? pama.page.pageSize : 15;
	let total = roleData.length;

	//自动生成数据
	return {
		code: 888, //状态码
		msg: '',
		data: {
			total: total,
			pageNo: !pama.page.pageNo ? 1 : pama.page.pageNo,
			lists: roleData
		}
	}
} )

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/role/info', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = null;
	roleData.forEach( ( item, index ) => {
		if ( item.id == pama.id ) {
			data = item;
		}
	} )
	return {
		code: 888, //状态码
		msg: '',
		data: data
	}
} )


//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/role/treeData', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	return {
		code: 888, //状态码
		msg: '',
		data: roleData
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/system/role/save', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );

	if ( data.id ) {
		roleData.forEach( ( item, index ) => {
			if ( item.id == data.id ) {
				roleData[index].name = data.name;
				roleData[index].menus = data.menus;
				roleData[index].description = data.description;
			}
		} )
	} else {
		data.id = new Date().getTime();
		data.createDate = new Date();
		roleData.push( data );
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/system/role/delete', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );
	if ( !data.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	for ( let i = 0; i < roleData.length; i++ ) {
		if ( roleData[i].id == data.id ) {
			roleData.splice( i, 1 );
			break;
		}
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/system/role/delete/check', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );
	if ( !data.ids ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	for ( let j = 0; j < data.ids.length; j++ ) {
		for ( let i = 0; i < roleData.length; i++ ) {
			if ( roleData[i].id == data.ids[j].id ) {
				roleData.splice( i, 1 );
				break;
			}
		}
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )

//拦截表格实例表格数据的接口
Mock.mock( '/api/system/role/delete/all', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	roleData.splice( 0, roleData.length );
	return {
		code: 888, //状态码
		msg: ''
	}
} )

const userData = [];
//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/user', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.page ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}

	let pageSize = pama.page.pageSize ? pama.page.pageSize : 15;
	let total = userData.length;

	//自动生成数据
	return {
		code: 888, //状态码
		msg: '',
		data: {
			total: total,
			pageNo: !pama.page.pageNo ? 1 : pama.page.pageNo,
			lists: userData
		}
	}
} )

//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/user/info', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	//将请求参数转换为JSON对象
	let pama = JSON.parse( options.body );
	// pama.keyword
	if ( !pama || !pama.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = null;
	userData.forEach( ( item, index ) => {
		if ( item.id == pama.id ) {
			data = item;
		}
	} )
	return {
		code: 888, //状态码
		msg: '',
		data: data
	}
} )


//拦截表格实例表格ss数据的接口
Mock.mock( '/api/system/user/treeData', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	return {
		code: 888, //状态码
		msg: '',
		data: userData
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/system/user/save', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );

	if ( data.id ) {
		userData.forEach( ( item, index ) => {
			if ( item.id == data.id ) {
				userData[index] = data;
			}
		} )
	} else {
		data.id = new Date().getTime();
		data.createDate = new Date();
		userData.push( data );
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/system/user/delete', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );
	if ( !data.id ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	for ( let i = 0; i < userData.length; i++ ) {
		if ( userData[i].id == data.id ) {
			userData.splice( i, 1 );
			break;
		}
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )


//拦截表格实例表格数据的接口
Mock.mock( '/api/system/user/delete/check', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	let data = JSON.parse( options.body );
	if ( !data.ids ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	for ( let j = 0; j < data.ids.length; j++ ) {
		for ( let i = 0; i < userData.length; i++ ) {
			if ( userData[i].id == data.ids[j].id ) {
				userData.splice( i, 1 );
				break;
			}
		}
	}
	return {
		code: 888, //状态码
		msg: ''
	}
} )

//拦截表格实例表格数据的接口
Mock.mock( '/api/system/user/delete/all', 'post', ( options ) => {
	if ( !options || !options.body ) {
		return {
			code: 101, //状态码
			msg: '参数为空',
		}
	}
	userData.splice( 0, userData.length );
	return {
		code: 888, //状态码
		msg: ''
	}
} )