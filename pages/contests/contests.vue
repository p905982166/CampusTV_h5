<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">赛事</view>
				
			</view>
			
		</view>
		
		<view class="main-body">
			<view style="display: flex;flex-direction: row;margin-left: 10px;">
				筛选：<text style="border: #000000 solid 1px;padding: 0 5px;">全部</text>
			</view>
			<view style="display: flex;flex-direction: column;">
				<view style="display: flex;flex-direction: row;
				 background-color: #ffffff;width: 150px; align-self: center; margin: 10px 0;
				align-items: center;" v-for="(item,index) in 3" :key="index">
					<image src="../../static/img/home_team.png"
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
					<view style="display: flex; margin: 0px 15px;
					flex-direction: column;align-items: center;">
						<text style="color: #999999;font-size: 15px;">0 - 0</text>
						<text style="color: #989898;font-size: 13px;">已结束</text>
					</view>
					<image src="../../static/img/away_team.png" 
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
				</view>
				<view style="display: flex;flex-direction: row;
				 background-color: #ffffff;width: 150px; align-self: center; margin: 10px 0;
				align-items: center;" v-for="(item,index) in 4" :key="index">
					<image src="../../static/img/home_team.png"
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
					<view style="display: flex; margin: 0px 15px;
					flex-direction: column;align-items: center;">
						<text style="color: #323232;font-size: 15px;">0 - 0</text>
						<text style="color: #ff0000;font-size: 13px;">第{{index + 1}}节</text>
					</view>
					<image src="../../static/img/away_team.png" 
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
				</view>
				<view style="display: flex;flex-direction: row;
				 background-color: #ffffff;width: 150px; align-self: center; margin: 10px 0;
				align-items: center;">
					<image src="../../static/img/home_team.png"
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
					<view style="display: flex; margin: 0px 15px;
					flex-direction: column;align-items: center;">
						<text style="color: #323232;font-size: 15px;">0 - 0</text>
						<text style="color: #ff0000;font-size: 13px;">加时中</text>
					</view>
					<image src="../../static/img/away_team.png" 
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
				</view>
				<view style="display: flex;flex-direction: row;
				 background-color: #ffffff;width: 150px; align-self: center; margin: 10px 0;
				align-items: center;" v-for="(item,index) in 2" :key="index">
					<image src="../../static/img/home_team.png"
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
					<view style="display: flex; margin: 0px 15px;
					flex-direction: column;align-items: center;">
						<text style="color: #323232;font-size: 12px;">13:00</text>
						<text style="color: #323232;font-size: 13px;">未开始</text>
					</view>
					<image src="../../static/img/away_team.png" 
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
				</view>
				<view style="display: flex;flex-direction: row;
				 background-color: #ffffff;width: 150px; align-self: center; margin: 10px 0;
				align-items: center;" v-for="(item,index) in 2" :key="index">
					<image src="../../static/img/home_team.png"
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
					<view style="display: flex; margin: 0px 15px;
					flex-direction: column;align-items: center;">
						<text style="color: #323232;font-size: 12px;">14:00</text>
						<text style="color: #323232;font-size: 13px;">未开始</text>
					</view>
					<image src="../../static/img/away_team.png" 
					style="width: 40px;height: 40px;border-radius: 30px;"></image>
				</view>
			</view>
			
			
			<!-- <view class="area-selector">
				省份：<picker mode="selector" 
				:range="area" 
				range-key="name" 
				@change="provinceChange"
				:value="areaIndex">
					{{ area[areaIndex].name }}
				</picker>
				地区：<picker
				mode="selector"
				:range="area[areaIndex].children" 
				range-key="name" 
				@change="areaChange"
				:value="areaChildIndex">
					{{ area[areaIndex].children[areaChildIndex].name }}
				</picker>
			</view> -->
			<!-- <button @click="pushVideo">推流</button>
			<button @click="getVideo">拉流</button> -->
		</view>
	</view>
</template>


<script>
	import divisionsOfChina from '@/static/json/divisionsOfChina.js'
	
	import {
		mapState,
		mapMutations
	} from 'vuex'
	
	export default {
		
		computed: mapState(['isLogin', 'userId','userInfo','statusBarHeight','userPermission']),
		data() {
			return {
				area: divisionsOfChina.area,
				areaIndex: 0,
				areaChildIndex: 0,
				contestsList:[
					{}
				]
			}
		},
		methods: {
			...mapMutations(['initUserState']),
			scroll: function(e) {
				console.log(e.detail)
				
			},
			pushVideo(){
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
					})
				}else{
					console.log("调用anroid方法");
					
					android.intoRoom('1');
				}
			},
			getVideo(){
				if(typeof android === "undefined"){
					console.log("不是在应用内打开");
					uni.showToast({
						title:'请在app内使用',
						icon:'none'
					})
				}else{
					console.log("调用anroid方法");
					
					android.intoRoom('2');
				}
			},
			provinceChange(e){
				this.areaIndex = e.detail.value;
				this.areaChildIndex = 0;
			},
			areaChange(e){
				this.areaChildIndex = e.detail.value;
			},
			appback(){
				uni.navigateBack({
					animationType: 'pop-out',
					animationDuration: 200
				})
			},
		},
		onLoad() {
			console.log(this.area)
		}
	}
</script>

<style>
	.main-body{
		height: 100%;
		margin-top: 10px;
		background-color: #ffffff;
		display: flex;
		flex-direction: column;
		
	}

	.area-selector{
		display: flex;
		flex-direction: row;
		margin-left: 10px;
	}
	.area-selector picker{
		border: #000000 1px solid;
		
		margin-right: 20px;
	}
</style>
