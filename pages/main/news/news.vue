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
			<view class="main-body-news-video" v-if="videos.length > 4">
				<video
				 :src="server + newsUrl + videos"
				 controls :title="videoTitle"
				 direction="-90"
				 @fullscreenchange="fullscreenchange"
				 @fullscreenclick="fullscreenclick"></video>
			</view>
			<text v-if="videos.length > 4"
			style="margin-top: 5px;margin-left: 50rpx;margin-right: 50rpx; color: #716e6e;font-size: 18px;">
				{{videoTitle}}
			</text>
			
			<view class="main-body-news-body">
				 <view v-for="(item,index) in newsBody" :key="index">
				 	 <view class="main-body-news-body-text-container">
						 <text class="main-body-news-body-text"
						 v-if="item.type === 0">{{ newsBody[index].content }}</text>
					 </view>
					 
					 <view class="main-body-news-body-img-container">
						 <image class="main-body-news-body-img" mode="aspectFit"
						  v-if="item.type === 1"
						  :src="server + newsUrl + item.content"></image>
					 </view>
				 </view>
			</view>
			<view class="main-body-attitude">
				<image class="main-body-attitude-img"
				 :src="smile" @tap="attitudeClick(1)">
				 喜欢
				 </image>
				<image class="main-body-attitude-img"
				 :src="sad" @tap="attitudeClick(2)">
				 不喜欢
				 </image>
			</view>
			<view class="main-body-bottom" v-show="showBottom">
				<view 
				@tap="gotoComment"
				style="
				width: 200px;
				background-color: #d5d5d5;
				align-items: center;
				display: flex;
				flex-direction: row;
				border-radius: 5px;">
					<image
						style="width: 20px;height: 20px;font-size: 20px; padding: 10px 15px;"
						src="@/static/pencil.png" >发表个评论</image>
				</view>
				<image
					@tap="gotoComment"
					src="@/static/comment.png" 
					style="width: 30px;height: 30px;padding: 10px 8px 10px 25px;">
					{{newsDetail.commentsNum}}
				</image>
				<image
					@tap="share"
					src="@/static/share.png" 
					style="width: 22px;height: 22px;padding: 9px 8px 10px 35px;">
					{{newsDetail.shareTimes}}
				</image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import globalUrl from '@/pages/Global.vue'
	export default {
		computed: mapState(['isLogin', 'userId','statusBarHeight', 'userPermission']),
		data() {
			return {
				server : globalUrl.httpUrl,
				createByNick: '',
				belongCampus: '',
				createDate: '',
				newsId: 0,
				newsDetail : '',
				newsUrl : '',
				newsBody : '',
				videos : '',
				videoTitle : '',
				
				lastScroll : 0,
				
				smile: '../../../static/smile.png',
				sad: '../../../static/sad.png',
				attitude: 0,
				
				showBottom:true,
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
				
		        this.newsId = option.newsId;
		},
		onReady() {
			var _this = this;
			uni.request({
				url:'/controller/news/getNewsDetail',
				method:'GET',
				data:{news_id: _this.newsId},
				success(res) {
					var dat = res.data;
					if(dat.state === '200'){
						_this.newsDetail = dat.news_detail;
						_this.newsBody = JSON.parse(dat.news_detail.newsBody);
						_this.newsUrl = dat.news_detail.newsUrl;
						_this.videos = dat.news_detail.videos;
						_this.videoTitle = "视频：" + dat.news_detail.videoTitle;
						_this.createByNick = dat.userNick;
						_this.belongCampus = dat.campusName;
						_this.createDate = dat.createDate;
						if(dat.attitude > 0){
							_this.attitude = dat.attitude;
							if(_this.attitude === 1){
								_this.smile = '../../../static/smile_click.png'
							}else if(_this.attitude === 2){
								_this.sad = '../../../static/sad_click.png'
							}
						}
						console.log("态度：" + _this.attitude);
					}
				},
				fail(err) {
					console.log(err)
				}
				
			})
		},
		mounted() {
			window.exitFullscreen = this.exitFullscreen;
		},
		methods: {
			fullscreenclick(e){
				console.log(e.detail)
			},
			fullscreenchange(e){
				console.log(e.detail)
			},
			exitFullscreen(){
				console.log("Android调用H5退出全屏的api")
				var doc = document;
				if (doc.exitFullscreen) {
					doc.exitFullscreen();
				} else if (de.mozCancelFullScreen) {
					doc.mozCancelFullScreen();
				} else if (de.webkitCancelFullScreen) {
					doc.webkitCancelFullScreen();
				}
			},
			attitudeClick(e){
				
				if(this.isLogin === false || this.userId === 0){
					uni.showToast({
						title:'请登录后使用哟~',
						icon:'none'
					})
					return;
				}
				
				var action = 0;
				if(e === 1){
					if(this.attitude === 0){
						this.smile = '../../../static/smile_click.png'
						this.attitude = 1;
						action = 1;
					}else
					if(this.attitude === 1){
						this.smile = '../../../static/smile.png'
						this.attitude = 0;
						action = -1;
					}else
					if(this.attitude === 2){
						this.sad = '../../../static/sad.png'
						this.smile = '../../../static/smile_click.png'
						this.attitude = 1;
						action = 1;
					}
					
				}else{
					if(this.attitude === 0){
						this.sad = '../../../static/sad_click.png'
						this.attitude = 2;
						action = 2;
					}else
					if(this.attitude === 1){
						this.smile = '../../../static/smile.png'
						this.sad = '../../../static/sad_click.png'
						this.attitude = 2;
						action = 2;
					}else
					if(this.attitude === 2){
						this.sad = '../../../static/sad.png'
						this.attitude = 0;
						action = -2;
					}
				}
				var _this = this;
				var data = { 
					news_id: _this.newsId,
					attitude: action
				}
				uni.request({
					url:'/controller/sys_user/sendAttitudesToNews',
					method:'POST',
					data: data,
					header:{'Content-type':'application/x-www-form-urlencoded'},
					success(res) {
						var dat = res.data;
						console.log(dat);
					},
					fail(err) {
						console.log(err)
					}
					
				})
				
			},
			gotoComment(){
				if(this.isLogin === false || this.userId === 0){
					uni.showToast({
						title:'请登录后使用哟~',
						icon:'none'
					})
					return;
				}
				
				if(this.userPermission.commentNews === 1){
					console.log('跳转至评论')
				}else{
					if(this.isLogin === false || this.userId === 0){
						uni.showToast({
							title:'你被限制评论新闻',
							icon:'none'
						})
					}
				}
				
				
			},
			share(){
				if(this.isLogin === false || this.userId === 0){
					uni.showToast({
						title:'请登录后使用哟~',
						icon:'none'
					})
					return;
				}
				
				if(this.newsDetail.sharable !== 1){
					console.log('该新闻不能被分享')
				}else{
					console.log('选择分享')
				}
				
			},
			appback(){
				uni.navigateBack({
					animationType: 'pop-out',
					animationDuration: 200
				})
			},
		},
		onPageScroll(e) {
			if(e.scrollTop < this.lastScroll){
				this.showBottom = true;
			}else{
				this.showBottom = false;
			}
			this.lastScroll = e.scrollTop
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
	.main-body-news-title{
		font-size: 23px;
		padding-top: 20px;
		padding-bottom: 10px;
		padding-left: 20px;
		padding-right: 20px;
	}
	.main-body-news-create{
		margin-top: 10px;
		margin-bottom: 10px;
		padding-left: 20px;
		padding-right: 20px;
		display: flex;
		flex-direction: row;
	}
	.main-body-news-create-by{
		
		font-size: 13px;
		color: #4c7eff;
	}
	.main-body-news-create-date{
		padding-right: 9rpx;
		padding-left: 19rpx;
		
		font-size: 13px;
		color: #606160;
	}
	.main-body-news-video{
		margin-top: 20px;
		text-align: center;
	}

	.main-body-news-body{
		margin-top: 20px;
		margin-bottom: 50px;
	}

	.main-body-news-body-text-container{
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.main-body-news-body-text{
		margin-left: 25px;
		margin-top: 30px;
		font-size: 19px;
	}
	.main-body-news-body-img-container{
		text-align: center;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.main-body-news-body-img{
		margin-top: 20px;
		width: 80%;
		height: 340px;
	}
	
	.main-body-attitude{
		align-items: center;
		display: flex;
		flex-direction: row;
		margin-bottom: 70px;
		justify-content: center;
	}
	.main-body-attitude-container{
		
	}
	.main-body-attitude-img{
		padding-left: 15px;
		padding-right: 15px;
		width: 32px;
		height: 32px;
		
	}
	
	.main-body-bottom{
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		bottom: 0;
		border: solid #808080;
		border-width:1px 0 0 0;
		padding: 10px;

	}
</style>
