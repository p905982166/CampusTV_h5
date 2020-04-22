<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">填写真实玩家信息</view>
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
			
			<view class="main-body-register">
				<view class="register-input-group">
					<view class="register-input-row">
						<text>姓名：</text>
						<m-input type="text" maxlength="30" clearable focus v-model="name" placeholder="真实姓名"></m-input>
					</view>
					<view class="register-input-row">
						<text>性别：</text>
						<radio-group @change="sexChange">
							<label>
								<radio class="radio-sex" value="1" :checked="isBoy"/><text class="radio-sex-text">男</text>
								<radio class="radio-sex" value="2" :checked="!isBoy"/><text class="radio-sex-text">女</text>
							</label>
						</radio-group>
					</view>
					<view class="register-input-row">
						<text>出生日期：</text>
						<picker mode="date" value="1990-01-01" start="1970-01-01" end="2020-01-01" @change="birthDayChange">
							<view>{{ birthDay }}</view>
						</picker>
					</view>
					<view class="register-input-row">
						<text>身高：</text>
						<m-input type="number" maxlength="3" clearable v-model="height" placeholder="单位(厘米 cm)"></m-input>
					</view>
					<view class="register-input-row">
						<text>体重：</text>
						<m-input type="number" maxlength="3" clearable v-model="weight" placeholder="单位(千克 kg)"></m-input>
					</view>
					<view class="register-input-row">
						<text>籍贯：</text>
						<m-input type="text" clearable v-model="birthPlace" placeholder="自己填写"></m-input>
					</view>
				</view>
				<view class="btn-row">
					<button class="bt-register-true" @tap="register">确定</button>
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
	import mInput from '@/components/input-box/m-input.vue'
	export default {
		components: {
			mInput
		},
		
		computed: mapState(['statusBarHeight','isLogin', 'userId','userInfo','statusBarHeight']),
		data() {
			return {
				name:'',
				uSex : 0,
				isBoy : true,
				birthDay:'1990-01-01',
				height: 0,
				weight: 0,
				birthPlace:'',
				
			}
		},
		onLoad() {
			if(this.userInfo.joinAnyTeam >= 0){
				console.log("获取信息");
				var _this = this;
				uni.request({
					url:'/controller/team/getPlayerInfo',
					method:'POST',
					data: { user_id: _this.userId},
					header:{'Content-type':'application/x-www-form-urlencoded'},
					success(res) {
						let data = res.data;
						console.log(data)
						if(data.state === '200'){
							let info = data.playerInfo
							_this.name = info.playerName;
							_this.uSex =  parseInt(info.playerSex);
							if(_this.uSex <= 1){
								_this.isBoy = true;
							}else{
								_this.isBoy = false;
							}
							_this.birthDay = _this.timeStamp(info.playerBirth);
							_this.height = info.playerHeight;
							_this.weight = info.playerWerght;
							_this.birthPlace = info.playerHome;
						}
					},
					fail(err) {
						uni.showToast({
							title:'访问失败，请检查网络',
							icon: 'none',
						})
					}
				})
			}else{
				console.log("无信息");
			}
		},
		methods: {
			...mapMutations(['changeUserInfo']),
			timeStamp: function(value) {
				if (!value) return '';
				var now = new Date(value);
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				if (month < 10) {
					month = '0' + month
				}
				var date = now.getDate();
				if (date < 10) {
					date = '0' + date
				}
				return year + "-" + month + "-" + date
			},
			sexChange(event){
				console.log(event.detail.value);
				this.uSex = parseInt(event.detail.value) ;
			},
			birthDayChange(e){
				this.birthDay = e.detail.value;
				console.log(this.birthDay);
			},
			register(){
				var _this = this;
				console.log(this.userId)
				var data = {
					playerId: this.userId,
					playerName: this.name,
					playerSex: this.uSex,
					playerBirth: this.birthDay,
					playerHeight: this.height,
					playerWerght: this.weight ,
					playerHome: this.birthPlace 
				}
				//playerWeight数据库写错了
				console.log(data);
				uni.request({
					url:'/controller/team/becomeOrEditPlayer',
					method:'POST',
					data: data,
					header:{'Content-type':'application/json'},
					success(res) {
						
						let data = res.data;
						console.log(data)
						if(data.state !== '200'){
							uni.showToast({
								title: data.msg,
								icon:'none',
							})
						}else{
							
							let userInfo = _this.userInfo;
							userInfo.joinAnyTeam = 1;
							
							_this.changeUserInfo(userInfo);
							
							uni.showToast({
								title:'保存成功',
							});
							
							setTimeout(function () {
							
								uni.navigateBack({
									animationType: 'pop-out',
									animationDuration: 200
								})
							
							}, 1000);
							
						}
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
	.radio-sex{
		margin-left: 30rpx;
	}
	.radio-sex-text{
		margin-left: 10rpx;
		margin-right: 10rpx;
	}
	.bt-register-true{
		background-color: #007AFF;
	}

</style>
