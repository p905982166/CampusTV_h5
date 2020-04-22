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
			<scroll-view 
			:style="{'height': windowHeight + topViewHeight + 'px'}"
			
			scroll-y="true" 
			refresher-enabled="true" 
			:refresher-triggered="triggered"
			:refresher-threshold="45" 
			@scrolltolower="onScrolltolower"
			@refresherpulling="onPulling"
			@refresherrefresh="onRefresh" 
			@refresherrestore="onRestore" 
			@refresherabort="onAbort">
			<view>
				<view v-for="(item,index) in dataList" :key="index">
					<view class="social-user-info">
						<image 
						style="
						
						width: 60px;height: 60px;
						border-radius: 20px;
						margin-right: 10px;"
						:src="server + item.userHeadImage">
							<view style="display: flex;flex-direction: column; padding-left: 7px;">
								<text>{{item.userNick}}</text>
								<text style="font-size: 13px;padding-top: 5px;">{{item.dateTime}}</text>
							</view>
						</image>
						
					</view>
					<view class="social-detail">
						<view class="social-detail-body" style="padding-left: 10px; padding-bottom: 10px;">
							{{ item.socialDetail.socialBody }}
						</view>
						<uni-grid
						
						:column="3" 
						borderColor="#474747" 
						style="margin-top: 10px;margin-bottom: 20px;">
						    <uni-grid-item 
							v-for="(fileItem,index) in getArray(item.socialDetail.socialFiles)" :index="index" :key="index">
								<image class="main-body-grid-img" 
								:src="server + item.socialDetail.filesUrl + fileItem"></image>
						    </uni-grid-item>
						</uni-grid>
						<view class="social-tools">
							<image 
							@tap="clickLike(index)" 
							:src="likes[index].src">
							</image>
							<image 
							@tap="clickComment(index)" 
							src="../../static/comment.png" >
							</image>
							
							<image 
							@tap="clickShare(index)" 
							src="../../static/share.png">
							</image>
						</view>
						<view style="margin-bottom: 30px;">
							<view v-if="parseInt(item.socialDetail.clicks)!==0" style="margin-left: 10px;">
							{{ item.socialDetail.clicks }}人觉得很赞
							</view>
							<view @tap="clickComment(index)" v-if="parseInt(item.socialDetail.comments)!==0" style="margin-left: 10px;">
							{{ item.socialDetail.comments }}条评论
							</view>
							<view v-if="parseInt(item.socialDetail.shares)!==0" style="margin-left: 10px;">
							{{ item.socialDetail.shares }}人转发
						</view>
						
						</view>
					</view>
					
				</view>
			</view>
			<view @tap="loadMore" style="text-align: center; margin-bottom: 20px;">
				{{ bottomState[bottomStateIndex] }}
			</view>
			</scroll-view>
		</view>
		<view class="main-body-bottom">
			<image
				@tap="addFunction"
				src="@/static/add.png" 
				style="width: 30px;height: 30px;
				padding: 10px 8px 10px 25px;">
				
			</image>
		</view>
	</view>
</template>

