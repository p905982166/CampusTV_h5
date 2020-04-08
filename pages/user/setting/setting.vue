<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">设置</view>
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
			
			<button class="main-body-other-logout" type="default" @tap="logoutModal"> 注销 </button>
			
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	export default {
		
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight']),
		data() {
			return {
				isMove : false,
			}
		},
		
		methods: {
			...mapMutations(['initUserState']),
			press(who){
				var _this = this;
				switch(who){
					case 'logout':
						break;
				};
				
			},
			release(who){
				if(!this.isMove){
					console.log("手指未移动，处理点击事件")
					var _this = this;
					switch(who){
						case 'logout':
							this.logoutModal();
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
					case 'logout':
						break;
				}
				this.isMove = true;
				
			},
			logoutModal(){
				var _this = this;
				uni.showModal({
					title: '系统',
					content: '您是否确定要退出该账号？',
					showCancel: true,
					cancelText: '再想想',
					cancelColor: '#007aff',
					confirmText: '退出',
					confirmColor: '#ff0000',
					success(res) {
						if(res.confirm){
							_this.logout();
						}
					}
				})
			},
			logout(){
				uni.showLoading({
					title:'请等待...'
				})
				var _this = this;
				uni.request({
					url:'/controller/sys_user/logout',
					method:'POST',
					data: { u_id: _this.userId},
					header:{'Content-type':'application/x-www-form-urlencoded'},
					success(res) {
						uni.hideLoading();
						let data = res.data;
						if(data.state !== '200'){
							uni.showToast({
								title: data.msg,
								icon:'none',
								
							})
						}else{
							
							uni.showToast({
								title:'注销成功',
								complete() {
									
								}
							})
							
						}
						
						let userState = {"isLogin" : false, "userId" : 0, "userInfo" : ''};
						
						userState.isLogin = false;
						userState.userInfo = {};
						
						_this.initUserState(userState);
						
						setTimeout(function () {
						
							uni.navigateBack({
								animationType: 'pop-out',
								animationDuration: 200
							})
						
						}, 1000);
						
					},
					fail(err) {
						uni.showToast({
							title:'访问失败，请检查网络',
							icon: 'none',
						})
					}
				})
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
		margin-top: 40px;
	}

	.main-body-other-logout{
		background-color: #ff0000;
		
		width: 60%;
	}
</style>
