<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
			<!-- 导航栏 -->
				<view class="main-head-navi-title">新闻页面</view>
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
			statusBarHeight: {{statusBarHeight}}
			newsId: {{newsId}}
			newsDetail: {{newsDetail}}
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	
	export default {
		computed: mapState(['statusBarHeight']),
		data() {
			return {
				
				newsId: 0,
				newsDetail : '',
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
		        console.log(option.newsId); //打印出上个页面传递的参数。
				
		        this.newsId = option.newsId;
				var _this = this;
				uni.request({
					url:'/controller/news/getNewsDetail',
					method:'GET',
					data:{news_id: _this.newsId},
					success(res) {
						var dat = res.data;
						if(dat.state === '200'){
							console.log(dat);
							_this.newsDetail = dat;
						}
					},
					fail(err) {
						console.log(err)
					}
					
				})
		},
		methods: {
			
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
	

</style>
