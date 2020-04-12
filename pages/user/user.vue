<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->

		</view>
		
		<view class="main-body">
			<!-- 用户信息 -->
			<view class="main-body-user">
				<image class="main-body-user-head" @click="selectHeadImage"
				  :src="user_headImage"
				  mode="aspectFill"></image>
				<view class="main-body-user-info" @click="editInfoOrLogin"> 
					<view class="main-body-user-info-first">
						<text class="main-body-user-info-nick">{{ user_nick }}</text>
						<image class="main-body-user-info-sex" v-if="isLogin"
						 :src="user_sex"
						 mode="aspectFill"></image>
					</view>
					<view class="main-body-user-info-sign" v-show="isLogin">
						<image class="main-body-user-info-sign-icon"
						 src="../../static/sign.png"></image>
						<text class="main-body-user-info-sign-text">{{ user_sign }}</text>
					</view>
				</view>
				<image class="main-body-arrow" @click="editInfoOrLogin"
				  src="../../static/arrow_right.png"
				  mode="aspectFill"></image>
			</view>
			<!-- 用户信息结束 -->
			
			<!-- 登录后才能使用 -->
			<view v-show="isLogin">
				<!-- 用户管理 -->
				<view :class="otherUserManager" v-if="canUserManager"
				 @touchstart="press('userManager')"
				 @touchend="release('userManager')"
				 @touchmove="move('userManager')">
					<image class="main-body-other-icon" src="../../static/user_manager.png" mode="scaleToFill"></image>
					<text class="main-body-other-text">用户管理</text>
					<image class="main-body-arrow"
					  src="../../static/arrow_right.png"
					  mode="aspectFill"></image>
				</view>
				<!-- 用户管理结束 -->
				
				<!-- 权限管理 -->
				<view :class="otherUserPermission" v-if="canUserPermission"
				 @touchstart="press('_userPermission')"
				 @touchend="release('_userPermission')"
				 @touchmove="move('_userPermission')">
					<image class="main-body-other-icon" src="../../static/user_permission.png" mode="scaleToFill"></image>
					<text class="main-body-other-text">权限管理</text>
					<image class="main-body-arrow"
					  src="../../static/arrow_right.png"
					  mode="aspectFill"></image>
				</view>
				<!-- 权限管理结束 -->
				
				<!-- 我的新闻 -->
				<view :class="otherUserNews"
				 @touchstart="press('userNews')"
				 @touchend="release('userNews')"
				 @touchmove="move('userNews')">
					<image class="main-body-other-icon" src="../../static/user_news.png" mode="scaleToFill"></image>
					<text class="main-body-other-text">我的新闻</text>
					<image class="main-body-arrow"
					  src="../../static/arrow_right.png"
					  mode="aspectFill"></image>
				</view>
				<!-- 我的新闻结束 -->
				
				<!-- 新闻审核 -->
				<view :class="otherUserReview" v-if="canUserReview"
				 @touchstart="press('userReview')"
				 @touchend="release('userReview')"
				 @touchmove="move('userReview')">
					<image class="main-body-other-icon" src="../../static/user_review.png" mode="scaleToFill"></image>
					<text class="main-body-other-text">新闻审核</text>
					<image class="main-body-arrow"
					  src="../../static/arrow_right.png"
					  mode="aspectFill"></image>
				</view>
				<!-- 新闻审核结束 -->
				
				<!-- 我的队伍 -->
				<view :class="otherUserTeam"
				 @touchstart="press('userTeam')"
				 @touchend="release('userTeam')"
				 @touchmove="move('userTeam')">
					<image class="main-body-other-icon" src="../../static/user_team.png" mode="scaleToFill"></image>
					<text class="main-body-other-text">我的队伍</text>
					<image class="main-body-arrow"
					  src="../../static/arrow_right.png"
					  mode="aspectFill"></image>
				</view>
				<!-- 我的队伍结束 -->
				
				<!-- 用户日志 -->
				<view :class="otherUserLog"
				 @touchstart="press('userLog')"
				 @touchend="release('userLog')"
				 @touchmove="move('userLog')">
					<image class="main-body-other-icon" src="../../static/user_log.png" mode="scaleToFill"></image>
					<text class="main-body-other-text">用户日志</text>
					<image class="main-body-arrow"
					  src="../../static/arrow_right.png"
					  mode="aspectFill"></image>
				</view>
				<!-- 用户日志结束 -->
				
				<!-- 设置 -->
				<view :class="otherSetting"
				 @touchstart="press('setting')"
				 @touchend="release('setting')"
				 @touchmove="move('setting')">
					<image class="main-body-other-icon" src="../../static/settings.png" mode="scaleToFill"></image>
					<text class="main-body-other-text">设置</text>
					<image class="main-body-arrow"
					  src="../../static/arrow_right.png"
					  mode="aspectFill"></image>
				</view>
				<!-- 设置结束 -->
				
			</view>
			
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	const server = "http://192.168.43.249:8888/";
	export default {
		computed: mapState(['isLogin', 'userId', 'userInfo','statusBarHeight', 'userPermission']),
		data(){
			return {
				platform : '',
				user_headImage : '',
				user_nick :'',
				user_sign :'',
				user_sex : '',
				
				otherUserManager:'main-body-other-white',
				canUserManager : false,
				
				otherUserPermission:'main-body-other-white',
				canUserPermission : false,
				
				otherUserNews:'main-body-other-white',
				canUserNews : false,
				
				otherUserReview:'main-body-other-white',
				canUserReview : false,
				
				otherUserTeam:'main-body-other-white',
				
				
				otherUserLog:'main-body-other-white',
				
				
				otherSetting:'main-body-other-white',
				
				isMove:false,
			}
		},
		mounted() {
			window.changeHeadImage = this.changeHeadImage;
		},
		methods: {
		...mapMutations(['initUserState']),
			changeHeadImage(path){
				this.user_headImage = "http://androidimg" + path;
			},
			selectHeadImage(){
				
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
					})
				}else{
					console.log("调用anroid方法");
					let cookie = this.getCookie("user_cookie");
					android.uploadHeadImage(cookie);
				}
			},
			getCookie(cname) {
		    	var name = cname + "=";
		    	var ca = document.cookie.split(';');
		    	for (var i = 0; i < ca.length; i++) {
		    		var c = ca[i];
		    		while (c.charAt(0) == ' ') c = c.substring(1);
		    			if (c.indexOf(name) != -1){
		    			return c.substring(name.length, c.length);
		    		}
		    	}
		    	return "";
		    },
			editInfoOrLogin(){
				if(this.isLogin){
					this.editInfo();
				}else{
					this.login();
				}
			},
			editInfo(){
				uni.navigateTo({
					animationType: 'pop-in',
					animationDuration: 200,
					url:'editInfo/editInfo'
				})
			},
			login(){
				uni.navigateTo({
					animationType: 'pop-in',
					animationDuration: 200,
					url:'login/login'
				})
			},
			
			press(who){
				var _this = this;
				switch(who){
					case 'userManager':
						_this.otherUserManager = 'main-body-other-shade';
						break;
					case '_userPermission':
						_this.otherUserPermission = 'main-body-other-shade';
						break;
					case 'userNews':
						_this.otherUserNews = 'main-body-other-shade';
						break;
					case 'userReview':
						_this.otherUserReview = 'main-body-other-shade';
						break;
					case 'userTeam':
						_this.otherUserTeam = 'main-body-other-shade';
						break;
					case 'userLog':
						_this.otherUserLog = 'main-body-other-shade';
						break;
					case 'setting':
						_this.otherSetting = 'main-body-other-shade';
						break;
				};
				
			},
			release(who){
				if(!this.isMove){
					console.log("手指未移动，处理点击事件")
					var _this = this;
					switch(who){
						case 'userManager':
							_this.otherUserManager = 'main-body-other-white';
							_this.userManager();
							break;
						case '_userPermission':
							_this.otherUserPermission = 'main-body-other-white';
							_this._userPermission();
							break;
						case 'userNews':
							_this.otherUserNews = 'main-body-other-white';
							_this.userNews();
							break;
						case 'userReview':
							_this.otherUserReview = 'main-body-other-white';
							_this.userReview();
							break;
						case 'userTeam':
							_this.otherUserTeam = 'main-body-other-white';
							_this.userTeam();
							break;
						case 'userLog':
							_this.otherUserLog = 'main-body-other-white';
							_this.userLog();
							break;
						case 'setting':
							_this.otherSetting = 'main-body-other-white'
							_this.setting();
							break;
					}
				}else{
					console.log("手指移动，不处理点击事件")
				}
				this.isMove = false;
			},
			move(who){
				var _this = this;
				switch(who){
					case 'userManager':
						_this.otherUserManager = 'main-body-other-white';
						break;
					case '_userPermission':
						_this.otherUserPermission = 'main-body-other-white';
						break;
					case 'userNews':
						_this.otherUserNews = 'main-body-other-white';
						break;
					case 'userReview':
						_this.otherUserReview = 'main-body-other-white';
						break;
					case 'userTeam':
						_this.otherUserTeam = 'main-body-other-white';
						break;
					case 'userLog':
						_this.otherUserLog = 'main-body-other-white';
						break;
					case 'setting':
						_this.otherSetting = 'main-body-other-white'
						break;
				}
				this.isMove = true;
				
			},
			userManager(){
				uni.navigateTo({
					url:'uManager/uManager'
				})
			},
			_userPermission(){
				
				uni.navigateTo({
					url:'uPermission/uPermission'
				})
			},
			userNews(){
				uni.navigateTo({
					url:'uNews/uNews'
				})
			},
			userReview(){
				uni.navigateTo({
					url:'uReview/uReview'
				})
			},
			userTeam(){
				uni.navigateTo({
					url:'uTeam/uTeam'
				})
			},
			userLog(){
				uni.navigateTo({
					url:'uLog/uLog'
				})
			},
			setting(){
				var _this = this;
				uni.navigateTo({
					url:'setting/setting'
				})
			}
			
		},
		onShow() {
			
			console.log("再次验证用户是否登录")
			var _this = this;
			uni.request({
				url:'/controller/sys_user/query_self_info',
				method:'POST',
				header:{'Content-type':'application/x-www-form-urlencoded'},
				success(res) {
					let data = res.data;
					if(data.state === '200'){
						let userState = {"isLogin" : false, "userId" : 0, "userInfo" : {}, "userPermission":{}};
						
						userState.isLogin = true;
						userState.userId = data.userId;
						userState.userInfo = data.userInfo;
						userState.userPermission = data.userPermission;
						
						_this.initUserState(userState);
						
						_this.user_nick = _this.userInfo.userNick;
						if(_this.userInfo.userSex === 1){
							_this.user_sex = '../../static/ic_male.png';
						}else{
							_this.user_sex = '../../static/ic_female.png';
						}
						_this.user_sign = _this.userInfo.userSign !== undefined?_this.userInfo.userSign:'这家伙很懒，什么都没有留下';
						_this.user_headImage = server +  _this.userInfo.userHeadImage;
						
						if(_this.userPermission.managerUser === 1){
							_this.canUserManager = true;
						}else{
							_this.canUserManager = false;
						}
						if(_this.userPermission.managerPermission === 1){
							_this.canUserPermission = true;
						}else{
							_this.canUserPermission = false;
						}
						if(_this.userPermission.createNews === 1){
							_this.canUserNews = true;
						}else{
							_this.canUserNews = false;
						}
						if(_this.userInfo.userType >= 7){
							_this.canUserReview = true;
						}else{
							_this.canUserReview = false;
						}
					}else{
						let userState = {"isLogin" : false, "userId" : 0, "userInfo" : {}, "userPermission":{}};
						_this.initUserState(userState);
						_this.user_headImage = '../../static/no_user.png';
						
						_this.user_nick = '亲，您还没有登录呢~';
						_this.user_sign = '用户未登录';
					}
					
				},
				fail(err) {
					console.log(err)
					let userState = {"isLogin" : false, "userId" : 0, "userInfo" : {}, "userPermission":{}};
					_this.initUserState(userState);
					_this.user_headImage = '../../static/no_user.png';
					_this.user_nick = '亲，您还没有登录呢~';
					_this.user_sign = '用户未登录';
				}
			})
		
			// if(this.isLogin){
			// 	this.user_nick = this.userInfo.userNick;
			// 	this.user_sign = this.userInfo.userSign !== undefined?this.userInfo.userSign:'这家伙很懒，什么都没有留下';
			// 	this.user_headImage = server + this.userInfo.userHeadImage;
				
			// 	if(this.userInfo.userSex === 1){
			// 		this.user_sex = '../../static/ic_male.png';
			// 	}else{
			// 		this.user_sex = '../../static/ic_female.png';
			// 	}
				
			// 	if(this.userPermission.managerUser === 1){
			// 		this.canUserManager = true;
			// 	}
			// 	if(this.userPermission.managerPermission === 1){
			// 		this.canUserPermission = true;
			// 	}
			// 	if(this.userPermission.createNews === 1){
			// 		this.canUserNews = true;
			// 	}
			// 	if(this.userInfo.userType >= 7){
			// 		this.canUserReview = true;
			// 	}
				
			// }else{
			// 	this.user_headImage = '../../static/no_user.png';
			// 	this.user_nick = '亲，您还没有登录呢~';
			// 	this.user_sign = '用户未登录';
			// }
		},
		onLoad() {
			// if(!this.isLogin){
			// 	console.log("再次验证用户是否登录")
			// 	var _this = this;
			// 	uni.request({
			// 		url:'/controller/sys_user/query_self_info',
			// 		method:'POST',
			// 		header:{'Content-type':'application/x-www-form-urlencoded'},
			// 		success(res) {
			// 			let data = res.data;
			// 			if(data.state === '200'){
			// 				let userState = {"isLogin" : false, "userId" : 0, "userInfo" : {}, "userPermission":{}};
							
			// 				userState.isLogin = true;
			// 				userState.userId = data.userId;
			// 				userState.userInfo = data.userInfo;
			// 				userState.userPermission = data.userPermission;
							
			// 				_this.initUserState(userState);
							
			// 				_this.user_nick = _this.userInfo.userNick;
			// 				if(_this.userInfo.userSex === 1){
			// 					_this.user_sex = '../../static/ic_male.png';
			// 				}else{
			// 					_this.user_sex = '../../static/ic_female.png';
			// 				}
			// 				_this.user_sign = _this.userInfo.userSign !== undefined?_this.userInfo.userSign:'这家伙很懒，什么都没有留下';
			// 				_this.user_headImage = server +  _this.userInfo.userHeadImage;
							
			// 				if(_this.userPermission.managerUser === 1){
			// 					_this.canUserManager = true;
			// 				}
			// 				if(_this.userPermission.managerPermission === 1){
			// 					_this.canUserPermission = true;
			// 				}
			// 				if(_this.userPermission.createNews === 1){
			// 					_this.canUserNews = true;
			// 				}
			// 				if(_this.userInfo.userType >= 7){
			// 					_this.canUserReview = true;
			// 				}
			// 			}
						
			// 		},
			// 		fail(err) {
			// 			console.log(err)
			// 		}
			// 	})
			// }
		
		}
	}
