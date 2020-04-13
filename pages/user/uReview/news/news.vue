<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">新闻预览</view>
				<!-- 返回图标需要放在标题下面才能有用 -->
				<image 
				@click="appback"
				class="main-head-navi-arrow"
				src="@/static/arrow_back_black.png"
				mode="scaleToFill"
				></image>
			</view>
		</view>
		
		<view class="main-body">
			<view v-if="ict > 61252 || ict == 29374" style="display: flex; flex-direction: row;
			align-items: center;
			margin-top: 20px; margin-left: 10px;">
				新闻状态：
				<text style="color: red;">{{ newsState }}</text>
				<button v-if="ict > 61252" style="background-color: red;" @click="cancelPublish">重新编辑</button>
			</view>
			<view v-if="ict > 61252 || ict == 29374 && newsDetail.newsStatus == 2" style="display: flex; flex-direction: row;
			align-items: center;
			margin-top: 20px; margin-left: 10px;">
				未通过原因：
				<text style="color: red;">{{ newsDetail.reviewRemark }}</text>
			</view>
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
				<view class="main-body-news-create-date">类目：</view>
				<view class="main-body-news-create-by">{{typeName}}</view>
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
			<view class="main-body-given"  v-if="ict > 10124 && ict < 15125">
				审核结果：
				<picker class="main-body-picker-type"
				 mode="selector"
				 :range="reviewResult"
				 @change="reviewResultChanged"
				 range-key="name" >
					<view>{{reviewResult[reviewResultIndex].name}}</view>
				</picker>
				<input
				 type="text"
				  style="margin-bottom: 10px;
				  font-size: 18px;
				  border:solid #000;
				  border-width:0 0 1px 0;"
				v-model="reviewRemark" placeholder="请填写审核结果备注" maxlength="100"/>
				<button @click="submitReviewResult" style="background-color: #0FAEFF;">确定</button>
			</view>
			
			<view class="main-body-given"  v-if="ict > 22412 && ict < 32415">
				<!-- 已审核 -->
			</view>
			
			<view class="main-body-given"  v-if="ict > 34214 && ict < 36142">
				分发给：
				<picker class="main-body-picker-type"
				 mode="selector"
				 :range="reviewGroups"
				 @change="reviewGroupsSelectedChanged"
				 range-key="name" >
					<view>{{reviewGroups[reviewGroupsSelected].userNick}}</view>
				</picker>
				<button @click="giveToGroup"
				 style="width: 90px;background-color: #0FAEFF;">确定</button>
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
		computed: mapState(['isLogin', 'userId', 'userInfo','statusBarHeight', 'userPermission']),
		data() {
			return {
				server: globalUrl.httpUrl,
				ict:0,
				newsState: '',
				lastIndex: -1 , //上个页面传功来的，用于删除item
				createByNick: '',
				belongCampus: '',
				typeName: '',
				createDate: '',
				newsId: 0,
				newsDetail : '',
				newsUrl : '',
				newsBody : '',
				videos : '',
				videoTitle : '',
				
				reviewResult: [
					{status:0, name:'未选择'},
					{status:3, name:'给予通过'},
					{status:2, name:'不给予通过'},
				],
				reviewResultIndex:0,
				reviewRemark:'',
				
				reviewGroups: [
					{uId:0, userNick:'未选择', name:'未选择'},
				],
				reviewGroupsSelected: 0,
				
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
		        this.newsId = option.newsId;
				this.lastIndex = parseInt(option.index);
				this.ict = parseInt(option.ict);
		},
		onReady() {
			//37583
			var _this = this;
			if(this.ict > 7128){
				uni.request({
					url:'/controller/news/getReviewingNewsDetail',
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
							_this.typeName = dat.typeName;
							_this.createDate = dat.createDate;
							if(dat.news_detail.newsStatus === 1){
								_this.newsState = "审核中"
							}else if(dat.news_detail.newsStatus === 2){
								_this.newsState = "未通过"
							}else if(dat.news_detail.newsStatus === 3){
								_this.newsState = "通过"
							}else if(dat.news_detail.newsStatus === 4){
								_this.newsState = "通过 —— 不被看见"
							}
						}else{
							uni.navigateBack({
								
							})
						}
					},
					fail(err) {
						console.log(err)
						uni.navigateBack({
							
						})
					}
				})
			}else{
				uni.reLaunch({
					url:'../../../main/main'
				})
			}
			
			if(_this.ict > 34214 && _this.ict < 36142){
				//获取审核组
				uni.request({
					url:'/controller/news/getReviewGroupList',
					method:'GET',
					success(res) {
						var dat = res.data;
						if(dat.state === '200'){
							var group = dat.groupList;
							for (var i = 0; i < group.length; i++) {
								let obj = {uId:0, userNick:''}
								obj.uId = group[i].uId;
								obj.userNick = group[i].userNick;
								obj.name = group[i].userNick + "  编号：" + group[i].uId ;
								_this.reviewGroups.push(obj);
							}
						}else{
							
						}
					},
					fail(err) {
						console.log(err)
						
					}
				})
			}
			
		},
		mounted() {
			window.exitFullscreen = this.exitFullscreen;
		},
		methods: {
			reviewResultChanged(e){
				console.log(e.target.value)
				this.reviewResultIndex = e.target.value;
			},
			reviewGroupsSelectedChanged(e){
				console.log(e.target.value)
				this.reviewGroupsSelected = e.target.value;
			},
			cancelPublish(){
				var _this = this;
				uni.showModal({
					title: '取消发布新闻',
					content: '确定撤回该新闻吗？',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#ff0a0a',
					confirmText: '确定',
					confirmColor: '#007aff',
					success(re) {
						if(re.confirm){
							let data = {news_id: _this.newsId}
							console.log(data);
							uni.request({
								url:'/controller/news/cancelPublishNews',
								method:'POST',
								data: data,
								header:{'Content-type':'application/x-www-form-urlencoded'},
								success(res) {
									var dat = res.data;
									if(dat.state === '200'){
										uni.showToast({
											title:"成功撤销"
										})
										
										if(_this.lastIndex !== -1){
											//移除上页面中的数据
											var pages = getCurrentPages();
											var prevPage = pages[pages.length - 2]; //上一个页面
											
											prevPage.$set(prevPage.$data, 'pageBack', {remove:true, index: _this.lastIndex})
										}
										setTimeout(function () {
										
											uni.navigateBack({
												animationType: 'pop-out',
												animationDuration: 200
											})
										
										}, 1000);
									}else{
										uni.showToast({
											title: dat.msg,
											icon: 'none'
										})
									}
								},
								fail(err) {
									console.log(err)
									uni.showToast({
										title: '请求错误，请检查网络后重试',
										icon: 'none'
									})
								}
								
							})
						}
					}
				})
			},
			submitReviewResult(){
				console.log(this.reviewResultIndex)
				var _this = this;
				if(_this.reviewResultIndex === 0){
					uni.showToast({
						title:'请选择审核结果',
						icon:'none'
					})
					return;
				}
				if(_this.reviewResultIndex === 2){
					if(_this.reviewRemark.length <= 0){
						uni.showToast({
							title:'请填写不通过的原因',
							icon:'none'
						})
						return;
					}
				}
				let data = {
					news_id: _this.newsId, 
					review_result: _this.reviewResult[_this.reviewResultIndex].status,
					review_remark: _this.reviewRemark,
				};
					
				uni.request({
					url:'/controller/news/reviewNews',
					method:'POST',
					data: data,
					header:{'Content-type':'application/x-www-form-urlencoded'},
					success(res) {
						var dat = res.data;
						if(dat.state === '200'){
							uni.showToast({
								title:"提交审核结果成功"
							})
							
							if(_this.lastIndex !== -1){
								//移除上页面中的数据
								var pages = getCurrentPages();
								var prevPage = pages[pages.length - 2]; //上一个页面
								
								prevPage.$set(prevPage.$data, 'pageBack', {remove:true, index: _this.lastIndex})
							}
							setTimeout(function () {
							
								uni.navigateBack({
									animationType: 'pop-out',
									animationDuration: 200
								})
							
							}, 1000);
						}else{
							uni.showToast({
								title: dat.msg,
								icon: 'none'
							})
						}
					},
					fail(err) {
						console.log(err)
						uni.showToast({
							title: '请求错误，请检查网络后重试',
							icon: 'none'
						})
					}
					
				})
					
			},
			giveToGroup(){
				//分发给审核组成员
				console.log(this.reviewGroupsSelected)
				var _this = this;
				if(_this.reviewGroupsSelected === 0){
					uni.showToast({
						title:'请选择指定对象',
						icon:'none'
					})
					return;
				}
				let uId = _this.reviewGroups[_this.reviewGroupsSelected].uId
				let data = {news_id: _this.newsId, target_user_id: uId};
				uni.request({
					url:'/controller/news/reviewTaskDistribute',
					method:'POST',
					data: data,
					header:{'Content-type':'application/x-www-form-urlencoded'},
					success(res) {
						var dat = res.data;
						if(dat.state === '200'){
							uni.showToast({
								title:"审核任务分发成功"
							})
							
							if(_this.lastIndex !== -1){
								//移除上页面中的数据
								var pages = getCurrentPages();
								var prevPage = pages[pages.length - 2]; //上一个页面
								
								prevPage.$set(prevPage.$data, 'pageBack', {remove:true, index: _this.lastIndex})
							}
							setTimeout(function () {
							
								uni.navigateBack({
									animationType: 'pop-out',
									animationDuration: 200
								})
							
							}, 1000);
						}else{
							uni.showToast({
								title: dat.msg,
								icon: 'none'
							})
						}
					},
					fail(err) {
						console.log(err)
						uni.showToast({
							title: '请求错误，请检查网络后重试',
							icon: 'none'
						})
					}
					
				})
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
		margin-bottom: 30px;
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
	
	.main-body-given{
		align-items: center;
		margin-left: 40px;
		margin-right: 40px;
		margin-bottom: 30px;
	}
	.main-body-picker-type{
		text-align: center;
		background-color: #ececec;
		margin-top: 10px;
		margin-bottom: 15px;
		padding-left: 20px;
		padding-right: 20px;
		border: 1px #222222 solid;
	}
</style>