<script>
	import globalUrl from '../Global.vue'
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	
	import {
		mapState
	} from 'vuex'
	const {windowHeight} = uni.getSystemInfoSync();
	export default {
		components: {uniGrid,uniGridItem},
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight', 'userPermission']),
		data(){
			return {
				lastUserId: 0,
				server: globalUrl.httpUrl,
				topViewHeight: 45,
				windowHeight,
				triggered: false,
				bottomState: [
					'未加载数据',
					'数据加载中',
					'加载完毕',
					'暂无数据',
					'数据错误，请重试',
					'',
				],
				bottomStateIndex:0,
				dataList:[],
				bodyList:[],
				likes:[],
				isFirstRefresh :true,
				
			}
		},
		onLoad() {
			this.lastUserId = this.userId;
			console.log(this.windowHeight)
			this._freshing = false;
			setTimeout(() => {
				this.triggered = true;
				this.bottomStateIndex = 1;
			}, 20)
		},
		onShow() {
			
			if(this.userId != this.lastUserId){
				//用户状态发生了改变
				this.lastUserId = this.userId; // 记得改变值
				console.log("userId",this.userId);
				console.log("lastUserId",this.lastUserId);
				console.log("用户状态发生了改变")
				this.isFirstRefresh = true;
				setTimeout(() => {
					this.triggered = true;
					this.bottomStateIndex = 1;
				}, 20)
			}
		},
		methods: {
			clickLike(index){
				if(this.isLogin === false || this.userId === 0){
					uni.showToast({
						title:'登录后才能点赞哦~',
						icon:'none'
					})
					return;
				}
				
				if(this.likes[index].click == false){
					this.likes[index].click = true;
					this.likes[index].src = '../../static/like_click.png'
					this.dataList[index].socialDetail.clicks ++;
					var data = {social_id: this.dataList[index].socialDetail.socialId};
					uni.request({
						url:'/controller/social/clickSocialLike',
						method:'POST',
						data:data,
						header:{'Content-type':'application/x-www-form-urlencoded'},
						success(res) {
							let data = res.data;
							console.log(data);
						}
					})
				}else{
					uni.showToast({
						title:'已经点过赞了哦',
						icon: 'none'
					})
				}
				// else{
				// 	this.likes[index].click = false;
				// 	this.likes[index].src = '../../static/like_normal.png'
				// }
				
			},
			clickComment(index){
				if(this.isLogin === false || this.userId === 0){
					uni.showToast({
						title:'登录后才能查看哦~',
						icon:'none'
					})
					return;
				}
				
				let socialInfo = this.dataList[index];
				uni.navigateTo({
					url:'socialComment/socialComment?like='+ this.likes[index].click +'&socialInfo=' + encodeURIComponent(JSON.stringify(socialInfo))
				})
			},
			clickShare(index){
				if(this.isLogin === false || this.userId === 0){
					uni.showToast({
						title:'登录后才能分享哦~',
						icon:'none'
					})
					return;
				}
			},
			getArray(str){
				return JSON.parse(str);
			},
			addFunction(){
				
				if(this.isLogin === false || this.userId === 0){
					uni.showToast({
						title:'登录后才能使用哦~',
						icon:'none'
					})
					return;
				}
				
				if(this.userPermission.createSocial === 1){
					uni.navigateTo({
						url:'createSocial/createSocial'
					})
				}else{
					uni.showToast({
						title:'你没有创建社交动态的权限',
						icon:'none'
					})
				}
			},
			loadMore(){
				this.bottomStateIndex = 1;
				setTimeout(() => {
					this.bottomStateIndex = 2;
				},1000)
			},
			onScrolltolower(){
				console.log("onScrolltolower");
				this.bottomStateIndex = 1
				var data = { social_id: this.dataList[this.dataList.length-1].socialDetail.socialId, 
							is_refresh:2 ,
				}
				var _this = this;
				console.log("data",data)
				uni.request({
					url:'/controller/social/getSocialList',
					method:'GET',
					data: data,
					success(res) {
						_this.triggered = false;
						_this._freshing = false;
						var dat = res.data;
						console.log(dat);
						
						_this.bottomStateIndex = 2;
						if(dat.state === '200'){
							let list = dat.list;
							console.log(list);
							if(list.length === 0){
								_this.bottomStateIndex = 3;
							}else{
								_this.dataList = _this.dataList.concat(list);
								for (var i = 0; i < list.length; i++) {
									var like = {
										click:false,
										src:'../../static/like_normal.png'
									}
									if(list[i].click){
										like.click = true;
										like.src = '../../static/like_click.png';
									}
									_this.likes.push(like);
								}
							}
							
							
						}else{
							_this.bottomStateIndex = 4;
						}
						
					},
					fail(err) {
						_this.triggered = false;
						_this._freshing = false;
						console.log(err)
						_this.bottomState[4] = '请求错误，请检查网络后重试';
						_this.bottomStateIndex = 4;
						uni.showToast({
							title: '请求错误，请检查网络后重试',
							icon: 'none'
						})
						
					}
					
				})
				
				// setTimeout(() => {
				// 	if(this.dataList.length === 0){
						
				// 		for (var i = 0; i < 44; i++) {
				// 			if(this.dataList.length <= 200){
				// 				this.dataList.push(i)
				// 			}else{
				// 				this.bottomStateIndex = 1
				// 			}
				// 		}
				// 	}else{
				// 		this.bottomStateIndex = 2
				// 	}
					
						
				// }, 1000)
			},
			onPulling(e) {
				//console.log("onpulling", e);
			},
			onRefresh(e) {
				console.log("onRefresh", e);
				if (this._freshing) return;
				this._freshing = true;
				this.bottomStateIndex = 1;
				var data = null;
				this.dataList.splice(0, this.dataList.length);
				// if(this.isFirstRefresh){
				// 	data = {  }
				// 	this.dataList.splice(0,this.dataList.length);
				// 	this.isFirstRefresh = false;
				// }else{
				// 	console.log(this.dataList)
				// 	if(this.dataList.length > 0){
				// 		data = { social_id: this.dataList[0].socialDetail.socialId, is_refresh:1 }
				// 	}else{
				// 		data = { social_id:0, is_refresh:1 }
				// 	}
				// }
				var _this = this;
				console.log("data",data)
				uni.request({
					url:'/controller/social/getSocialList',
					method:'GET',
					data: data,
					success(res) {
						_this.triggered = false;
						_this._freshing = false;
						var dat = res.data;
						console.log(dat);
						_this.bottomStateIndex = 2;
						if(dat.state === '200'){
							let list = dat.list;
							console.log(list);
							_this.dataList = list.concat(_this.dataList);
							let likes = [];
							for (var i = 0; i < list.length; i++) {
								var like = {
									click:false,
									src:'../../static/like_normal.png'
								}
								if(list[i].click){
									like.click = true;
									like.src = '../../static/like_click.png';
								}
								likes.push(like);
							}
							_this.likes = likes.concat(_this.likes)
						}else{
							
							_this.bottomStateIndex = 4;
						}
						
					},
					fail(err) {
						_this.triggered = false;
						_this._freshing = false;
						console.log(err)
						_this.bottomState[4] = '请求错误，请检查网络后重试';
						_this.bottomStateIndex = 4;
						uni.showToast({
							title: '请求错误，请检查网络后重试',
							icon: 'none'
						})
						
					}
					
				})
				
			},
			onRestore() {
				this.triggered = 'restore'; // 需要重置
				console.log("onRestore");
			},
			onAbort() {
				console.log("onAbort");
			}
			
		},
	}
</script>

<style>
	
	.social-user-info{
		font-size: 20px;
		padding: 15px;
		display: flex;
		flex-direction: row;
		
		
	}
	
	.main-body-bottom{
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
		
		position: fixed;
		bottom: 0;
		margin-bottom: 50px;
	
	}
	.main-body-grid-img{
		
		width: 80%;
		align-self: center;
	}
	
	.social-tools{
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-right: 10px;
		margin-bottom: 10px;
	}
	
	.social-tools image{
		align-self: center;
		width: 30px;
		height: 30px;
		padding-right: 20px;
	}
</style>
