<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">我的新闻</view>
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
			<QSTabsWxs 
			ref="qs"
			hasRefresh
			refreshImage="/static/refresh.png"
			activeFontColor="#000" 
			refreshTextColor="#000"
			tabsFontColor="rgba(90, 90, 90, 229)" 
			tabsBackgroundColor="#ffffff" 
			swiperBackgroundColor="#ffffff" 
			minWidth="50rpx" 
			type="index"
			defCurrent="0"
			:height="windowHeight">
			</QSTabsWxs>
		</view>
	</view>
</template>

<script>
	
	import QSTabsWxs from '../../../components/QS-tabs-wxs-list/QS-tabs-wxs-list.vue';
	
	import {
		mapState,
		mapMutations
	} from 'vuex'
	const {windowHeight} = uni.getSystemInfoSync();
	export default {
		
		components:{
			QSTabsWxs,
		},
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight','userPermission']),
		data() {
			return {
				topViewHeight: 44,
				windowHeight,
				QSTabsWxsListHeight: 20,
				tabTypeIndex : 0,
				tablist:[
					{name:'浏览过', id:1},
					{name:'评论过', id:2},
					{name:'表态过', id:3},
					{name:'发布的', id:4},
				],
			}
		},
		onReady() {
			var that = this;
						
			let m = 0;
			let tabs = Array(that.tablist.length).fill('').map(() => {
				const tablist = that.tablist[m++];
				const name = tablist.name;
				return {
					tablist,
					name,
					id: m,
					type: 2,
					swiperBackgroundColor: '#F5F5F5',
					lineColor: '#000000',
					tabsBackgroundColor: '#ffffff'
				}
			});
			console.log(this.$refs)
			console.log(this.$refs['qs'])
			
			this.$refs['qs'].setTabs(tabs);
			
			
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
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
	}
	
	.main-body-list{
		margin-top: 10px;
	}
	
</style>
