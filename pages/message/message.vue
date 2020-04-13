<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">消息</view>
			</view>
		</view>
		
		<view class="main-body">
			<view>消息</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	
	export default {
		computed: mapState(['isLogin', 'userId','statusBarHeight']),
		onShow() {
			if(!this.isLogin || this.userId === 0){
				console.log("未登录");
				uni.switchTab({
					url:'../user/user'
				})
				
			}else{
				console.log("已登录");
			}
		},
		data(){
			return {
				platform : '',
				
			}
		},
		
		methods: {
			
			
		},
	}
</script>

<style>

</style>
