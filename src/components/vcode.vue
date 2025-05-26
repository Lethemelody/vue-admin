<template>
	<img :src=" codeSrc " />
</template>

<script setup>
import {
	ref,
	reactive,
	defineProps,
	onMounted
} from "vue";

import utils from "@/utils/utils.js";

let codeSrc = new URL( "../assets/code.png",
	import.meta.url ).href; //图片验证码
//更新图片验证码
const changeCode = () => {
	codeSrc = new URL( "../assets/code.png",
		import.meta.url ).href; //图片验证码
}
const refresh = () => {
	changeCode();
}
defineExpose( {
	refresh
} )
</script>

<style scoped="scoped">
.code {
  cursor: pointer;
}

.code img {
  width: 100%;
  height: 100%;
}
</style>
