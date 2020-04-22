<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">创建队伍</view>
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
			<view style="display: flex;flex-direction: column; margin-top: 15px;margin-left: 20px;">
				队伍logo：（点击图片选择本地相册）
				<image style="align-self: center; border-radius: 8px;
						height: 200rpx;width: 200rpx;" 
					@click="selectTeamLogo"
					:src="teamLogo"
					mode="aspectFill"></image>
			</view>
			
			<view style="display: flex;flex-direction: row; align-items: center; margin-top: 15px;margin-left: 20px;">
				队伍名称：
				<input 
				style=" border:solid #000;
				  border-width:0 0 1px 0; width: 200px;"
				type="text" 
				v-model="teamName" 
				placeholder="输入队伍名称"/>
			</view>
			<view style="display: flex;flex-direction: row; align-items: center; margin-top: 15px;margin-left: 20px;">
				所属学校：
				<picker style="border: #000000 solid 1px;"
				 mode="selector" 
				:range="campusType" range-key="campusName" 
				:value="campusTypeIndex"
				@change="campusTypeValuechange">
					<view>{{ campusType[campusTypeIndex].campusName }}</view>
				</picker>
			</view>
			<view class="btn-row">
				<button style="margin-left: 20px; margin-right: 20px; background-color: #00ABEC;" 
				@tap="createTeam">确定</button>
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
		
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight','userPermission']),
		data() {
			return {
				teamLogo:'../../../../static/img/album.png',
				teamName:'',
				teamBelongTo:0,
				campusType: [{campusId:0, campusName:'请选择'}],
				campusTypeIndex: 0,
				campusId: 0,
			}
		},
		onLoad() {
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
							
						}
					}
				},
				fail(err) {
					console.log(err)
				}
				
			})
		},
		mounted() {
			window.changeTeamLogo = this.changeTeamLogo;
			window.createTeamSuccess = this.createTeamSuccess;
		},
		methods: {
			...mapMutations(['initUserState']),
			selectTeamLogo(){
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
					})
				}else{
					console.log("调用anroid方法");
					android.selectTeamLogo();
				}
			},
			changeTeamLogo(path){
				this.teamLogo = "http://androidimg" + path;
			},
			campusTypeValuechange(e){
				console.log(e.target.value);
				this.campusTypeIndex = e.target.value;
				this.campusName = this.campusType[e.target.value].campusName;
				this.teamBelongTo = this.campusType[e.target.value].campusId;
			},
			createTeam(){
				if(this.teamLogo.length <= 4 || this.teamName.length <= 0 || this.teamBelongTo ===0){
					uni.showToast({
						title:'请将所有信息填写完整',
						icon:'none'
					})
					return;
				}
				
				
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
					})
				}else{
					console.log("调用anroid方法");
					let cookie = this.getCookie("user_cookie");
					android.createTeam(
					this.teamName, 
					this.teamBelongTo+'', 
					this.teamLogo 
					,cookie);
				}
				
			},
			createTeamSuccess(teamId){
				uni.navigateBack({
					
				})
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

</style>
