<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">编辑新闻</view>
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
			<text style="padding-top: 10px;">请认真填写以下必要信息：</text>
			<view class="main-body-picker">
				新闻类目：
				<picker class="main-body-picker-type"
				 mode="multiSelector" 
				:range="tabType" range-key="name" 
				:value="tabTypeIndex"
				@change="tabTypeValuechange"
				@columnchange="tabTypecolumnchange">
					<view>{{ subTypeSelect.name }}</view>
				</picker>
			</view>
			<view class="main-body-picker">
				所属学校：
				<picker class="main-body-picker-type"
				 mode="selector" 
				:range="campusType" range-key="campusName" 
				:value="campusTypeIndex"
				@change="campusTypeValuechange">
					<view>{{ campusName }}</view>
				</picker>
			</view>
			<view class="main-body-picker">
				新闻标题：
				<input class="main-body-title"
				 type="text" :value="title" placeholder="请输入新闻标题" maxlength="40" />
			</view>
			<view class="main-body-picker-icon">
				新闻图标：
				<text @tap="androidSelectIcon" class="main-body-picker-type">选择</text>
				<image @tap="androidSelectIcon" class="main-body-picker-icon-img" :src="icon" mode="aspectFit"></image>
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
				types: [],
				subTabId: 0,
				tabTypeIndex:[0, 0],
				subTypeSelect:{},
				tabType:[
					[
						{id: 1, name: "体育"},{id: 2, name: "电竞"}
					],
					[
						
					],
				],
				subTabTypeList:[],
				
				campusName: '请选择',
				campusType: [{campusId:0, campusName:'请选择'}],
				campusTypeIndex: 0,
				
				title:'',
				icon:'../../../../static/img/qq.png',
			}
		},
		onReady() {
			
			var that = this;
			
			//种类
			uni.request({
				url:'/controller/sys_types/getTypes',
				method:'GET',
				success(res) {
					var dat = res.data;
					if(dat.state === '200'){
						console.log(dat.types);
						that.types = dat.types;
						
						let tempList = [];
						for (var i = 0; i < that.types.length; i++) {
							//填充父菜单项
							let obj = {id:0, name:''};
							obj.id = that.types[i].typeId;
							obj.name = that.types[i].typeName;
							tempList.push(obj);
							
							//填充子菜单项
							let subTempList =[{sub_id:0, name:'请选择'}];
							for (var j = 0; j < that.types[i].subTypesList.length; j++) {
								let subObj = {sub_id:0, name:''};
								subObj.sub_id = that.types[i].subTypesList[j].subTypeId;
								subObj.name = that.types[i].subTypesList[j].subTypeName;
								subTempList.push(subObj);
							}
							that.subTabTypeList[i] = subTempList;
						}
						//初始化默认选择第一列
						that.tabType[0] = tempList;
						that.tabType[1] = that.subTabTypeList[0];
						that.subTypeSelect = that.subTabTypeList[0][0];
					}
				},
				fail(err) {
					console.log(err)
				}
				
			})
			
			//学校
			uni.request({
				url:'/controller/campus/getCampusLists',
				method:'GET',
				success(res) {
					var dat = res.data;
					if(dat.state === '200'){
						console.log(dat.list);
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
			window.changeIcon = this.changeIcon;
		},
		methods: {
			...mapMutations(['initUserState']),
			
			tabTypeValuechange(e){
				console.log(e.detail.value);
				this.tabTypeIndex = e.detail.value;
				this.subTypeSelect = this.subTabTypeList[this.tabTypeIndex[0]][this.tabTypeIndex[1]];
			},
			tabTypecolumnchange(e){
				console.log(e.detail)
				
				let column = e.detail.column;
				if(column === 0){
					//滚动第一列
					
					this.tabType[1] = this.subTabTypeList[e.detail.value];
																	// [0, x]
					this.tabTypeIndex.splice(0, 1, e.detail.value)  // [1, x]
					this.tabTypeIndex.splice(1, 1, 0)               // [1, 0]
				}
				
			},
			campusTypeValuechange(e){
				console.log(e.target.value);
				this.campusName = this.campusType[e.target.value].campusName;
			},
			androidSelectIcon(){
				
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
						
					})
				}else{
					console.log("调用android方法");
					android.selectNewsIcon();
				}
			},
			changeIcon(path){
				uni.showToast({
					title:"123213123"
				})
				console.log("path");
				console.log(path);
				//在安卓端拦截请求，否则显示不了
				this.icon = "http://androidimg" + path;
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
		background-color: #F5F5F5;
		display: flex;
		flex-direction: column;
		padding-left: 20px;
		padding-right: 20px;
	}
	.main-body-picker{
		display: flex;
		flex-direction: row;
		padding-top: 26rpx;
		align-items: center;
		
	}
	.main-body-picker-icon{
		display: flex;
		flex-direction: row;
		padding-top: 40rpx;
		align-items: center;
	}
	.main-body-picker-type{
		background-color: #ffffff;
		padding-left: 20px;
		padding-right: 20px;
		border: 1px #222222 solid;
	}
	.main-body-title{
		padding-left: 10rpx;
		margin-right: 10px;
		width: 60%;
		border:solid #000;
		border-width:0 0 1px 0;
	}
	.main-body-picker-icon-img{
		padding-left: 20px;
		border-radius: 8px;
		width: 100px;
		height: 100px;
	}
</style>
