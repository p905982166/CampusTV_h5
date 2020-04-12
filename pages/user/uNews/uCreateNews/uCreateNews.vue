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
			<view v-if="!isEditing">
				<view class="main-body-news-body-tools">
					<button @click="continueEdit">继续编辑</button>
					<button style="background-color: #0FAEFF;" @click="submitPublish">提交发布</button>
				</view>
			</view>
			
			<text style="padding-top: 10px;">请认真填写以下必要信息：</text>
			<view class="main-body-picker">
				新闻类目：
				<picker class="main-body-picker-type" v-bind:disabled="!isEditing"
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
				<picker class="main-body-picker-type" v-bind:disabled="!isEditing"
				 mode="selector" 
				:range="campusType" range-key="campusName" 
				:value="campusTypeIndex"
				@change="campusTypeValuechange">
					<view>{{ campusType[campusTypeIndex].campusName }}</view>
				</picker>
			</view>
			<view class="main-body-picker">
				新闻标题：
				<input class="main-body-title" v-bind:disabled="!isEditing"
				 type="text" v-model="title" placeholder="请输入新闻标题" maxlength="40" />
			</view>
			<view class="main-body-picker-icon">
				新闻图标：
				<text @tap="androidSelectIcon" class="main-body-picker-type">选择</text>
				<image v-show="icon.length>0" @tap="androidSelectIcon" 
				class="main-body-picker-icon-img"
				 :src="icon" mode="aspectFit"></image>
			</view>
			<view class="main-body-news-body">
				头视频文件：
				<text v-bind:disabled="!isEditing" @tap="androidSelectVideo" class="main-body-picker-type">{{ videoName }}</text>
			</view>
			<view style="margin-top: 30rpx;margin-left: 20px;">
				<input class="main-body-title-video" v-bind:disabled="!isEditing"
				 type="text" v-model="videoTitle" placeholder="请输入视频标题(视频和标题都可空)" maxlength="40" />
			</view>
			
			<view class="main-body-news-body">
				新闻内容：
			</view>
			
			<view class="main-body-news-body-type"
			  v-for="(item,index) in bodyItem" :key="index">
				<view class="main-body-news-body-row" v-if="item.type === 0">
					
					<textarea class="main-body-news-body-paragraphs"
					 v-model="item.content"
					 maxlength = '-1'
					 auto-height = "true"
					 placeholder="输入段落内容"
					 placeholder-style="color:#ababab"
					 v-bind:disabled="!isEditing"
					 ></textarea>
					 <image v-if="isEditing"
					 @tap="deleteItem(index)"
					 class="main-body-news-body-paragraphs-delete"
					 src="../../../../static/delete.png"
					 mode="aspectFit"></image>
				</view>
				<view class="main-body-news-body-row" v-if="item.type === 1">
					<image
					class="main-body-news-body-img"
					:src="item.content"
					mode="aspectFit"></image>
					<image v-if="isEditing"
					@tap="deleteItem(index)"
					class="main-body-news-body-paragraphs-delete"
					src="../../../../static/delete.png"
					mode="aspectFit"></image>
				</view>
				
			</view>
			
			<view v-if="isEditing">
				<view class="main-body-news-body-tools">
					<button @click="addParagraphs">插入段落</button>
					<button @click="callAndroidSelectNewsImg">插入图片</button>
				</view>
				<button @click="submitSave" class="main-body-news-body-tools-bt" >提交保存</button>
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
				
				campusType: [{campusId:0, campusName:'请选择'}],
				campusTypeIndex: 0,
				campusId: 0,
				
				title:'',
				icon:'',
				videoName:'请选择',
				videoTitle:'',
				server:'dfghjghfgfhkhhhgvgh',
				
				bodyNode:[
					{
						name: 'p',
						attrs: {
							class: 'p-class',
							style: 'line-height: 60px; color: red; text-align:center;'
						},
						children: [{
							type: 'text',
							text: 'Hello&nbsp;uni-app!'
						}]
					},
					
				],
				
				richBody:'<p>paragraph_0</p><p>paragraph_1</p><img>img_0</img>',
				bodyItem:[
				],
				
				isJudging : true,
				isEditing: true,
				changed: false,
				newsId: 0,
				
				lastIndex: -1, //上个页面传过来的
			}
		},
		onLoad(option) {
			console.log("onLoad")
			
			if(option.newsId !== undefined){
				this.newsId = parseInt(option.newsId);
				this.isEditing = false;
				this.lastIndex = parseInt(option.index);
				console.log(this.lastIndex)
			}
		},
		onReady() {
			console.log("onReady")
			console.log(this.newsId)
			
			var that = this;
			if(this.newsId !== undefined && this.newsId !== 0){
				//获取信息
				console.log("继续编辑新闻")
				let data = {news_id: this.newsId}
				uni.request({
					url:'/controller/news/getMyUnReviewedView',
					data:data,
					method:'GET',
					success(res) {
						var dat = res.data;
						if(dat.state === '200'){
							console.log(dat);
							let detail = dat.news_detail;
							that.subTabId = detail.subTypesId;
							that.campusId = detail.belongTo;
							that.title = detail.newsTitle;
							let server = "http://192.168.43.249:8888/" + detail.newsUrl;
							that.server = server;
							if(!detail.newsIcon.startsWith(server)){
								that.icon = server + detail.newsIcon;
							}else{
								that.icon = detail.newsIcon;
							}
							
							let videoName = detail.videos;
							if(videoName.length > 13){
								let head = videoName.substr(0,5);
								let end = videoName.substr(videoName.length - 8);
								let tempName = head.concat("....").concat(end);
								that.videoName = tempName;
							}
							let body = detail.newsBody;
							
							let item = JSON.parse(body)
							for (var i = 0; i < item.length; i++) {
								if(item[i].type === 1){
									if(!item[i].content.startsWith(server)){
										item[i].content = server + item[i].content;
									}
								}
								that.bodyItem.push(item[i])
							}
							console.log(that.bodyItem);
							
						}
						that.initUi();
					},
					fail(err) {
						console.log(err);
						that.initUi();
					}
					
				})
			}else{
				console.log("创建新闻")
				that.initUi();
			}
			
			
		},
		
		mounted() {
			window.changeIcon = this.changeIcon;
			window.changeVideo = this.changeVideo;
			window.addImg = this.addImg;
			window.stopEdit = this.stopEdit;
			window.appback = this.appback;
		},
		methods: {
			...mapMutations(['initUserState']),
			initUi(){
				console.log("initUi");
				
				console.log(this.tabTypeIndex)
				var that = this;
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
							//填充第一列
							that.tabType[0] = tempList;
							
							//初始化默认选择第一列
							let iniSelectI = 0;
							let iniSelectJ = 0;
							if(that.subTabId !== 0){
								for (var i = 0; i < that.subTabTypeList.length; i++) {
									for(var j = 0; j < that.subTabTypeList[i].length; j++){
										if(that.subTabId === that.subTabTypeList[i][j].sub_id){
											iniSelectI = i;
											iniSelectJ = j;
											break;
										}
									}
								}
							}
							
							that.tabType[1] = that.subTabTypeList[iniSelectI];
							//这样写才有效
							that.tabTypeIndex.splice(0,that.tabTypeIndex.length);
							that.tabTypeIndex.push(iniSelectI)
							that.tabTypeIndex.push(iniSelectJ)
							that.subTypeSelect = that.subTabTypeList[iniSelectI][iniSelectJ];
							console.log(that.tabTypeIndex)
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
							console.log("that.campusId",that.campusId);
							for (var i = 0; i < dat.list.length; i++) {
								var obj = {campusId:0, campusName:''}
								obj.campusId = dat.list[i].campusId;
								obj.campusName = dat.list[i].campusName;
								that.campusType.push(obj);
								
								if(obj.campusId === that.campusId){
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
			tabTypeValuechange(e){
				this.changed = true;
				console.log(e.detail.value);
				this.tabTypeIndex = e.detail.value;
				console.log(this.tabTypeIndex);
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
				this.changed = true;
				console.log(e.target.value);e.target.value;
				this.campusTypeIndex = e.target.value;
				this.campusName = this.campusType[e.target.value].campusName;
			},
			androidSelectIcon(){
				if(this.isEditing){
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
				}
				
			},
			changeIcon(path){
				this.changed = true;
				console.log("path");
				console.log(path);
				//在安卓端拦截请求，否则显示不了
				this.icon = "http://androidimg" + path;
			},
			androidSelectVideo(){
				if(this.isEditing){
					if(typeof android === "undefined"){
						console.log("不是在应用内打开");
						uni.showToast({
							title:'请在app内使用',
							icon:'none'
							
						})
					}else{
						console.log("调用android方法");
						android.selectNewsVideo();
					}
					
				}
				
			},
			changeVideo(videoName){
				this.changed = true;
				//在安卓端拦截请求，否则显示不了
				if(videoName.length > 13){
					let head = videoName.substr(0,5);
					let end = videoName.substr(videoName.length - 8);
					let tempName = head.concat("....").concat(end);
					this.videoName = tempName;
				}
				
			},
			deleteItem(index){
				this.changed = true;
				this.bodyItem.splice(index,1);
			},
			
			addParagraphs(){
				this.changed = true;
				this.bodyItem.push({type:0, content: ''})
			},
			callAndroidSelectNewsImg(){
				
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
					})
				}else{
					console.log("调用android方法");
					android.selectNewsImg();
				}
			},
			addImg(path){
				this.changed = true;
				let tempPath = "http://androidimg" + path;
				this.bodyItem.push({type:1, content: tempPath})
			},
			submitSave(){
				
				if(!this.changed){
					console.log("无更改，无需保存");
					this.isEditing = false;
					return;
				}
				
				//在android端实现
				
				var newsInfo = {
					newsId: 0,
					userId : this.userId,
					subTypesId : 0,
					belongTo : 0,
					newsTitle : '',
					newsIcon: '',
					createBy : this.userId,
					lastEditBy : this.userId,
					newsBody: '',
					photos: '',
					videos: '',
					videoTitle: this.videoTitle,
				}
				
				if(this.subTypeSelect.sub_id === 0){
					uni.showToast({
						title:'新闻类目不能为空',
						icon:'none',
					})
					return;
				}else{
					newsInfo.subTypesId = this.subTypeSelect.sub_id;
				}
				
				if(this.campusType[this.campusTypeIndex].campusId === 0){
					uni.showToast({
						title:'所属学校不能为空',
						icon:'none',
					})
					return;
				}else{
					newsInfo.belongTo = this.campusType[this.campusTypeIndex].campusId;
				}
				
				if(this.title <= 0){
					uni.showToast({
						title:'新闻标题不能为空',
						icon:'none',
						
					})
					return;
				}else{
					newsInfo.newsTitle = this.title;
				}
				if(this.icon.length <= 0){
					uni.showToast({
						title:'新闻图标不能为空',
						icon:'none',
						
					})
					return;
				}else{
					
				}
				if(this.videoName === '请选择'){
					//无需判断
				}else{
					//video已保存在安卓端
				}
				if(this.bodyItem.length <= 0){
					uni.showToast({
						title:'新闻内容不能为空',
						icon:'none',
					})
					return;
				}else{
					
				}
				
				
				
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
					})
				}else{
					
					console.log("调用android方法");
					let cookie = this.getCookie("user_cookie");
					if(this.newsId !== 0){
						//更新
						newsInfo.newsId = this.newsId;
					}
					android.submitSaveNews(JSON.stringify(newsInfo),JSON.stringify(this.bodyItem), this.server, cookie);
					
					var pages = getCurrentPages();
					var prevPage = pages[pages.length - 2]; //上一个页面
					console.log("点击了保存，置刷新位为真")
					//不是创建新的，要移除上页面中的数据
					prevPage.$set(prevPage.$data, 'pageBack', {refresh:true})
				}
				
			},
			continueEdit(){
				this.isEditing = true;
			},
			stopEdit(newsId){
				//android 保存成功后调用
				this.changed = false;
				this.isEditing = false;
				this.newsId = newsId;
				
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
			submitPublish(){
				//发布，提交审核
				var _this = this;
				if(_this.newsId !== undefined && _this.newsId !== 0)
				uni.showModal({
					title: '发布新闻',
					content: '确定提交发布吗？',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#ff0a0a',
					confirmText: '确定',
					confirmColor: '#007aff',
					success(re) {
						if(re.confirm){
							let data = {news_id: _this.newsId}
							console.log(data);
							uni.request({
								url:'/controller/news/publishNews',
								method:'POST',
								data: data,
								header:{'Content-type':'application/x-www-form-urlencoded'},
								success(res) {
									var dat = res.data;
									if(dat.state === '200'){
										uni.showToast({
											title:"已成功提交，请等待审核"
										})
										
										var pages = getCurrentPages();
										var prevPage = pages[pages.length - 2]; //上一个页面
										
										if(_this.lastIndex !== -1){
											//不是创建新的，要移除上页面中的数据
											prevPage.$set(prevPage.$data, 'pageBack', {remove:true, index: _this.lastIndex})
										}
										setTimeout(function () {
										
											uni.navigateBack({
												animationType: 'pop-out',
												animationDuration: 200
											})
										
										}, 1000);
									}else{
										uni.showToast({
											title: dat.msg,
											icon: 'none'
										})
									}
								},
								fail(err) {
									console.log(err)
									uni.showToast({
										title: '请求错误，请检查网络后重试',
										icon: 'none'
									})
								}
								
							})
						}
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
		onBackPress() {
			var _this = this;
			if(_this.changed){
				//询问是否保存
				uni.showModal({
					title: '编辑新闻',
					content: '内容改变过，是否保存更改？',
					showCancel: true,
					cancelText: '取消',
					cancelColor: '#007aff',
					confirmText: '确定',
					confirmColor: '#007aff',
					success(res) {
						if(res.confirm){
							_this.submitSave();
						}else{
							_this.changed = false;
							uni.navigateBack({
								animationType: 'pop-out',
								animationDuration: 200
							})
						}
					}
				})
				return true;
			}
			
		}
	}
</script>

<style>

	.main-body{
		
		width: 100%;
		position: absolute;
	
		display: flex;
		flex-direction: column;
		
	}
	.main-body-picker{
		display: flex;
		flex-direction: row;
		padding-top: 26rpx;
		align-items: center;
		padding-left: 20px;
	}
	.main-body-picker-icon{
		display: flex;
		flex-direction: row;
		padding-top: 40rpx;
		align-items: center;
		padding-left: 20px;
	}
	.main-body-picker-type{
		background-color: #ececec;
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
	.main-body-title-video{
		padding-left: 10rpx;
		margin-right: 10px;
		width: 80%;
		border:solid #000;
		border-width:0 0 1px 0;
	}
	.main-body-picker-icon-img{
		padding-left: 20px;
		border-radius: 8px;
		width: 100px;
		height: 100px;
	}
	.main-body-news-body{
		
		padding-top: 60rpx;
		align-items: center;
		padding-left: 20px;
	}
	.main-body-news-body-type{
		text-align: center;
		margin-bottom: 20px;
	}
	.main-body-news-body-row{
		padding-top: 10rpx;
		display: flex;
		flex-direction: row;
		margin-left: 20px;
		
	}
	.main-body-news-body-paragraphs{
		text-align: left;
		font-size: 18px;
		background-color: #fff;
		margin-top: 15px;
		padding-left: 10rpx;
		margin-left: 20px;
		margin-right: 10px;
		border: 1px solid #000;
		
	}
	.main-body-news-body-paragraphs-delete{
		margin-left: 30rpx;
		margin-right: 30rpx;
		width: 30px;
		height: 30px;
		align-self: center;
	}
	
	.main-body-news-body-img{
		margin-top: 15px;
		width: 300px;
		margin-left: 30px;
	}
	
	.main-body-news-body-tools{
		display: flex;
		flex-direction: row;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.main-body-news-body-tools-bt{
		height: 50px;
		margin-left: 50px;
		margin-right: 50px;
		
		margin-bottom: 30px;
		background-color: #007AFF;
	}
</style>