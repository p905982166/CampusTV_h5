<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">社交</view>
			</view>
		</view>
		
		<view class="main-body">
			<view>社交</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	
	export default {
		computed: mapState(['isLogin', 'userId','statusBarHeight']),
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
