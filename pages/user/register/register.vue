<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">用户注册</view>
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
			
			<view class="main-body-register">
				<view class="register-input-group">
					<view class="register-input-row">
						<text>用户名：</text>
						<m-input type="text" maxlength="15" clearable focus v-model="account" placeholder="以字母开头, 字母数字组合(5~15)位"></m-input>
					</view>
					<view class="register-input-row">
						<text>密码：</text>
						<m-input type="text" maxlength="16" clearable v-model="password" placeholder="设置登录密码(6~16)位"></m-input>
					</view>
					<view class="register-input-row">
						<text>再次输入：</text>
						<m-input type="text" maxlength="16" clearable v-model="confirm" placeholder="再次确认密码(6~16)位, 同上"></m-input>
					</view>
					<view class="register-input-row">
						<text>手机号：</text>
						<m-input type="text" maxlength="11" clearable v-model="telephone" placeholder="手机号(11)位"></m-input>
					</view>
					<view class="register-input-row">
						<text>验证码：</text>
						<m-input type="text" maxlength="6" clearable v-model="safeCode" placeholder="验证码(6)位"></m-input>
						<button :disabled="registerGetBtDisabled" class="safe-button" @tap="getSafeCode" type="default">获取{{ registerCountdownText }}</button>
					</view>
				</view>
				<view class="btn-row">
					<button :disabled="btRegisterDisable" class="bt-register-true" @tap="register">确定</button>
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
		watch:{
			account(){
				this.isAllFinish();
			},
			telephone(){
				this.telephone = this.telephone.replace(/\D/g, "");
				this.isAllFinish();
			},
			safeCode(){
				this.safeCode = this.safeCode.replace(/\D/g, "");
				this.isAllFinish();
			},
			password(){
				this.isAllFinish();
			},
			confirm(){
				this.isAllFinish();
			},
			
		},
		computed: mapState(['statusBarHeight','registerCountdown',
							'registerTimer','registerCountdownText', 'registerGetBtDisabled']),
		data() {
			return {
				account:'',
				password:'',
				confirm:'',
				telephone:'',
				safeCode:'',
				btRegister:'bt-register-false',
				btRegisterDisable:true,
			}
		},
		methods: {
			...mapMutations(['initUserState','changeRegisterState','registerToLogin']),
			getSafeCode(){
				var _this = this;
				if(this.telephone.length !== 11) {
					uni.showToast({
						title:'请确保手机号码位11为数字',
						icon:'none'
					})
				}else{
					
					uni.request({
						url:'/controller/sys_user/aliMessage',
						method:'POST',
						data: { tel: _this.telephone},
						header:{'Content-type':'application/x-www-form-urlencoded'},
						success(res) {
							
							let data = res.data;
							if(data.state !== '200'){
								uni.showToast({
									title: data.msg,
									icon:'none',
								})
							}else{
								_this.startTimer();
							}
							
						},
						fail(err) {
							uni.showToast({
								title:'访问失败，请检查网络',
								icon: 'none',
							})
						}
					})
					
					
				}
				
			},
			startTimer(){
				var _this = this;
				const TIME_COUNT = 60;
				if (!this.registerGetBtDisabled) {
					var countdown = TIME_COUNT;
					var timer = setInterval(() => {
						var registerState = {
							countdown:'',
							countdownText:'',
							timer:'',
							getBtDisabled: true
						}
						var countdownText = '';
						var getBtDisabled = false;
						if (countdown > 0 && countdown <= TIME_COUNT) {          
							countdown--;      
							console.log('注册验证码倒计时：',countdown);
							countdownText = '(' + countdown + ')'
							getBtDisabled = true;
						} else {          
							getBtDisabled = false;
							timer = null;        
							countdownText = '';
							clearInterval(_this.registerTimer);       
						}
						registerState.countdown = countdown;
						registerState.countdownText = countdownText;
						registerState.timer = timer;
						registerState.getBtDisabled = getBtDisabled;
						
						_this.changeRegisterState(registerState);
						
					}, 1000)       
				}
			},
			isAllFinish(){
				let disable = false;
				if(this.account.length < 5){
					disable = true;
					return;
				} 
				if(this.password.length < 6 || this.password.length > 16){
					disable = true;
					return;
				}
				if(this.confirm !== this.password){
					disable = true;
					return;
				}
				if(this.telephone.length !== 11) {
					disable = true;
					return;
				}
				if(this.safeCode.length !== 6){
					disable = true;
					return;
				}
				console.log(disable)
				this.btRegisterDisable = disable;
			},
			register(){
				
				var reg = /^[A-Za-z][A-Za-z0-9]{4,14}$/;
				console.log(reg.test(this.account))
				if(!reg.test(this.account)){
					uni.showToast({
						title: '账户名格式错误',
						icon:'none',
					})
					return;
				}
				
				var _this = this;
				this.btRegisterDisable = true;
				uni.request({
					url:'/controller/sys_user/register',
					method:'POST',
					data: {
						u_name: _this.account,
						u_password: _this.password,
						u_tel: _this.telephone,
						tel_safe_code: _this.safeCode
					},
					header:{'Content-type':'application/x-www-form-urlencoded'},
					success(res) {
						
						let data = res.data;
						if(data.state !== '200'){
							uni.showToast({
								title: data.msg,
								icon:'none',
							})
						}else{
							let registerInfo = {account: _this.account, password: _this.password};
							_this.registerToLogin(registerInfo);
							uni.showToast({
								title:'注册成功！',
							})
							setTimeout(function () {
							
								uni.navigateBack({
									animationType: 'pop-out',
									animationDuration: 200
								})
							
							}, 1000);
						}
						_this.btRegisterDisable = false;
					},
					fail(err) {
						uni.showToast({
							title:'访问失败，请检查网络',
							icon: 'none',
						});
						_this.btRegisterDisable = false;
					}
				})
			},
			appback(){
				uni.navigateBack({
					animationType: 'pop-out',
					animationDuration: 200
				})
			},
			
			/* methods */
		},
		
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
	.register-input-group{
		display: flex;
		flex-direction: column;
		padding: 20px;
	}
	.register-input-row{
		display: flex;
		flex-direction: row;
		margin-top: 40px;
		position: relative;
		align-items: center;
	}
	
	.register-input-row::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.safe-button{
		align-self: center;
		margin-right: 40rpx;
	}
	.bt-register-true{
		background-color: #007AFF;
	}

</style>
