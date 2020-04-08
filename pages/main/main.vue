<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			
				<view class="main-head-navi-type">
				<!-- 导航栏 -->
					<!-- <view class="main-head-navi-title">首页</view> -->
					<qs-tabs :tabs="tabType" :current="tabTypeIndex" @change='changeType'
					activeColor="#fff" defaultColor="#000" 
					fontSize="30px"></qs-tabs>
					
				</view>
			</view>
			
			<view class="scroll-item" v-for="(item, index) in tabType" :key="index">
				
				<QSTabsWxs v-show="tabTypeIndex === index"
				:ref="`qs${index}`"
				hasRefresh
				refreshImage="/static/refresh.png"
				activeFontColor="#000" 
				refreshTextColor="#000"
				tabsFontColor="rgba(90, 90, 90, 229)" 
				tabsBackgroundColor="#ffffff" 
				swiperBackgroundColor="#ffffff" 
				minWidth="50rpx" 
				type="index"
				defCurrent="0"
				:height="windowHeight-topViewHeight">
				</QSTabsWxs>
				
			</view>
			
		</view>
	</view>
	
</template>

<script>
	
	import qsTabs from "../../components/QS-tabs/QS-tabs.vue"
	import QSTabsWxs from '../../components/QS-tabs-wxs-list/QS-tabs-wxs-list.vue';
	
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	const {windowHeight} = uni.getSystemInfoSync();
	export default {
		components:{
			qsTabs,
			QSTabsWxs,
		},
		computed: mapState(['isLogin', 'userId']),
		mounted() {
			
		},
		data(){
			return {
				
				
				topViewHeight: 44,
				windowHeight,
				
				statusBarHeight : "height:0px",
		
				tabTypeIndex : 0,
				//默认
				tabType : [
					{ name:"校园体育" },
					{ name:"校园电子竞技" }
				],
				//用来判断是否初始化过大tab
				tabTypeInit : [],
				
				tablist : [],
				
				
				QSTabsWxsListHeight: 20,
				
			}
		},
		onReady() {
			
			
		},
		methods:{
			...mapMutations(['initUserState', 'changePlatform']),
			
			changeType(n){
				var that = this;
				this.tabTypeIndex = n;
				this.tablist = this.tabType[n].subTypesList;

				let m = 0;
				let tabs = Array(that.tablist.length).fill('').map(() => {
					const tablist = that.tablist[m++];
					const name = tablist.subTypeName;
					console.log(name);
					return {
						tablist,
						name,
						id: tablist.subTypeId,
						type: 1,
						swiperBackgroundColor: '#F5F5F5',
						lineColor: '#000000',
						tabsBackgroundColor: '#ffffff'
					}
				});
				
				if(this.tabTypeInit[n] === undefined){
					//每个只需要实例化一次
					this.$refs[`qs${n}`][0].setTabs(tabs);
					this.tabTypeInit[n] = true
				}
				
			},
			
		},
		created() {
			
		},
		onLoad() {
			
			var that = this;
			
			this.systemInfo = uni.getSystemInfoSync();
			
			console.log(uni.getSystemInfoSync().platform);
			
			if (uni.getSystemInfoSync().platform === "android") {
				
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
				}else{
					this.statusBarHeight = "height:" + android.getStatusBarHeight() + "px";
					console.log(this.changePlatform())
					this.changePlatform(this.statusBarHeight);
					
					console.log("运行在Android设备上，获取到转换后得状态栏高度为：" + this.statusBarHeight);
				}
				
			}else{
				console.log("非android操作系统");
			}
			
			uni.request({
				url:'/controller/sys_types/getTypes',
				method:'GET',
				success(res) {
					var dat = res.data;
					if(dat.state === '200'){
						console.log(dat);
						let userState = {"isLogin" : false, "userId" : 0, "userInfo" : {}, "userPermission":{}};
						userState.isLogin = dat.loginStatus;
						if(!userState.isLogin){
							console.log(1);
							userState.userId = 0;
							
						}else{
							console.log(2)
							userState.userId = dat.userId;
							userState.userInfo = dat.userInfo;
							userState.userPermission = dat.userPermission;
						}
						
						that.initUserState(userState);	
						
							
						that.tabType = dat.types;
						that.tablist = that.tabType[0].subTypesList;
						that.changeType(0);
					}
				},
				fail(err) {
					console.log(err)
				}
				
			})
			
		
			
			
		}
		
	}
</script>

<style>

	
	.main-body{
		background-color: #18ec6d;
	}
</style>
