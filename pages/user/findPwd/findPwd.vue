<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">找回密码</view>
				<!-- 返回图标需要放在标题下面才能有用 -->
				<image 
				@click="appback"
				class="main-head-navi-arrow"
				src="../../../static/arrow_back_black.png"
				mode="scaleToFill"
				></image>
			</view>
			
		</view>
		
		<view class="main-body">
			
			正在努力开发.....
			
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../../components/input-box/m-input.vue'
	export default {
		components: {
			mInput
		},
		computed: mapState(['statusBarHeight']),
		data() {
			return {
				
			}
		},
		methods: {
			...mapMutations(['initUserState']),
			
			
			appback(){
				uni.navigateBack({
					animationType: 'pop-out',
					animationDuration: 200
				})
			},
		}
	}
</script>

<style>


	.main-body{
		height: 100%;
		width: 100%;
		position: absolute;
		background-color: #dfdfdf;
		display: flex;
		flex-direction: column;
	}
</style>
