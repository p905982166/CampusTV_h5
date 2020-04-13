<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">编辑个人信息</view>
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
			<view class="main-body-edit">
				<view class="edit-input-group">
					<view class="edit-input-row">
						<text>用户编号：</text>
						<m-input type="text" disabled="true" maxlength="15" v-model="uId" ></m-input>
					</view>
					<view class="edit-input-row">
						<text>用户名：</text>
						<m-input type="text" disabled="true" maxlength="15" v-model="uName"></m-input>
					</view>
					<view class="edit-input-row">
						<text>手机号：</text>
						<m-input type="text" disabled="true" maxlength="11" v-model="uTel" ></m-input>
					</view>
					<view class="edit-input-row">
						<text>昵称：</text>
						<m-input type="text" :disabled="!isEdit" maxlength="12" :clearable="isEdit" v-model="uNick" placeholder="取个昵称吧~"></m-input>
					</view>
					<view class="edit-input-row">
						<text>性别：</text>
						<radio-group @change="sexChange">
							<label>
								<radio :disabled="!isEdit" class="radio-sex" value="1" :checked="isBoy"/><text class="radio-sex-text">男</text>
								<radio :disabled="!isEdit" class="radio-sex" value="2" :checked="!isBoy"/><text class="radio-sex-text">女</text>
							</label>
						</radio-group>
					</view>
					<view class="edit-input-row">
						<text>签名：</text>
						<m-input type="text" :disabled="!isEdit" maxlength="50" :clearable="isEdit" v-model="uSign" placeholder="留下你想说的话语吧~"></m-input>
					</view>
					<view class="edit-input-row">
						所属学校：
						<picker class="main-body-picker-type" :disabled="!isEdit"
						 mode="selector" 
						:range="campusType" range-key="campusName" 
						:value="campusTypeIndex"
						@change="campusTypeValuechange">
							<view>{{ campusType[campusTypeIndex].campusName }}</view>
						</picker>
					</view>
					<view class="edit-input-row">
						<text>接受陌生人消息：</text>
						<radio-group @change="agreeChange">
							<label>
								<radio :disabled="!isEdit" class="radio-sex" value="1" :checked="isAgree"/><text class="radio-sex-text">是</text>
								<radio :disabled="!isEdit" class="radio-sex" value="2" :checked="!isAgree"/><text class="radio-sex-text">否</text>
							</label>
						</radio-group>
					</view>
				</view>
			</view>
			
			<view class="btn-edit" v-show="!isEdit">
				<button class="bt-edit-start" @tap="startEdit">启用编辑</button>
			</view>
			<view class="btn-edit" v-show="isEdit">
				<button class="bt-edit-true" @tap="postEdit">确定</button>
			</view>
			<view class="btn-edit" v-show="isEdit">
				<button class="bt-edit-false" @tap="cancelEdit">取消</button>
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
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight']),
		data() {
			return {
				uId : '',
				uName : '',
				uTel : '',
				uNick : '',
				uSex : 0,
				isBoy : true,
				uSign : '',
				uAgreeUnknows: 1,
				isAgree : false,
				
				isEdit: false,
				campusType: [{campusId:0, campusName:'请选择'}],
				campusTypeIndex: 0,
				campusId: 0,
				uBelongTo : 0,
			}
		},
		onReady() {
			//学校
			var that = this;
			uni.request({
				url:'/controller/campus/getCampusLists',
				method:'GET',
				success(res) {
					var dat = res.data;
					if(dat.state === '200'){
						console.log(dat.list);
						console.log("that.uBelongTo",that.uBelongTo);
						for (var i = 0; i < dat.list.length; i++) {
							var obj = {campusId:0, campusName:''}
							obj.campusId = dat.list[i].campusId;
							obj.campusName = dat.list[i].campusName;
							that.campusType.push(obj);
							
							if(obj.campusId === that.uBelongTo){
								that.campusTypeIndex = i + 1;
							}
						}
					}
				},
				fail(err) {
					console.log(err)
				}
				
			})
		},
		methods: {
			...mapMutations(['changeUserInfo']),
			
			appback(){
				uni.navigateBack({
					animationType: 'pop-out',
					animationDuration: 200
				})
			},
			sexChange(event){
				console.log(event.detail.value);
				this.uSex = parseInt(event.detail.value) ;
			},
			agreeChange(event){
				console.log(event.detail.value);
				this.uAgreeUnknows = parseInt(event.detail.value);
			},
			startEdit(){
				this.isEdit = true;
			},
			cancelEdit(){
				this.isEdit = false;
			},
			campusTypeValuechange(e){
				console.log(e.target.value);
				this.campusTypeIndex = e.target.value;
				this.campusName = this.campusType[e.target.value].campusName;
			},
			postEdit(){
				if(this.uNick.length <= 0){
					uni.showToast({
						title:"取个昵称吧 ۹(･༥･´)و ",
						icon:"none"
					});
					return;
				}
				var requestUser = {
					userId: this.userInfo.userId,
					userNick: this.uNick,
					userSex: this.uSex,
					userSign: this.uSign,
					agreeUnknows: this.uAgreeUnknows,
					belongTo: this.campusType[this.campusTypeIndex].campusId
				}
				var _this = this;
				uni.request({
					url:'/controller/sys_user/edit_info',
					method:'POST',
					data: requestUser,
					header:{'Content-type':'application/json'},
					success(res) {
						
						let data = res.data;
						if(data.state !== '200'){
							uni.showToast({
								title: data.msg,
								icon:'none',
							})
						}else{
							
							let userInfo = _this.userInfo;
							userInfo.userNick = _this.uNick;
							userInfo.userSex = _this.uSex;
							userInfo.userSign = _this.uSign;
							userInfo.agreeUnknows = _this.uAgreeUnknows;
							_this.changeUserInfo(userInfo);
							
							uni.showToast({
								title:'修改成功',
							});
							
							_this.isEdit = false;
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
			
		},
		onLoad() {
			this.uId = this.userInfo.userId + '';
			this.uName = this.userInfo.userName;
			this.uTel = this.userInfo.userTel;
			this.uNick = this.userInfo.userNick;
			this.uSex = this.userInfo.userSex;
			this.uBelongTo = this.userInfo.belongTo;
			if(this.uSex === 1){
				this.isBoy = true;
			}else{
				this.isBoy = false;
			}
			this.uSign = this.userInfo.userSign;
			this.uAgreeUnknows = this.userInfo.agreeUnknows;
			if(this.uAgreeUnknows === 1){
				this.isAgree = true;
			}else{
				this.isAgree = false;
			}
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
	.edit-input-group{
		display: flex;
		flex-direction: column;
		padding: 20px;
	}
	.edit-input-row{
		display: flex;
		flex-direction: row;
		margin-bottom: 40px;
		position: relative;
		align-items: center;
	}
	
	.edit-input-row::after {
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
	.bt-edit-start{
		background-color: #ebebeb;
	}
	.bt-edit-true{
		background-color: #007AFF;
	}
	.bt-edit-false{
		background-color: #ff2c2f;
		margin-top: 25px;
	}
	.btn-edit{
		padding-left: 60px;
		padding-right: 60px;
	}
	.main-body-picker{
		display: flex;
		flex-direction: row;
		padding-top: 26rpx;
		align-items: center;
		padding-left: 20px;
	}
	.main-body-picker-type{
		background-color: #ececec;
		padding-left: 20px;
		padding-right: 20px;
		border: 1px #222222 solid;
	}
</style>
