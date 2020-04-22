<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">队伍信息</view>
				<!-- 返回图标需要放在标题下面才能有用 -->
				<image 
				@click="appback"
				class="main-head-navi-arrow"
				src="@/static/arrow_back_black.png"
				mode="scaleToFill"
				></image>
				
			</view>
			
		</view>
		
		<view class="main-body" v-if="teamInfo != null">
			<view style="display: flex;flex-direction: row; margin-top: 15px;
			margin-left: 20px;align-items: center;">
				队伍logo：
				<image style="align-self: center; border-radius: 8px;
						height: 200rpx;width: 200rpx;" 
					@click="selectTeamLogo"
					:src="server + teamLogo"
					mode="aspectFill"></image>
			</view>
			<view style="display: flex;flex-direction: row; align-items: center; margin-top: 15px;margin-left: 20px;">
				创建者：{{creator}}
			</view>
			<view style="display: flex;flex-direction: row; align-items: center; margin-top: 15px;margin-left: 20px;">
				队伍名称：{{teamInfo.teamName}}
			</view>
			<view style="display: flex;flex-direction: row; align-items: center; margin-top: 15px;margin-left: 20px;">
				所属学校：{{campusName}}
			</view>
			<view style="display: flex;flex-direction: column;  margin-top: 15px;margin-left: 20px;">
				队员：
				<view style="display: flex;flex-direction: column; margin-top: 15px;">
					<view v-for="(item,index) in teamPlayers" :key="index">
						{{ item.playerInfo.playerName }}
						{{ item.teamPlayer.playerNumber }}
						{{ item.teamPlayer.teamRole }}
					</view>
					
				</view>
				<button style="width: 100px;background-color: #00ABEC;">邀请成员</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import globalUrl from '@/pages/Global.vue'
	export default {
		
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight','userPermission']),
		data() {
			return {
				server: globalUrl.httpUrl,
				teamId:0,
				teamInfo:null,
				teamLogo:'',
				teamPlayers:[],
				campusName:[],
				creator:'',
			}
		},
		onLoad(option) {
			this.teamId = option.teamId;
			
		},
		onReady() {
			var _this = this;
			var data = {
				teamId: this.teamId
			}
			
			uni.request({
				url:'/controller/team/getTeamInfo',
				method:'GET',
				data:data,
				success(res) {
					let dat = res.data;
					console.log(dat)
					if(dat.state === '200'){
						_this.teamInfo = dat.teamInfo;
						_this.teamLogo = _this.teamInfo.teamLogo;
						_this.teamPlayers = JSON.parse(dat.teamPlayers) ;
						_this.campusName = dat.campusName;
						_this.creator = dat.creator;
						console.log(_this.teamInfo);
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
		methods: {
			...mapMutations(['initUserState']),
			selectTeamLogo(){
				if(this.teamInfo.createBy !== this.userId){
					uni.showToast({
						title:'非球队创建者'
					})
					return;
				}
				console.log("android selectTeamLogo");
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

	.main-body-other-logout{
		background-color: #ff0000;
		
		width: 60%;
	}
</style>
