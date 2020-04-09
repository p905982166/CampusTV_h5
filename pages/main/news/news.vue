<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">新闻页面</view>
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
			<view class="main-body-news-title"> {{ newsDetail.newsTitle }} </view>
			<view class="main-body-news-create">
				<view class="main-body-news-create-date">来自：</view>
				<view class="main-body-news-create-by">{{createByNick}}</view>
			</view>
			<view class="main-body-news-create">
				<view class="main-body-news-create-date">坐标：</view>
				<view class="main-body-news-create-by">{{belongCampus}}</view>
			</view>
			<view class="main-body-news-create">
				<view class="main-body-news-create-date">时间：</view>
				<view class="main-body-news-create-by">{{createDate}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	
	export default {
		computed: mapState(['statusBarHeight']),
		data() {
			return {
				createByNick: '',
				belongCampus: '',
				createDate: '',
				newsId: 0,
				newsDetail : '',
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
		        console.log(option.newsId); //打印出上个页面传递的参数。
				
		        this.newsId = option.newsId;
				var _this = this;
				uni.request({
					url:'/controller/news/getNewsDetail',
					method:'GET',
					data:{news_id: _this.newsId},
					success(res) {
						var dat = res.data;
						if(dat.state === '200'){
							console.log(dat);
							_this.newsDetail = dat.news_detail;
							_this.createByNick = dat.userNick;
							_this.belongCampus = dat.campusName;
							_this.createDate = dat.createDate;
						}
					},
					fail(err) {
						console.log(err)
					}
					
				})
		},
		methods: {
			
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
		
		position: absolute;
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		padding-left: 20px;
		padding-right: 20px;
	}
	.main-body-news-title{
		font-size: 23px;
		padding-top: 20px;
		padding-bottom: 10px;
	}
	.main-body-news-create{
		display: flex;
		flex-direction: row;
	}
	.main-body-news-create-by{
		padding-top: 10px;
		font-size: 13px;
		color: #4c7eff;
	}
	.main-body-news-create-date{
		padding-right: 9rpx;
		padding-left: 19rpx;
		padding-top: 10px;
		font-size: 13px;
		color: #606160;
	}

</style>
