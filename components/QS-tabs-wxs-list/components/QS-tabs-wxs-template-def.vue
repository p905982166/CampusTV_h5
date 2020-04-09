<!-- 该组件需自行实现, 此处只是示例 -->
<template>
	<view class="container" :class="getFixedClass">
		<view class="container-create-news" v-if="tab.id === 5">
			<button class="container-create-news-create" @click="createNews">创建</button>
		</view>
		<scroll-view scroll-y class="scrollView" lower-threshold="200" :scroll-top="scrollTop" @scroll="scrollFn($event)"
		 @scrolltolower="getList(false, false, false)">
			<!-- 保证性能勿删 -->
			<view class="scroll-container">
				<!-- 保证性能勿删 -->
				<block v-if="getShow">
					
					<!-- 自行实现页面样式展示 -->
					<view class="scroll-item" v-if="pageType === 1"
					 v-for="(item, ind) in list" :key="ind" @tap="itemClick(ind)">
						<!-- 首页新闻展示样式 -->
						<view class="scroll-item-detail">
							<view class="scroll-item-detail-text">
								{{item.newsTitle}}
							</view>
							<image lazy-load class="scroll-item-detail-image" src="http://127.0.0.1:8888/api/uploadFiles/users/1/headImage/5.jpg"
							 mode="scaleToFill"></image>
							
						</view>
						<view class="scroll-item-create-info">{{item.belongToCampus}}&#160; &#160;{{item.createByNick}}&#160; &#160;{{item.dateInfo}}</view>
					</view>
					
					<view v-if="pageType === 2"
					 class="scroll-item-my" v-for="(item, ind) in list" :key="ind" @tap="itemClick(ind)">
						<!-- 我的新闻展示样式 -->
						<view class="scroll-item-my-detail">
							<image lazy-load class="scroll-item-my-detail-image" src="http://127.0.0.1:8888/api/uploadFiles/users/1/headImage/5.jpg"
							 mode="aspectFit"></image>
							 
							<view class="scroll-item-my-detail-text">
								{{item.newsTitle}}
							</view>
							
						</view>
						
					</view>
					
					<!-- 列表状态展示 -->
					<view class="statusText" @tap="getList(false, true, false)" :style="{
						'color': getColor
					}">
						{{statusText.text || '数据未加载'}}
					</view>
					
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	// 组件必须
	import { QSTabsWxsListMixin } from '../mixins/QS-tabs-wxs-list-mixin.js';
	
	import {
		getTabList
	} from '@/util/getTabList.js';
	import {
		doPageDemand
	} from '../js/pageDemand.js';
	export default {
		mixins: [QSTabsWxsListMixin()],// 组件必须
		data() {
			return {
				list: [],
				sendData: {
				},
				pageType:0,
				userId: 0,
				statusText: {},
				refreshClear: false
			}
		},
		computed: {
			getColor() {
				let color;
				switch (this.type) {
					case 'setColor':
						color = '#fff';
						break;
					case 'index':
						color = '#000000';
						break;
					default:
						color = '#999';
						break;
				}
				return color;
			}
		},
		created() {
			// console.log('component - created - tab:' + this.tab);
			// console.log('component - created - index:' + this.index);
		},
		methods: {
			init(refresh) {	//若是用户触发下拉刷新则refresh为true
				if (this.refreshClear) this.oldScrollTop = 0;
				this.getList(refresh, false, false);
			},
			getList(refresh, doEvent, force) {
				let _this = this;
				console.log(refresh);
				
				this.pageType = this.tab.type;
				console.log(this.tab.type)
				this.userId = this.tab.userId;
				
				console.log(this.tab.userId)
				
				if(this.pageType === 1){
					//从首页进来的
					console.log("从首页进来的")
					this.sendData.sub_type_id = this.tab.id
					
					if(refresh == undefined){
						//第一次获取
						console.log("TAG","第一次获取");
					}else if(refresh){
						console.log("TAG","尝试重新获取");
						if(this.list.length !== 0){
							console.log("TAG","下拉加载");
							this.sendData.init_type = 1;
							this.sendData.news_id = this.list[0].newsId;
						}
					}else if(!refresh){
						console.log("TAG","尝试重新获取");
						if(this.list.length !== 0){
							console.log("TAG","上拉加载");
							this.sendData.init_type = 2;
							this.sendData.news_id = this.list[this.list.length - 1].newsId;
						}
						
					};
				}else if(this.pageType === 2){
					//从我的新闻里面进来的
					console.log("从我的新闻里面进来的")
					this.sendData.type_id = this.tab.id
					
					if(refresh == undefined){
						//第一次获取
						console.log("TAG","第一次获取");
					}else if(refresh){
						console.log("TAG","尝试重新获取");
						if(this.list.length !== 0){
							console.log("TAG","下拉加载");
							this.sendData.init_type = 1;
							this.sendData.my_id = this.list[0].myId;
						}
					}else if(!refresh){
						console.log("TAG","尝试重新获取");
						if(this.list.length !== 0){
							console.log("TAG","上拉加载");
							this.sendData.init_type = 2;
							this.sendData.my_id = this.list[this.list.length - 1].myId;
							console.log("myId",this.list[this.list.length - 1].myId);
						}
						
					};
				}
				
				doPageDemand.call(this, {
					getDataFn: getTabList, //获取数据的方法
					success() {
						if (refresh) _this.$emit('refreshEnd');
					},
					fail() {
						console.log('访问接口失败');
					}, //接口访问失败回调

					sendDataName: 'sendData', //携带数据字段名称
					pageType: 'pageType',
					userId: 'userId',

					setName: 'list', //页面中列表数据字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略
					statusTextName: 'statusText', //页面中列表状态字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略
					waitingName: false, //页面中获取数据等待字段名称, 如果在页面中分别有两个或两个以上列表使用该js, 则页面中需区分传入, 否则可以忽略

					refresh, //刷新标识, 若为true则会将携带数据中的页数重置为1
					force, //强制标识, 若为true则会忽略等待标识为true时的跳过操作
					doEvent, //进入状态判断标识, 若为true则会进入判断列表status而进行相应操作

					noDataText: false, //访问接口后若数据长度为0则可自定义为空时文字

					refreshClear: this.refreshClear, //刷新时是否清空数据
				})
			},
			createNews(){
				console.log('创建新闻');
				uni.navigateTo({
					url:'./uCreateNews/uCreateNews'
				})
			},
			itemClick(ind) {
				 
				var newsId = this.list[ind].newsId;
				var userId = this.userId;
				console.log("pageType: ",this.pageType);
				
				console.log(userId);
				
				if(this.pageType === 1){
					uni.navigateTo({
					    url: './news/news?newsId=' + newsId
					});
					
				}else if(this.pageType === 2){
					uni.navigateTo({
					    url: '../../../pages/main/news/news?newsId=' + newsId
					});
				}
				
				// [ {userId: 1, list:[]} ]
				var hist = uni.getStorageSync("browserHistory");
				var list = [];
				console.log("记录浏览历史");
				if(hist === undefined || hist === ''){
					hist = [];
					
				}
				
				let index = hist.findIndex(function(value){
					return value.userId === userId;
				});
				console.log(index);
				if(index >= 0){
					//有该用户的记录
					list = hist[index].list;
					
					let listIndex = list.findIndex(function(value){
						return value.newsId === newsId;
					});
					if(listIndex >= 0){
						console.log('移除已存在的元素');
						list.splice(listIndex, 1)
					}
					console.log('放到队首');
					list.unshift(this.list[ind]);
					
					hist[index].list = list;
					
				}else{
					//无该用户的记录
					list.push(this.list[ind]);
					var temp = {userId: userId, list};
					hist.push(temp);
				}
				
				uni.setStorageSync("browserHistory", hist);
				console.log(hist);
				
			}
		}
	}
</script>

<style scoped>
	@import url("../css/QS-tabs-wxs-list-components.css");
	.container-create-news{
		padding: 20px;
	}
	.container-create-news-create{
		background-color: #007AFF;
		border-radius: 10px;
	}
</style>
