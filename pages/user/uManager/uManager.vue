<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">用户管理</view>
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
			<view class="main-body-select-method">
				请选择搜索方式：
				<picker class="main-body-select-method-selector"
				 mode="selector"
				:value="methodIndex"
				:range="selectMethod" :range-key="'name'" @change="selectMethodChange">
					<view>{{selectMethod[methodIndex].name}}</view>
				</picker>
			</view>
			
			<view class="main-body-select-row">
				<view v-if="methodIndex === 1" class="my-search">
					<text class="my-search-text">搜索: </text>
					<input class="my-search-input" type="text" v-model="targetUserId" placeholder="用户编号"/>
					<image class="my-search-image" @click="getTargetStatus"
					src="../../../static/search.png"
					mode="scaleToFill"></image>
				</view>
				<view v-if="methodIndex === 2" class="my-search">
					请选择用户状态：
					<picker class="main-body-select-method-selector"
					 mode="selector"
					:value="userStatusIndex"
					:range="userStatus" :range-key="'name'" @change="userStatusChange">
						<view>{{userStatus[userStatusIndex].name}}</view>
					</picker>
					<image class="my-search-image" @click="getRangeStatus"
					src="../../../static/search.png"
					mode="scaleToFill"></image>
				</view>
			</view>
			
			<view class="main-body-users">
				<t-table @change="change">
					<t-tr>
						<t-th>编号</t-th>
						<t-th>昵称</t-th>
						<t-th>状态</t-th>
						<t-th>操作</t-th>
					</t-tr>
					<t-tr v-for="item in users" :key="item.id">
						<t-td>{{ item.userId }}</t-td>
						<t-td>{{ item.userNick }}</t-td>
						<t-td>{{ getStatusString(item.userStatus) }}</t-td>
						<t-td><button @click="edit(item)">编辑</button></t-td>
					</t-tr>
				</t-table>
			</view>
			<uni-popup ref="popup" type="center">
				<radio-group @change="managerMethodChange" class="pop-column">
					<label class="pop-item">
						<radio value="0" :checked="managerMethod === 0"/>
						<text class="pop-item-text">正常</text>
					</label>
					<label class="pop-item">
						<radio value="1" :checked="managerMethod === 1"/>
						<text class="pop-item-text">限制登录</text>
					</label>
					<label class="pop-item">
						<radio value="2" :checked="managerMethod === 2"/>
						<text class="pop-item-text">冻结</text>
					</label>
					<label class="pop-item">
						<radio value="3" :checked="managerMethod === 3"/>
						<text class="pop-item-text">封禁</text>
					</label>
					<button class="pop-bt-alter" @click="postAlter">确定</button>
				</radio-group>
			</uni-popup>
			
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import tTable from '../../../components/t-table/t-table.vue';
	import tTh from '../../../components/t-table/t-th.vue';
	import tTr from '../../../components/t-table/t-tr.vue';
	import tTd from '../../../components/t-table/t-td.vue';
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd,
			uniPopup
		},
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight']),
		data() {
			return {
				methodIndex: 0,
				selectMethod:[
					{name:'点击选择', method: 0},
					{name:'用户编号', method: 1},
					{name:'用户状态', method: 2}
				],
				targetUserId:'',
				userStatusIndex:0,
				userStatus:[
					{name:'正常', status: 0},
					{name:'不正常', status: -1},
					{name:'在线', status: 1},
					{name:'不在线', status: 2},
					{name:'忙碌', status: 3},
					{name:'请勿打扰', status: 4},
					{name:'限制登录', status: 5},
					{name:'冻结', status: 6},
					{name:'封禁', status: 7},
				],
				
				users: [],
				userSelected : 0,
				managerMethod: 0,
			}
		},
		
		methods: {
			...mapMutations(['initUserState']),
			selectMethodChange(e){
				this.methodIndex = e.detail.value;
			},
			userStatusChange(e){
				this.userStatusIndex = e.detail.value;
			},
			managerMethodChange(e){
				console.log(e.detail.value);
				this.managerMethod = e.detail.value;
			},
			getTargetStatus(){
				var _this = this;
				if(_this.targetUserId === ''){
					return;
				} 
				var id = parseInt(_this.targetUserId);
				
				if(isNaN(id) || id <= 0){
					uni.showToast({
						title:"用户编号非法",
						icon:'none'
					})
					return;
				}
				var data = {query_method : 1, u_id: id};
				this.queryUsers(data);
			},
			getRangeStatus(){
				var data = {query_method : 2, u_status: this.userStatus[this.userStatusIndex].status};
				console.log(data);
				this.queryUsers(data);
			},
			queryUsers(data){
				uni.showLoading({
					title:'加载中'
				})
				var _this = this;
				uni.request({
					url:'/controller/sys_user/query_user_status',
					method:'GET',
					data: data,
					header:{'Content-type':'application/x-www-form-urlencoded'},
					success(res) {
						let data = res.data;
						if(data.state !== '200'){
							uni.showToast({
								title: data.msg,
								icon:'none'
							})
						}else{
							_this.users = data.list;
							uni.hideLoading();
						}
					},
					fail(err){
						uni.showToast({
							title:'访问失败，请检查网络',
							icon: 'none',
						})
					},
				})
			},
			change(e) {
				console.log(e.detail);
			},
			edit(item) {
				console.log(item.userId);
				this.userSelected = item.userId;
				this.$refs.popup.open()
			},
			getStatusString(status){
				let statusStr = '';
				switch(status){
					case 0: statusStr = '离线';
						break;
					case 1: statusStr = '在线';
						break;
					case 2: statusStr = '忙碌';
						break;
					case 3: statusStr = '请勿打扰';
						break;
					case 4: statusStr = '限制登录';
						break;
					case 5: statusStr = '冻结';
						break;
					case 6: statusStr = '封禁';
						break;
				}
				return statusStr;
			},
			postAlter(){
				var _this = this;
				var data = {
					u_id: _this.userSelected,
					method: _this.managerMethod
				}
				console.log(data);
				uni.request({
					url:'/controller/sys_user/alterUserStatus',
					method:'POST',
					data: data,
					header:{'Content-type':'application/x-www-form-urlencoded'},
					success(res) {
						let data = res.data;
						if(data.state !== '200'){
							uni.showToast({
								title: data.msg,
								icon:'none'
							})
						}else{
							uni.showToast({
								title: "修改成功",
							})
							if(_this.methodIndex === 1){
								_this.getTargetStatus();
							}else{
								_this.getRangeStatus();
							}
							_this.$refs.popup.close();
						}
					},
					fail(err){
						uni.showToast({
							title:'访问失败，请检查网络',
							icon: 'none',
						})
					},
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
		margin-top: 20px;
	}

	.main-body-other-logout{
		background-color: #ff0000;
		
		width: 60%;
	}
	.main-body-select-method{
		display: flex;
		flex-direction: row;
	}
	.main-body-select-method-selector{
		padding-right: 4px;
		padding-left: 4px;
		border:1.5px solid #272727;
	}
	
	.my-search{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 20px;
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
	.main-body-users{
		padding: 40rpx;
	}
	
	.pop-column{
		background-color: #FFFFFF;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		padding: 80px;
	}
	.pop-item{
		margin-bottom: 14px;
	}
	.pop-item-text{
		padding-left: 10px;
	}
	.pop-bt-alter{
		background-color: #007AFF;
		margin-top: 10px;
		width: 100%;
	}
</style>
