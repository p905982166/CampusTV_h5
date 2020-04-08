<template>
	<view>
		<view class="main-head">
			<view class="main-head-status" :style="statusBarHeight"></view>
			<!-- 这里是状态栏 -->
			<view class="main-head-navi">
				<!-- 导航栏 -->
				<view class="main-head-navi-title">用户日志</view>
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
			
			<view v-for="(item,index) in logs" :key="index">
				<view class="main-body-logs">
					{{ formatDate(item.logDate) }} 从 {{ item.description }}
				</view>
				
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
				logs:{},
			}
		},
		
		methods: {
			...mapMutations(['initUserState']),
			
			appback(){
				uni.navigateBack({
					animationType: 'pop-out',
					animationDuration: 200
				})
			},
			formatDate: function (value) {
				let date = new Date(value);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
			  }
		},
		onLoad() {
			var _this = this;
			uni.request({
				url:'/controller/sys_user/query_self_log',
				method:'POST',
				header:{'Content-type':'application/x-www-form-urlencoded'},
				success(res) {
					let data = res.data;
					if(data.state !== '200'){
						uni.showToast({
							title: data.msg,
							icon:'none'
						})
					}else{
						_this.logs = data.user_logs;
					}
				},
				fail(err){
					
				}
			})
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

	.main-body-other-logout{
		background-color: #ff0000;
		
		width: 60%;
	}
	.main-body-logs{
		padding-bottom: 20px;
	}
</style>
