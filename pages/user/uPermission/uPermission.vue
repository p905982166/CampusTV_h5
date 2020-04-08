<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">权限管理</view>
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
			<view class="my-search">
				<text class="my-search-text">搜索: </text>
				<input class="my-search-input" type="text" v-model="targetUserId" placeholder="用户编号"/>
				<image class="my-search-image" @click="getTargetPermission"
				src="../../../static/search.png"
				mode="scaleToFill"></image>
			</view>
			
			<view class="main-body-user-info">
				<text class="main-body-user-info-uId">用户编号：{{ realTargetUserPermission.userId }}</text>
				<text class="main-body-user-info-uNick">用户昵称：{{ realTargetUserNick }}</text>
			</view>
			
			<checkbox-group class="main-body-user-permissions" @change="cbChange">
				<view class="main-body-user-permissions-colunm">
					<label>
						<checkbox :disabled="disabled" value="managerPermission" :checked="hasPermissionManager" />权限管理
					</label>
					
					<label>
						<checkbox :disabled="disabled" value="managerUser" :checked="hasUserManager"/>用户管理
					</label>
					
					<label>
						<checkbox :disabled="disabled" value="commentNews" :checked="hasCommentNews"/>评论新闻
					</label>
					
					<label>
						<checkbox :disabled="disabled" value="commentSocial" :checked="hasCommentSocial"/>评论动态
					</label>
					
					<label>
						<checkbox :disabled="disabled" value="createTeam" :checked="hasCreateTeam"/>创建球队
					</label>
					
				</view>
				
				<view class="main-body-user-permissions-colunm">
					
					<label>
						<checkbox :disabled="disabled" value="createSubType" :checked="hasCreateSubType"/>创建菜单栏项
					</label>
					
					<label>
						<checkbox :disabled="disabled" value="createNews" :checked="hasCreateNews"/>发布新闻
					</label>
					
					<label>
						<checkbox :disabled="disabled" value="createSocial" :checked="hasCreateSocial"/>发布动态
					</label>
					
					<label>
						<checkbox :disabled="disabled" value="createMessage" :checked="hasCreateMessage"/>发送信息
					</label>
					
					<label>
						<checkbox :disabled="disabled" value="createTvRoom" :checked="hasCreateTvRoom"/>创建直播间
					</label>
					
				</view>
				
			</checkbox-group>
			<view class="bt-save">
				<button :disabled="saveabled" class="bt-save-true" @tap="save">保存</button>
			</view>
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
				targetUserId: '',
				disabled : true,
				saveabled : true,
				realTargetUserNick: '',
				realTargetUserPermission: {},
				hasPermissionManager : false,
				hasCreateSubType : false,
				hasUserManager : false,
				hasCreateNews : false,
				hasCommentNews : false,
				hasCreateSocial : false,
				hasCommentSocial : false,
				hasCreateMessage : false,
				hasCreateTeam : false,
				hasCreateTvRoom : false,
				
				
			}
		},
		
		methods: {
			...mapMutations(['initUserState']),
			
			getTargetPermission(){
				
				var _this = this;
				
				_this.realTargetUserNick = "",
				_this.realTargetUserPermission = {};
				_this.hasPermissionManager = false;
				_this.hasCreateSubType = false;
				_this.hasUserManager = false;
				_this.hasCreateNews = false;
				_this.hasCommentNews = false;
				_this.hasCreateSocial = false;
				_this.hasCommentSocial = false;
				_this.hasCreateMessage = false;
				_this.hasCreateTeam = false;
				_this.hasCreateTvRoom = false;
				_this.disabled = true;
				_this.saveabled = true;
				
				
				
				if(_this.targetUserId === ''){
					return;
				} 
				var id = parseInt(_this.targetUserId);
				
				if(isNaN(id) || id <= 0){
					uni.showToast({
						title:"用户编号非法",
						icon:'none'
					})
				}else{
					_this.disabled = true;
					uni.request({
						url:'/controller/sys_user_permission/getPermission',
						method:'GET',
						data: { target_user_id: id},
						header:{'Content-type':'application/x-www-form-urlencoded'},
						success(res) {
							let data = res.data;
							if(data.state !== '200'){
								uni.showToast({
									title: data.msg,
									icon:'none'
								})
								
							}else{
								_this.realTargetUserNick = data.userNick;
								_this.realTargetUserPermission = data.detail;
								_this.disabled = false;
								if(data.detail.managerPermission === 1){
									_this.hasPermissionManager = true;
								}else{
									_this.hasPermissionManager = false;
								}
								if(data.detail.createSubType === 1){
									_this.hasCreateSubType = true;
								}else{
									_this.hasCreateSubType = false;
								}
								if(data.detail.managerUser === 1){
									_this.hasUserManager = true;
								}else{
									_this.hasUserManager = false;
								}
								if(data.detail.createNews === 1){
									_this.hasCreateNews = true;
								}else{
									_this.hasCreateNews = false;
								}
								if(data.detail.commentNews === 1){
									_this.hasCommentNews = true;
								}else{
									_this.hasCommentNews = false;
								}
								if(data.detail.createSocial === 1){
									_this.hasCreateSocial = true;
								}else{
									_this.hasCreateSocial = false;
								}
								if(data.detail.commentSocial === 1){
									_this.hasCommentSocial = true;
								}else{
									_this.hasCommentSocial = false;
								}
								if(data.detail.createMessage === 1){
									_this.hasCreateMessage = true;
								}else{
									_this.hasCreateMessage = false;
								}
								if(data.detail.createTeam === 1){
									_this.hasCreateTeam = true;
								}else{
									_this.hasCreateTeam = false;
								}
								if(data.detail.createTvRoom === 1){
									_this.hasCreateTvRoom = true;
								}else{
									_this.hasCreateTvRoom = false;
								}
								console.log(data.detail);
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
			cbChange(e){
				this.saveabled = false;
				var list = e.detail.value;
				if(list.includes("managerPermission")){
					this.realTargetUserPermission.managerPermission = 1;
				}else{
					this.realTargetUserPermission.managerPermission = 2;
				}
				if(list.includes("createSubType")){
					this.realTargetUserPermission.createSubType = 1;
				}else{
					this.realTargetUserPermission.createSubType = 2;
				}
				if(list.includes("managerUser")){
					this.realTargetUserPermission.managerUser = 1;
				}else{
					this.realTargetUserPermission.managerUser = 2;
				}
				if(list.includes("createNews")){
					this.realTargetUserPermission.createNews = 1;
				}else{
					this.realTargetUserPermission.createNews = 2;
				}
				if(list.includes("commentNews")){
					this.realTargetUserPermission.commentNews = 1;
				}else{
					this.realTargetUserPermission.commentNews = 2;
				}
				if(list.includes("createSocial")){
					this.realTargetUserPermission.createSocial = 1;
				}else{
					this.realTargetUserPermission.createSocial = 2;
				}
				if(list.includes("commentSocial")){
					this.realTargetUserPermission.commentSocial = 1;
				}else{
					this.realTargetUserPermission.commentSocial = 2;
				}
				if(list.includes("createMessage")){
					this.realTargetUserPermission.createMessage = 1;
				}else{
					this.realTargetUserPermission.createMessage = 2;
				}
				if(list.includes("createTeam")){
					this.realTargetUserPermission.createTeam = 1;
				}else{
					this.realTargetUserPermission.createTeam = 2;
				}
				if(list.includes("createTvRoom")){
					this.realTargetUserPermission.createTvRoom = 1;
				}else{
					this.realTargetUserPermission.createTvRoom = 2;
				}
				
				console.log(this.realTargetUserPermission);
			},
			save(){
				var _this = this;
				console.log(_this.realTargetUserPermission)
				uni.request({
					url:'/controller/sys_user_permission/editPermission',
					method:'POST',
					data: _this.realTargetUserPermission,
					header:{'Content-type':'application/json'},
					success(res) {
						
						let data = res.data;
						if(data.state !== '200'){
							uni.showToast({
								title: data.msg,
								icon:'none',
							})
						}else{
							
							uni.showToast({
								title:'修改成功',
							});
							_this.saveabled = true;
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
		padding-left: 10px;
	}

	.main-body-other-logout{
		background-color: #ff0000;
		
		width: 60%;
	}
	.my-search{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 20px;
		
	}
	.my-search-text{
		
		padding-right: 20rpx;
		padding-bottom: 8rpx;
	}
	.my-search-input{
		border:2px solid #272727;
		border-radius: 8rpx;
		background-color:transparent;
	}
	.my-search-image{
		padding-left: 20rpx;
		height: 50rpx;
		width: 50rpx;
	}
	.main-body-user-info{
		display: flex;
		flex-direction: column;
		
	}
	.main-body-user-info-uId{
		margin-top: 20rpx;
		
	}
	.main-body-user-info-uNick{
		margin-top: 40rpx;
	}
	.main-body-user-permissions{
		
		padding-top: 30px;
		display: flex;
		flex-direction: row;
	}
	.main-body-user-permissions-colunm{
		padding-left: 30rpx;
		padding-right: 40rpx;
		display: flex;
		flex-direction: column;
	}
	.bt-save{
		padding-top: 90rpx;
		padding-left: 50px;
		padding-right: 70px;
	}
	.bt-save-true{
		background-color: #007AFF;
	}
	checkbox{
		padding: 20rpx;
	}
</style>
