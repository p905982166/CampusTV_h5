<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">社交评论</view>
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
			<view class="social-user-info">
				<image 
				style="
				
				width: 60px;height: 60px;
				border-radius: 20px;
				margin-right: 10px;"
				:src="server + socialInfo.userHeadImage">
					<view style="display: flex;flex-direction: column; padding-left: 7px;">
						<text>{{socialInfo.userNick}}</text>
						<text style="font-size: 13px;padding-top: 5px;">{{socialInfo.dateTime}}</text>
					</view>
				</image>
				
			</view>
			<view class="social-detail">
				<view class="social-detail-body" style="padding-left: 10px; padding-bottom: 10px;">
					{{ socialInfo.socialDetail.socialBody }}
				</view>
				<uni-grid
				@change="itemClick"
				:column="3" 
				borderColor="#474747" 
				style="margin-top: 10px;margin-bottom: 20px;">
				    <uni-grid-item 
					v-for="(fileItem,index) in getArray(socialInfo.socialDetail.socialFiles)" :index="index" :key="index">
						<image class="main-body-grid-img" 
						:src="server + socialInfo.socialDetail.filesUrl + fileItem"></image>
				    </uni-grid-item>
				</uni-grid>
				<view class="social-tools">
					<image 
					:src="likeSrc[likeIndex]">
					</image>
					<image 
					@tap="comment"
					src="@/static/comment.png" >
					</image>
					
					<image 
					src="@/static/share.png">
					</image>
				</view>
				
				
				<uni-popup ref="popup" type="bottom" >
					<view class="comment-edit">
						<input
						class="comment-edit-input"
						type="text" 
						v-model="commentBody" 
						:placeholder="holder" />
						<button type="default" style="width: 90px;background-color: #00ABEC;">发送</button>
					</view>
				</uni-popup>
				
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
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {uniGrid,uniGridItem, uniPopup},
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight', 'userPermission']),
		data() {
			return {
				server: globalUrl.httpUrl,
				socialInfo:'',
				socialId:0,
				likeSrc:['../../../static/like_normal.png','../../../static/like_click.png'],
				likeIndex:0,
				
				commentBody :'',
				holder:'评论',
				
			}
		},
		onLoad(option) {
			this.socialInfo = JSON.parse(decodeURIComponent(option.socialInfo));
			this.like = option.like;
			if(this.like){
				this.likeIndex = 1
			}else{
				this.likeIndex = 0
			}
			console.log(option);
			console.log(this.socialInfo);
		},
		onReady() {
			var data
		},
		methods: {
			...mapMutations(['initUserState']),
			comment(target){
				this.$refs.popup.open()
				if(target === 0){
					this.holder = '评论'
				}else{
					this.holder = '回复 评论'
				}
			},
			send(){
				this.$refs.popup.close()
			},
			getArray(str){
				return JSON.parse(str);
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

	.social-user-info{
		font-size: 20px;
		padding: 15px;
		display: flex;
		flex-direction: row;
		
		
	}
	
	.main-body-bottom{
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
		
		position: fixed;
		bottom: 0;
		margin-bottom: 50px;
	
	}
	.main-body-grid-img{
		
		width: 80%;
		align-self: center;
	}
	
	.social-tools{
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		margin-right: 10px;
		margin-bottom: 10px;
	}
	
	.social-tools image{
		align-self: center;
		width: 30px;
		height: 30px;
		padding-right: 20px;
	}
	
	.comment-edit{
		background-color: #fff;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		
		padding: 5px;
	}
	.comment-edit-input{
		border:1px solid #000000;
		width: 60%;
		padding: 5px 15px;
		margin-right: 10px;
	}
</style>