</script>

<style>
	.main-head{
		
		background-color: #ffffff;
		padding: 10px;
	}

	.main-body{
		height: 100%;
		width: 100%;
		position: absolute;
		background-color: #f8f8f8;
		display: flex;
		flex-direction: column;
	}
	.main-body-user{
		width: 100%;
		height: 24%;
		background-color: #ffffff;
		display: flex;
		flex-direction: row;
		margin-bottom: 20rpx;
		align-items: center;
	}
	.main-body-user-head{
		
		display: flex;
		border-radius: 8px;
		height: 140rpx;
		width: 140rpx;
		margin-left: 30px;
		
	}
	.main-body-user-info{
		display: flex;
		flex-direction: column;
		padding: 30rpx;
	}
	.main-body-user-info-first{
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-bottom: 40rpx;
		font-size: 17px;
		color: #222222;
	}
	.main-body-user-info-nick{
		
	}
	.main-body-user-info-sex{
		align-self: center;
		margin-left: 20rpx;
		height: 24px;
		width: 24px;
	}
	.main-body-user-info-sign{
		display: flex;
		flex-direction: row;
	}
	.main-body-user-info-sign-icon{
		height: 16px;
		width: 16px;
		align-self: center;
	}
	.main-body-user-info-sign-text{
		padding-left: 12rpx;
		font-size: 15px;
		color: #a3a3a3;
	}
	.main-body-arrow{
		position: absolute;
		margin-right: 50rpx;
		align-self: center;
		right: 0px;
		height: 20rpx;
		width: 20rpx;
	}
	.main-body-other-white{
		background-color: white;
		display: flex;
		flex-direction: row;
		padding: 20rpx;
		margin-bottom: 10px;
		
	}
	.main-body-other-shade{
		background-color: #f8f8f8;
		display: flex;
		flex-direction: row;
		padding: 20rpx;
		margin-bottom: 10px;
	}
	.main-body-other-icon{
		margin-left: 30rpx;
		height: 70rpx;
		width: 70rpx;
	}
	.main-body-other-text{
		align-self: center;
		margin-left: 20px;
	}
	
</style>
