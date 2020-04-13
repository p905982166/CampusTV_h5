<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">编辑动态</view>
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
			
			<view class="main-body-social-body">
				<button class="main-body-social-create" @click="createSocial">发表</button>
				<view class="main-body-social-user">
					<image 
					style="width: 60px;height: 60px; border-radius: 20px;margin-right: 10px;"
					:src="server + userInfo.userHeadImage" 
					>
						{{ userInfo.userNick }}
					</image>
				</view>
				
				<textarea class="main-body-social-body-text"
				
				 v-model="socialBody"
				 maxlength="200"
				 placeholder="在此输入内容...">
					
				</textarea>
			</view>
			
			
			<uni-grid 
			@change="itemClick"
			:column="3" 
			borderColor="#474747" 
			style="margin-top: 10px;">
			    <uni-grid-item 
				v-for="(item,index) in fileList" :index="index" :key="index">
					<image class="main-body-grid-img" 
					:src="item"></image>
			    </uni-grid-item>
			</uni-grid>
			<uni-popup ref="popup" type="bottom">
				<view v-if="isFile" style="margin-bottom: 10px;">
					<button @click="deleteItem">删除</button>
				</view>
				<view v-else style="margin-bottom: 10px;">
					<button @click="camara" style="margin-bottom: 10px;">拍照</button>
					<button @click="album" >从相册选择</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import gloabUrl from "../../Global.vue"
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {uniGrid,uniGridItem,uniPopup},
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight']),
		data() {
			return {
				server: gloabUrl.httpUrl,
				socialBody:'',
				fileList:[
					'../../../static/camera.png',
				],
				realFileSize :0,
				isFile : false,
				nowIndex : 0,
			}
		},
		mounted() {
			window.addFile = this.addFile;
		},
		methods: {
			...mapMutations(['initUserState']),
			itemClick(e){
				//console.log(e.detail.index);
				this.nowIndex = e.detail.index
				if(this.nowIndex !== this.fileList.length-1){
					this.isFile = true;
				}else{
					this.isFile = false;
					if(this.realFileSize.length === 9){
						uni.showToast({
							title:'最多支持选择9个文件',
							icon:'none'
						})
						return;
					}
				}
				this.$refs.popup.open()
			},
			deleteItem(){
				this.fileList.splice(this.nowIndex,1);
				if(this.nowIndex === 8){
					this.fileList.push("../../../static/camera.png");
				}
				this.realFileSize--;
				this.$refs.popup.close();
			},
			camara(){
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
					})
				}else{
					console.log("调用anroid方法");
					android.socialCamera();
					
				}
				this.$refs.popup.close();
			},
			album(){
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
					})
				}else{
					console.log("调用anroid方法");
					android.socialAlbum();
				}
				this.$refs.popup.close();
			},
			addFile(path){
				this.fileList.splice(this.nowIndex,1);
				this.fileList.push("http://androidimg" + path);
				if(this.nowIndex <= 8){
					this.fileList.push("../../../static/camera.png");
				}
				
				this.realFileSize ++;
				console.log(this.realFileSize);
			},
			createSocial(){
				console.log(this.socialBody);
				if(this.socialBody === '' && this.realFileSize <= 0){
					uni.showToast({
						title:'你还没有编辑任何内容呢',
						icon:'none'
					})
					return;
				}else{
					var _this = this;
					uni.showModal({
						title: '发布动态',
						content: '确定发布该动态吗？',
						showCancel: true,
						cancelText: '取消',
						cancelColor: '#ff0a0a',
						confirmText: '确定',
						confirmColor: '#007aff',
						success(re) {
							if(re.confirm){
								//处理最后一个url
								
								if(typeof android === "undefined"){
									console.log("不是在应用内打开");
									uni.showToast({
										title:'请在app内使用',
										icon:'none'
									})
								}else{
									console.log("调用anroid方法");
									let cookie = _this.getCookie("user_cookie");
									
									android.createSocial(_this.socialBody, JSON.stringify(_this.fileList), cookie);
									setTimeout(e => {
										uni.navigateBack({
											
										})
									},1000)
								}
							}
						},
					})
				}
				
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
	}
	.main-body-social-body{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 30%;
		border: solid #000000;
		border-width: 1px 0px 1px 0px;
	}
	.main-body-social-create{
		position: fixed;
		right: 0;
		margin-top: 10rpx;
		margin-right: 10rpx;
		background-color: #0FAEFF;
	}
	.main-body-social-user{
		padding: 15px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.main-body-grid-img{
		
		width: 80%;
		align-self: center;
	}
	.main-body-social-body-text{
		width: 94%;
		display: flex;
		margin-left: 10px;
		margin-right: 10px;
		font-size: 18px;
		
	}

</style>
