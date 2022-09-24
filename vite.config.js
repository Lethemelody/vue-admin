import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path')
import {
	resolve
} from 'path' // 主要用于alias文件路径别名

// https://vitejs.dev/config/
export default defineConfig({
	base: "/",
	define: {
		'process.env': {
			'BASE_API': "/"
		}
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, '.', 'src'),
		},
	},
	plugins: [vue()]
})
