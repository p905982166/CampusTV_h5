<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">我的队伍</view>
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
			<view class="main-body-team-control">
				<view v-if="userInfo.joinAnyTeam > 0">
					<button @click="bePlayer" type="default">修改个人玩家信息</button>
					<button @click="createTeam" type="default">创建队伍</button>
					<!-- <button @click="joinTeam" type="default">加入队伍</button> -->
					<view style="margin-left: 20px;"  class="main-body-my-team">
						我创建的队伍：
						<view style="margin-left: 20px;"  v-if="myCreate.length === 0">
							暂无数据
						</view>
						<view v-else 
						v-for="(item,index) in myCreate" :key="index"
						@click="getTeam(item.teamId)"
						style="display: flex;flex-direction: row;align-items: center;margin-left: 20px;margin-top: 10px;margin-bottom: 10px;"
						>
							<image 
							:src="server + item.teamLogo" 
							style="width: 40px;height: 40px;">
								{{ item.teamName }}
							</image>
						</view>
						我加入的队伍：
						<view style="margin-left: 20px;margin-top: 10px;" v-if="myJoin.length === 0">
							暂无数据
						</view>
						<view v-else 
						v-for="(item,index) in myJoin" :key="index"
						@click="getTeam(item.teamPlayers.teamId)"
						style="display: flex;flex-direction: row;align-items: center;margin-left: 20px;margin-top: 10px;">
							<image
							:src="server + item.teamLogo" 
							style="width: 40px;height: 40px;">
								{{ item.teamName }}
							</image>
						</view>
					</view>
				</view>
				<view v-else>
					<button @click="bePlayer" type="default">创建个人玩家信息</button>
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
	import globalUrl from '@/pages/Global.vue'
	export default {
		
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight', 'userPermission']),
		data() {
			return {
				server: globalUrl.httpUrl,
				myJoin:[],
				myCreate:[],
			}
		},
		onShow() {
			var _this = this;
			this.myCreate.splice(0,this.myCreate.length);
			this.myJoin.splice(0,this.myJoin.length);
			
			uni.request({
				url:'/controller/team/getMyTeam',
				method:'GET',
				success(res) {
					let data = res.data;
					console.log(data)
					if(data.state === '200'){
						_this.myCreate = data.myCreate;
						_this.myJoin = data.myJoin;
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
			getTeam(teamId){
				uni.navigateTo({
					url:'uTeamInfo/uTeamInfo?teamId=' + teamId
				})
			},
			bePlayer(){
				uni.navigateTo({
					url:'uBePlayer/uBePlayer'
				})
			},
			joinTeam(){
				uni.navigateTo({
					url:'uJoinTeam/uJoinTeam'
				})
			},
			createTeam(){
				if(this.userPermission.createTeam !== 1){
					uni.showToast({
						title:"你没有权限创建一只队伍"
					})
					return;
				}
				uni.navigateTo({
					url:'uCreateTeam/uCreateTeam'
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
		margin-top: 10px;
	}

	.main-body-team-control button{
		background-color: #00ABEC;
		margin-bottom: 20px;
		margin-left: 50px;
		margin-right: 50px;
	}
</style>
