<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">消息</view>
			</view>
		</view>
		
		<view class="main-body">
			<qs-tabs :tabs="tabType" :current="tabTypeIndex" @change='changeType'
			activeColor="#000000" defaultColor="#000" 
			fontSize="30px"></qs-tabs>
			<swiper 
			:style="'background-color: #f5f5f5; height: '+ windowHeight +'px;'" 
			:current="tabTypeIndex" @change="swiperChange" touchable="false">
				<swiper-item>
					<view>
						<view v-if="messageList.length === 0">
							还没有收到消息呢
						</view>
						<view v-else v-for="(item, index) in messageList" :key="index">
							item.offlineMessage.messageBody
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view
					class="swiper-item uni-bg-green">
					
					</view>
				</swiper-item>
				
			</swiper>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import qsTabs from "../../components/QS-tabs/QS-tabs.vue"
	import globalUrl from '@/pages/Global.vue'
	const {windowHeight} = uni.getSystemInfoSync();
	
	export default {
		components:{
			qsTabs
		},
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight', 'userPermission']),
		
		data(){
			return {
				windowHeight,
				platform : '',
				lastUserId : 0,
				server: globalUrl.httpUrl,
				webServer: globalUrl.webSocketServer,
				
				socket: null,
				
				tabType : [
					{ typeName:"消息" },
					{ typeName:"好友" }
				],
				tabTypeIndex :0,
				
				
				friendsList:[],
				
				applyList:[],
				
				messageList:[],
				
			}
		},
		onUnload(){
			if(this.socket !== null){
				console.log("断开socket")
				uni.closeSocket()
			}
		},
		onLoad() {
			console.log("onLoad")
			if(this.isLogin){
				this.lastUserId = this.userId;
				console.log("lastUser" , this.lastUserId);
				
				
			}
			
		},
		
		onReady() {
			
			//初始化监听
			uni.onSocketOpen(function (res) {
			  console.log('WebSocket连接已打开！');
			});
			uni.onSocketError(function (res) {
			  console.log('WebSocket连接打开失败，请检查！');
			});
			uni.onSocketMessage(function (res) {
			  console.log('收到服务器内容：' + res.data);
			  
			  
			  
			});
			uni.onSocketClose(function(){
				console.log('WebSocket连接已断开！');
				this.socket == null;
			})
			
		},
		onShow() {
			console.log("onshow")
			if(!this.isLogin || this.userId === 0){
				console.log("未登录");
				uni.switchTab({
					url:'../user/user'
				})
				
			}else{
				//用户已经登录
				if(this.lastUserId != this.userId){
					console.log("用户发生了变化");
					this.lastUserId = this.userId; // 重新记录lastUserId
					if(this.socket !== null){
						//关闭之前的连接
						uni.closeSocket();
						//重新连接
						this.socket = uni.connectSocket({
						  url: this.webServer + this.lastUserId
						});
						console.log("再次连接", this.webServer);
						//重新获取好友列表
						this.friendsList.splice(0,this.friendsList.length);
						this.getFriendList();
						this.messageList.splice(0, this.messageList.length);
						this.getOfflineMessage();
						this.applyList.splice(0, this.applyList.length);
						this.getFriendApplying();
					}
				}else{
					//判断之前是否连接过
					if(this.socket === null){
						this.socket = uni.connectSocket({
						  url: this.webServer + this.lastUserId
						});
						console.log("连接至聊天服务器", this.webServer);
						//获取好友列表
						this.getFriendList();
						this.getOfflineMessage();
						this.getFriendApplying();
					}
				}
				
				
			}
		},
		
		
		methods: {
			changeType(n){
				this.tabTypeIndex = n;
			},
			swiperChange(e){
				this.tabTypeIndex = e.detail.current;
			},
			getFriendList(){
				//不用验证登录了
				uni.request({
					url:'/controller/sys_user/getUserFriend',
					method:'GET',
					success(res) {
						var dat = res.data;
						console.log("好友列表:" );
						if(dat.state === "200"){
							this.friendsList = dat.friendsList;
							console.log(this.friendsList);
						}
					},
					fail(err) {
						
					}
					
				})
			},
			getOfflineMessage(){
				//不用验证登录了
				uni.request({
					url:'/controller/sys_user/getOfflineMessage',
					method:'GET',
					success(res) {
						var dat = res.data;
						console.log("离线消息列表:");
						if(dat.state === "200"){
							this.messageList = dat.offlineMsgLists;
							console.log(this.messageList);
						}
					},
					fail(err) {
						
					}
					
				})
			},
			getFriendApplying(){
				//不用验证登录了
				uni.request({
					url:'/controller/sys_user/getFriendsApplying',
					method:'GET',
					success(res) {
						var dat = res.data;
						console.log("申请列表:");
						if(dat.state === "200"){
							this.applyList = dat.applyingList;
							console.log(this.applyList);
						}
					},
					fail(err) {
						
					}
					
				})
			},
		},
	}
</script>

<style>

</style>
