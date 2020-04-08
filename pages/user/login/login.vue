<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">用户登录</view>
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
			
			<view class="main-body-login">
				<view class="input-group">
					<view class="input-row border">
						<text class="title">用户名：</text>
						<m-input class="m-input" type="text" maxlength="15" clearable focus v-model="account" placeholder="登录用户名/手机号"></m-input>
					</view>
					<view class="input-row">
						<text class="title">密码：</text>
						<m-input type="password" maxlength="16" displayable v-model="password" placeholder="请输入密码"></m-input>
					</view>
				</view>
				<view class="btn-row">
					<button type="primary" class="primary" @tap="login">登录</button>
				</view>
				<view class="action-row">
					<navigator url="../register/register">注册账号</navigator>
					<text>|</text>
					<navigator url="../findPwd/findPwd">忘记密码</navigator>
				</view>
				
			</view>
			
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
		computed: mapState(['isLogin', 'userId','statusBarHeight',
							'registerUserAccount','registerUserPassword']),
		data() {
			return {
				account: '',
				password: '',
			}
		},
		methods: {
			...mapMutations(['initUserState']),
			login(){
				console.log("login")
				var _this = this;
				if(_this.account.length < 5 || _this.account.length > 15){
					uni.showToast({
						title:'账号长度应在5~15位',
						icon: 'none',
					})
					return;
				}
				if(_this.password.length < 6 || _this.password.length > 16){
					uni.showToast({
						title:'密码长度应在6~16位',
						icon: 'none',
					})
					return;
				}
				console.log("准备访问：data -> ", _this.account, _this.password);
				uni.showLoading({
					title:'正在校验'
				})
				uni.request({
					url:'/controller/sys_user/login',
					method:'POST',
					data: { u_name: _this.account , u_password: _this.password},
					header:{'Content-type':'application/x-www-form-urlencoded'},
					success(res) {
						uni.hideLoading();
						let data = res.data;
						if(data.state !== '200'){
							uni.showToast({
								title: data.msg,
								icon:'none',
								complete() {
									_this.password = '';
								}
							})
						}else{
							
							let userState = {"isLogin" : false, "userId" : 0, "userInfo" : {}, "userPermission":{}};
							userState.isLogin = true;
							userState.userId = data.userId;
							userState.userInfo = data.userInfo;
							userState.userPermission = data.userPermission;
							_this.initUserState(userState);
							
							uni.hideLoading();
							uni.showToast({
								title:'登录成功',
							})
							setTimeout(function () {
							
								uni.navigateBack({
									animationType: 'pop-out',
									animationDuration: 200
								})
							
							}, 1000);
							
						}
						
					},
					fail(err) {
						uni.hideLoading();
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
			
		},
		onShow() {
			this.account = this.registerUserAccount;
			this.password = this.registerUserPassword;
		},
		
	}
</script>

<style>

	.main-body {
		height: 100%;
		width: 100%;
		position: absolute;
		background-color: #dfdfdf;
		display: flex;
		flex-direction: column;
	}
	.main-body-login{
		display: flex;
		flex: 1;
		flex-direction: column;
		background-color: #efeff4;
		padding: 10px;
	}
	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	
	.action-row navigator {
		color: #007aff;
		padding: 0 10px;
	}
</style>
